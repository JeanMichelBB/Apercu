from pydantic import BaseModel


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
