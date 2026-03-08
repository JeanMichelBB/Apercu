from fastapi import APIRouter, HTTPException, Depends, Header
from database.engine import SessionLocal
from database.models import Email
from typing import Optional
from jwt import PyJWTError
import datetime
import secrets
import bcrypt
import jwt

router = APIRouter()

SECRET_KEY = secrets.token_hex(32)


def authenticate(email, password):
    with SessionLocal() as db:
        user = db.query(Email).filter(Email.email == email).first()
        if user:
            if bcrypt.checkpw(password.encode(), user.password.encode()):
                return True
    return False


def generate_token(email):
    payload = {
        "email": email,
        "exp": datetime.datetime.utcnow() + datetime.timedelta(minutes=30),
    }
    return jwt.encode(payload, SECRET_KEY, algorithm="HS256")


async def get_current_user(access_token: Optional[str] = Header(..., alias="access-token")):
    try:
        payload = jwt.decode(access_token, SECRET_KEY, algorithms=["HS256"])
        email = payload.get("email")
        if not email:
            raise HTTPException(status_code=401, detail="Invalid token")
        return email
    except PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid token")


@router.post("/login")
async def login(email: str, password: str):
    if authenticate(email, password):
        token = generate_token(email)
        return {"token": token}
    raise HTTPException(status_code=401, detail="Invalid email or password")


@router.get("/protected-page")
async def protected_page(current_user: str = Depends(get_current_user)):
    return {"message": f"{current_user}"}
