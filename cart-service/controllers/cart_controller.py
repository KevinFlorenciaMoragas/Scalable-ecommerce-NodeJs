from sqlalchemy.orm import Session
from fastapi import HTTPException
from fastapi.encoders import jsonable_encoder
from typing import List
from models.cartItem import CartItem
from models.cart import Cart
import datetime

def createCart(user_id:int, db: Session):
    try:
        cart = Cart(user_id=user_id, state="open",created_at=datetime.datetime.now(), updated_at=datetime.datetime.now())
        db.add(cart)
        db.commit()
        db.refresh(cart)
        return cart
    except Exception as e:
        raise HTTPException(status_code=400, detail="Error creating cart")
    
def addProductToCart(cart_id:int,quantity:int,db:Session,product):
    cart = db.query(Cart).filter(Cart.id == cart_id).first()
    if not cart:
        raise HTTPException(status_code=404, detail="Cart not found")
    
    cartItem = CartItem(
        cart_id=cart_id,
        product_id=product.id,
        quantity=quantity,
        price=product.price,
        total_price=product.price*quantity)
    
    db.add(cartItem)
    db.commit()
    db.refresh(cartItem)

    return cartItem

def updateTotalCart(cart_id:str, db:Session):
    cart = db.query(Cart).filter(Cart.id == cart.id).first()
    if not cart:
        raise HTTPException(status_code=404, detail="Cart not found")
    
    total = sum(item.subtotal for item in cart.items)
    cart.total = total
    db.commit()
    db.refresh(cart)
    return cart

def endCart(cart_id:int, db:Session):
    cart = db.query(Cart).filter(Cart.id == cart_id).first()
    if not cart:
        raise HTTPException(status_code=404, detail="Cart not found")
    
    cart.state = "closed"
    db.commit()
    db.refresh(cart)
    return cart

def getCart(cart_id:int, db:Session):
    cart = db.query(Cart).filter(Cart.id == cart_id).first()
    if not cart:
        raise HTTPException(status_code=404, detail="Cart not found")
    
    return cart

def getCartItems(cart_id:int, db:Session):
    cart = db.query(Cart).filter(Cart.id == cart_id).first()
    if not cart:
        raise HTTPException(status_code=404, detail="Cart not found")
    
    return cart.items

def deleteCart(cart_id:int, db:Session):
    cart = db.query(Cart).filter(Cart.id == cart_id).first()
    if not cart:
        raise HTTPException(status_code=404, detail="Cart not found")
    db.delete(cart)
    db.commit()
    return cart

def deleteCartItem(cart_item_id:int, db:Session):
    cart = db.query(CartItem).filter(CartItem.id == cart_item_id).first()
    if not cart:
        raise HTTPException(status_code=404, detail="Cart item not found")
    db.delete(cart)
    db.commit()
    return cart

