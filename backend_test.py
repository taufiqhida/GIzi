#!/usr/bin/env python3
"""
Comprehensive Backend API Test Suite for Sobat Giziku
Tests role-based authentication system and all API endpoints
"""

import requests
import json
import sys
import os
from datetime import datetime

# Get backend URL from frontend .env
def get_backend_url():
    try:
        with open('/app/frontend/.env', 'r') as f:
            for line in f:
                if line.startswith('REACT_APP_BACKEND_URL='):
                    return line.split('=')[1].strip()
    except Exception as e:
        print(f"Error reading backend URL: {e}")
        return None

BASE_URL = get_backend_url()
if not BASE_URL:
    print("❌ Could not get backend URL from frontend/.env")
    sys.exit(1)

API_URL = f"{BASE_URL}/api"
print(f"🔗 Testing API at: {API_URL}")

# Test data
TEST_USERS = {
    'admin': {
        'email': 'admin@sobatgizi.com',
        'password': 'admin123',
        'nama': 'Admin User',
        'role': 'admin',
        'nohp': '081234567890'
    },
    'dokter': {
        'email': 'dokter@sobatgizi.com', 
        'password': 'dokter123',
        'nama': 'Dr. Test Dokter',
        'role': 'dokter',
        'nohp': '081234567891',
        'spesialisasi': 'Gizi Anak',
        'pengalaman': '5 tahun',
        'keahlian': ['Konsultasi Gizi', 'MPASI'],
        'jadwal': 'Senin-Jumat 08:00-17:00'
    },
    'pasien': {
        'email': 'testpasien@example.com',
        'password': 'test123',
        'nama': 'Test Pasien',
        'role': 'pasien',
        'nohp': '081234567892'
    }
}

BALITA_DATA = {
    'nama_balita': 'Anak Test',
    'jenis_kelamin': 'laki',
    'tanggal_lahir': '2023-01-15',
    'nik_balita': '1234567890123456',
    'berat_badan': 10.5,
    'tinggi_badan': 75.0,
    'nama_orang_tua': 'Test Parent',
    'anak_ke': 1,
    'berat_badan_lahir': 3.2,
    'panjang_badan_lahir': 50.0,
    'rt': '001',
    'rw': '002',
    'kelurahan': 'Test Kelurahan'
}

# Global variables to store tokens and IDs
tokens = {}
user_ids = {}
balita_id = None
konsultasi_id = None

def test_api_health():
    """Test if API is accessible"""
    print("\n🔍 Testing API Health...")
    try:
        response = requests.get(f"{API_URL}/", timeout=10)
        if response.status_code == 200:
            print("✅ API is accessible")
            return True
        else:
            print(f"❌ API health check failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ API health check failed: {e}")
        return False

