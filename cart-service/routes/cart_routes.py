from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from controllers.cart_controller import (
    createCart,
    addProductToCart,
    updateTotalCart,
    endCart,
    getCart)
from database.database import SessionLocal

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/cart/{user_id}")
def create_cart(user_id:int, db: Session = Depends(get_db)):
    return createCart(user_id, db)
@router.post("/cart/{cart_id}/add")
def add_product_to_cart(cart_id:int, quantity:int, db: Session = Depends(get_db)):
    return addProductToCart(cart_id, quantity, db)
@router.post("/cart/{cart_id}/end")
def end_cart(cart_id:int, db: Session = Depends(get_db)):
    return endCart(cart_id, db)
@router.get("/cart/{cart_id}")
def get_cart(cart_id:int, db: Session = Depends(get_db)):
    return getCart(cart_id, db)
@router.post("/cart/{cart_id}/update")
def update_cart(cart_id:int, db: Session = Depends(get_db)):
    return updateTotalCart(cart_id, db)
