from sqlalchemy import Column, Integer, String, DateTime,ForeignKey
from sqlalchemy.orm import relationship
from database.database import Base
from utils.generateUUID import generateUUID
import datetime 


class Cart(Base):
    __tablename__ = "cart"

    id = Column(Integer, primary_key=True, index=True,default= generateUUID)
    user_id = Column(Integer,nullable=False)
    state = Column(String, nullable = False)
    created_at = Column(DateTime, default=datetime.datetime.now)
    updated_at = Column(DateTime, default=datetime.datetime.now)

    items = relationship("CartItem", back_populates="cart")