from fastapi import APIRouter, Request
from database.engine import SessionLocal
from database.models import Contact, Email
from schemas import ContactForm
from text_mail import sendEmail

router = APIRouter()


@router.get("/contacts")
async def get_contacts():
    db = SessionLocal()
    contacts = db.query(Contact).all()
    db.close()
    return contacts


@router.post("/submit-form")
async def submit_form(request: Request, form_data: ContactForm):
    contact = Contact(
        subject=form_data.subject,
        first_name=form_data.first_name,
        last_name=form_data.last_name,
        email=form_data.email,
        phone_number=form_data.phone_number,
        additional_info=form_data.additional_info,
    )

    db = SessionLocal()
    db.add(contact)
    db.commit()
    db.close()

    message = (
        f"Subject: {form_data.subject}\n\n"
        f"{form_data.first_name} {form_data.last_name} a soumis un formulaire avec les informations suivantes:\n\n"
        f"Email: {form_data.email}\n"
        f"Phone Number: {form_data.phone_number}\n"
        f"Additional Info: {form_data.additional_info}"
    )

    db = SessionLocal()
    emails = db.query(Email).all()
    db.close()

    for email in emails:
        try:
            sendEmail(email.email, form_data.subject, message)
        except Exception as e:
            print("submit-form: Something went wrong while sending the email...", e)

    return {"message": "Form submission successful"}


@router.delete("/delete-contact/{contact_id}")
async def delete_contact(contact_id: str):
    db = SessionLocal()
    contact = db.query(Contact).filter(Contact.id == contact_id).first()
    db.delete(contact)
    db.commit()
    db.close()
    return {"message": "Contact deleted successfully"}


@router.delete("/delete-all-contacts")
async def delete_all_contacts():
    db = SessionLocal()
    db.query(Contact).delete()
    db.commit()
    db.close()
    return {"message": "All contacts deleted successfully"}


@router.put("/update-contact/{contact_id}")
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
