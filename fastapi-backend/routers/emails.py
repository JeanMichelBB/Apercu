from fastapi import APIRouter, HTTPException
from database.engine import SessionLocal
from database.models import Email
from schemas import EmailForm
from text_mail import sendEmail, testEmail
from uuid import uuid4
import bcrypt

router = APIRouter()


@router.get("/emails")
async def get_emails():
    db = SessionLocal()
    emails = db.query(Email).all()
    db.close()
    return emails


@router.post("/send-email")
async def send_email(form_data: EmailForm):
    email = Email(email=form_data.email)
    db = SessionLocal()
    db.add(email)
    db.commit()
    db.close()
    return {"message": "Email sent successfully"}


@router.delete("/delete-email/{email_id}")
async def delete_email(email_id: str):
    db = SessionLocal()
    email = db.query(Email).filter(Email.id == email_id).first()
    if email:
        db.delete(email)
        db.commit()
        db.close()
        return {"message": "Email deleted successfully"}
    db.close()
    raise HTTPException(status_code=404, detail="Email not found")


@router.post("/forget-password")
async def forget_password(email: str):
    db = SessionLocal()
    user = db.query(Email).filter(Email.email == email).first()
    if user:
        temp_password = str(uuid4())[:8]
        hashed_password = bcrypt.hashpw(temp_password.encode(), bcrypt.gensalt())
        user.password = hashed_password.decode()
        db.commit()
        db.close()
        message = f"Subject: Forget Password\n\nYou requested a password reset. Your temporary password is: {temp_password}"
        try:
            sendEmail(email, "Forget Password", message)
        except Exception as e:
            print("forget-password: Something went wrong while sending the email...", e)
        return {"message": "Temporary password sent to your email"}
    db.close()
    raise HTTPException(status_code=404, detail="Admin user not found")


@router.get("/update-admin-user")
async def update_admin_user(email: str, oldPassword: str, newPassword: str):
    db = SessionLocal()
    user = db.query(Email).filter(Email.email == email).first()
    if user:
        hashed_password = user.password.encode()
        if bcrypt.checkpw(oldPassword.encode(), hashed_password):
            hashed_new_password = bcrypt.hashpw(newPassword.encode(), bcrypt.gensalt())
            user.password = hashed_new_password.decode()
            db.commit()
            db.close()
            return {"message": "Admin user updated successfully"}
    db.close()
    raise HTTPException(status_code=404, detail="Admin user not found")


@router.get("/test-email")
async def test_email():
    success, error_message = testEmail()
    if success:
        return {"message": "Email connection test successful"}
    raise HTTPException(status_code=500, detail=f"Email connection failed: {error_message}")
