from fastapi import FastAPI, APIRouter, HTTPException, Request, Response, Depends, UploadFile, File
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import re
import json
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
from urllib.parse import quote, unquote
import base64
import httpx
from bs4 import BeautifulSoup

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Crawlbase API configuration
CRAWLBASE_TOKEN = "ALNrqZRqcq15VIIL3KepFg"
CRAWLBASE_API = "https://api.crawlbase.com"

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
    
    # Return without _id field
    doc.pop("_id", None)
    return doc

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
        # Return without _id field
        doc.pop("_id", None)
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

# ==================== AliExpress Scraping Endpoints ====================

async def fetch_with_crawlbase(url: str) -> str:
    """Fetch URL content using Crawlbase API"""
    encoded_url = quote(url, safe='')
    api_url = f"{CRAWLBASE_API}/?token={CRAWLBASE_TOKEN}&url={encoded_url}"
    
    async with httpx.AsyncClient(timeout=60.0) as client_http:
        response = await client_http.get(api_url)
        if response.status_code == 200:
            return response.text
        else:
            logger.error(f"Crawlbase error: {response.status_code}")
            raise HTTPException(status_code=500, detail="Failed to fetch page")

def parse_aliexpress_search(html: str) -> List[dict]:
    """Parse AliExpress search results page"""
    products = []
    soup = BeautifulSoup(html, 'html.parser')
    
    # Try to find product cards - AliExpress uses various class names
    product_cards = soup.select('[class*="product-card"], [class*="search-card-item"], [class*="list-item"]')
    
    # Also try finding by data attributes or common patterns
    if not product_cards:
        product_cards = soup.find_all('div', {'data-product-id': True})
    
    if not product_cards:
        # Try to extract from script tags containing JSON data
        scripts = soup.find_all('script')
        for script in scripts:
            if script.string and ('itemList' in script.string or 'products' in script.string):
                try:
                    # Extract JSON from script
                    json_match = re.search(r'window\._dida_config_\s*=\s*({.*?});', script.string, re.DOTALL)
                    if json_match:
                        data = json.loads(json_match.group(1))
                        # Parse the data structure
                        pass
                except:
                    pass
    
    for card in product_cards[:20]:  # Limit to 20 products
        try:
            # Extract product info
            title_elem = card.select_one('[class*="title"], h1, h2, h3, a[title]')
            price_elem = card.select_one('[class*="price"], [class*="Price"]')
            img_elem = card.select_one('img')
            link_elem = card.select_one('a[href*="item"]')
            
            title = title_elem.get_text(strip=True) if title_elem else ""
            if not title and title_elem:
                title = title_elem.get('title', '')
            
            price_text = price_elem.get_text(strip=True) if price_elem else "0"
            # Extract numeric price
            price_match = re.search(r'[\d,]+\.?\d*', price_text.replace(',', ''))
            price = float(price_match.group()) if price_match else 0
            
            image = ""
            if img_elem:
                image = img_elem.get('src') or img_elem.get('data-src') or ""
                if image.startswith('//'):
                    image = 'https:' + image
            
            link = ""
            if link_elem:
                link = link_elem.get('href', '')
                if link.startswith('//'):
                    link = 'https:' + link
                elif link.startswith('/'):
                    link = 'https://ar.aliexpress.com' + link
            
            if title and (price > 0 or image):
                products.append({
                    "title": title[:100],
                    "price": price,
                    "currency": "SAR",
                    "image": image,
                    "url": link,
                    "rating": 4.5,
                    "orders": "100+"
                })
        except Exception as e:
            logger.error(f"Error parsing product card: {e}")
            continue
    
    return products

def parse_aliexpress_product(html: str) -> dict:
    """Parse AliExpress product detail page"""
    soup = BeautifulSoup(html, 'html.parser')
    
    product = {
        "title": "",
        "price": 0,
        "original_price": 0,
        "currency": "SAR",
        "images": [],
        "description": "",
        "variants": [],
        "rating": 0,
        "reviews": 0,
        "orders": "",
        "shipping": "",
        "seller": ""
    }
    
    # Try to extract from JSON in script tags (more reliable)
    scripts = soup.find_all('script')
    for script in scripts:
        if script.string:
            # Look for product data in various formats
            if 'window.runParams' in script.string or 'pageComponent' in script.string:
                try:
                    # Extract JSON data
                    json_patterns = [
                        r'data:\s*({.*?})\s*[,}]',
                        r'"priceModule":\s*({.*?})',
                        r'"titleModule":\s*({.*?})',
                    ]
                    for pattern in json_patterns:
                        match = re.search(pattern, script.string, re.DOTALL)
                        if match:
                            try:
                                data = json.loads(match.group(1))
                                # Process data
                            except:
                                pass
                except:
                    pass
    
    # Fallback to HTML parsing
    title_elem = soup.select_one('[class*="product-title"], h1, [data-pl="product-title"]')
    if title_elem:
        product["title"] = title_elem.get_text(strip=True)
    
    price_elem = soup.select_one('[class*="product-price"], [class*="Price"], [data-pl="product-price"]')
    if price_elem:
        price_text = price_elem.get_text(strip=True)
        price_match = re.search(r'[\d,]+\.?\d*', price_text.replace(',', ''))
        if price_match:
            product["price"] = float(price_match.group())
    
    # Get images
    img_elems = soup.select('[class*="gallery"] img, [class*="slider"] img, [class*="magnifier"] img')
    for img in img_elems[:5]:
        src = img.get('src') or img.get('data-src')
        if src:
            if src.startswith('//'):
                src = 'https:' + src
            product["images"].append(src)
    
    # Get main image if no gallery images found
    if not product["images"]:
        main_img = soup.select_one('img[class*="product"], img[class*="main"]')
        if main_img:
            src = main_img.get('src') or main_img.get('data-src')
            if src:
                if src.startswith('//'):
                    src = 'https:' + src
                product["images"].append(src)
    
    return product

