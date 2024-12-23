from sqlalchemy.orm import Session
from fastapi import HTTPException
from fastapi.encoders import jsonable_encoder
from typing import List
from models.payment import Payment
import datetime
from pubsub import publish_event
from utils.payment import stripe_payment

def createPayment(data,db: Session):
    try:
        print(data)
        payment = Payment(
            cart_id=data['cart_id'],
            total=data['amount'],
            state="pending",
            productList=jsonable_encoder(data['productList']),
            created_at=datetime.datetime.now(),
            updated_at=datetime.datetime.now()
        )
        db.add(payment)
        db.commit()
        db.refresh(payment)
        return payment
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error creating payment: {str(e)}")