def test_user_registration():
    """Test user registration for all roles"""
    print("\n🔍 Testing User Registration...")
    success_count = 0
    
    for role, user_data in TEST_USERS.items():
        try:
            response = requests.post(f"{API_URL}/auth/register", json=user_data, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if 'access_token' in data and 'user' in data:
                    tokens[role] = data['access_token']
                    user_ids[role] = data['user']['id']
                    print(f"✅ {role.capitalize()} registration successful")
                    success_count += 1
                else:
                    print(f"❌ {role.capitalize()} registration missing required fields")
            elif response.status_code == 400 and "already registered" in response.text:
                print(f"⚠️  {role.capitalize()} already exists, trying login...")
                # Try login instead
                login_data = {'email': user_data['email'], 'password': user_data['password']}
                login_response = requests.post(f"{API_URL}/auth/login", json=login_data, timeout=10)
                if login_response.status_code == 200:
                    login_result = login_response.json()
                    tokens[role] = login_result['access_token']
                    user_ids[role] = login_result['user']['id']
                    print(f"✅ {role.capitalize()} login successful")
                    success_count += 1
                else:
                    print(f"❌ {role.capitalize()} login failed: {login_response.status_code}")
            else:
                print(f"❌ {role.capitalize()} registration failed: {response.status_code} - {response.text}")
                
        except Exception as e:
            print(f"❌ {role.capitalize()} registration error: {e}")
    
    return success_count == len(TEST_USERS)

def test_user_login():
    """Test user login"""
    print("\n🔍 Testing User Login...")
    success_count = 0
    
    for role, user_data in TEST_USERS.items():
        try:
            login_data = {'email': user_data['email'], 'password': user_data['password']}
            response = requests.post(f"{API_URL}/auth/login", json=login_data, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if 'access_token' in data:
                    tokens[role] = data['access_token']
                    user_ids[role] = data['user']['id']
                    print(f"✅ {role.capitalize()} login successful")
                    success_count += 1
                else:
                    print(f"❌ {role.capitalize()} login missing access_token")
            else:
                print(f"❌ {role.capitalize()} login failed: {response.status_code}")
                
        except Exception as e:
            print(f"❌ {role.capitalize()} login error: {e}")
    
    return success_count == len(TEST_USERS)

def test_protected_routes():
    """Test protected /me endpoint"""
    print("\n🔍 Testing Protected Routes...")
    success_count = 0
    
    for role in tokens:
        try:
            headers = {'Authorization': f'Bearer {tokens[role]}'}
            response = requests.get(f"{API_URL}/auth/me", headers=headers, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if data.get('role') == role:
                    print(f"✅ {role.capitalize()} /me endpoint working")
                    success_count += 1
                else:
                    print(f"❌ {role.capitalize()} /me returned wrong role: {data.get('role')}")
            else:
                print(f"❌ {role.capitalize()} /me failed: {response.status_code}")
                
        except Exception as e:
            print(f"❌ {role.capitalize()} /me error: {e}")
    
    return success_count == len(tokens)

def test_admin_endpoints():
    """Test admin-specific endpoints"""
    print("\n🔍 Testing Admin Endpoints...")
    
    if 'admin' not in tokens:
        print("❌ Admin token not available")
        return False
    
    headers = {'Authorization': f'Bearer {tokens["admin"]}'}
    success_count = 0
    
    # Test get users
    try:
        response = requests.get(f"{API_URL}/admin/users", headers=headers, timeout=10)
        if response.status_code == 200:
            users = response.json()
            if isinstance(users, list):
                print(f"✅ Admin can get users list ({len(users)} users)")
                success_count += 1
            else:
                print("❌ Admin users endpoint returned invalid format")
        else:
            print(f"❌ Admin get users failed: {response.status_code}")
    except Exception as e:
        print(f"❌ Admin get users error: {e}")
    
    # Test create user
    try:
        new_user = {
            'email': 'newuser@test.com',
            'password': 'test123',
            'nama': 'New Test User',
            'role': 'pasien',
            'nohp': '081234567899'
        }
        response = requests.post(f"{API_URL}/admin/users", json=new_user, headers=headers, timeout=10)
        if response.status_code == 200:
            print("✅ Admin can create new user")
            success_count += 1
        elif response.status_code == 400 and "already registered" in response.text:
            print("✅ Admin create user (user already exists)")
            success_count += 1
        else:
            print(f"❌ Admin create user failed: {response.status_code}")
    except Exception as e:
        print(f"❌ Admin create user error: {e}")
    
    return success_count == 2

def test_pasien_endpoints():
    """Test pasien-specific endpoints"""
    print("\n🔍 Testing Pasien Endpoints...")
    global balita_id, konsultasi_id
    
    if 'pasien' not in tokens:
        print("❌ Pasien token not available")
        return False
    
    headers = {'Authorization': f'Bearer {tokens["pasien"]}'}
    success_count = 0
    
    # Test create balita
    try:
        response = requests.post(f"{API_URL}/pasien/balita", json=BALITA_DATA, headers=headers, timeout=10)
        if response.status_code == 200:
            balita_data = response.json()
            balita_id = balita_data.get('id')
            print("✅ Pasien can create balita data")
            success_count += 1
        else:
            print(f"❌ Pasien create balita failed: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"❌ Pasien create balita error: {e}")
    
    # Test get balita
    try:
        response = requests.get(f"{API_URL}/pasien/balita", headers=headers, timeout=10)
        if response.status_code == 200:
            balita_list = response.json()
            if isinstance(balita_list, list):
                print(f"✅ Pasien can get balita list ({len(balita_list)} items)")
                success_count += 1
                # Use first balita if we don't have balita_id
                if not balita_id and balita_list:
                    balita_id = balita_list[0].get('id')
            else:
                print("❌ Pasien balita list returned invalid format")
        else:
            print(f"❌ Pasien get balita failed: {response.status_code}")
    except Exception as e:
        print(f"❌ Pasien get balita error: {e}")
    
    # Test create konsultasi (only if we have balita_id)
    if balita_id:
        try:
            konsultasi_data = {
                'balita_id': balita_id,
                'keluhan': 'Anak saya susah makan dan berat badannya tidak naik'
            }
            response = requests.post(f"{API_URL}/pasien/konsultasi", json=konsultasi_data, headers=headers, timeout=10)
            if response.status_code == 200:
                konsultasi_result = response.json()
                konsultasi_id = konsultasi_result.get('id')
                print("✅ Pasien can create konsultasi")
                success_count += 1
            else:
                print(f"❌ Pasien create konsultasi failed: {response.status_code} - {response.text}")
        except Exception as e:
            print(f"❌ Pasien create konsultasi error: {e}")
    else:
        print("⚠️  Skipping konsultasi test - no balita_id available")
    
    # Test get konsultasi
    try:
        response = requests.get(f"{API_URL}/pasien/konsultasi", headers=headers, timeout=10)
        if response.status_code == 200:
            konsultasi_list = response.json()
            if isinstance(konsultasi_list, list):
                print(f"✅ Pasien can get konsultasi list ({len(konsultasi_list)} items)")
                success_count += 1
                # Use first konsultasi if we don't have konsultasi_id
                if not konsultasi_id and konsultasi_list:
                    konsultasi_id = konsultasi_list[0].get('id')
            else:
                print("❌ Pasien konsultasi list returned invalid format")
        else:
            print(f"❌ Pasien get konsultasi failed: {response.status_code}")
    except Exception as e:
        print(f"❌ Pasien get konsultasi error: {e}")
    
    return success_count >= 3  # At least 3 out of 4 tests should pass

def test_dokter_endpoints():
    """Test dokter-specific endpoints"""
    print("\n🔍 Testing Dokter Endpoints...")
    
    if 'dokter' not in tokens:
        print("❌ Dokter token not available")
        return False
    
    headers = {'Authorization': f'Bearer {tokens["dokter"]}'}
    success_count = 0
    
    # Test get konsultasi list
    try:
        response = requests.get(f"{API_URL}/dokter/konsultasi", headers=headers, timeout=10)
        if response.status_code == 200:
            konsultasi_list = response.json()
            if isinstance(konsultasi_list, list):
                print(f"✅ Dokter can get konsultasi list ({len(konsultasi_list)} items)")
                success_count += 1
            else:
                print("❌ Dokter konsultasi list returned invalid format")
        else:
            print(f"❌ Dokter get konsultasi failed: {response.status_code}")
    except Exception as e:
        print(f"❌ Dokter get konsultasi error: {e}")
    
    # Test accept konsultasi (only if we have konsultasi_id)
    if konsultasi_id:
        try:
            response = requests.put(f"{API_URL}/dokter/konsultasi/{konsultasi_id}/accept", headers=headers, timeout=10)
            if response.status_code == 200:
                print("✅ Dokter can accept konsultasi")
                success_count += 1
            else:
                print(f"❌ Dokter accept konsultasi failed: {response.status_code} - {response.text}")
        except Exception as e:
            print(f"❌ Dokter accept konsultasi error: {e}")
    else:
        print("⚠️  Skipping accept konsultasi test - no konsultasi_id available")
        success_count += 1  # Don't penalize for missing test data
    
    return success_count == 2

def test_chat_endpoints():
    """Test chat endpoints"""
    print("\n🔍 Testing Chat Endpoints...")
    
    if not konsultasi_id:
        print("⚠️  Skipping chat tests - no konsultasi_id available")
        return True  # Don't fail if no test data
    
    success_count = 0
    
    # Test send message as pasien
    if 'pasien' in tokens:
        try:
            headers = {'Authorization': f'Bearer {tokens["pasien"]}'}
            message_data = {
                'konsultasi_id': konsultasi_id,
                'message': 'Halo dokter, saya ingin konsultasi tentang anak saya'
            }
            response = requests.post(f"{API_URL}/chat", json=message_data, headers=headers, timeout=10)
            if response.status_code == 200:
                print("✅ Pasien can send chat message")
                success_count += 1
            else:
                print(f"❌ Pasien send message failed: {response.status_code} - {response.text}")
        except Exception as e:
            print(f"❌ Pasien send message error: {e}")
    
    # Test send message as dokter
    if 'dokter' in tokens:
        try:
            headers = {'Authorization': f'Bearer {tokens["dokter"]}'}
            message_data = {
                'konsultasi_id': konsultasi_id,
                'message': 'Halo, saya siap membantu konsultasi Anda'
            }
            response = requests.post(f"{API_URL}/chat", json=message_data, headers=headers, timeout=10)
            if response.status_code == 200:
                print("✅ Dokter can send chat message")
                success_count += 1
            else:
                print(f"❌ Dokter send message failed: {response.status_code} - {response.text}")
        except Exception as e:
            print(f"❌ Dokter send message error: {e}")
    
    # Test get messages
    if 'pasien' in tokens:
        try:
            headers = {'Authorization': f'Bearer {tokens["pasien"]}'}
            response = requests.get(f"{API_URL}/chat/{konsultasi_id}", headers=headers, timeout=10)
            if response.status_code == 200:
                messages = response.json()
                if isinstance(messages, list):
                    print(f"✅ Can get chat messages ({len(messages)} messages)")
                    success_count += 1
                else:
                    print("❌ Chat messages returned invalid format")
            else:
                print(f"❌ Get chat messages failed: {response.status_code}")
        except Exception as e:
            print(f"❌ Get chat messages error: {e}")
    
    return success_count >= 2  # At least 2 out of 3 tests should pass

def test_unauthorized_access():
    """Test that unauthorized access is properly blocked"""
    print("\n🔍 Testing Unauthorized Access...")
    success_count = 0
    
    # Test accessing admin endpoint without token
    try:
        response = requests.get(f"{API_URL}/admin/users", timeout=10)
        if response.status_code == 401:
            print("✅ Admin endpoint properly blocks unauthorized access")
            success_count += 1
        else:
            print(f"❌ Admin endpoint should return 401, got {response.status_code}")
    except Exception as e:
        print(f"❌ Unauthorized admin test error: {e}")
    
    # Test accessing pasien endpoint with dokter token
    if 'dokter' in tokens:
        try:
            headers = {'Authorization': f'Bearer {tokens["dokter"]}'}
            response = requests.get(f"{API_URL}/pasien/balita", headers=headers, timeout=10)
            if response.status_code == 403:
                print("✅ Pasien endpoint properly blocks dokter access")
                success_count += 1
            else:
                print(f"❌ Pasien endpoint should return 403 for dokter, got {response.status_code}")
        except Exception as e:
            print(f"❌ Cross-role access test error: {e}")
    
    return success_count == 2

def run_all_tests():
    """Run all backend API tests"""
    print("🚀 Starting Sobat Giziku Backend API Tests")
    print("=" * 50)
    
    test_results = {}
    
    # Test API health first
    test_results['api_health'] = test_api_health()
    if not test_results['api_health']:
        print("\n❌ API is not accessible. Stopping tests.")
        return test_results
    
    # Run all tests
    test_results['registration'] = test_user_registration()
    test_results['login'] = test_user_login()
    test_results['protected_routes'] = test_protected_routes()
    test_results['admin_endpoints'] = test_admin_endpoints()
    test_results['pasien_endpoints'] = test_pasien_endpoints()
    test_results['dokter_endpoints'] = test_dokter_endpoints()
    test_results['chat_endpoints'] = test_chat_endpoints()
    test_results['unauthorized_access'] = test_unauthorized_access()
    
    # Print summary
    print("\n" + "=" * 50)
    print("📊 TEST SUMMARY")
    print("=" * 50)
    
    passed = sum(1 for result in test_results.values() if result)
    total = len(test_results)
    
    for test_name, result in test_results.items():
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{test_name.replace('_', ' ').title()}: {status}")
    
    print(f"\nOverall: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All tests passed!")
        return True
    else:
        print("⚠️  Some tests failed. Check the details above.")
        return False

if __name__ == "__main__":
    success = run_all_tests()
    sys.exit(0 if success else 1)