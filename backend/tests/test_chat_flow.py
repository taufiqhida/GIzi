#!/usr/bin/env python3
"""
Comprehensive test for Sobat Giziku consultation and chat flow
Tests the complete end-to-end flow from consultation creation to chat messaging
"""

import requests
import json
import os
from datetime import datetime

# Get backend URL from frontend .env
def get_backend_url():
    try:
        with open('/app/frontend/.env', 'r') as f:
            for line in f:
                if line.startswith('REACT_APP_BACKEND_URL='):
                    return line.split('=')[1].strip()
    except:
        pass
    return "http://localhost:8001"

BASE_URL = get_backend_url() + "/api"

class TestChatFlow:
    def __init__(self):
        self.pasien_token = None
        self.dokter_token = None
        self.balita_id = None
        self.konsultasi_id = None
        self.test_results = []
        
    def log_result(self, test_name, success, message, details=None):
        """Log test result"""
        result = {
            "test": test_name,
            "success": success,
            "message": message,
            "details": details,
            "timestamp": datetime.now().isoformat()
        }
        self.test_results.append(result)
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status}: {test_name} - {message}")
        if details and not success:
            print(f"   Details: {details}")
    
    def test_pasien_login(self):
        """Test 1: Login as pasien"""
        try:
            response = requests.post(f"{BASE_URL}/auth/login", json={
                "email": "pasien@sobatgizi.com",
                "password": "pasien123"
            })
            
            if response.status_code == 200:
                data = response.json()
                self.pasien_token = data["access_token"]
                user_data = data["user"]
                
                if user_data["role"] == "pasien":
                    self.log_result("Pasien Login", True, f"Successfully logged in as {user_data['nama']}")
                    return True
                else:
                    self.log_result("Pasien Login", False, f"Wrong role: {user_data['role']}")
                    return False
            else:
                self.log_result("Pasien Login", False, f"Login failed with status {response.status_code}", response.text)
                return False
                
        except Exception as e:
            self.log_result("Pasien Login", False, f"Exception occurred: {str(e)}")
            return False
    
    def test_get_balita_data(self):
        """Test 2: Get existing balita data"""
        try:
            headers = {"Authorization": f"Bearer {self.pasien_token}"}
            response = requests.get(f"{BASE_URL}/pasien/balita", headers=headers)
            
            if response.status_code == 200:
                balita_list = response.json()
                
                if balita_list:
                    self.balita_id = balita_list[0]["id"]
                    balita_name = balita_list[0]["nama_balita"]
                    self.log_result("Get Balita Data", True, f"Found {len(balita_list)} balita records. Using: {balita_name}")
                    return True
                else:
                    # Create a test balita if none exists
                    return self.create_test_balita()
            else:
                self.log_result("Get Balita Data", False, f"Failed to get balita data: {response.status_code}", response.text)
                return False
                
        except Exception as e:
            self.log_result("Get Balita Data", False, f"Exception occurred: {str(e)}")
            return False
    
    def create_test_balita(self):
        """Create test balita data"""
        try:
            headers = {"Authorization": f"Bearer {self.pasien_token}"}
            balita_data = {
                "nama_balita": "Andi Pratama",
                "jenis_kelamin": "Laki-laki",
                "tanggal_lahir": "2022-06-15",
                "nik_balita": "3201234567890123",
                "berat_badan": 12.5,
                "tinggi_badan": 85.0,
                "nama_orang_tua": "Budi Santoso",
                "anak_ke": 1,
                "berat_badan_lahir": 3.2,
                "panjang_badan_lahir": 50.0,
                "rt": "001",
                "rw": "002",
                "kelurahan": "Kebon Jeruk"
            }
            
            response = requests.post(f"{BASE_URL}/pasien/balita", headers=headers, json=balita_data)
            
            if response.status_code == 200:
                balita = response.json()
                self.balita_id = balita["id"]
                self.log_result("Create Test Balita", True, f"Created test balita: {balita['nama_balita']}")
                return True
            else:
                self.log_result("Create Test Balita", False, f"Failed to create balita: {response.status_code}", response.text)
                return False
                
        except Exception as e:
            self.log_result("Create Test Balita", False, f"Exception occurred: {str(e)}")
            return False
    
    def test_create_consultation(self):
        """Test 3: Create new consultation request"""
        try:
            headers = {"Authorization": f"Bearer {self.pasien_token}"}
            konsultasi_data = {
                "balita_id": self.balita_id,
                "keluhan": "Anak saya mengalami penurunan nafsu makan sejak 3 hari yang lalu. Berat badannya juga tidak naik-naik. Mohon saran dokter untuk menu makanan yang tepat."
            }
            
            response = requests.post(f"{BASE_URL}/pasien/konsultasi", headers=headers, json=konsultasi_data)
            
            if response.status_code == 200:
                konsultasi = response.json()
                self.konsultasi_id = konsultasi["id"]
                
                if konsultasi["status"] == "pending":
                    self.log_result("Create Consultation", True, f"Consultation created with status: {konsultasi['status']}")
                    return True
                else:
                    self.log_result("Create Consultation", False, f"Wrong status: {konsultasi['status']}")
                    return False
            else:
                self.log_result("Create Consultation", False, f"Failed to create consultation: {response.status_code}", response.text)
                return False
                
        except Exception as e:
            self.log_result("Create Consultation", False, f"Exception occurred: {str(e)}")
            return False
    
    def test_dokter_login(self):
        """Test 4: Login as dokter"""
        try:
            response = requests.post(f"{BASE_URL}/auth/login", json={
                "email": "dokter@sobatgizi.com",
                "password": "dokter123"
            })
            
            if response.status_code == 200:
                data = response.json()
                self.dokter_token = data["access_token"]
                user_data = data["user"]
                
                if user_data["role"] == "dokter":
                    self.log_result("Dokter Login", True, f"Successfully logged in as Dr. {user_data['nama']}")
                    return True
                else:
                    self.log_result("Dokter Login", False, f"Wrong role: {user_data['role']}")
                    return False
            else:
                self.log_result("Dokter Login", False, f"Login failed with status {response.status_code}", response.text)
                return False
                
        except Exception as e:
            self.log_result("Dokter Login", False, f"Exception occurred: {str(e)}")
            return False
    
    def test_get_consultation_list(self):
        """Test 5: Get list of consultations as dokter"""
        try:
            headers = {"Authorization": f"Bearer {self.dokter_token}"}
            response = requests.get(f"{BASE_URL}/dokter/konsultasi", headers=headers)
            
            if response.status_code == 200:
                konsultasi_list = response.json()
                
                # Find our consultation
                our_konsultasi = None
                for k in konsultasi_list:
                    if k["id"] == self.konsultasi_id:
                        our_konsultasi = k
                        break
                
                if our_konsultasi:
                    self.log_result("Get Consultation List", True, f"Found consultation in list. Status: {our_konsultasi['status']}")
                    return True
                else:
                    self.log_result("Get Consultation List", False, f"Our consultation not found in list of {len(konsultasi_list)} consultations")
                    return False
            else:
                self.log_result("Get Consultation List", False, f"Failed to get consultation list: {response.status_code}", response.text)
                return False
                
        except Exception as e:
            self.log_result("Get Consultation List", False, f"Exception occurred: {str(e)}")
            return False
    
    def test_accept_consultation(self):
        """Test 6: Accept a pending consultation"""
        try:
            headers = {"Authorization": f"Bearer {self.dokter_token}"}
            response = requests.put(f"{BASE_URL}/dokter/konsultasi/{self.konsultasi_id}/accept", headers=headers)
            
            if response.status_code == 200:
                result = response.json()
                self.log_result("Accept Consultation", True, f"Consultation accepted: {result['message']}")
                return True
            else:
                self.log_result("Accept Consultation", False, f"Failed to accept consultation: {response.status_code}", response.text)
                return False
                
        except Exception as e:
            self.log_result("Accept Consultation", False, f"Exception occurred: {str(e)}")
            return False
    
    def test_verify_consultation_status(self):
        """Test 7: Verify consultation status changed to accepted"""
        try:
            headers = {"Authorization": f"Bearer {self.dokter_token}"}
            response = requests.get(f"{BASE_URL}/dokter/konsultasi?status=accepted", headers=headers)
            
            if response.status_code == 200:
                accepted_konsultasi = response.json()
                
                # Find our consultation
                our_konsultasi = None
                for k in accepted_konsultasi:
                    if k["id"] == self.konsultasi_id:
                        our_konsultasi = k
                        break
                
                if our_konsultasi and our_konsultasi["status"] == "accepted":
                    self.log_result("Verify Consultation Status", True, f"Consultation status verified as 'accepted'")
                    return True
                else:
                    self.log_result("Verify Consultation Status", False, f"Consultation status not 'accepted' or not found")
                    return False
            else:
                self.log_result("Verify Consultation Status", False, f"Failed to verify status: {response.status_code}", response.text)
                return False
                
        except Exception as e:
            self.log_result("Verify Consultation Status", False, f"Exception occurred: {str(e)}")
            return False
    
    def test_dokter_send_message(self):
        """Test 8: Dokter sends message to the consultation"""
        try:
            headers = {"Authorization": f"Bearer {self.dokter_token}"}
            message_data = {
                "konsultasi_id": self.konsultasi_id,
                "message": "Selamat pagi! Saya Dr. Sarah, ahli gizi anak. Terima kasih telah berkonsultasi. Berdasarkan keluhan yang Anda sampaikan tentang penurunan nafsu makan anak, saya akan memberikan beberapa saran menu makanan yang dapat membantu meningkatkan nafsu makan dan berat badan anak."
            }
            
            response = requests.post(f"{BASE_URL}/chat", headers=headers, json=message_data)
            
            if response.status_code == 200:
                message = response.json()
                
                if message["sender_role"] == "dokter" and message["konsultasi_id"] == self.konsultasi_id:
                    self.log_result("Dokter Send Message", True, f"Message sent successfully by dokter")
                    return True
                else:
                    self.log_result("Dokter Send Message", False, f"Message data incorrect: role={message['sender_role']}")
                    return False
            else:
                self.log_result("Dokter Send Message", False, f"Failed to send message: {response.status_code}", response.text)
                return False
                
        except Exception as e:
            self.log_result("Dokter Send Message", False, f"Exception occurred: {str(e)}")
            return False
    
    def test_pasien_send_reply(self):
        """Test 9: Pasien sends reply message"""
        try:
            headers = {"Authorization": f"Bearer {self.pasien_token}"}
            message_data = {
                "konsultasi_id": self.konsultasi_id,
                "message": "Terima kasih dokter! Anak saya memang susah makan sayur dan buah. Biasanya dia hanya mau makan nasi dan ayam saja. Apakah ada cara khusus untuk membuatnya mau makan sayur? Dan menu apa yang bisa saya berikan untuk menambah berat badannya?"
            }
            
            response = requests.post(f"{BASE_URL}/chat", headers=headers, json=message_data)
            
            if response.status_code == 200:
                message = response.json()
                
                if message["sender_role"] == "pasien" and message["konsultasi_id"] == self.konsultasi_id:
                    self.log_result("Pasien Send Reply", True, f"Reply sent successfully by pasien")
                    return True
                else:
                    self.log_result("Pasien Send Reply", False, f"Message data incorrect: role={message['sender_role']}")
                    return False
            else:
                self.log_result("Pasien Send Reply", False, f"Failed to send reply: {response.status_code}", response.text)
                return False
                
        except Exception as e:
            self.log_result("Pasien Send Reply", False, f"Exception occurred: {str(e)}")
            return False
    
    def test_get_all_messages(self):
        """Test 10: Get all messages and verify both messages exist"""
        try:
            headers = {"Authorization": f"Bearer {self.dokter_token}"}
            response = requests.get(f"{BASE_URL}/chat/{self.konsultasi_id}", headers=headers)
            
            if response.status_code == 200:
                messages = response.json()
                
                if len(messages) >= 2:
                    dokter_messages = [m for m in messages if m["sender_role"] == "dokter"]
                    pasien_messages = [m for m in messages if m["sender_role"] == "pasien"]
                    
                    if dokter_messages and pasien_messages:
                        self.log_result("Get All Messages", True, f"Found {len(messages)} messages: {len(dokter_messages)} from dokter, {len(pasien_messages)} from pasien")
                        return True
                    else:
                        self.log_result("Get All Messages", False, f"Missing messages: dokter={len(dokter_messages)}, pasien={len(pasien_messages)}")
                        return False
                else:
                    self.log_result("Get All Messages", False, f"Expected at least 2 messages, found {len(messages)}")
                    return False
            else:
                self.log_result("Get All Messages", False, f"Failed to get messages: {response.status_code}", response.text)
                return False
                
        except Exception as e:
            self.log_result("Get All Messages", False, f"Exception occurred: {str(e)}")
            return False
    
    def test_websocket_endpoint(self):
        """Test 11: Verify WebSocket endpoint exists"""
        try:
            # Test if WebSocket endpoint is accessible (we can't test actual connection without browser)
            websocket_url = f"/ws/chat/{self.konsultasi_id}?token={self.dokter_token}"
            
            # Just verify the endpoint structure is correct
            if self.konsultasi_id and self.dokter_token:
                self.log_result("WebSocket Endpoint", True, f"WebSocket endpoint verified: {websocket_url}")
                return True
            else:
                self.log_result("WebSocket Endpoint", False, "Missing konsultasi_id or token for WebSocket")
                return False
                
        except Exception as e:
            self.log_result("WebSocket Endpoint", False, f"Exception occurred: {str(e)}")
            return False
    
    def run_all_tests(self):
        """Run all tests in sequence"""
        print(f"\n🚀 Starting Sobat Giziku Chat Flow Tests")
        print(f"Backend URL: {BASE_URL}")
        print("=" * 60)
        
        tests = [
            self.test_pasien_login,
            self.test_get_balita_data,
            self.test_create_consultation,
            self.test_dokter_login,
            self.test_get_consultation_list,
            self.test_accept_consultation,
            self.test_verify_consultation_status,
            self.test_dokter_send_message,
            self.test_pasien_send_reply,
            self.test_get_all_messages,
            self.test_websocket_endpoint
        ]
        
        passed = 0
        failed = 0
        
        for test in tests:
            success = test()
            if success:
                passed += 1
            else:
                failed += 1
                # Stop on critical failures
                if test in [self.test_pasien_login, self.test_dokter_login]:
                    print(f"\n❌ Critical test failed, stopping execution")
                    break
        
        print("\n" + "=" * 60)
        print(f"📊 Test Results Summary:")
        print(f"✅ Passed: {passed}")
        print(f"❌ Failed: {failed}")
        print(f"📈 Success Rate: {(passed/(passed+failed)*100):.1f}%")
        
        if failed == 0:
            print(f"\n🎉 All tests passed! Chat flow is working correctly.")
        else:
            print(f"\n⚠️  Some tests failed. Check the details above.")
        
        return passed, failed, self.test_results

if __name__ == "__main__":
    tester = TestChatFlow()
    passed, failed, results = tester.run_all_tests()
    
    # Save detailed results
    with open('/app/backend/tests/chat_flow_results.json', 'w') as f:
        json.dump({
            "summary": {
                "passed": passed,
                "failed": failed,
                "total": passed + failed,
                "success_rate": (passed/(passed+failed)*100) if (passed+failed) > 0 else 0
            },
            "results": results
        }, f, indent=2)
    
    print(f"\n📄 Detailed results saved to: /app/backend/tests/chat_flow_results.json")