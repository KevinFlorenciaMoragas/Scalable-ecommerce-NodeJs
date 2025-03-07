from fastapi import FastAPI
from pubsub import start_subscriber
from routes.cart_routes import router as carrito_router
from database.database import Base, engine
from models.users import Users
from models.cart import Cart
from models.products import Products
from models.associations import cart_product_association 
import threading
#Eliminar todas las tablas existentes
#Base.metadata.drop_all(bind=engine)
# Crear tablas nuevas con la nueva configuración
Base.metadata.create_all(bind=engine)
app = FastAPI()
# Iniciar el suscriptor en un hilo separado
def start_subscriber_thread():
    start_subscriber()

subscriber_thread = threading.Thread(target=start_subscriber_thread, daemon=True)
subscriber_thread.start()
app.include_router(carrito_router, prefix="/api", tags=["Cart"])
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)