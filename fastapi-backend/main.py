from fastapi import FastAPI, Request, Depends, HTTPException, Header
from pydantic import BaseModel
from sqlalchemy import create_engine, Column, String, DateTime, func
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import sessionmaker
from fastapi.middleware.cors import CORSMiddleware
from starlette.responses import JSONResponse
import jwt
from uuid import uuid4
from text_mail import sendEmail

SQLALCHEMY_DATABASE_URL = "mysql+pymysql://sysadm:sysadm@mysql/law_db"
engine = create_engine(SQLALCHEMY_DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

class Contact(Base):
    __tablename__ = "contacts"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid4()), unique=True)
    subject = Column(String(100)) 
    first_name = Column(String(50))
    last_name = Column(String(50))
    email = Column(String(100))
    phone_number = Column(String(20))
    additional_info = Column(String(255))
    created_at = Column(DateTime, default=func.now())
    
class Email(Base):
    __tablename__ = "emails"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid4()), unique=True)
    email = Column(String(100))
    created_at = Column(DateTime, default=func.now())
    
class AdminUser(Base):
    __tablename__ = "admin_users"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid4()), unique=True)
    username = Column(String(50), unique=True, index=True)
    password = Column(String(100))

# Create all tables in the engine
Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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
    
@app.get("/contacts")
async def get_contacts():
    db = SessionLocal()
    contacts = db.query(Contact).all()
    db.close()
    return contacts

@app.post("/submit-form")
async def submit_form(request: Request, form_data: ContactForm):
    # Create a new Contact instance with the form data
    contact = Contact(
        subject=form_data.subject,
        first_name=form_data.first_name,
        last_name=form_data.last_name,
        email=form_data.email,
        phone_number=form_data.phone_number,
        additional_info=form_data.additional_info,
    )

    # Add the new Contact instance to the database session
    db = SessionLocal()
    db.add(contact)
    db.commit()
    db.close()
    
    message = f"Subject: {form_data.subject}\n\n{form_data.first_name} {form_data.last_name} a soumis un formulaire avec les informations suivantes:\n\nEmail: {form_data.email}\nPhone Number: {form_data.phone_number}\nAdditional Info: {form_data.additional_info}"
   
    emails = await get_emails()
    for email in emails:
        try:
            sendEmail(email.email, form_data.subject, message)
        except Exception as e:
            print("Something went wrong...", e)

    return {"message": "Form submission successful"}


@app.delete("/delete-contact/{contact_id}")
async def delete_contact(contact_id: str):
    db = SessionLocal()
    contact = db.query(Contact).filter(Contact.id == contact_id).first()
    db.delete(contact)
    db.commit()
    db.close()
    return {"message": "Contact deleted successfully"}

@app.delete("/delete-all-contacts")
async def delete_all_contacts():
    db = SessionLocal()
    db.query(Contact).delete()
    db.commit()
    db.close()
    return {"message": "All contacts deleted successfully"}

@app.put("/update-contact/{contact_id}")
async def update_contact(contact_id: str, form_data: ContactForm):
    db = SessionLocal()
    contact = db.query(Contact).filter(Contact.id == contact_id).first()
    contact.subject = form_data.subject
    contact.first_name = form_data.first_name
    contact.last_name = form_data.last_name
    contact.email = form_data.email
    contact.phone_number = form_data.phone_number
    contact.additional_info = form_data.additional_info
    db.commit()
    db.close()
    return {"message": "Contact updated successfully"}

# a call that recive a form for a email and send a email of the new contact

@app.get("/emails")
async def get_emails():
    db = SessionLocal()
    emails = db.query(Email).all()
    db.close()
    return emails

@app.post("/send-email")
async def send_email(form_data: EmailForm):
    email = Email(
        email=form_data.email
    )

    db = SessionLocal()
    db.add(email)
    db.commit()
    db.close()

    return {"message": "Email sent successfully"}

@app.delete("/delete-email/{email_id}")
async def delete_email(email_id: str):
    db = SessionLocal
    email = db.query(Email).filter(Email.id == email_id).first()
    db.delete(email)
    db.commit()
    db.close()
    return {"message": "Email deleted successfully"}
    
    
SECRET_KEY = "3e7e7b1"

@app.get("/admin-users")
async def get_admin_users():
    db = SessionLocal()
    admin_users = db.query(AdminUser).all()
    db.close()
    return admin_users

@app.put("/update-admin-user")
async def update_admin_user(username: str, old_password: str, new_password: str):
    db = SessionLocal()
    admin_user = db.query(AdminUser).filter(AdminUser.username == username).first()
    if admin_user and admin_user.password == old_password:
        admin_user.username = username
        admin_user.password = new_password
        db.commit()
        db.close()
        return {"message": "Admin user updated successfully"}
    else:
        raise HTTPException(status_code=401, detail="Invalid username or password")

@app.post("/login")
async def login(form_data: AdminForm):
    db = SessionLocal()
    admin_user = db.query(AdminUser).filter(AdminUser.username == form_data.username).first()
    db.close()
    if admin_user and admin_user.password == form_data.password:
        token = jwt.encode({"username": admin_user.username}, SECRET_KEY, algorithm="HS256")
        return {"token": token}
    else:
        raise HTTPException(status_code=401, detail="Invalid username or password")

async def verify_token(token: str = Header(...)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        username = payload.get("username")
        if not username:
            raise HTTPException(status_code=401, detail="Invalid token")
        return username
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
    
@app.get("/protected-page")
async def protected_page(username: str = Depends(verify_token)):
    try:
        return {"message": f"Welcome, {username}!"}
    except HTTPException as e:
        print(e.detail)
        return JSONResponse(status_code=e.status_code, content={"detail": e.detail})