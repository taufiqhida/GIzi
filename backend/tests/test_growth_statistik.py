"""Tests for Growth Curve (riwayat), Balita CRUD, and Statistik Kelurahan endpoints."""
import os
import pytest
import requests
from datetime import datetime, timedelta

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://kesehatan-kelurahan.preview.emergentagent.com').rstrip('/')
API = f"{BASE_URL}/api"

PASIEN_EMAIL = "pasien@sobatgizi.com"
PASIEN_PASSWORD = "pasien123"
PASIEN2_EMAIL = "TEST_pasien2@sobatgizi.com"
PASIEN2_PASSWORD = "pasien2pass"


# -------------------- Fixtures --------------------
@pytest.fixture(scope="session")
def session():
    return requests.Session()


@pytest.fixture(scope="session")
def pasien_token(session):
    r = session.post(f"{API}/auth/login", json={"email": PASIEN_EMAIL, "password": PASIEN_PASSWORD})
    assert r.status_code == 200, f"Login failed: {r.text}"
    return r.json()["access_token"]


@pytest.fixture(scope="session")
def pasien_headers(pasien_token):
    return {"Authorization": f"Bearer {pasien_token}"}


@pytest.fixture(scope="session")
def pasien2_token(session):
    # Try register second pasien for isolation tests
    payload = {
        "email": PASIEN2_EMAIL,
        "password": PASIEN2_PASSWORD,
        "nama": "Test Pasien 2",
        "role": "pasien",
        "nohp": "08123456789"
    }
    r = session.post(f"{API}/auth/register", json=payload)
    if r.status_code in (200, 201):
        return r.json()["access_token"]
    # fallback to login
    r = session.post(f"{API}/auth/login", json={"email": PASIEN2_EMAIL, "password": PASIEN2_PASSWORD})
    assert r.status_code == 200, f"Could not auth pasien2: {r.text}"
    return r.json()["access_token"]


@pytest.fixture(scope="session")
def pasien2_headers(pasien2_token):
    return {"Authorization": f"Bearer {pasien2_token}"}


@pytest.fixture(scope="session")
def created_balita(session, pasien_headers):
    """Create a balita with TEST_ prefix for testing. Returns the created balita dict."""
    today = datetime.now()
    lahir = (today - timedelta(days=365)).strftime('%Y-%m-%d')
    payload = {
        "nama_balita": "TEST_Bayi Test",
        "jenis_kelamin": "Laki-laki",
        "tanggal_lahir": lahir,
        "nik_balita": f"TEST{datetime.now().strftime('%H%M%S%f')}",
        "berat_badan": 9.5,
        "tinggi_badan": 75.0,
        "nama_orang_tua": "TEST Ortu",
        "anak_ke": 1,
        "berat_badan_lahir": 3.2,
        "panjang_badan_lahir": 50.0,
        "rt": "01",
        "rw": "02",
        "kelurahan": "TEST_Kelurahan"
    }
    r = session.post(f"{API}/pasien/balita", json=payload, headers=pasien_headers)
    assert r.status_code == 200, f"Create balita failed: {r.text}"
    data = r.json()
    yield data
    # Cleanup
    session.delete(f"{API}/pasien/balita/{data['id']}", headers=pasien_headers)


# -------------------- Tests --------------------
class TestBalitaCreate:
    def test_create_balita_initializes_riwayat(self, created_balita):
        assert "riwayat" in created_balita
        assert isinstance(created_balita["riwayat"], list)
        assert len(created_balita["riwayat"]) == 1, "Initial measurement should be added to riwayat"
        first = created_balita["riwayat"][0]
        assert first["berat_badan"] == 9.5
        assert first["tinggi_badan"] == 75.0
        assert "usia_bulan" in first
        assert "status_kms" in first
        assert "status" in first["status_kms"]


class TestAddPengukuran:
    def test_add_pengukuran_success(self, session, pasien_headers, created_balita):
        bid = created_balita["id"]
        tgl = datetime.now().strftime('%Y-%m-%d')
        r = session.post(
            f"{API}/pasien/balita/{bid}/riwayat",
            json={"tanggal": tgl, "berat_badan": 10.2, "tinggi_badan": 77.0},
            headers=pasien_headers,
        )
        assert r.status_code == 200, r.text
        updated = r.json()
        assert len(updated["riwayat"]) >= 2
        # latest should match new measurement
        assert updated["berat_badan"] == 10.2
        assert updated["tinggi_badan"] == 77.0
        # status_kms should be recomputed
        assert "status" in updated["status_kms"]

    def test_add_pengukuran_calculates_usia_bulan(self, session, pasien_headers, created_balita):
        bid = created_balita["id"]
        # Date 6 months after birth
        lahir = datetime.strptime(created_balita["tanggal_lahir"], '%Y-%m-%d')
        tgl = (lahir + timedelta(days=30 * 6)).strftime('%Y-%m-%d')
        r = session.post(
            f"{API}/pasien/balita/{bid}/riwayat",
            json={"tanggal": tgl, "berat_badan": 7.5, "tinggi_badan": 65.0},
            headers=pasien_headers,
        )
        assert r.status_code == 200, r.text
        riw = r.json()["riwayat"]
        # find the entry we just added
        match = [x for x in riw if x["tanggal"] == tgl]
        assert match, "Just-added measurement should exist in riwayat"
        assert 5 <= match[0]["usia_bulan"] <= 7, f"Expected usia ~6 months, got {match[0]['usia_bulan']}"

    def test_add_pengukuran_not_owner_returns_404(self, session, pasien2_headers, created_balita):
        bid = created_balita["id"]
        r = session.post(
            f"{API}/pasien/balita/{bid}/riwayat",
            json={"tanggal": "2025-06-01", "berat_badan": 8, "tinggi_badan": 70},
            headers=pasien2_headers,
        )
        assert r.status_code == 404


