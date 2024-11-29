from sqlalchemy import Column, String, Integer, ForeignKey, Float, DateTime
from sqlalchemy.orm import relationship
from database.database import Base
import datetime
from utils.generateUUID import generateUUID

class CartItem(Base):
    __tablename__ = "cart_item"

    id= Column(Integer, primary_key=True, index=True, default=generateUUID)
    cart_id = Column(Integer, ForeignKey("cart.id"),nullable=False)
    product_id = Column(Integer, nullable=False)
    quantity = Column(Integer, nullable=False)
    price = Column(Float, nullable=False)
    total_price = Column(Float, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.now)
    updated_at = Column(DateTime, default=datetime.datetime.now)

    cart = relationship("Cart", back_populates="items")