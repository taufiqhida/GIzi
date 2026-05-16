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

# WebSocket Connection Manager
class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, List[WebSocket]] = {}
    
    async def connect(self, websocket: WebSocket, konsultasi_id: str):
        await websocket.accept()
        if konsultasi_id not in self.active_connections:
            self.active_connections[konsultasi_id] = []
        self.active_connections[konsultasi_id].append(websocket)
    
    def disconnect(self, websocket: WebSocket, konsultasi_id: str):
        if konsultasi_id in self.active_connections:
            if websocket in self.active_connections[konsultasi_id]:
                self.active_connections[konsultasi_id].remove(websocket)
    
    async def broadcast(self, konsultasi_id: str, message: dict):
        if konsultasi_id in self.active_connections:
            for connection in self.active_connections[konsultasi_id]:
                try:
                    await connection.send_json(message)
                except:
                    pass

manager = ConnectionManager()

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
    users = await db.users.find(query, {"_id": 0}).to_list(1000)
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
    
    artikel = await db.artikel.find({}, {"_id": 0}).to_list(1000)
    return artikel

@admin_router.delete("/artikel/{artikel_id}")
async def delete_artikel(artikel_id: str, current_user: UserResponse = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    result = await db.artikel.delete_one({"id": artikel_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Artikel not found")
    
    return {"message": "Artikel deleted"}

@admin_router.put("/artikel/{artikel_id}")
async def update_artikel(artikel_id: str, artikel: ArtikelCreate, current_user: UserResponse = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    slug = artikel.title.lower().replace(' ', '-').replace(':', '').replace(',', '')
    update_data = {
        **artikel.dict(),
        "slug": slug
    }
    
    result = await db.artikel.update_one(
        {"id": artikel_id},
        {"$set": update_data}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Artikel not found")
    
    updated = await db.artikel.find_one({"id": artikel_id}, {"_id": 0})
    return updated

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
    
    resep = await db.resep.find({}, {"_id": 0}).to_list(1000)
    return resep

@admin_router.delete("/resep/{resep_id}")
async def delete_resep(resep_id: str, current_user: UserResponse = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    result = await db.resep.delete_one({"id": resep_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Resep not found")
    
    return {"message": "Resep deleted"}

@admin_router.put("/resep/{resep_id}")
async def update_resep(resep_id: str, resep: ResepCreate, current_user: UserResponse = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    result = await db.resep.update_one(
        {"id": resep_id},
        {"$set": resep.dict()}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Resep not found")
    
    updated = await db.resep.find_one({"id": resep_id}, {"_id": 0})
    return updated

# Pasien Routes
@pasien_router.get("/balita")
async def get_my_balita(current_user: UserResponse = Depends(get_current_user)):
    if current_user.role != "pasien":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    balita = await db.data_balita.find({"user_id": current_user.id}, {"_id": 0}).to_list(1000)
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
    
    # Initial measurement as first riwayat entry
    initial_pengukuran = Pengukuran(
        tanggal=sekarang.strftime('%Y-%m-%d'),
        berat_badan=data.berat_badan,
        tinggi_badan=data.tinggi_badan,
        usia_bulan=usia,
        status_kms=status_kms
    )
    
    balita = DataBalita(
        **data.dict(),
        user_id=current_user.id,
        usia=usia,
        status_kms=status_kms,
        riwayat=[initial_pengukuran]
    )
    
    await db.data_balita.insert_one(balita.dict())
    return balita

def _calc_status_kms(berat_badan: float, usia_bulan: int) -> dict:
    median_weight = 7.3 + (usia_bulan * 0.16)
    percentile = (berat_badan / median_weight) * 100 if median_weight > 0 else 100
    if percentile < 70:
        return {"status": "BGM", "warna": "Merah", "color": "red"}
    elif percentile < 80:
        return {"status": "Gizi Kurang", "warna": "Kuning", "color": "yellow"}
    return {"status": "Gizi Baik", "warna": "Hijau", "color": "green"}

@pasien_router.put("/balita/{balita_id}")
async def update_balita(balita_id: str, data: DataBalitaUpdate, current_user: UserResponse = Depends(get_current_user)):
    if current_user.role != "pasien":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    balita = await db.data_balita.find_one({"id": balita_id, "user_id": current_user.id})
    if not balita:
        raise HTTPException(status_code=404, detail="Balita not found")
    
    update_data = {k: v for k, v in data.dict().items() if v is not None}
    
    if update_data:
        # Recalculate usia & status_kms if relevant fields change
        tanggal_lahir = update_data.get("tanggal_lahir", balita["tanggal_lahir"])
        berat_badan = update_data.get("berat_badan", balita["berat_badan"])
        lahir = datetime.strptime(tanggal_lahir, '%Y-%m-%d')
        sekarang = datetime.now()
        usia = (sekarang.year - lahir.year) * 12 + (sekarang.month - lahir.month)
        update_data["usia"] = usia
        update_data["status_kms"] = _calc_status_kms(berat_badan, usia)
        
        await db.data_balita.update_one({"id": balita_id}, {"$set": update_data})
    
    updated = await db.data_balita.find_one({"id": balita_id}, {"_id": 0})
    return updated

@pasien_router.delete("/balita/{balita_id}")
async def delete_balita(balita_id: str, current_user: UserResponse = Depends(get_current_user)):
    if current_user.role != "pasien":
        raise HTTPException(status_code=403, detail="Not authorized")
    result = await db.data_balita.delete_one({"id": balita_id, "user_id": current_user.id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Balita not found")
    return {"message": "Balita deleted"}

@pasien_router.post("/balita/{balita_id}/riwayat")
async def add_pengukuran(balita_id: str, data: PengukuranCreate, current_user: UserResponse = Depends(get_current_user)):
    if current_user.role != "pasien":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    balita = await db.data_balita.find_one({"id": balita_id, "user_id": current_user.id})
    if not balita:
        raise HTTPException(status_code=404, detail="Balita not found")
    
    lahir = datetime.strptime(balita["tanggal_lahir"], '%Y-%m-%d')
    tgl = datetime.strptime(data.tanggal, '%Y-%m-%d')
    usia_bulan = (tgl.year - lahir.year) * 12 + (tgl.month - lahir.month)
    if usia_bulan < 0:
        usia_bulan = 0
    
    status_kms = _calc_status_kms(data.berat_badan, usia_bulan)
    pengukuran = Pengukuran(
        tanggal=data.tanggal,
        berat_badan=data.berat_badan,
        tinggi_badan=data.tinggi_badan,
        usia_bulan=usia_bulan,
        status_kms=status_kms
    )
    
    # Append to riwayat and update current values to latest measurement (if latest by date)
    riwayat = balita.get("riwayat", [])
    riwayat.append(pengukuran.dict())
    # sort by tanggal ascending
    riwayat_sorted = sorted(riwayat, key=lambda x: x["tanggal"])
    latest = riwayat_sorted[-1]
    
    sekarang = datetime.now()
    usia_now = (sekarang.year - lahir.year) * 12 + (sekarang.month - lahir.month)
    
    await db.data_balita.update_one(
        {"id": balita_id},
        {"$set": {
            "riwayat": riwayat_sorted,
            "berat_badan": latest["berat_badan"],
            "tinggi_badan": latest["tinggi_badan"],
            "usia": usia_now,
            "status_kms": _calc_status_kms(latest["berat_badan"], usia_now)
        }}
    )
    
    updated = await db.data_balita.find_one({"id": balita_id}, {"_id": 0})
    return updated

@pasien_router.get("/balita/{balita_id}/riwayat")
async def get_riwayat(balita_id: str, current_user: UserResponse = Depends(get_current_user)):
    if current_user.role != "pasien":
        raise HTTPException(status_code=403, detail="Not authorized")
    balita = await db.data_balita.find_one({"id": balita_id, "user_id": current_user.id}, {"_id": 0})
    if not balita:
        raise HTTPException(status_code=404, detail="Balita not found")
    return balita.get("riwayat", [])

@pasien_router.delete("/balita/{balita_id}/riwayat/{index}")
async def delete_pengukuran(balita_id: str, index: int, current_user: UserResponse = Depends(get_current_user)):
    if current_user.role != "pasien":
        raise HTTPException(status_code=403, detail="Not authorized")
    balita = await db.data_balita.find_one({"id": balita_id, "user_id": current_user.id})
    if not balita:
        raise HTTPException(status_code=404, detail="Balita not found")
    riwayat = balita.get("riwayat", [])
    if index < 0 or index >= len(riwayat):
        raise HTTPException(status_code=400, detail="Invalid index")
    riwayat.pop(index)
    riwayat_sorted = sorted(riwayat, key=lambda x: x["tanggal"])
    
    update = {"riwayat": riwayat_sorted}
    # Recompute current fields from latest remaining measurement
    if riwayat_sorted:
        latest = riwayat_sorted[-1]
        lahir = datetime.strptime(balita["tanggal_lahir"], '%Y-%m-%d')
        sekarang = datetime.now()
        usia_now = (sekarang.year - lahir.year) * 12 + (sekarang.month - lahir.month)
        update["berat_badan"] = latest["berat_badan"]
        update["tinggi_badan"] = latest["tinggi_badan"]
        update["usia"] = usia_now
        update["status_kms"] = _calc_status_kms(latest["berat_badan"], usia_now)
    
    await db.data_balita.update_one({"id": balita_id}, {"$set": update})
    return {"message": "Pengukuran deleted"}

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
    
    konsultasi = await db.konsultasi.find({"pasien_id": current_user.id}, {"_id": 0}).to_list(1000)
    return konsultasi

# Dokter Routes
@dokter_router.get("/konsultasi")
async def get_konsultasi_list(status: Optional[str] = None, current_user: UserResponse = Depends(get_current_user)):
    if current_user.role != "dokter":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    query = {}
    if status:
        query["status"] = status
    
    konsultasi = await db.konsultasi.find(query, {"_id": 0}).to_list(1000)
    return konsultasi

@dokter_router.put("/konsultasi/{konsultasi_id}/accept")
async def accept_konsultasi(konsultasi_id: str, current_user: UserResponse = Depends(get_current_user)):
    if current_user.role != "dokter":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    result = await db.konsultasi.update_one(
        {"id": konsultasi_id},
        {"$set": {"dokter_id": current_user.id, "status": "accepted", "updated_at": datetime.now(timezone.utc)}}
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
        {"$set": {"status": "rejected", "updated_at": datetime.now(timezone.utc)}}
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
        sender_role=current_user.role,
        sender_name=current_user.nama
    )
    
    await db.chat_messages.insert_one(message.dict())
    
    # Broadcast to WebSocket connections
    await manager.broadcast(msg.konsultasi_id, {
        "type": "new_message",
        "data": message.dict()
    })
    
    return message

@api_router.get("/chat/{konsultasi_id}")
async def get_messages(konsultasi_id: str, current_user: UserResponse = Depends(get_current_user)):
    messages = await db.chat_messages.find(
        {"konsultasi_id": konsultasi_id}, 
        {"_id": 0}
    ).sort("created_at", 1).to_list(1000)
    return messages

# WebSocket endpoint for real-time chat
@app.websocket("/ws/chat/{konsultasi_id}")
async def websocket_chat(websocket: WebSocket, konsultasi_id: str, token: str = None):
    # Verify token
    if not token:
        await websocket.close(code=4001)
        return
    
    payload = decode_token(token)
    if not payload:
        await websocket.close(code=4001)
        return
    
    await manager.connect(websocket, konsultasi_id)
    try:
        while True:
            data = await websocket.receive_text()
            msg_data = json.loads(data)
            
            # Create and save message
            message = ChatMessage(
                konsultasi_id=konsultasi_id,
                sender_id=payload.get("sub"),
                sender_role=payload.get("role"),
                sender_name=msg_data.get("sender_name", "User"),
                message=msg_data.get("message", "")
            )
            
            await db.chat_messages.insert_one(message.dict())
            
            # Broadcast to all connections in this consultation
            await manager.broadcast(konsultasi_id, {
                "type": "new_message",
                "data": message.dict()
            })
    except WebSocketDisconnect:
        manager.disconnect(websocket, konsultasi_id)

# Public Routes
@api_router.get("/")
async def root():
    return {"message": "Sobat Giziku API"}

@api_router.get("/artikel/public")
async def get_public_artikel():
    artikel = await db.artikel.find({}, {"_id": 0}).to_list(100)
    return artikel

@api_router.get("/artikel/public/{slug}")
async def get_artikel_by_slug(slug: str):
    artikel = await db.artikel.find_one({"slug": slug}, {"_id": 0})
    if not artikel:
        raise HTTPException(status_code=404, detail="Artikel not found")
    return artikel

@api_router.get("/resep/public")
async def get_public_resep():
    resep = await db.resep.find({}, {"_id": 0}).to_list(1000)
    return resep

@api_router.get("/dokter/public")
async def get_public_dokter():
    dokter = await db.users.find({"role": "dokter"}, {"_id": 0}).to_list(100)
    return [UserResponse(**d) for d in dokter]

@api_router.get("/statistik/kelurahan")
async def get_statistik_kelurahan():
    """Aggregate balita data per kelurahan (public).
    Returns list of {kelurahan, total, gizi_baik, gizi_kurang, bgm, rata_bb, rata_tb}."""
    balita_list = await db.data_balita.find({}, {"_id": 0}).to_list(10000)
    
    agg: Dict[str, dict] = {}
    for b in balita_list:
        kel = (b.get("kelurahan") or "Tidak Diketahui").strip() or "Tidak Diketahui"
        if kel not in agg:
            agg[kel] = {
                "kelurahan": kel, "total": 0, "gizi_baik": 0,
                "gizi_kurang": 0, "bgm": 0, "sum_bb": 0.0, "sum_tb": 0.0
            }
        a = agg[kel]
        a["total"] += 1
        a["sum_bb"] += float(b.get("berat_badan") or 0)
        a["sum_tb"] += float(b.get("tinggi_badan") or 0)
        status = (b.get("status_kms") or {}).get("status", "")
        if status == "Gizi Baik":
            a["gizi_baik"] += 1
        elif status == "Gizi Kurang":
            a["gizi_kurang"] += 1
        elif status == "BGM":
            a["bgm"] += 1
    
    result = []
    for kel, a in agg.items():
        total = a["total"] or 1
        result.append({
            "kelurahan": a["kelurahan"],
            "total": a["total"],
            "gizi_baik": a["gizi_baik"],
            "gizi_kurang": a["gizi_kurang"],
            "bgm": a["bgm"],
            "rata_bb": round(a["sum_bb"] / total, 2),
            "rata_tb": round(a["sum_tb"] / total, 2),
            "persen_gizi_baik": round((a["gizi_baik"] / total) * 100, 1),
        })
    result.sort(key=lambda x: x["total"], reverse=True)
    return result

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
