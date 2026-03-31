#!/usr/bin/env python3

import requests
import sys
import json
from datetime import datetime
from typing import Dict, Any

class CatholicProfessionalsCMSTester:
    def __init__(self, base_url="https://catholic-biz-png.preview.emergentagent.com"):
        self.base_url = base_url
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []
        self.session_token = None
        self.test_user_id = None

    def log_test(self, name: str, success: bool, details: str = ""):
        """Log test result"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
        
        result = {
            "test_name": name,
            "success": success,
            "details": details,
            "timestamp": datetime.now().isoformat()
        }
        self.test_results.append(result)
        
        status = "✅ PASSED" if success else "❌ FAILED"
        print(f"{status} - {name}")
        if details:
            print(f"   Details: {details}")

    def run_test(self, name: str, method: str, endpoint: str, expected_status: int, data: Dict[Any, Any] = None, auth_required: bool = False) -> tuple:
        """Run a single API test"""
        url = f"{self.base_url}/api/{endpoint}"
        headers = {'Content-Type': 'application/json'}
        
        # Add auth header if required and available
        if auth_required and self.session_token:
            headers['Authorization'] = f'Bearer {self.session_token}'

        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=10)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=headers, timeout=10)
            elif method == 'DELETE':
                response = requests.delete(url, headers=headers, timeout=10)
            elif method == 'PATCH':
                response = requests.patch(url, json=data, headers=headers, timeout=10)
            else:
                self.log_test(name, False, f"Unsupported method: {method}")
                return False, {}

            success = response.status_code == expected_status
            details = f"Status: {response.status_code}, Expected: {expected_status}"
            
            if not success:
                details += f", Response: {response.text[:200]}"
            
            self.log_test(name, success, details)
            
            try:
                return success, response.json() if success else {}
            except:
                return success, {}

        except requests.exceptions.RequestException as e:
            self.log_test(name, False, f"Request failed: {str(e)}")
            return False, {}

    def test_api_root(self):
        """Test API root endpoint"""
        success, response = self.run_test(
            "API Root",
            "GET",
            "",
            200
        )
        return success and "Catholic Professionals PNG API" in str(response)

    def test_auth_register(self):
        """Test user registration"""
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        test_data = {
            "name": f"Test User {timestamp}",
            "email": f"test_{timestamp}@example.com",
            "password": "TestPassword123!"
        }
        
        success, response = self.run_test(
            "User Registration",
            "POST",
            "auth/register",
            200,
            test_data
        )
        
        if success and response:
            self.test_user_id = response.get('user_id')
            # Registration should set session cookie, but we'll test login separately
            required_fields = ["user_id", "email", "name", "role"]
            missing_fields = [field for field in required_fields if field not in response]
            if missing_fields:
                self.log_test("Registration Response Validation", False, f"Missing fields: {missing_fields}")
                return False
            else:
                self.log_test("Registration Response Validation", True, "All required fields present")
        
        return success

    def test_auth_login(self):
        """Test user login"""
        # First register a user
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        register_data = {
            "name": f"Login Test User {timestamp}",
            "email": f"login_test_{timestamp}@example.com",
            "password": "TestPassword123!"
        }
        
        reg_success, reg_response = self.run_test(
            "Pre-Login Registration",
            "POST",
            "auth/register",
            200,
            register_data
        )
        
        if not reg_success:
            return False
        
        # Now test login
        login_data = {
            "email": register_data["email"],
            "password": register_data["password"]
        }
        
        success, response = self.run_test(
            "User Login",
            "POST",
            "auth/login",
            200,
            login_data
        )
        
        if success and response:
            self.test_user_id = response.get('user_id')
            # Login doesn't return session token in response, it sets cookie
            required_fields = ["user_id", "email", "name", "role"]
            missing_fields = [field for field in required_fields if field not in response]
            if missing_fields:
                self.log_test("Login Response Validation", False, f"Missing fields: {missing_fields}")
                return False
            else:
                self.log_test("Login Response Validation", True, "All required fields present")
        
        return success

    def test_auth_me_without_auth(self):
        """Test auth/me endpoint without authentication"""
        success, response = self.run_test(
            "Auth Me (No Auth)",
            "GET",
            "auth/me",
            401
        )
        return success

    def test_dashboard_stats_without_auth(self):
        """Test dashboard stats endpoint without authentication"""
        success, response = self.run_test(
            "Dashboard Stats (No Auth)",
            "GET",
            "dashboard/stats",
            401
        )
        return success

    def test_contact_form_submission(self):
        """Test contact form submission (public endpoint)"""
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        test_data = {
            "name": f"Test User {timestamp}",
            "email": f"test_{timestamp}@example.com",
            "phone": "+675 123 4567",
            "subject": "Test Subject",
            "message": "This is a test message from the automated test suite."
        }
        
        success, response = self.run_test(
            "Contact Form Submission",
            "POST",
            "contact",
            200,
            test_data
        )
        
        if success and response:
            required_fields = ["id", "name", "email", "subject", "message", "created_at", "status"]
            missing_fields = [field for field in required_fields if field not in response]
            if missing_fields:
                self.log_test("Contact Form Response Validation", False, f"Missing fields: {missing_fields}")
                return False
            else:
                self.log_test("Contact Form Response Validation", True, "All required fields present")
        
        return success

    def test_get_contacts_without_auth(self):
        """Test getting contacts without authentication"""
        success, response = self.run_test(
            "Get Contacts (No Auth)",
            "GET",
            "contact",
            401
        )
        return success

    def test_events_endpoints(self):
        """Test events endpoints (public access)"""
        # Test GET events (public)
        success, response = self.run_test(
            "Get Events (Public)",
            "GET",
            "events",
            200
        )
        
        if success and isinstance(response, list):
            self.log_test("Events Response Format", True, f"Returned {len(response)} events")
        else:
            self.log_test("Events Response Format", False, "Invalid response format")
        
        # Test POST event without auth (should fail)
        test_event = {
            "title": "Test Event",
            "description": "This is a test event",
            "date": "2025-12-31",
            "time": "10:00 AM",
            "location": "Test Location",
            "attendees": 50,
            "featured": False
        }
        
        post_success, post_response = self.run_test(
            "Create Event (No Auth)",
            "POST",
            "events",
            401,
            test_event
        )
        
        return success and post_success

    def test_news_endpoints(self):
        """Test news endpoints (public access)"""
        # Test GET news (public)
        success, response = self.run_test(
            "Get News (Public)",
            "GET",
            "news",
            200
        )
        
        if success and isinstance(response, list):
            self.log_test("News Response Format", True, f"Returned {len(response)} news items")
        else:
            self.log_test("News Response Format", False, "Invalid response format")
        
        # Test POST news without auth (should fail)
        test_news = {
            "title": "Test News Article",
            "excerpt": "This is a test news excerpt",
            "content": "This is the full content of the test news article.",
            "date": "2025-01-20",
            "author": "Test Author",
            "category": "Test Category",
            "readTime": "3 min read",
            "featured": False
        }
        
        post_success, post_response = self.run_test(
            "Create News (No Auth)",
            "POST",
            "news",
            401,
            test_news
        )
        
        return success and post_success

    def test_members_endpoints(self):
        """Test members endpoints (public access)"""
        # Test GET members (public)
        success, response = self.run_test(
            "Get Members (Public)",
            "GET",
            "members",
            200
        )
        
        if success and isinstance(response, list):
            self.log_test("Members Response Format", True, f"Returned {len(response)} members")
        else:
            self.log_test("Members Response Format", False, "Invalid response format")
        
        # Test POST member without auth (should fail)
        test_member = {
            "name": "Test Member",
            "email": "member@example.com",
            "profession": "Test Profession",
            "company": "Test Company",
            "bio": "Test bio",
            "featured": False,
            "published": True
        }
        
        post_success, post_response = self.run_test(
            "Create Member (No Auth)",
            "POST",
            "members",
            401,
            test_member
        )
        
        return success and post_success

    def test_newsletter_endpoints(self):
        """Test newsletter endpoints"""
        # Test newsletter subscription (public)
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        test_data = {
            "email": f"newsletter_{timestamp}@example.com",
            "name": f"Newsletter Test {timestamp}"
        }
        
        success, response = self.run_test(
            "Newsletter Subscription",
            "POST",
            "newsletter",
            200,
            test_data
        )
        
        if success and response:
            required_fields = ["id", "email", "subscribed", "created_at"]
            missing_fields = [field for field in required_fields if field not in response]
            if missing_fields:
                self.log_test("Newsletter Response Validation", False, f"Missing fields: {missing_fields}")
                return False
            else:
                self.log_test("Newsletter Response Validation", True, "All required fields present")
        
        # Test GET newsletter subscribers without auth (should fail)
        get_success, get_response = self.run_test(
            "Get Newsletter Subscribers (No Auth)",
            "GET",
            "newsletter",
            401
        )
        
        return success and get_success

    def test_page_settings_endpoints(self):
        """Test page settings endpoints"""
        # Test GET page settings (public)
        success, response = self.run_test(
            "Get Page Settings (Public)",
            "GET",
            "settings/hero",
            200
        )
        
        if success:
            self.log_test("Page Settings Response Format", True, "Settings endpoint accessible")
        
        # Test PUT page settings without auth (should fail)
        test_settings = {
            "settings": {
                "title": "Test Title",
                "subtitle": "Test Subtitle"
            }
        }
        
        put_success, put_response = self.run_test(
            "Update Page Settings (No Auth)",
            "PUT",
            "settings/hero",
            401,
            test_settings
        )
        
        return success and put_success

    def test_gallery_endpoints(self):
        """Test gallery endpoints"""
        # Test GET gallery (public)
        success, response = self.run_test(
            "Get Gallery Images",
            "GET",
            "gallery",
            200
        )
        
        if success and response:
            if "db_images" in response and "fs_images" in response:
                self.log_test("Gallery Response Format", True, f"DB images: {len(response.get('db_images', []))}, FS images: {len(response.get('fs_images', []))}")
            else:
                self.log_test("Gallery Response Format", False, "Missing db_images or fs_images")
        
        return success

    def run_all_tests(self):
        """Run all backend API tests"""
        print("🚀 Starting Catholic Professionals PNG CMS API Tests")
        print(f"📍 Testing against: {self.base_url}")
        print("=" * 60)
        
        # Test API availability
        if not self.test_api_root():
            print("❌ API root endpoint failed - stopping tests")
            return False
        
        # Test authentication endpoints
        print("\n🔐 Testing Authentication Endpoints")
        self.test_auth_register()
        self.test_auth_login()
        self.test_auth_me_without_auth()
        
        # Test dashboard endpoints
        print("\n📊 Testing Dashboard Endpoints")
        self.test_dashboard_stats_without_auth()
        
        # Test public endpoints
        print("\n🌐 Testing Public Endpoints")
        self.test_contact_form_submission()
        self.test_get_contacts_without_auth()
        self.test_events_endpoints()
        self.test_news_endpoints()
        self.test_members_endpoints()
        self.test_newsletter_endpoints()
        self.test_page_settings_endpoints()
        self.test_gallery_endpoints()
        
        # Print summary
        print("=" * 60)
        print(f"📊 Test Summary: {self.tests_passed}/{self.tests_run} tests passed")
        success_rate = (self.tests_passed / self.tests_run) * 100 if self.tests_run > 0 else 0
        print(f"📈 Success Rate: {success_rate:.1f}%")
        
        if self.tests_passed == self.tests_run:
            print("🎉 All tests passed!")
            return True
        else:
            print("⚠️  Some tests failed - check details above")
            return False

    def save_results(self, filename: str = "/app/backend_test_results.json"):
        """Save test results to file"""
        results = {
            "summary": {
                "total_tests": self.tests_run,
                "passed_tests": self.tests_passed,
                "success_rate": (self.tests_passed / self.tests_run) * 100 if self.tests_run > 0 else 0,
                "timestamp": datetime.now().isoformat()
            },
            "test_results": self.test_results
        }
        
        try:
            with open(filename, 'w') as f:
                json.dump(results, f, indent=2)
            print(f"📄 Test results saved to: {filename}")
        except Exception as e:
            print(f"❌ Failed to save results: {e}")

def main():
    tester = CatholicProfessionalsCMSTester()
    success = tester.run_all_tests()
    tester.save_results()
    
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())