from fastapi import APIRouter, HTTPException, Depends, Header
from database.engine import SessionLocal
from database.models import Email, User as UserModel
from schemas import UserRegister, UserLogin, ChangePassword, ForgotPasswordRequest, VerifyCodeRequest, ResetPasswordRequest
from text_mail import sendEmail
from typing import Optional
from jwt import PyJWTError
import datetime
import os
import secrets
import random
import string
import bcrypt
import jwt

router = APIRouter()

SECRET_KEY = os.getenv("SECRET_KEY") or secrets.token_hex(32)
FRONTEND_URL = os.getenv("FRONTEND_URL", "https://apercu.sacenpapier.org")

# In-memory store for password reset codes: {email: {"code": str, "expires": datetime}}
_reset_codes: dict = {}

# In-memory store for email verification tokens: {token: email}
_verify_tokens: dict = {}


def _issue_verification_token(email: str) -> str:
    token = secrets.token_urlsafe(32)
    _verify_tokens[token] = email
    return token


def authenticate(email, password):
    with SessionLocal() as db:
        user = db.query(Email).filter(Email.email == email).first()
        if user:
            if bcrypt.checkpw(password.encode(), user.password.encode()):
                return True
    return False


def generate_token(email, role="admin", user_id=None, name=None):
    payload = {
        "email": email,
        "role": role,
        "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=8),
    }
    if user_id:
        payload["user_id"] = user_id
    if name:
        payload["name"] = name
    return jwt.encode(payload, SECRET_KEY, algorithm="HS256")


def decode_token(token: str) -> dict:
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
    except PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid token")


async def get_current_user(access_token: Optional[str] = Header(..., alias="access-token")):
    payload = decode_token(access_token)
    email = payload.get("email")
    if not email:
        raise HTTPException(status_code=401, detail="Invalid token")
    return payload


async def require_admin(access_token: Optional[str] = Header(..., alias="access-token")):
    payload = decode_token(access_token)
    if payload.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return payload


async def require_organizer(access_token: Optional[str] = Header(..., alias="access-token")):
    payload = decode_token(access_token)
    if payload.get("role") not in ("organizer", "admin"):
        raise HTTPException(status_code=403, detail="Organizer access required")
    return payload


@router.post("/login")
async def login(body: UserLogin):
    if authenticate(body.email, body.password):
        token = generate_token(body.email, role="admin")
        return {"token": token}
    raise HTTPException(status_code=401, detail="Invalid email or password")


@router.post("/auth/register")
async def register(body: UserRegister):
    with SessionLocal() as db:
        if db.query(UserModel).filter(UserModel.email == body.email).first():
            raise HTTPException(status_code=400, detail="Email already registered")
        hashed = bcrypt.hashpw(body.password.encode(), bcrypt.gensalt()).decode()
        allowed_roles = {"user", "organizer"}
        role = body.role if body.role in allowed_roles else "user"
        user = UserModel(name=body.name, email=body.email, password=hashed, role=role)
        db.add(user)
        db.commit()
        db.refresh(user)
        verify_token = _issue_verification_token(user.email)
        verify_url = f"{FRONTEND_URL}/verify-email?token={verify_token}"
        sendEmail(
            user.email,
            "Verify your Aperçu account",
            f"Hi {user.name},\n\nPlease verify your email by clicking the link below:\n\n{verify_url}\n\nThis link is valid for one use.\n\nAperçu"
        )
        token = generate_token(user.email, role=role, user_id=user.id, name=user.name)
        return {"token": token}


@router.post("/auth/user-login")
async def user_login(body: UserLogin):
    with SessionLocal() as db:
        user = db.query(UserModel).filter(UserModel.email == body.email).first()
        if not user or not bcrypt.checkpw(body.password.encode(), user.password.encode()):
            raise HTTPException(status_code=401, detail="Invalid email or password")
        token = generate_token(user.email, role=user.role, user_id=user.id, name=user.name)
        return {"token": token}


@router.put("/auth/password")
async def change_password(body: ChangePassword, current_user: dict = Depends(get_current_user)):
    role = current_user.get("role")
    email = current_user.get("email")
    with SessionLocal() as db:
        if role == "admin":
            user = db.query(Email).filter(Email.email == email).first()
        else:
            user = db.query(UserModel).filter(UserModel.email == email).first()
        if not user or not bcrypt.checkpw(body.current_password.encode(), user.password.encode()):
            raise HTTPException(status_code=400, detail="Current password is incorrect")
        user.password = bcrypt.hashpw(body.new_password.encode(), bcrypt.gensalt()).decode()
        db.commit()
        return {"detail": "Password updated"}


