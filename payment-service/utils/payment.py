import stripe
from fastapi import HTTPException

def stripe_payment(amount, cart_id):
    from pubsub import publish_event
    currency = "usd"
    amount_in_cents = int(amount * 100)
    payment_method = "pm_card_visa"
    try:
        payment_intent = stripe.PaymentIntent.create(
            amount=amount_in_cents,
            currency=currency,
            payment_method=payment_method,
            automatic_payment_methods={
                "enabled": True,
                "allow_redirects": "never"  # No permitir redirecciones
            },
            confirm=True
        )
        print("Payment intent", payment_intent.status)
        if payment_intent.status == 'succeeded':
            return payment_intent

    except stripe.error.CardError as e:
        raise HTTPException(status_code=402, detail=f"Error con la tarjeta: {str(e)}")
    except stripe.error.RateLimitError:
        raise HTTPException(status_code=429, detail="Demasiadas solicitudes a Stripe. Intenta más tarde.")
    except stripe.error.InvalidRequestError as e:
        raise HTTPException(status_code=400, detail=f"Solicitud inválida: {str(e)}")
    except stripe.error.AuthenticationError:
        raise HTTPException(status_code=401, detail="Autenticación fallida con la API de Stripe.")
    except stripe.error.APIConnectionError:
        raise HTTPException(status_code=502, detail="Error de conexión con Stripe.")
    except stripe.error.StripeError as e:
        raise HTTPException(status_code=500, detail=f"Error general de Stripe: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error inesperado: {str(e)}")
