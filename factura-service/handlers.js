const { publishEvent } = require("./pubsub");
const { createBill } = require("./createBill");
const processedMessages = new Set();

async function handleBillEvent(message) {
    const { event, data } = message;
    console.log("Handling cart event");
    if (event === 'bill:createBill') {
        console.log(data)
        let productList = JSON.parse(data.productList);
        createBill(productList, data.cart_id);
    }
}

module.exports = {
    handleBillEvent
};