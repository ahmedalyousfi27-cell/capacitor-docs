#!/usr/bin/env python3
"""
Wo6ol Backend API Testing Suite
Tests all critical API endpoints for the Arabic AliExpress mediation platform
"""

import requests
import sys
import json
from datetime import datetime

class Wo6olAPITester:
    def __init__(self, base_url="https://express-bridge.preview.emergentagent.com/api"):
        self.base_url = base_url
        self.session_token = "test_session_1768769228127"  # Test admin session
        self.tests_run = 0
        self.tests_passed = 0
        self.failed_tests = []

    def run_test(self, name, method, endpoint, expected_status, data=None, auth_required=False):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}" if endpoint else self.base_url
        headers = {'Content-Type': 'application/json'}
        
        if auth_required:
            headers['Authorization'] = f'Bearer {self.session_token}'

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=10)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=headers, timeout=10)
            elif method == 'DELETE':
                response = requests.delete(url, headers=headers, timeout=10)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    if isinstance(response_data, dict) and len(str(response_data)) < 200:
                        print(f"   Response: {response_data}")
                except:
                    pass
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                try:
                    error_data = response.json()
                    print(f"   Error: {error_data}")
                except:
                    print(f"   Response text: {response.text[:200]}")
                self.failed_tests.append({
                    "test": name,
                    "expected": expected_status,
                    "actual": response.status_code,
                    "endpoint": endpoint
                })

            return success, response.json() if response.content else {}

        except requests.exceptions.RequestException as e:
            print(f"❌ Failed - Network Error: {str(e)}")
            self.failed_tests.append({
                "test": name,
                "error": str(e),
                "endpoint": endpoint
            })
            return False, {}
        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            self.failed_tests.append({
                "test": name,
                "error": str(e),
                "endpoint": endpoint
            })
            return False, {}

    def test_root_endpoint(self):
        """Test API root endpoint"""
        return self.run_test("API Root", "GET", "", 200)

    def test_public_settings(self):
        """Test public settings endpoint"""
        return self.run_test("Public Settings", "GET", "settings/public", 200)

    def test_auth_me(self):
        """Test authentication endpoint"""
        return self.run_test("Auth Me", "GET", "auth/me", 200, auth_required=True)

    def test_auth_me_without_token(self):
        """Test authentication endpoint without token"""
        return self.run_test("Auth Me (No Token)", "GET", "auth/me", 401)

    def test_cart_endpoints(self):
        """Test cart-related endpoints"""
        print("\n📦 Testing Cart Endpoints...")
        
        # Get cart (should be empty or return items)
        success, _ = self.run_test("Get Cart", "GET", "cart", 200, auth_required=True)
        
        # Add item to cart
        cart_item = {
            "product_name": "Test Product تجريبي",
            "product_url": "https://ar.aliexpress.com/item/test",
            "product_image": "https://via.placeholder.com/150",
            "price": 25.99,
            "quantity": 1,
            "size": "L",
            "color": "أزرق",
            "notes": "منتج تجريبي"
        }
        success, response = self.run_test("Add to Cart", "POST", "cart", 200, cart_item, auth_required=True)
        
        return success

    def test_addresses_endpoints(self):
        """Test address management endpoints"""
        print("\n🏠 Testing Address Endpoints...")
        
        # Get addresses
        success, _ = self.run_test("Get Addresses", "GET", "addresses", 200, auth_required=True)
        
        # Add address
        address_data = {
            "name": "أحمد محمد",
            "phone": "+967777123456",
            "governorate": "صنعاء",
            "city": "صنعاء",
            "description": "شارع الزبيري، بجانب البنك",
            "is_default": True
        }
        success, response = self.run_test("Add Address", "POST", "addresses", 200, address_data, auth_required=True)
        
        return success

    def test_orders_endpoints(self):
        """Test order management endpoints"""
        print("\n📋 Testing Order Endpoints...")
        
        # Get orders
        success, _ = self.run_test("Get Orders", "GET", "orders", 200, auth_required=True)
        
        return success

    def test_admin_endpoints(self):
        """Test admin-only endpoints"""
        print("\n👑 Testing Admin Endpoints...")
        
        # Admin stats
        success, _ = self.run_test("Admin Stats", "GET", "admin/stats", 200, auth_required=True)
        
        # Admin orders
        success, _ = self.run_test("Admin Orders", "GET", "admin/orders", 200, auth_required=True)
        
        # Admin settings
        success, _ = self.run_test("Admin Settings", "GET", "admin/settings", 200, auth_required=True)
        
        return success

    def test_profile_endpoints(self):
        """Test profile management"""
        print("\n👤 Testing Profile Endpoints...")
        
        # Update profile
        profile_data = {
            "phone": "+967777123456",
            "city": "صنعاء"
        }
        success, _ = self.run_test("Update Profile", "PUT", "auth/profile", 200, profile_data, auth_required=True)
        
        return success

def main():
    print("🚀 Starting Wo6ol Backend API Tests")
    print("=" * 50)
    
    tester = Wo6olAPITester()
    
    # Test basic endpoints
    print("\n🔧 Testing Basic Endpoints...")
    tester.test_root_endpoint()
    tester.test_public_settings()
    
    # Test authentication
    print("\n🔐 Testing Authentication...")
    tester.test_auth_me()
    tester.test_auth_me_without_token()
    
    # Test main functionality
    tester.test_cart_endpoints()
    tester.test_addresses_endpoints()
    tester.test_orders_endpoints()
    tester.test_profile_endpoints()
    
    # Test admin functionality
    tester.test_admin_endpoints()
    
    # Print final results
    print("\n" + "=" * 50)
    print(f"📊 Test Results: {tester.tests_passed}/{tester.tests_run} passed")
    
    if tester.failed_tests:
        print(f"\n❌ Failed Tests ({len(tester.failed_tests)}):")
        for test in tester.failed_tests:
            print(f"   • {test['test']}: {test.get('error', f\"Expected {test.get('expected')}, got {test.get('actual')}\")}")
    
    success_rate = (tester.tests_passed / tester.tests_run) * 100 if tester.tests_run > 0 else 0
    print(f"\n📈 Success Rate: {success_rate:.1f}%")
    
    if success_rate >= 80:
        print("🎉 Backend API is working well!")
        return 0
    elif success_rate >= 50:
        print("⚠️  Backend API has some issues but core functionality works")
        return 1
    else:
        print("🚨 Backend API has major issues")
        return 2

if __name__ == "__main__":
    sys.exit(main())