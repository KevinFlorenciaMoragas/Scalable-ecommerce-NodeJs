from flask import Flask, request, jsonify
from fastapi import FastAPI
import stripe
import os
from dotenv import load_dotenv
from routes.payment_routes import router as payment_router
from models.payment import Payment
from database.database import Base, engine
from pubsub import start_subscriber
import threading

# Crear tablas nuevas con la nueva configuración
Base.metadata.create_all(bind=engine)

app = FastAPI()

# Iniciar el suscriptor en un hilo separado
def start_subscriber_thread():
    start_subscriber()

subscriber_thread = threading.Thread(target=start_subscriber_thread, daemon=True)
subscriber_thread.start()

app.include_router(payment_router, prefix="/api", tags=["Payment"])
load_dotenv()
stripe.api_key = os.getenv('STRIPE_SECRET_KEY')
if not stripe.api_key:
    raise ValueError('No STRIPE_SECRET_KEY set')
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)