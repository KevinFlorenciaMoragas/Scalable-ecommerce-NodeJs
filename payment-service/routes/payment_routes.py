from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from controllers.payment_controller import (
    createPayment,
    getPayment,
    paymentCompleted)
from database.database import SessionLocal
router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/payment/{payment_id}")
def get_payment(payment_id:int, db: Session = Depends(get_db)):
    return getPayment(payment_id, db)
@router.post("/payment/{payment_id}")
def proccess_payment(payment_id:int, db: Session = Depends(get_db)):
    return paymentCompleted(payment_id, db)
