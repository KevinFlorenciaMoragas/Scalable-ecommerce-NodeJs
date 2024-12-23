const { publishEvent } = require("./pubsub");
const Product = require('./models/products.model');

const processedMessages = new Set();

async function handleCartEvent(message) {
    const { event, data } = message;
    console.log("Handling cart event");
    let productsList = [];
    if (event === 'cart:ended') {
        try {
            let total = 0;
            for (let p of data) {
                const product = await Product.findByPk(p.product_id);
                console.log(product.dataValues);
                if (product.dataValues.stock < p.quantity) {
                    console.log(`Product ${product.dataValues.name} is out of stock`);
                    publishEvent('cart:cancelled', 'cart', { cart_id: data.cart_id });
                    return;
                }
                productsList.push({
                    id: product.dataValues.id,
                    name: product.dataValues.name,
                    quantity: p.quantity,
                    unitaryPrice: product.dataValues.price,
                    totalPrice: product.dataValues.price * p.quantity
                });
                const newStock = product.dataValues.stock - p.quantity;
                await Product.update({ stock: newStock }, {
                    where: { id: product.id }
                });
                console.log(`Stock updated for product ${product.dataValues.name}`);
                total += product.dataValues.price * p.quantity;
            }
            console.log(productsList);
            console.log(`Total amount charged: ${total}`);
            publishEvent('cart:processed', 'cart', { cart_id: data[0].cart_id, amount: total, productsList: productsList });

        } catch (error) {
            console.log(error.message);
        }
    }
}

async function handleProductEvent(message) {
    const { event, data, message_id } = message;
    if (!message_id) {
        console.log("Message ID is missing");
        return;
    }
    if (event === 'products:decrementInventory') {
        try {
            console.log(data.productList);
            let productsList = JSON.parse(data.productList);
            console.log(productsList);
            for (let p of productsList) {
                console.log(p.id);
                const product = await Product.findByPk(p.id);
                if (!product) {
                    console.log(`Product with id ${p.id} not found`);
                    continue;
                }
                const newStock = product.dataValues.stock - p.quantity;
                await Product.update({ stock: newStock }, {
                    where: { id: product.id }
                });
                console.log(`Stock updated for product ${product.dataValues.name}`);
            }
        } catch (error) {
            console.log(error.message);
        }
    }
}

module.exports = {
    handleCartEvent,
    handleProductEvent
};