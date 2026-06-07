"""
Seed script untuk membuat admin pertama di MongoDB.

Cara pakai di VPS:
    cd /path/to/backend
    source venv/bin/activate
    python seed_admin.py

    # Atau dengan custom email/password via env:
    SEED_ADMIN_EMAIL=admin@domainmu.com SEED_ADMIN_PASSWORD=passwordKuat123 python seed_admin.py
"""
import asyncio
import os
import sys
import uuid
from datetime import datetime, timezone
from pathlib import Path

from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

sys.path.insert(0, str(ROOT_DIR))
from auth import get_password_hash  # noqa: E402


async def seed():
    mongo_url = os.environ.get('MONGO_URL')
    db_name = os.environ.get('DB_NAME')
    if not mongo_url or not db_name:
        print("❌ MONGO_URL atau DB_NAME tidak ditemukan di .env")
        sys.exit(1)

    email = os.environ.get('SEED_ADMIN_EMAIL', 'admin@sobatgizi.com')
    password = os.environ.get('SEED_ADMIN_PASSWORD', 'admin123')
    nama = os.environ.get('SEED_ADMIN_NAMA', 'Super Admin')

    client = AsyncIOMotorClient(mongo_url)
    db = client[db_name]

    existing = await db.users.find_one({"email": email})
    if existing:
        print(f"ℹ️  User {email} sudah ada — update password.")
        await db.users.update_one(
            {"email": email},
            {"$set": {
                "password": get_password_hash(password),
                "role": "admin",
                "nama": nama,
            }}
        )
        print(f"✅ Password admin {email} berhasil di-reset.")
    else:
        user = {
            "id": str(uuid.uuid4()),
            "email": email,
            "password": get_password_hash(password),
            "nama": nama,
            "role": "admin",
            "nohp": None,
            "foto": None,
            "spesialisasi": None,
            "pengalaman": None,
            "keahlian": [],
            "jadwal": None,
            "created_at": datetime.now(timezone.utc),
        }
        await db.users.insert_one(user)
        print(f"✅ Admin baru dibuat:")
        print(f"   Email   : {email}")
        print(f"   Password: {password}")
        print(f"   Role    : admin")

    print("\n⚠️  PENTING: Ganti password setelah login pertama!")
    client.close()


if __name__ == "__main__":
    asyncio.run(seed())
