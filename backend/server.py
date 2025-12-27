from fastapi import FastAPI, APIRouter, HTTPException, Depends, Header, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
from pathlib import Path
import os
import logging
import json
from datetime import datetime, timezone
from typing import Optional, List, Dict

from models import *
from auth import get_password_hash, verify_password, create_access_token, decode_token

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app
app = FastAPI()

# Create routers
api_router = APIRouter(prefix="/api")
auth_router = APIRouter(prefix="/auth", tags=["Authentication"])
admin_router = APIRouter(prefix="/admin", tags=["Admin"])
dokter_router = APIRouter(prefix="/dokter", tags=["Dokter"])
pasien_router = APIRouter(prefix="/pasien", tags=["Pasien"])

# Dependency to get current user
async def get_current_user(authorization: Optional[str] = Header(None)):
    if not authorization or not authorization.startswith('Bearer '):
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    token = authorization.split(' ')[1]
    payload = decode_token(token)
    
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    user_id = payload.get("sub")
    user = await db.users.find_one({"id": user_id})
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return UserResponse(**user)

# Auth Routes
@auth_router.post("/register")
async def register(user_data: UserCreate):
    # Check if email exists
    existing = await db.users.find_one({"email": user_data.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Hash password
    hashed_password = get_password_hash(user_data.password)
    
    # Create user
    user = User(
        **user_data.dict(exclude={'password'}),
        password=hashed_password
    )
    
    await db.users.insert_one(user.dict())
    
    # Create token
    access_token = create_access_token(data={"sub": user.id, "role": user.role})
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": UserResponse(**user.dict())
    }

@auth_router.post("/login")
async def login(credentials: UserLogin):
    user = await db.users.find_one({"email": credentials.email})
    
    if not user or not verify_password(credentials.password, user['password']):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    access_token = create_access_token(data={"sub": user['id'], "role": user['role']})
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": UserResponse(**user)
    }

@auth_router.get("/me")
async def get_me(current_user: UserResponse = Depends(get_current_user)):
    return current_user

