import redis
import json
import threading
import uuid
from handlers import handle_message

redis_client = redis.Redis(host='localhost', port=6379, decode_responses=True)
subscriber_thread = None
subscriber_lock = threading.Lock()

def publish_event(channel, event, data):
    print(f"Publishing event: {event} to channel: {channel}")
    message = {
        "event": event,
        "data": data,
        "message_id": str(uuid.uuid4())
    }
    redis_client.publish(channel, json.dumps(message))
    print(f"Published message: {message}")

def subscribe_event():
    pubsub = redis_client.pubsub()
    pubsub.subscribe('payment')
    print("Subscribed to channels: payment")
    for message in pubsub.listen():
        print(f"Received message: {message}")
        if message and message["type"] == "message":
            handle_message(message)

def start_subscriber():
    global subscriber_thread
    with subscriber_lock:
        if not subscriber_thread or not subscriber_thread.is_alive():
            subscriber_thread = threading.Thread(target=subscribe_event, daemon=True)
            subscriber_thread.start()
            print("Subscriber thread started")
        else:
            print("Subscriber thread already running")