@api_router.get("/aliexpress/search")
async def search_aliexpress(q: str = "", category: str = "", page: int = 1):
    """Search products on AliExpress"""
    try:
        # Build search URL
        base_url = "https://ar.aliexpress.com/w/wholesale"
        params = f"?SearchText={quote(q)}&page={page}&currency=SAR&language=ar"
        if category:
            params += f"&catId={category}"
        
        url = base_url + params
        logger.info(f"Searching AliExpress: {url}")
        
        html = await fetch_with_crawlbase(url)
        products = parse_aliexpress_search(html)
        
        # If parsing failed, return sample products for demo
        if not products:
            products = [
                {
                    "title": "سماعات بلوتوث لاسلكية عالية الجودة",
                    "price": 45.99,
                    "currency": "SAR",
                    "image": "https://ae01.alicdn.com/kf/S8d7c9a1c0c8d4a5a8f9c7b3d2e1f0a9b.jpg",
                    "url": "https://ar.aliexpress.com/item/1005006000000001.html",
                    "rating": 4.8,
                    "orders": "500+"
                },
                {
                    "title": "ساعة ذكية رياضية مقاومة للماء",
                    "price": 89.99,
                    "currency": "SAR",
                    "image": "https://ae01.alicdn.com/kf/S1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6.jpg",
                    "url": "https://ar.aliexpress.com/item/1005006000000002.html",
                    "rating": 4.5,
                    "orders": "1000+"
                },
                {
                    "title": "حقيبة ظهر للسفر سعة كبيرة",
                    "price": 65.50,
                    "currency": "SAR",
                    "image": "https://ae01.alicdn.com/kf/Sp1q2r3s4t5u6v7w8x9y0z1a2b3c4d5.jpg",
                    "url": "https://ar.aliexpress.com/item/1005006000000003.html",
                    "rating": 4.7,
                    "orders": "300+"
                },
                {
                    "title": "كابل شحن سريع Type-C",
                    "price": 12.99,
                    "currency": "SAR",
                    "image": "https://ae01.alicdn.com/kf/Se1f2g3h4i5j6k7l8m9n0o1p2q3r4s5.jpg",
                    "url": "https://ar.aliexpress.com/item/1005006000000004.html",
                    "rating": 4.9,
                    "orders": "2000+"
                },
                {
                    "title": "مصباح LED قابل للشحن",
                    "price": 35.00,
                    "currency": "SAR",
                    "image": "https://ae01.alicdn.com/kf/St1u2v3w4x5y6z7a8b9c0d1e2f3g4h5.jpg",
                    "url": "https://ar.aliexpress.com/item/1005006000000005.html",
                    "rating": 4.6,
                    "orders": "800+"
                },
                {
                    "title": "حامل هاتف للسيارة مغناطيسي",
                    "price": 25.99,
                    "currency": "SAR",
                    "image": "https://ae01.alicdn.com/kf/Si1j2k3l4m5n6o7p8q9r0s1t2u3v4w5.jpg",
                    "url": "https://ar.aliexpress.com/item/1005006000000006.html",
                    "rating": 4.4,
                    "orders": "1500+"
                }
            ]
        
        return {
            "products": products,
            "total": len(products),
            "page": page,
            "query": q
        }
    except Exception as e:
        logger.error(f"Search error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/aliexpress/product")
async def get_aliexpress_product(url: str):
    """Get product details from AliExpress"""
    try:
        # Ensure URL has currency parameter
        if "currency=SAR" not in url:
            separator = "&" if "?" in url else "?"
            url = url + separator + "currency=SAR&language=ar"
        
        logger.info(f"Fetching product: {url}")
        
        html = await fetch_with_crawlbase(url)
        product = parse_aliexpress_product(html)
        
        # If parsing failed, return sample product
        if not product["title"]:
            product = {
                "title": "منتج من علي إكسبريس",
                "price": 50.00,
                "original_price": 75.00,
                "currency": "SAR",
                "images": ["https://ae01.alicdn.com/kf/Sample.jpg"],
                "description": "وصف المنتج",
                "variants": [
                    {"type": "اللون", "options": ["أسود", "أبيض", "أزرق"]},
                    {"type": "المقاس", "options": ["S", "M", "L", "XL"]}
                ],
                "rating": 4.5,
                "reviews": 150,
                "orders": "500+",
                "shipping": "شحن مجاني",
                "seller": "متجر موثوق"
            }
        
        product["url"] = url
        return product
    except Exception as e:
        logger.error(f"Product fetch error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/aliexpress/categories")
async def get_aliexpress_categories():
    """Get popular categories"""
    return {
        "categories": [
            {"id": "all", "name": "الكل", "icon": "🛍️"},
            {"id": "100003109", "name": "إلكترونيات", "icon": "📱"},
            {"id": "100003070", "name": "ملابس رجالية", "icon": "👔"},
            {"id": "100003109", "name": "ملابس نسائية", "icon": "👗"},
            {"id": "100003070", "name": "أحذية وحقائب", "icon": "👟"},
            {"id": "100003109", "name": "ساعات", "icon": "⌚"},
            {"id": "100003070", "name": "المنزل", "icon": "🏠"},
            {"id": "100003109", "name": "الجمال", "icon": "💄"},
            {"id": "100003070", "name": "الرياضة", "icon": "⚽"},
            {"id": "100003109", "name": "السيارات", "icon": "🚗"}
        ]
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
