const mongoose = require("mongoose");

const orderDetail = new mongoose.Schema({
    customer_id: {
        type: String,
        required: true
    },
    inventory_id: {
        type: String,
        required: true
    },
    item_name: {
        type: String,
        required: true
    },
    quantity:{
        type: Number,
        required:true,
        default: 0
    }
});

const orderDetails = mongoose.model("orderDetails", orderDetail);

module.exports = {
    orderDetails
};