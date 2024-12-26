# generate a funtion to send email
import smtplib
from email.mime.text import MIMEText

def send_email(sender, recipient, subject, body):
    """
    Send an email from the specified sender to the specified recipient.
    
    Args:
        sender (str): The email address of the sender.
        recipient (str): The email address of the recipient.
        subject (str): The subject line of the email.
        body (str): The body text of the email.
    """
    
    # Create a MIME text message
    msg = MIMEText(body)
    msg['Subject'] = subject
    msg['From'] = sender
    msg['To'] = recipient
    
    # Send the email
    with smtplib.SMTP('localhost') as smtp:
        smtp.send_message(msg)