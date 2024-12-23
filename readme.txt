README: Microservicios para E-Commerce
Descripción General

Este proyecto es un sistema distribuido compuesto por varios microservicios diseñados para gestionar diferentes aspectos de una plataforma de e-commerce. Los microservicios están integrados para trabajar juntos en un flujo de trabajo de gestión de usuarios, productos, carritos, pagos y generación de facturas.
Componentes del Sistema:

    Microservicio Users:
        Gestiona usuarios utilizando NodeJs, Express y Sequelize.
        Implementa el cifrado de contraseñas utilizando bcrypt.
        Proporciona autenticación a través de JWT para manejo seguro de sesiones.

    Microservicio Products:
        Gestiona productos utilizando NodeJs, Express y Sequelize.
        Emite eventos al microservicio de pagos con la información de los productos.
        Verifica existencia y disponibilidad de productos antes de pasar a la pasarela de pago.

    Microservicio Cart:
        Gestiona carritos de compras utilizando Python y FastAPI.
        Añade productos a los carritos y emite eventos cuando el carrito ha finalizado al microservicio de productos.

    Microservicio Payment:
        Gestiona pagos utilizando Stripe.
        Emite un evento al microservicio de facturas con la información de los productos.
        También emite eventos al microservicio de productos para descontar los productos del inventario.

    Microservicio Bill:
        Genera facturas utilizando NodeJs con Puppeteer para crear PDFs desde plantillas HTML y Bootstrap para el diseño.

    Redis y Eventos:
        Redis se utiliza como sistema de eventos para sincronizar acciones entre los microservicios, como crear usuarios, productos, actualizar inventarios, etc.

Requisitos

    NodeJs y npm: Para el desarrollo de microservicios en NodeJs.
        Node.js >= 14.x
        npm >= 6.x

    Python y pip: Para el desarrollo del microservicio Cart y Payment.
        Python >= 3.8
        pip >= 20.x

    Bases de Datos: Sequelize se conecta a MySQL, PostgreSQL o SQLite.

    Redis: Se utiliza para gestionar eventos entre microservicios.

    Stripe: Para el procesamiento de pagos en el microservicio Payment.

Diagramas del Sistema

    Arquitectura General:

        +-------------------+          +-------------------+          +-------------------+          
        |     Microservicio Users    |          |    Microservicio Products     |          |     Microservicio Cart     |
        +-------------------+          +-------------------+          +-------------------+        
                    |                                        |                                       |
                    |                                        |                                       |
        +-------------------+     +-------------------+     +-------------------+    
        |     Microservicio Bill    |     |   Microservicio Payment     |     
        +-------------------+     +-------------------+   
                                |                                       |
                                |                                       |
                                v                                       v
                           +-------------------+
                           |     Redis Event Broker   |
                           +-------------------+

Microservicio Users
Tecnologías utilizadas

    NodeJs
    Express
    Sequelize
    bcrypt (cifrado de contraseñas)
    JWT (autenticación)

Endpoints

    Registro de usuarios: POST /api/users/register
    Inicio de sesión: POST /api/users/login
    Validación de token: GET /api/users/validate
    Lista de usuarios: GET /api/users

Microservicio Products
Tecnologías utilizadas

    NodeJs
    Express
    Sequelize
    Redis (Eventos)

Funcionalidades

    Gestión de productos.
    Verificación de existencia y stock antes de procesar pagos.
    Emisión de eventos a otros microservicios cuando se realizan cambios en productos.

Endpoints

    Crear producto: POST /api/products
    Obtener productos: GET /api/products
    Actualizar producto: PUT /api/products/:id
    Eliminar producto: DELETE /api/products/:id

Microservicio Cart
Tecnologías utilizadas

    Python
    FastAPI
    Redis (Eventos)

Funcionalidades

    Gestión de carritos.
    Agregar productos al carrito.
    Emisión de eventos al finalizar el carrito.

Endpoints

    Añadir producto al carrito: POST /api/cart
    Ver carrito: GET /api/cart
    Finalizar carrito: POST /api/cart/checkout

Microservicio Payment
Tecnologías utilizadas

    Python
    FastAPI
    Stripe
    Redis (Eventos)

Funcionalidades

    Gestión de pagos mediante Stripe.
    Generación de eventos para facturación y actualización de inventario.

Endpoints

    Procesar pago: POST /api/payment
    Cancelar pago: POST /api/payment/cancel
    Revisar estado del pago: GET /api/payment/:id

Microservicio Bill
Tecnologías utilizadas

    NodeJs
    Puppeteer
    Bootstrap (CSS)

Funcionalidades

    Generación de facturas en formato PDF.
    Integración con Stripe para obtener los datos de la factura.

Endpoints

    Generar factura: POST /api/bill/generate

Flujos de trabajo
1. Creación de productos

    Microservicio Products:
        Recibe los datos del producto y almacena en la base de datos.
        Emite un evento a Redis para que los otros microservicios se actualicen.

2. Registro de usuarios

    Microservicio Users:
        Crea usuarios, almacena en la base de datos y genera un token JWT.

3. Gestión de carritos

    Microservicio Cart:
        Permite añadir productos al carrito y emitir eventos para la gestión de inventario en otros microservicios.

4. Procesamiento de pagos

    Microservicio Payment:
        Genera pagos a través de Stripe, emite eventos para generar facturas y descontar inventario.

Instalación y ejecución
Requisitos:

    Instala todas las dependencias necesarias para los diferentes microservicios.

    Para NodeJs (Users, Products, Bill):

npm install

Para Python (Cart, Payment):

pip install -r requirements.txt

Levantar Redis

docker-compose up -d redis

Iniciar los microservicios:

    # Microservicio Users
    npm run start:users

    # Microservicio Products
    npm run start:products

    # Microservicio Cart
    uvicorn app:app --host 0.0.0.0 --port 8001

    # Microservicio Payment
    uvicorn app:app --host 0.0.0.0 --port 8002

    # Microservicio Bill
    npm run start:bill

    Configuración de Stripe

    Configura tu clave de API de Stripe en cada microservicio que necesite pagos.

Consideraciones adicionales

    Eventos: Redis es crucial para la comunicación en tiempo real entre los microservicios.
    Seguridad: Todos los servicios manejan cifrado adecuado para datos sensibles como contraseñas y detalles financieros.
    Escalabilidad: Los microservicios están diseñados para ser independientes y escalables según la demanda.