# Admin Routes
@admin_router.get("/users")
async def get_users(role: Optional[str] = None, current_user: UserResponse = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    query = {"role": role} if role else {}
    users = await db.users.find(query).to_list(1000)
    return [UserResponse(**user) for user in users]

@admin_router.post("/users")
async def create_user_by_admin(user_data: UserCreate, current_user: UserResponse = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    existing = await db.users.find_one({"email": user_data.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = get_password_hash(user_data.password)
    user = User(**user_data.dict(exclude={'password'}), password=hashed_password)
    await db.users.insert_one(user.dict())
    
    return UserResponse(**user.dict())

@admin_router.delete("/users/{user_id}")
async def delete_user(user_id: str, current_user: UserResponse = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    result = await db.users.delete_one({"id": user_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    
    return {"message": "User deleted successfully"}

@admin_router.post("/artikel")
async def create_artikel(artikel: ArtikelCreate, current_user: UserResponse = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    slug = artikel.title.lower().replace(' ', '-').replace(':', '').replace(',', '')
    artikel_obj = Artikel(
        **artikel.dict(),
        slug=slug,
        author_id=current_user.id,
        author_name=current_user.nama
    )
    
    await db.artikel.insert_one(artikel_obj.dict())
    return artikel_obj

@admin_router.get("/artikel")
async def get_all_artikel(current_user: UserResponse = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    artikel = await db.artikel.find().to_list(1000)
    return artikel

@admin_router.delete("/artikel/{artikel_id}")
async def delete_artikel(artikel_id: str, current_user: UserResponse = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    result = await db.artikel.delete_one({"id": artikel_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Artikel not found")
    
    return {"message": "Artikel deleted"}

@admin_router.post("/resep")
async def create_resep(resep: ResepCreate, current_user: UserResponse = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    resep_obj = ResepMPASI(**resep.dict())
    await db.resep.insert_one(resep_obj.dict())
    return resep_obj

@admin_router.get("/resep")
async def get_all_resep(current_user: UserResponse = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    resep = await db.resep.find().to_list(1000)
    return resep

@admin_router.delete("/resep/{resep_id}")
async def delete_resep(resep_id: str, current_user: UserResponse = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    result = await db.resep.delete_one({"id": resep_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Resep not found")
    
    return {"message": "Resep deleted"}

# Pasien Routes
@pasien_router.get("/balita")
async def get_my_balita(current_user: UserResponse = Depends(get_current_user)):
    if current_user.role != "pasien":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    balita = await db.data_balita.find({"user_id": current_user.id}).to_list(1000)
    return balita

@pasien_router.post("/balita")
async def create_balita(data: DataBalitaCreate, current_user: UserResponse = Depends(get_current_user)):
    if current_user.role != "pasien":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    # Calculate age and status
    from datetime import datetime
    lahir = datetime.strptime(data.tanggal_lahir, '%Y-%m-%d')
    sekarang = datetime.now()
    usia = (sekarang.year - lahir.year) * 12 + (sekarang.month - lahir.month)
    
    # Simple KMS calculation
    median_weight = 7.3 + (usia * 0.16)
    percentile = (data.berat_badan / median_weight) * 100
    
    if percentile < 70:
        status_kms = {"status": "BGM", "warna": "Merah", "color": "red"}
    elif percentile < 80:
        status_kms = {"status": "Gizi Kurang", "warna": "Kuning", "color": "yellow"}
    else:
        status_kms = {"status": "Gizi Baik", "warna": "Hijau", "color": "green"}
    
    balita = DataBalita(
        **data.dict(),
        user_id=current_user.id,
        usia=usia,
        status_kms=status_kms
    )
    
    await db.data_balita.insert_one(balita.dict())
    return balita

@pasien_router.post("/konsultasi")
async def request_konsultasi(konsul: KonsultasiCreate, current_user: UserResponse = Depends(get_current_user)):
    if current_user.role != "pasien":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    konsultasi = Konsultasi(
        pasien_id=current_user.id,
        **konsul.dict()
    )
    
    await db.konsultasi.insert_one(konsultasi.dict())
    return konsultasi

@pasien_router.get("/konsultasi")
async def get_my_konsultasi(current_user: UserResponse = Depends(get_current_user)):
    if current_user.role != "pasien":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    konsultasi = await db.konsultasi.find({"pasien_id": current_user.id}).to_list(1000)
    return konsultasi

# Dokter Routes
@dokter_router.get("/konsultasi")
async def get_konsultasi_list(status: Optional[str] = None, current_user: UserResponse = Depends(get_current_user)):
    if current_user.role != "dokter":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    query = {}
    if status:
        query["status"] = status
    
    konsultasi = await db.konsultasi.find(query).to_list(1000)
    return konsultasi

@dokter_router.put("/konsultasi/{konsultasi_id}/accept")
async def accept_konsultasi(konsultasi_id: str, current_user: UserResponse = Depends(get_current_user)):
    if current_user.role != "dokter":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    result = await db.konsultasi.update_one(
        {"id": konsultasi_id},
        {"$set": {"dokter_id": current_user.id, "status": "accepted", "updated_at": datetime.utcnow()}}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Konsultasi not found")
    
    return {"message": "Konsultasi accepted"}

@dokter_router.put("/konsultasi/{konsultasi_id}/reject")
async def reject_konsultasi(konsultasi_id: str, current_user: UserResponse = Depends(get_current_user)):
    if current_user.role != "dokter":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    result = await db.konsultasi.update_one(
        {"id": konsultasi_id},
        {"$set": {"status": "rejected", "updated_at": datetime.utcnow()}}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Konsultasi not found")
    
    return {"message": "Konsultasi rejected"}

# Chat Routes
@api_router.post("/chat")
async def send_message(msg: ChatMessageCreate, current_user: UserResponse = Depends(get_current_user)):
    message = ChatMessage(
        **msg.dict(),
        sender_id=current_user.id,
        sender_role=current_user.role
    )
    
    await db.chat_messages.insert_one(message.dict())
    return message

@api_router.get("/chat/{konsultasi_id}")
async def get_messages(konsultasi_id: str, current_user: UserResponse = Depends(get_current_user)):
    messages = await db.chat_messages.find({"konsultasi_id": konsultasi_id}).sort("created_at", 1).to_list(1000)
    return messages

# Public Routes
@api_router.get("/")
async def root():
    return {"message": "Sobat Giziku API"}

@api_router.get("/artikel/public")
async def get_public_artikel():
    artikel = await db.artikel.find().to_list(100)
    return artikel

@api_router.get("/artikel/public/{slug}")
async def get_artikel_by_slug(slug: str):
    artikel = await db.artikel.find_one({"slug": slug})
    if not artikel:
        raise HTTPException(status_code=404, detail="Artikel not found")
    return artikel

@api_router.get("/resep/public")
async def get_public_resep():
    resep = await db.resep.find().to_list(1000)
    return resep

@api_router.get("/dokter/public")
async def get_public_dokter():
    dokter = await db.users.find({"role": "dokter"}).to_list(100)
    return [UserResponse(**d) for d in dokter]

# Include routers
api_router.include_router(auth_router)
api_router.include_router(admin_router)
api_router.include_router(dokter_router)
api_router.include_router(pasien_router)

app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
