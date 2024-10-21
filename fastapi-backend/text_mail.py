import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Set up email credentials
FROM_EMAIL = os.getenv("FROM_EMAIL")  # Your Gmail address
FROM_PASSWORD = os.getenv("FROM_PASSWORD")  # Your Gmail app password

def sendEmail(to_email, subject, message):
    # Create message container
    msg = MIMEMultipart()
    msg['From'] = FROM_EMAIL
    msg['To'] = to_email
    msg['Subject'] = subject
    msg.attach(MIMEText(message, 'plain'))

    try:
        # Connect to Gmail's SMTP server
        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()  # Secure connection
        server.login(FROM_EMAIL, FROM_PASSWORD)
        server.sendmail(FROM_EMAIL, to_email, msg.as_string())
        server.quit()
        print("Email sent successfully")
    except Exception as e:
        print(f"Something went wrong while sending the email... {e}")
        
def testEmail():
    try:
        # Connect to Gmail's SMTP server
        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()  # Secure connection
        server.login(FROM_EMAIL, FROM_PASSWORD)
        server.quit()
        return True, None  # Return True and no error message if the connection is successful
    except Exception as e:
        error_message = str(e)  # Capture the error message
        print(f"Something went wrong while testing the email connection... {error_message}")
        return False, error_message  # Return False and the error message if an error occurs