from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from fastapi import HTTPException
from fastapi.encoders import jsonable_encoder
from typing import List
from models.payment import Payment
import datetime
from pubsub import publish_event
from utils.payment import stripe_payment
import json

def createPayment(data: dict, db: Session):
    try:
        if not all(key in data for key in ['cart_id', 'amount', 'productList']):
            raise HTTPException(status_code=400, detail="Missing required fields in payment data")

        if not isinstance(data['productList'], list) or not data['productList']:
            raise HTTPException(status_code=400, detail="productList must be a non-empty list")
        print(data['productList'])
        serialized_product_list = json.dumps(data['productList'])  
        print(serialized_product_list)
        payment = Payment(
            cart_id=data['cart_id'],
            total=data['amount'],
            state="pending",
            productList=serialized_product_list,
            created_at=datetime.datetime.now(),
            updated_at=datetime.datetime.now()
        )
        db.add(payment)
        db.commit()  
        db.refresh(payment)  
        return payment

    except SQLAlchemyError as e:
        db.rollback()  
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

    except HTTPException:
        raise

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")

def getPayment(payment_id: int, db: Session):
    try:
        payment = db.query(Payment).filter(Payment.id == payment_id).first()
        if not payment:
            raise HTTPException(status_code=404, detail="Payment not found")
        return payment
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error getting payment: {str(e)}")

def paymentCompleted(payment_id: int, db: Session):
    try:
        payment = db.query(Payment).filter(Payment.id == payment_id).first()
        if not payment:
            raise HTTPException(status_code=404, detail="Payment not found")
        if payment.state == "completed":
            raise HTTPException(status_code=400, detail="Payment already completed")
        amount = payment.total
        cart_id = payment.cart_id
        payment_status = stripe_payment(amount, cart_id)
        if payment_status.status == 'succeeded':
            payment.state = "commpleted"
            payment.updated_at = datetime.datetime.now()
            publish_event("bill","bill:createBill", {"payment_id": payment.id, "cart_id":payment.cart_id ,"productList": payment.productList})
            publish_event("products","products:decrementInventory", {"productList": payment.productList})
            db.commit()
            db.refresh(payment)
        else:
            raise HTTPException(status_code=400, detail="Payment failed")
        
        return payment
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error completing payment: {str(e)}")
