from pydantic import BaseModel, Field, EmailStr
from typing import Optional, List
from datetime import datetime, timezone
import uuid

class User(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: EmailStr
    password: str  # hashed
    nama: str
    role: str  # admin, dokter, pasien
    nohp: Optional[str] = None
    foto: Optional[str] = None
    spesialisasi: Optional[str] = None  # for dokter
    pengalaman: Optional[str] = None  # for dokter
    keahlian: Optional[List[str]] = []  # for dokter
    jadwal: Optional[str] = None  # for dokter
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    nama: str
    role: str
    nohp: Optional[str] = None
    spesialisasi: Optional[str] = None
    pengalaman: Optional[str] = None
    keahlian: Optional[List[str]] = []
    jadwal: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str
    email: str
    nama: str
    role: str
    nohp: Optional[str] = None
    foto: Optional[str] = None
    spesialisasi: Optional[str] = None
    pengalaman: Optional[str] = None
    keahlian: Optional[List[str]] = []
    jadwal: Optional[str] = None

class DataBalita(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str  # pasien ID
    nama_balita: str
    jenis_kelamin: str
    tanggal_lahir: str
    nik_balita: str
    berat_badan: float
    tinggi_badan: float
    nama_orang_tua: str
    anak_ke: int
    berat_badan_lahir: float
    panjang_badan_lahir: float
    rt: str
    rw: str
    kelurahan: str
    usia: int
    status_kms: dict
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class DataBalitaCreate(BaseModel):
    nama_balita: str
    jenis_kelamin: str
    tanggal_lahir: str
    nik_balita: str
    berat_badan: float
    tinggi_badan: float
    nama_orang_tua: str
    anak_ke: int
    berat_badan_lahir: float
    panjang_badan_lahir: float
    rt: str
    rw: str
    kelurahan: str

class Konsultasi(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    pasien_id: str
    dokter_id: Optional[str] = None
    balita_id: str
    keluhan: str
    status: str = "pending"  # pending, accepted, rejected, completed
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class KonsultasiCreate(BaseModel):
    balita_id: str
    keluhan: str

class ChatMessage(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    konsultasi_id: str
    sender_id: str
    sender_role: str
    sender_name: str = ""
    message: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ChatMessageCreate(BaseModel):
    konsultasi_id: str
    message: str

class Artikel(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    slug: str
    title: str
    excerpt: str
    content: str
    image: str
    category: str
    author_id: str
    author_name: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ArtikelCreate(BaseModel):
    title: str
    excerpt: str
    content: str
    image: str
    category: str

class ResepMPASI(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    kategori: str  # 6-8, 9-11, 12-23, snack
    nama: str
    gambar: str
    deskripsi: str
    waktu: str
    porsi: str
    alat: List[str]
    bahan: List[str]
    cara: List[str]
    tips: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ResepCreate(BaseModel):
    kategori: str
    nama: str
    gambar: str
    deskripsi: str
    waktu: str
    porsi: str
    alat: List[str]
    bahan: List[str]
    cara: List[str]
    tips: str