class TestGetRiwayat:
    def test_get_riwayat_returns_list(self, session, pasien_headers, created_balita):
        bid = created_balita["id"]
        r = session.get(f"{API}/pasien/balita/{bid}/riwayat", headers=pasien_headers)
        assert r.status_code == 200
        data = r.json()
        assert isinstance(data, list)
        assert len(data) >= 1

    def test_get_riwayat_not_owner_returns_404(self, session, pasien2_headers, created_balita):
        bid = created_balita["id"]
        r = session.get(f"{API}/pasien/balita/{bid}/riwayat", headers=pasien2_headers)
        assert r.status_code == 404


class TestDeletePengukuran:
    def test_delete_pengukuran_success(self, session, pasien_headers, created_balita):
        bid = created_balita["id"]
        # add then delete
        session.post(
            f"{API}/pasien/balita/{bid}/riwayat",
            json={"tanggal": "2024-12-01", "berat_badan": 8.0, "tinggi_badan": 70.0},
            headers=pasien_headers,
        )
        riw = session.get(f"{API}/pasien/balita/{bid}/riwayat", headers=pasien_headers).json()
        before = len(riw)
        r = session.delete(f"{API}/pasien/balita/{bid}/riwayat/0", headers=pasien_headers)
        assert r.status_code == 200
        riw_after = session.get(f"{API}/pasien/balita/{bid}/riwayat", headers=pasien_headers).json()
        assert len(riw_after) == before - 1

    def test_delete_pengukuran_invalid_index(self, session, pasien_headers, created_balita):
        bid = created_balita["id"]
        r = session.delete(f"{API}/pasien/balita/{bid}/riwayat/9999", headers=pasien_headers)
        assert r.status_code == 400


class TestUpdateBalita:
    def test_update_balita_recalculates(self, session, pasien_headers, created_balita):
        bid = created_balita["id"]
        r = session.put(
            f"{API}/pasien/balita/{bid}",
            json={"berat_badan": 11.0},
            headers=pasien_headers,
        )
        assert r.status_code == 200, r.text
        data = r.json()
        assert data["berat_badan"] == 11.0
        assert "usia" in data
        assert "status_kms" in data and "status" in data["status_kms"]

    def test_update_balita_not_owner_returns_404(self, session, pasien2_headers, created_balita):
        bid = created_balita["id"]
        r = session.put(
            f"{API}/pasien/balita/{bid}",
            json={"berat_badan": 12.0},
            headers=pasien2_headers,
        )
        assert r.status_code == 404


class TestDeleteBalita:
    def test_delete_balita_owner(self, session, pasien_headers):
        # Create temp balita, delete it
        payload = {
            "nama_balita": "TEST_ToDelete",
            "jenis_kelamin": "Perempuan",
            "tanggal_lahir": "2024-01-01",
            "nik_balita": f"TESTDEL{datetime.now().strftime('%H%M%S%f')}",
            "berat_badan": 8.0,
            "tinggi_badan": 70.0,
            "nama_orang_tua": "TEST",
            "anak_ke": 1,
            "berat_badan_lahir": 3.0,
            "panjang_badan_lahir": 49.0,
            "rt": "01", "rw": "01", "kelurahan": "TEST_K",
        }
        r = session.post(f"{API}/pasien/balita", json=payload, headers=pasien_headers)
        assert r.status_code == 200
        bid = r.json()["id"]
        r2 = session.delete(f"{API}/pasien/balita/{bid}", headers=pasien_headers)
        assert r2.status_code == 200

    def test_delete_balita_not_owner_returns_404(self, session, pasien2_headers, created_balita):
        bid = created_balita["id"]
        r = session.delete(f"{API}/pasien/balita/{bid}", headers=pasien2_headers)
        assert r.status_code == 404


class TestStatistikKelurahan:
    def test_statistik_public_no_auth(self, session):
        r = session.get(f"{API}/statistik/kelurahan")
        assert r.status_code == 200
        data = r.json()
        assert isinstance(data, list)
        if data:
            row = data[0]
            for key in ("kelurahan", "total", "gizi_baik", "gizi_kurang", "bgm", "rata_bb", "rata_tb", "persen_gizi_baik"):
                assert key in row, f"Missing key {key}"

    def test_statistik_includes_created_balita(self, session, created_balita):
        r = session.get(f"{API}/statistik/kelurahan")
        assert r.status_code == 200
        data = r.json()
        kel_names = [x["kelurahan"] for x in data]
        assert "TEST_Kelurahan" in kel_names

    def test_statistik_sorted_desc_by_total(self, session):
        r = session.get(f"{API}/statistik/kelurahan")
        data = r.json()
        totals = [x["total"] for x in data]
        assert totals == sorted(totals, reverse=True)


class TestRegression:
    def test_admin_login(self, session):
        r = session.post(f"{API}/auth/login", json={"email": "superadmin@sobatgizi.com", "password": "admin123"})
        assert r.status_code == 200

    def test_dokter_login(self, session):
        r = session.post(f"{API}/auth/login", json={"email": "dokter@sobatgizi.com", "password": "dokter123"})
        assert r.status_code == 200

    def test_artikel_public(self, session):
        r = session.get(f"{API}/artikel/public")
        assert r.status_code == 200
        assert isinstance(r.json(), list)

    def test_resep_public(self, session):
        r = session.get(f"{API}/resep/public")
        assert r.status_code == 200
