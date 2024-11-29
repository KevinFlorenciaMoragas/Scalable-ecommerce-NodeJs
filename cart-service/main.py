from fastapi import FastAPI
from routes.cart_routes import router as carrito_router

app = FastAPI()

app.include_router(carrito_router, prefix="/api", tags=["Cart"])