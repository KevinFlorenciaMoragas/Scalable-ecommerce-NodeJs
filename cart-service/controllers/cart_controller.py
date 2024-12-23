from sqlalchemy.orm import Session
from fastapi import HTTPException
from fastapi.encoders import jsonable_encoder
from typing import List
from models.cart import Cart
from models.users import Users
from pubsub import publish_event
import datetime
from interfaces.cart_interface import CartBase
from models.products import Products
from models.associations import cart_product_association
def process_cart_products(cart_products):
    serialized_products = []
    for cp in cart_products:
        serialized_products.append({
            "cart_id": cp.cart_id,
            "product_id": cp.product_id,
            "quantity": cp.quantity
        })
    return serialized_products


def createCart(user_id: int, db: Session):
    try:
        print("Creating cart")
        user = db.query(Users).filter(Users.user_id == user_id).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        cart = Cart(user_id=user.id, state="open", created_at=datetime.datetime.now(), updated_at=datetime.datetime.now())
        db.add(cart)
        db.commit()
        db.refresh(cart)
        return cart
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error creating cart: {str(e)}")
    
def addProductToCart(product: CartBase, db: Session):
    try:
        product_id = product.product_id
        quantity = product.quantity
        cart_id = product.cart_id
        cart = db.query(Cart).filter(Cart.id == cart_id).first()
        if not cart:
            raise HTTPException(status_code=404, detail="Cart not found")
        product = db.query(Products).filter(Products.id == product_id).first()
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
        db.execute(
            cart_product_association.insert().values(
                cart_id=cart_id, product_id=product.product_id, quantity=quantity
            )
        )
        db.commit()
        return {
            "message": "Product added to cart successfully",
            "cart_item": {
                "cart_id": cart_id,
                "product_id": product_id,
                "quantity": quantity,
            },
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error adding product to cart: {str(e)}")

def endCart(cart_id:str, db:Session):
    try:
        cart = db.query(Cart).filter(Cart.id == cart_id).first()
        print(cart)
        if not cart:
            raise HTTPException(status_code=404, detail="Cart not found")
        if cart.state == "closed":
            raise HTTPException(status_code=400, detail="Cart already closed")
        
        cart_products = db.query(cart_product_association).filter(cart_product_association.c.cart_id == cart_id).all()
        if not cart_products:
            raise HTTPException(status_code=404, detail="Cart is empty")
        cart.state = "closed"
        db.commit()
        db.refresh(cart)
        serialized_cart_products = process_cart_products(cart_products)
        publish_event("cart", "cart:ended", serialized_cart_products)
        return cart
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error ending cart: {str(e)}")

def getCart(cart_id:str, db:Session):
    try:
        cart = db.query(Cart).filter(Cart.id == cart_id).first()
        if not cart:
            raise HTTPException(status_code=404, detail="Cart not found")
        return cart
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error getting cart: {str(e)}")

def getCartProducts(cart_id:str, db:Session):
    try:
        cart_products = db.query(cart_product_association).filter(cart_product_association.c.cart_id == cart_id).all()
        if not cart_products:
            raise HTTPException(status_code=404, detail="Cart products not found")
        return cart_products
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error getting cart products: {str(e)}")

def deleteCart(cart_id:str, db:Session):
    try:
        cart = db.query(Cart).filter(Cart.id == cart_id).first()
        if not cart:
            raise HTTPException(status_code=404, detail="Cart not found")
        db.delete(cart)
        db.commit()
        return cart
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error deleting cart: {str(e)}")
def deleteCartItem(product:CartBase, db:Session):
    try:
        cart_id = product.cart_id
        product_id = product.product_id
        cart_products = db.query(cart_product_association).filter(cart_product_association.c.cart_id == cart_id)&( cart_product_association.c.product_id == product_id).all()
        if not cart_products:
            raise HTTPException(status_code=404, detail="Cart item not found")
        db.delete(cart_products)
        db.commit()
        return cart_products
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error deleting cart item: {str(e)}")

