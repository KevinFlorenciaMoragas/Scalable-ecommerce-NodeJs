from pydantic import BaseModel
from typing import Optional
class CartBase(BaseModel):
    cart_id: str
    product_id: str
    quantity: Optional[int] = 1
