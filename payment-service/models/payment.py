from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Float
from database.database import Base
import datetime

class Payment(Base):
    __tablename__ = "payment"

    id = Column(Integer, primary_key=True, index=True)
    cart_id = Column(String(36))
    total = Column(Float, nullable=False)
    state = Column(String(20), nullable=False)
    productList = Column(String(10000), nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.now)
    updated_at = Column(DateTime, default=datetime.datetime.now)
