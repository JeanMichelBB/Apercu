from sqlalchemy import Column, String, DateTime, Text, Boolean, Integer, ForeignKey, func
from sqlalchemy.dialects.mysql import VARCHAR
from uuid import uuid4
from .engine import Base


class Contact(Base):
    __tablename__ = "contacts"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid4()), unique=True)
    subject = Column(String(100))
    first_name = Column(String(50))
    last_name = Column(String(50))
    email = Column(String(100))
    phone_number = Column(String(20))
    additional_info = Column(VARCHAR(1000))
    created_at = Column(DateTime, default=func.now())


class Email(Base):
    __tablename__ = "emails"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid4()), unique=True)
    email = Column(String(100))
    password = Column(String(100))
    created_at = Column(DateTime, default=func.now())


class AdminUser(Base):
    __tablename__ = "admin_users"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid4()), unique=True)
    username = Column(String(50), unique=True, index=True)
    password = Column(String(100))


class User(Base):
    __tablename__ = "users"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid4()), unique=True)
    name = Column(String(100))
    email = Column(String(100), unique=True, index=True)
    password = Column(String(100))
    role = Column(String(20), default="user")
    created_at = Column(DateTime, default=func.now())


class Event(Base):
    __tablename__ = "events"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid4()), unique=True)
    title = Column(String(200))
    description = Column(Text)
    location = Column(String(200))
    date = Column(DateTime)
    capacity = Column(Integer)
    status = Column(String(20), default="draft")  # draft | pending | published
    organizer_id = Column(String(36), ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, default=func.now())


class Speaker(Base):
    __tablename__ = "speakers"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid4()), unique=True)
    name = Column(String(100))
    bio = Column(Text)
    photo_url = Column(String(500))
    created_at = Column(DateTime, default=func.now())


class EventSpeaker(Base):
    __tablename__ = "event_speakers"
    event_id = Column(String(36), ForeignKey("events.id"), primary_key=True)
    speaker_id = Column(String(36), ForeignKey("speakers.id"), primary_key=True)


class Registration(Base):
    __tablename__ = "registrations"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid4()), unique=True)
    event_id = Column(String(36), ForeignKey("events.id"))
    user_id = Column(String(36), ForeignKey("users.id"))
    created_at = Column(DateTime, default=func.now())


class BlogPost(Base):
    __tablename__ = "blog_posts"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid4()), unique=True)
    title = Column(String(200))
    content = Column(Text)
    published = Column(Boolean, default=False)
    created_at = Column(DateTime, default=func.now())
