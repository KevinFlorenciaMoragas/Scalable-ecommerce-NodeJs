from sqlalchemy import Table, Column, String, ForeignKey, Integer
from database.database import Base

cart_product_association = Table(
    'cart_product_association',
    Base.metadata,
    Column('cart_id', String(36), ForeignKey('cart.id'), primary_key=True),
    Column('product_id', String(36), ForeignKey('products.id'), primary_key=True),
    Column('quantity', Integer, nullable=False)
)
