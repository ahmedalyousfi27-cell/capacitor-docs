from fastapi import FastAPI, APIRouter, HTTPException, Request, Response, Depends, UploadFile, File
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
import base64
import httpx

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI()
api_router = APIRouter(prefix="/api")

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# ==================== Models ====================

class User(BaseModel):
    user_id: str
    email: str
    name: str
    picture: Optional[str] = None
    phone: Optional[str] = None
    city: Optional[str] = None
    role: str = "user"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class Address(BaseModel):
    address_id: str = Field(default_factory=lambda: f"addr_{uuid.uuid4().hex[:12]}")
    user_id: str
    name: str
    phone: str
    governorate: str
    city: str
    description: str
    is_default: bool = False
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class AddressCreate(BaseModel):
    name: str
    phone: str
    governorate: str
    city: str
    description: str
    is_default: bool = False

class CartItem(BaseModel):
    item_id: str = Field(default_factory=lambda: f"item_{uuid.uuid4().hex[:12]}")
    user_id: str
    product_name: str
    product_url: str
    product_image: str
    price: float
    quantity: int = 1
    size: Optional[str] = None
    color: Optional[str] = None
    notes: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class CartItemCreate(BaseModel):
    product_name: str
    product_url: str
    product_image: str
    price: float
    quantity: int = 1
    size: Optional[str] = None
    color: Optional[str] = None
    notes: Optional[str] = None

class OrderItem(BaseModel):
    product_name: str
    product_url: str
    product_image: str
    price: float
    quantity: int
    size: Optional[str] = None
    color: Optional[str] = None
    notes: Optional[str] = None

class Order(BaseModel):
    order_id: str = Field(default_factory=lambda: f"ORD-{uuid.uuid4().hex[:8].upper()}")
    user_id: str
    items: List[OrderItem]
    address_id: str
    total_price: float
    commission: float = 0
    shipping_fee: float = 0
    grand_total: float
    payment_method: Optional[str] = None
    payment_reference: Optional[str] = None
    sender_name: Optional[str] = None
    receipt_image: Optional[str] = None
    status: str = "pending_review"  # pending_review, paid, purchasing, shipped, arrived_yemen, completed
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class OrderCreate(BaseModel):
    address_id: str

class PaymentSubmit(BaseModel):
    payment_method: str
    sender_name: str
    payment_reference: str
    receipt_image: str  # Base64 encoded

class Settings(BaseModel):
    settings_id: str = "main_settings"
    commission_rate: float = 10.0  # percentage
    shipping_fee: float = 5.0  # USD
    bank_accounts: List[dict] = []
    enable_inspection: bool = False
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# ==================== Auth Helpers ====================

async def get_current_user(request: Request) -> User:
    """Get current user from session token in cookie or Authorization header"""
    session_token = request.cookies.get("session_token")
    if not session_token:
        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            session_token = auth_header.split(" ")[1]
    
    if not session_token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    session = await db.user_sessions.find_one({"session_token": session_token}, {"_id": 0})
    if not session:
        raise HTTPException(status_code=401, detail="Invalid session")
    
    expires_at = session.get("expires_at")
    if isinstance(expires_at, str):
        expires_at = datetime.fromisoformat(expires_at)
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)
    if expires_at < datetime.now(timezone.utc):
        raise HTTPException(status_code=401, detail="Session expired")
    
    user = await db.users.find_one({"user_id": session["user_id"]}, {"_id": 0})
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    
    return User(**user)

async def get_admin_user(user: User = Depends(get_current_user)) -> User:
    """Ensure user is admin"""
    if user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return user

# ==================== Auth Endpoints ====================

