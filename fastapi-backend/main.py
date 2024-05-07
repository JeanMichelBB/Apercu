from fastapi import FastAPI, Request, Depends, HTTPException, Header
from pydantic import BaseModel
from sqlalchemy import create_engine, Column, String, DateTime, func
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import sessionmaker
from fastapi.middleware.cors import CORSMiddleware
from starlette.responses import JSONResponse
import jwt
import datetime
from uuid import uuid4
from text_mail import sendEmail
from sqlalchemy.dialects.postgresql import VARCHAR
from typing import Optional
from jwt import PyJWTError

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
    additional_info = Column(VARCHAR(1000)) 
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

Session = sessionmaker(bind=engine)
session = Session()
admin_user = session.query(AdminUser).filter_by(username='admin').first()
if admin_user is None:
    admin_user = AdminUser(username='admin', password='admin')
    session.add(admin_user)
    session.commit()
session.close()


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000/"],
    allow_credentials=True,
    allow_methods=["post", "get", "delete", "put"],
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
    db = SessionLocal() 
    email = db.query(Email).filter(Email.id == email_id).first()
    if email:
        db.delete(email)
        db.commit()
        db.close()
        return {"message": "Email deleted successfully"}
    else:
        return {"message": "Email not found"}, 404
    
@app.get("/admin-users")
async def get_admin_users():
    db = SessionLocal()
    admin_users = db.query(AdminUser).all()
    db.close()
    return admin_users

@app.put("/update-admin-user")
async def update_admin_user(old_username: str, old_password: str, new_password: str, new_username: str):
    db = SessionLocal()
    admin_user = db.query(AdminUser).filter(AdminUser.username == old_username, AdminUser.password == old_password).first()
    if admin_user:
        admin_user.username = new_username
        admin_user.password = new_password
        db.commit()
        db.close()
        return {"message": "Admin user updated successfully"}
    else:
        return {"message": "Admin user not found"}, 404
    
# forget password
@app.post("/forget-password")
async def forget_password(username: str):
    db = SessionLocal()
    admin_user = db.query(AdminUser).filter(AdminUser.username == username).first()
    db.close()
    if admin_user:
        message = f"Subject: Forget Password\n\nYou requested a password reset. Your password is: {admin_user.password}"
        sendEmail(username, "Forget Password", message)
        return {"message": "Password sent to your email"}
    else:
        return {"message": "Admin user not found"}, 404
    
    

SECRET_KEY = 'b1e7e7'

# Authentication
def authenticate(username, password):
    db = SessionLocal()
    user = db.query(AdminUser).filter(AdminUser.username == username, AdminUser.password == password).first()
    db.close()
    if user:
        return True
    return False

# Token Generation
def generate_token(username):
    payload = {
        'username': username,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=30) # Token expiration time
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm='HS256')
    return token

# Define a dependency function to verify the token
async def get_current_user(token: Optional[str] = Header(...)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        username = payload.get("username")
        if not username:
            raise HTTPException(status_code=401, detail="Invalid token")
        # You can add additional checks here if needed
        return username
    except PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

@app.post("/login")
async def login(username: str, password: str):
    # Check if the username and password are correct
    if authenticate(username, password):
        # Generate a token for the authenticated user
        token = generate_token(username)
        return {"token": token}
    else:
        # Return an error if authentication fails
        raise HTTPException(status_code=401, detail="Invalid username or password")

# Use the dependency function in your protected endpoints
@app.get("/protected-page")
async def protected_page(current_user: str = Depends(get_current_user)):
    return {"message": f"Welcome, {current_user}!"}