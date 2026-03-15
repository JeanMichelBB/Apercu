from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class ContactForm(BaseModel):
    subject: str
    first_name: str
    last_name: str
    email: str
    phone_number: str
    additional_info: str


class EmailForm(BaseModel):
    email: str


class AdminForm(BaseModel):
    username: str
    password: str


class UserRegister(BaseModel):
    name: str
    email: str
    password: str
    role: Optional[str] = "user"


class UserLogin(BaseModel):
    email: str
    password: str


class EventCreate(BaseModel):
    title: str
    description: str
    location: str
    date: datetime
    capacity: Optional[int] = None
    status: Optional[str] = "draft"
    image_url: Optional[str] = None


class EventUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    location: Optional[str] = None
    date: Optional[datetime] = None
    capacity: Optional[int] = None
    status: Optional[str] = None
    image_url: Optional[str] = None


class SpeakerCreate(BaseModel):
    name: str
    bio: str
    photo_url: Optional[str] = None
    gender: Optional[str] = None  # male | female | other


class BlogPostCreate(BaseModel):
    title: str
    content: str
    published: bool = False
    image_url: Optional[str] = None


class BlogPostUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    published: Optional[bool] = None
    image_url: Optional[str] = None


class ChangePassword(BaseModel):
    current_password: str
    new_password: str


class ForgotPasswordRequest(BaseModel):
    email: str


class VerifyCodeRequest(BaseModel):
    email: str
    code: str


class ResetPasswordRequest(BaseModel):
    reset_token: str
    new_password: str


class RejectionBody(BaseModel):
    reason: str


class CommentCreate(BaseModel):
    content: str
