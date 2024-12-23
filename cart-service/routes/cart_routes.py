from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from controllers.cart_controller import (
    createCart,
    addProductToCart,
    endCart,
    getCart,
    getCartProducts,
    deleteCart,
    deleteCartItem)
from database.database import SessionLocal
from interfaces.cart_interface import CartBase
router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/cart/{cart_id}")
def get_cart(cart_id:int, db: Session = Depends(get_db)):
    return getCart(cart_id, db)
@router.get("/cart/{cart_id}/products")
def get_cart_products(cart_id:int, db: Session = Depends(get_db)):
    return getCartProducts(cart_id, db)
@router.post("/cart/{user_id}")
def create_cart(user_id:int, db: Session = Depends(get_db)):
    return createCart(user_id, db)
@router.post("/cart/product/add")
def add_product_to_cart(product:CartBase, db: Session = Depends(get_db)):
    return addProductToCart(product, db)
@router.post("/cart/{cart_id}/end")
def end_cart(cart_id:str, db: Session = Depends(get_db)):
    print(cart_id)
    return endCart(cart_id, db)
@router.delete("/cart/{cart_id}")
def delete_cart(cart_id:int, db: Session = Depends(get_db)):
    return deleteCart(cart_id, db)
@router.delete("/cart/product/delete")
def delete_cart_item(product:CartBase, db: Session = Depends(get_db)):
    return deleteCartItem(product, db)