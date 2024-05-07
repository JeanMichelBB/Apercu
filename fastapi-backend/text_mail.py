# text_mail.py
import smtplib  
import os
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

FROM_EMAIL = os.getenv("FROM_EMAIL")
FROM_PASSWORD = os.getenv("FROM_PASSWORD")


def sendEmail(to_email, subject, message):
    from_email = FROM_EMAIL
    from_password = FROM_PASSWORD
    
    msg = MIMEMultipart()
    msg["From"] = from_email
    msg["To"] = to_email
    msg["Subject"] = subject
    msg.attach(MIMEText(message, "plain"))
    
    try:
        server = smtplib.SMTP("smtp-mail.outlook.com", 587)
        server.starttls()
        server.login(from_email, from_password)
        server.sendmail(from_email, to_email, msg.as_string())
        server.quit()
        print("Email sent successfully")
    except Exception as e:
        print("Something went wrong...", e)

