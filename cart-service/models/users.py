from sqlalchemy import Column, String, Integer, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from database.database import Base
from utils.generateUUID import generateUUID
import datetime

class Users(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, index=True, default=generateUUID)
    user_id = Column(Integer,unique=True ,nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.now)
    updated_at = Column(DateTime, default=datetime.datetime.now)

    cart = relationship("Cart", back_populates="user", uselist=False)
