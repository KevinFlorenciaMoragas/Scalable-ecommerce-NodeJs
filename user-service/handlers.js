const { publishEvent } = require("./pubsub");
const { getUser } = require("./controllers/user.controller");

let messageList = [];
const processedMessages = new Set();

async function handleCartEvent(message) {
    const { event, data } = message;
    const message_id = message.message_id;
    console.log(`Received event ${event} with message_id ${message_id}`);
    if(messageList.includes(message_id)){
        console.log(`Event ${message_id} already processed`);
        return;
    }
    if (!data || !data.user_id) {
        console.error('Data or user_id missing in event');
        return;
    }
    messageList.push(message_id);
    switch (event) {
        case 'cart:user_autentified':
            try {
                const user = await getUser(data.user_id);
                if (user) {
                    console.log(`User ${data.user_id} found`);
                    await publishEvent('cart_events:user_found',"user", {
                        user_id: data.user_id,
                        status: true
                    });
                } else {
                    console.log(`User ${data.user_id} not found`);
                    await publishEvent('cart_events:user_not_found',"user", {
                        user_id: data.user_id,
                        status: false
                    });
                }
            } catch (error) {
                console.error('Error handling cart event:', error);
            }
            break;
        case 'cart:checkout':
            console.log(`Processing cart checkout for user ${data.user_id}`);
            try{
                const user = await getUser(data.user_id);
                if(user){
                    console.log(`User ${data.user_id} found`);
                    await publishEvent('cart_events:checkout',"cart", {
                        user_id: data.user_id,
                        status: true
                    });
                }
            }catch(error){
                console.error('Error processing cart checkout:', error);
            }
            break;
        default:
            console.warn(`Unhandled event type: ${event}`);
            break;
    }
}

function handleUserEvent(message) {
    const { event, data, message_id } = message;

    if (!message_id) {
        console.log("Message ID is missing");
        return;
    }

    if (processedMessages.has(message_id)) {
        console.log(`Message ${message_id} already processed`);
        return;
    }

    processedMessages.add(message_id);

    // Handle the event
    if (event === 'user:created') {
        console.log(`User created: ${data.user_id}`);
        // Add your user creation logic here
    }

    // Add other event handlers as needed
}

module.exports = {
    handleCartEvent,
    handleUserEvent
};