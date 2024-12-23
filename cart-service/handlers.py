import json
from sqlalchemy.orm import Session
from fastapi import HTTPException
from models.users import Users
from models.products import Products
from fastapi.encoders import jsonable_encoder
import datetime
from database.database import SessionLocal
import asyncio
from models.eventlog import EventLog
processed_messages = set()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def handle_message(message):
    from pubsub import publish_event
    session = next(get_db())
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

        if session.query(EventLog).filter(EventLog.event_id == message_id).first():
            print("Evento ya procesado anteriormente")
            return 
        event_log = EventLog(
                event_id=message_id,
                event_type=event,
                processed_at=datetime.datetime.now()
            )
        session.add(event_log)
        if event == 'product:created':
            print(f"Product added: {data}")
            if session.query(Products).filter(Products.product_id == data['product_id']).first():
                raise HTTPException(status_code=400, detail="Product already exists")
            product = Products(product_id=data["product_id"], created_at=datetime.datetime.now(), updated_at=datetime.datetime.now())
            session.add(product)
            session.commit()
            session.refresh(product)
            return product
        if event == 'product:deleted':
            print(f"Product deleted: {data['product_id']}")
            product = session.query(Products).filter(Products.product_id == data['product_id']).first()
            if product:
                session.delete(product)
                session.commit()
                return product
            else:
                raise HTTPException(status_code=404, detail="Product not found")
        if event == 'user:created':
            print(f"User created: {data['user_id']}")
            if session.query(Users).filter(Users.user_id == data['user_id']).first():
                print("Este usuario existe ")
                return
            user = Users(
                user_id=data["user_id"],
                created_at=datetime.datetime.now(),
                updated_at=datetime.datetime.now()
            )            
            session.add(user)
            session.commit()
            session.refresh(user)
            print("Final")
            return user

        if event == 'user:deleted':
            print(f"User deleted: {data['user_id']}")
            user = session.query(Users).filter(Users.user_id == data['user_id']).first()
            if user:
                session.delete(user)
                session.commit()
                return user
            else:
                raise HTTPException(status_code=404, detail="User not found")
        if event == 'cart:processed':
            dataToSent = {
                "cart_id": data['cart_id'],
                "amount": data['amount'],
                "productList": data['productsList']
            }
            print("Data to send", dataToSent)
            publish_event("payment", "payment:payment_send", dataToSent)
            return dataToSent