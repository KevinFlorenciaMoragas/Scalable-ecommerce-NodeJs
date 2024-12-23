from sqlalchemy import Column, String, Integer, DateTime
from sqlalchemy.orm import relationship
from database.database import Base
from utils.generateUUID import generateUUID
import datetime

class Products(Base):
    __tablename__ = "products"

    id = Column(String(36), primary_key=True, index=True, default=generateUUID)
    product_id = Column(Integer,unique=True, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.now)
    updated_at = Column(DateTime, default=datetime.datetime.now)

    carts = relationship(
        "Cart",
        secondary="cart_product_association",
        back_populates="products"
    )