@api_router.post("/auth/session")
async def create_session(request: Request, response: Response):
    """Exchange session_id for session_token and user data"""
    body = await request.json()
    session_id = body.get("session_id")
    
    if not session_id:
        raise HTTPException(status_code=400, detail="session_id required")
    
    async with httpx.AsyncClient() as client_http:
        resp = await client_http.get(
            "https://demobackend.emergentagent.com/auth/v1/env/oauth/session-data",
            headers={"X-Session-ID": session_id}
        )
        if resp.status_code != 200:
            raise HTTPException(status_code=401, detail="Invalid session_id")
        
        data = resp.json()
    
    user_id = f"user_{uuid.uuid4().hex[:12]}"
    session_token = data.get("session_token")
    
    existing_user = await db.users.find_one({"email": data["email"]}, {"_id": 0})
    if existing_user:
        user_id = existing_user["user_id"]
        await db.users.update_one(
            {"user_id": user_id},
            {"$set": {"name": data["name"], "picture": data.get("picture")}}
        )
    else:
        new_user = {
            "user_id": user_id,
            "email": data["email"],
            "name": data["name"],
            "picture": data.get("picture"),
            "phone": None,
            "city": None,
            "role": "user",
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        await db.users.insert_one(new_user)
    
    session_doc = {
        "user_id": user_id,
        "session_token": session_token,
        "expires_at": (datetime.now(timezone.utc) + timedelta(days=7)).isoformat(),
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.user_sessions.delete_many({"user_id": user_id})
    await db.user_sessions.insert_one(session_doc)
    
    response.set_cookie(
        key="session_token",
        value=session_token,
        httponly=True,
        secure=True,
        samesite="none",
        path="/",
        max_age=7 * 24 * 60 * 60
    )
    
    user = await db.users.find_one({"user_id": user_id}, {"_id": 0})
    return user

@api_router.get("/auth/me")
async def get_me(user: User = Depends(get_current_user)):
    """Get current authenticated user"""
    return user.model_dump()

@api_router.post("/auth/logout")
async def logout(request: Request, response: Response):
    """Logout user"""
    session_token = request.cookies.get("session_token")
    if session_token:
        await db.user_sessions.delete_many({"session_token": session_token})
    response.delete_cookie("session_token", path="/")
    return {"message": "Logged out successfully"}

@api_router.put("/auth/profile")
async def update_profile(request: Request, user: User = Depends(get_current_user)):
    """Update user profile"""
    body = await request.json()
    update_data = {}
    for field in ["phone", "city", "name"]:
        if field in body:
            update_data[field] = body[field]
    
    if update_data:
        await db.users.update_one({"user_id": user.user_id}, {"$set": update_data})
    
    updated_user = await db.users.find_one({"user_id": user.user_id}, {"_id": 0})
    return updated_user

# ==================== Address Endpoints ====================

@api_router.get("/addresses")
async def get_addresses(user: User = Depends(get_current_user)):
    addresses = await db.addresses.find({"user_id": user.user_id}, {"_id": 0}).to_list(100)
    return addresses

@api_router.post("/addresses")
async def create_address(data: AddressCreate, user: User = Depends(get_current_user)):
    if data.is_default:
        await db.addresses.update_many({"user_id": user.user_id}, {"$set": {"is_default": False}})
    
    address = Address(user_id=user.user_id, **data.model_dump())
    doc = address.model_dump()
    doc["created_at"] = doc["created_at"].isoformat()
    await db.addresses.insert_one(doc)
    # Return without _id field
    doc.pop("_id", None)
    return doc

@api_router.delete("/addresses/{address_id}")
async def delete_address(address_id: str, user: User = Depends(get_current_user)):
    result = await db.addresses.delete_one({"address_id": address_id, "user_id": user.user_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Address not found")
    return {"message": "Address deleted"}

# ==================== Cart Endpoints ====================

@api_router.get("/cart")
async def get_cart(user: User = Depends(get_current_user)):
    items = await db.cart.find({"user_id": user.user_id}, {"_id": 0}).to_list(100)
    return items

@api_router.post("/cart")
async def add_to_cart(data: CartItemCreate, user: User = Depends(get_current_user)):
    item = CartItem(user_id=user.user_id, **data.model_dump())
    doc = item.model_dump()
    doc["created_at"] = doc["created_at"].isoformat()
    await db.cart.insert_one(doc)
    # Return without _id field
    doc.pop("_id", None)
    return doc

@api_router.put("/cart/{item_id}")
async def update_cart_item(item_id: str, request: Request, user: User = Depends(get_current_user)):
    body = await request.json()
    update_data = {}
    for field in ["quantity", "size", "color", "notes"]:
        if field in body:
            update_data[field] = body[field]
    
    result = await db.cart.update_one(
        {"item_id": item_id, "user_id": user.user_id},
        {"$set": update_data}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Item not found")
    
    item = await db.cart.find_one({"item_id": item_id}, {"_id": 0})
    return item

@api_router.delete("/cart/{item_id}")
async def remove_from_cart(item_id: str, user: User = Depends(get_current_user)):
    result = await db.cart.delete_one({"item_id": item_id, "user_id": user.user_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Item not found")
    return {"message": "Item removed"}

@api_router.delete("/cart")
async def clear_cart(user: User = Depends(get_current_user)):
    await db.cart.delete_many({"user_id": user.user_id})
    return {"message": "Cart cleared"}

# ==================== Order Endpoints ====================

@api_router.get("/orders")
async def get_orders(user: User = Depends(get_current_user)):
    orders = await db.orders.find({"user_id": user.user_id}, {"_id": 0}).sort("created_at", -1).to_list(100)
    return orders

@api_router.get("/orders/{order_id}")
async def get_order(order_id: str, user: User = Depends(get_current_user)):
    order = await db.orders.find_one({"order_id": order_id, "user_id": user.user_id}, {"_id": 0})
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order

@api_router.post("/orders")
async def create_order(data: OrderCreate, user: User = Depends(get_current_user)):
    cart_items = await db.cart.find({"user_id": user.user_id}, {"_id": 0}).to_list(100)
    if not cart_items:
        raise HTTPException(status_code=400, detail="Cart is empty")
    
    address = await db.addresses.find_one({"address_id": data.address_id, "user_id": user.user_id}, {"_id": 0})
    if not address:
        raise HTTPException(status_code=400, detail="Address not found")
    
    settings = await db.settings.find_one({"settings_id": "main_settings"}, {"_id": 0})
    commission_rate = settings.get("commission_rate", 10) if settings else 10
    shipping_fee = settings.get("shipping_fee", 5) if settings else 5
    
    items = []
    total_price = 0
    for item in cart_items:
        items.append(OrderItem(
            product_name=item["product_name"],
            product_url=item["product_url"],
            product_image=item["product_image"],
            price=item["price"],
            quantity=item["quantity"],
            size=item.get("size"),
            color=item.get("color"),
            notes=item.get("notes")
        ))
        total_price += item["price"] * item["quantity"]
    
    commission = total_price * (commission_rate / 100)
    grand_total = total_price + commission + shipping_fee
    
    order = Order(
        user_id=user.user_id,
        items=[i.model_dump() for i in items],
        address_id=data.address_id,
        total_price=total_price,
        commission=commission,
        shipping_fee=shipping_fee,
        grand_total=grand_total
    )
    
    doc = order.model_dump()
    doc["created_at"] = doc["created_at"].isoformat()
    doc["updated_at"] = doc["updated_at"].isoformat()
    await db.orders.insert_one(doc)
    await db.cart.delete_many({"user_id": user.user_id})
    
    return {"_id": 0, **doc}

@api_router.post("/orders/{order_id}/payment")
async def submit_payment(order_id: str, data: PaymentSubmit, user: User = Depends(get_current_user)):
    order = await db.orders.find_one({"order_id": order_id, "user_id": user.user_id}, {"_id": 0})
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    update_data = {
        "payment_method": data.payment_method,
        "sender_name": data.sender_name,
        "payment_reference": data.payment_reference,
        "receipt_image": data.receipt_image,
        "status": "pending_review",
        "updated_at": datetime.now(timezone.utc).isoformat()
    }
    
    await db.orders.update_one({"order_id": order_id}, {"$set": update_data})
    
    updated_order = await db.orders.find_one({"order_id": order_id}, {"_id": 0})
    return updated_order

# ==================== Admin Endpoints ====================

@api_router.get("/admin/stats")
async def get_admin_stats(user: User = Depends(get_admin_user)):
    new_orders = await db.orders.count_documents({"status": "pending_review"})
    in_progress = await db.orders.count_documents({"status": {"$in": ["paid", "purchasing", "shipped", "arrived_yemen"]}})
    completed = await db.orders.count_documents({"status": "completed"})
    
    pipeline = [{"$group": {"_id": None, "total": {"$sum": "$grand_total"}}}]
    result = await db.orders.aggregate(pipeline).to_list(1)
    total_sales = result[0]["total"] if result else 0
    
    return {
        "new_orders": new_orders,
        "in_progress": in_progress,
        "completed": completed,
        "total_sales": total_sales
    }

@api_router.get("/admin/orders")
async def get_all_orders(user: User = Depends(get_admin_user)):
    orders = await db.orders.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    for order in orders:
        order_user = await db.users.find_one({"user_id": order["user_id"]}, {"_id": 0})
        order["user_name"] = order_user["name"] if order_user else "Unknown"
        order["user_email"] = order_user["email"] if order_user else "Unknown"
    return orders

@api_router.get("/admin/orders/{order_id}")
async def get_admin_order(order_id: str, user: User = Depends(get_admin_user)):
    order = await db.orders.find_one({"order_id": order_id}, {"_id": 0})
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    order_user = await db.users.find_one({"user_id": order["user_id"]}, {"_id": 0})
    order["user_name"] = order_user["name"] if order_user else "Unknown"
    order["user_email"] = order_user["email"] if order_user else "Unknown"
    
    address = await db.addresses.find_one({"address_id": order["address_id"]}, {"_id": 0})
    order["address"] = address
    
    return order

@api_router.put("/admin/orders/{order_id}/status")
async def update_order_status(order_id: str, request: Request, user: User = Depends(get_admin_user)):
    body = await request.json()
    new_status = body.get("status")
    
    valid_statuses = ["pending_review", "paid", "purchasing", "shipped", "arrived_yemen", "completed"]
    if new_status not in valid_statuses:
        raise HTTPException(status_code=400, detail="Invalid status")
    
    result = await db.orders.update_one(
        {"order_id": order_id},
        {"$set": {"status": new_status, "updated_at": datetime.now(timezone.utc).isoformat()}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Order not found")
    
    order = await db.orders.find_one({"order_id": order_id}, {"_id": 0})
    return order

@api_router.get("/admin/settings")
async def get_settings(user: User = Depends(get_admin_user)):
    settings = await db.settings.find_one({"settings_id": "main_settings"}, {"_id": 0})
    if not settings:
        default_settings = Settings(
            bank_accounts=[
                {"name": "الكريمي", "account_number": "1234567890", "holder_name": "وصول للتسوق"},
                {"name": "القطيبي", "account_number": "0987654321", "holder_name": "وصول للتسوق"},
                {"name": "محفظة جيب", "account_number": "777123456", "holder_name": "وصول للتسوق"},
                {"name": "تحويل بنكي", "account_number": "YE12345678901234", "holder_name": "وصول للتسوق"}
            ]
        )
        doc = default_settings.model_dump()
        doc["updated_at"] = doc["updated_at"].isoformat()
        await db.settings.insert_one(doc)
        return doc
    return settings

@api_router.put("/admin/settings")
async def update_settings(request: Request, user: User = Depends(get_admin_user)):
    body = await request.json()
    update_data = {"updated_at": datetime.now(timezone.utc).isoformat()}
    
    for field in ["commission_rate", "shipping_fee", "bank_accounts", "enable_inspection"]:
        if field in body:
            update_data[field] = body[field]
    
    await db.settings.update_one(
        {"settings_id": "main_settings"},
        {"$set": update_data},
        upsert=True
    )
    
    settings = await db.settings.find_one({"settings_id": "main_settings"}, {"_id": 0})
    return settings

@api_router.get("/settings/public")
async def get_public_settings():
    """Get public settings (bank accounts for payment)"""
    settings = await db.settings.find_one({"settings_id": "main_settings"}, {"_id": 0})
    if not settings:
        return {
            "bank_accounts": [
                {"name": "الكريمي", "account_number": "1234567890", "holder_name": "وصول للتسوق"},
                {"name": "القطيبي", "account_number": "0987654321", "holder_name": "وصول للتسوق"},
                {"name": "محفظة جيب", "account_number": "777123456", "holder_name": "وصول للتسوق"},
                {"name": "تحويل بنكي", "account_number": "YE12345678901234", "holder_name": "وصول للتسوق"}
            ],
            "commission_rate": 10,
            "shipping_fee": 5
        }
    return {
        "bank_accounts": settings.get("bank_accounts", []),
        "commission_rate": settings.get("commission_rate", 10),
        "shipping_fee": settings.get("shipping_fee", 5)
    }

# Root endpoint
@api_router.get("/")
async def root():
    return {"message": "Wo6ol API is running"}

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
