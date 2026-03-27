#!/usr/bin/env python3

import requests
import sys
import json
from datetime import datetime
from typing import Dict, Any

class CatholicProfessionalsAPITester:
    def __init__(self, base_url="https://catholic-biz-png.preview.emergentagent.com"):
        self.base_url = base_url
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []

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

    def run_test(self, name: str, method: str, endpoint: str, expected_status: int, data: Dict[Any, Any] = None) -> tuple:
        """Run a single API test"""
        url = f"{self.base_url}/api/{endpoint}"
        headers = {'Content-Type': 'application/json'}

        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=10)
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

    def test_contact_form_submission(self):
        """Test contact form submission"""
        test_data = {
            "name": "Test User",
            "email": "test@example.com",
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
            # Verify response contains expected fields
            required_fields = ["id", "name", "email", "subject", "message", "created_at", "status"]
            missing_fields = [field for field in required_fields if field not in response]
            if missing_fields:
                self.log_test("Contact Form Response Validation", False, f"Missing fields: {missing_fields}")
                return False
            else:
                self.log_test("Contact Form Response Validation", True, "All required fields present")
        
        return success

    def test_get_contacts(self):
        """Test getting contacts"""
        success, response = self.run_test(
            "Get Contacts",
            "GET",
            "contact",
            200
        )
        
        if success:
            if isinstance(response, list):
                self.log_test("Contacts Response Format", True, f"Returned {len(response)} contacts")
            else:
                self.log_test("Contacts Response Format", False, "Response is not a list")
                return False
        
        return success

    def test_events_endpoints(self):
        """Test events endpoints"""
        # Test GET events
        success, response = self.run_test(
            "Get Events",
            "GET",
            "events",
            200
        )
        
        if success and isinstance(response, list):
            self.log_test("Events Response Format", True, f"Returned {len(response)} events")
        else:
            self.log_test("Events Response Format", False, "Invalid response format")
        
        # Test POST event
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
            "Create Event",
            "POST",
            "events",
            200,
            test_event
        )
        
        return success and post_success

    def test_news_endpoints(self):
        """Test news endpoints"""
        # Test GET news
        success, response = self.run_test(
            "Get News",
            "GET",
            "news",
            200
        )
        
        if success and isinstance(response, list):
            self.log_test("News Response Format", True, f"Returned {len(response)} news items")
        else:
            self.log_test("News Response Format", False, "Invalid response format")
        
        # Test POST news
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
            "Create News",
            "POST",
            "news",
            200,
            test_news
        )
        
        return success and post_success

    def test_status_endpoints(self):
        """Test status check endpoints"""
        # Test POST status
        test_status = {
            "client_name": "test_client"
        }
        
        success, response = self.run_test(
            "Create Status Check",
            "POST",
            "status",
            200,
            test_status
        )
        
        # Test GET status
        get_success, get_response = self.run_test(
            "Get Status Checks",
            "GET",
            "status",
            200
        )
        
        return success and get_success

    def run_all_tests(self):
        """Run all backend API tests"""
        print("🚀 Starting Catholic Professionals PNG API Tests")
        print(f"📍 Testing against: {self.base_url}")
        print("=" * 60)
        
        # Test API availability
        if not self.test_api_root():
            print("❌ API root endpoint failed - stopping tests")
            return False
        
        # Test all endpoints
        self.test_contact_form_submission()
        self.test_get_contacts()
        self.test_events_endpoints()
        self.test_news_endpoints()
        self.test_status_endpoints()
        
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
    tester = CatholicProfessionalsAPITester()
    success = tester.run_all_tests()
    tester.save_results()
    
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())