@router.get("/auth/me")
async def me(current_user: dict = Depends(get_current_user)):
    return current_user


@router.get("/auth/email-verified")
async def email_verified_status(current_user: dict = Depends(get_current_user)):
    with SessionLocal() as db:
        user = db.query(UserModel).filter(UserModel.email == current_user.get("email")).first()
        if not user:
            return {"email_verified": True}  # admin accounts are always considered verified
        return {"email_verified": bool(user.email_verified)}


@router.get("/protected-page")
async def protected_page(current_user: dict = Depends(get_current_user)):
    return {"message": current_user.get("email")}


@router.post("/auth/forgot-password")
async def forgot_password(body: ForgotPasswordRequest):
    email = body.email.lower().strip()
    code = ''.join(random.choices(string.digits, k=6))
    _reset_codes[email] = {
        "code": code,
        "expires": datetime.datetime.utcnow() + datetime.timedelta(minutes=15),
    }
    sendEmail(
        email,
        "Your Aperçu password reset code",
        f"Your password reset code is: {code}\n\nThis code expires in 15 minutes.\n\nIf you did not request this, ignore this email.\n\nAperçu"
    )
    return {"detail": "If this email is registered, a reset code has been sent."}


@router.post("/auth/verify-reset-code")
async def verify_reset_code(body: VerifyCodeRequest):
    email = body.email.lower().strip()
    entry = _reset_codes.get(email)
    if not entry or entry["code"] != body.code:
        raise HTTPException(status_code=400, detail="Invalid or expired code")
    if datetime.datetime.utcnow() > entry["expires"]:
        del _reset_codes[email]
        raise HTTPException(status_code=400, detail="Code has expired")
    del _reset_codes[email]
    reset_token = jwt.encode(
        {
            "email": email,
            "purpose": "password_reset",
            "exp": datetime.datetime.utcnow() + datetime.timedelta(minutes=15),
        },
        SECRET_KEY,
        algorithm="HS256",
    )
    return {"reset_token": reset_token}


@router.get("/auth/verify-email")
async def verify_email(token: str):
    email = _verify_tokens.pop(token, None)
    if not email:
        raise HTTPException(status_code=400, detail="Invalid or expired verification link")
    with SessionLocal() as db:
        user = db.query(UserModel).filter(UserModel.email == email).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        user.email_verified = True
        db.commit()
    return {"detail": "Email verified. You can now register for events."}


@router.post("/auth/resend-verification")
async def resend_verification(current_user: dict = Depends(get_current_user)):
    email = current_user.get("email")
    with SessionLocal() as db:
        user = db.query(UserModel).filter(UserModel.email == email).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        if user.email_verified:
            return {"detail": "Email already verified"}
    verify_token = _issue_verification_token(email)
    verify_url = f"{FRONTEND_URL}/verify-email?token={verify_token}"
    sendEmail(
        email,
        "Verify your Aperçu account",
        f"Please verify your email by clicking the link below:\n\n{verify_url}\n\nThis link is valid for one use.\n\nAperçu"
    )
    return {"detail": "Verification link sent"}


@router.post("/auth/reset-password")
async def reset_password(body: ResetPasswordRequest):
    try:
        payload = jwt.decode(body.reset_token, SECRET_KEY, algorithms=["HS256"])
    except PyJWTError:
        raise HTTPException(status_code=400, detail="Invalid or expired reset token")
    if payload.get("purpose") != "password_reset":
        raise HTTPException(status_code=400, detail="Invalid token")
    email = payload.get("email")
    hashed = bcrypt.hashpw(body.new_password.encode(), bcrypt.gensalt()).decode()
    with SessionLocal() as db:
        user = db.query(UserModel).filter(UserModel.email == email).first()
        if user:
            user.password = hashed
            db.commit()
            return {"detail": "Password updated"}
        admin = db.query(Email).filter(Email.email == email).first()
        if admin:
            admin.password = hashed
            db.commit()
            return {"detail": "Password updated"}
    raise HTTPException(status_code=404, detail="User not found")
