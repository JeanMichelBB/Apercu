import resend
import os
from dotenv import load_dotenv

load_dotenv()

resend.api_key = os.getenv("RESEND_API_KEY")
FROM_EMAIL = os.getenv("FROM_EMAIL", "noreply@sacenpapier.org")

def sendEmail(to_email, subject, message):
    try:
        resend.Emails.send({
            "from": FROM_EMAIL,
            "to": to_email,
            "subject": subject,
            "text": message
        })
        print("Email sent successfully")
    except Exception as e:
        print(f"Something went wrong while sending the email... {e}")

def testEmail():
    try:
        resend.Domains.list()
        return True, None
    except Exception as e:
        error_message = str(e)
        print(f"Email connection test failed... {error_message}")
        return False, error_message
