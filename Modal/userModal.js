const mongoose = require("mongoose");

const userDetail = new mongoose.Schema({
    customer_id: {
        type: String,
        required: true
    },
    customer_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    }
});

const userDetails = mongoose.model("userDetails", userDetail);

module.exports = {
    userDetails
};