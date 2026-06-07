from datetime import datetime, timedelta, timezone
from typing import Optional
import os
import re

from jose import JWTError, jwt
from passlib.context import CryptContext

# SECRET_KEY WAJIB dari .env — fail fast kalau tidak ada
SECRET_KEY = os.environ.get('SECRET_KEY')
if not SECRET_KEY or len(SECRET_KEY) < 32:
    raise RuntimeError(
        "SECRET_KEY tidak ditemukan atau terlalu pendek (min 32 chars). "
        "Set di .env: openssl rand -hex 32"
    )

ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.environ.get('ACCESS_TOKEN_EXPIRE_MINUTES', 60 * 24 * 7))

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + (
        expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def decode_token(token: str):
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except JWTError:
        return None


def validate_password_strength(password: str) -> Optional[str]:
    """Return error string if weak, None if OK."""
    if len(password) < 8:
        return "Password minimal 8 karakter"
    if not re.search(r"[A-Za-z]", password):
        return "Password harus mengandung huruf"
    if not re.search(r"\d", password):
        return "Password harus mengandung angka"
    return None
