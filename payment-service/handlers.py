import json
from flask import jsonify
import stripe
from utils.payment import stripe_payment
from database.database import SessionLocal
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
processed_messages = set()
def handle_message(message):

    from controllers.payment_controller import createPayment

    if message and message["type"] == "message":
        payload = json.loads(message["data"])
        event = payload["event"]
        data = payload["data"]
        message_id = payload.get('message_id')

        print(f"Message ID: {message_id}")

        if message_id in processed_messages:
            print(f"Message {message_id} already processed")
            return
        
        processed_messages.add(message_id)
        print("Mensajes procesados", processed_messages)

        if event == 'payment:payment_send':
            print(f"Payment received: {data}")
            db = next(get_db())
            try:
                createPayment(data, db)
            finally:
                db.close()
   