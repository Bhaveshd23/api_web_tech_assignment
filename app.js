const express = require("express");
const mongoose = require("mongoose");
const { userDetails } = require("./Modal/userModal");
const { inventoryDetails } = require("./Modal/inventoryModal");
const { orderDetails } = require("./Modal/orderDetail");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.listen(3000, (err) => {
    if (!err) {
        console.log("server is running");
    }
    else {
        console.log(err);
    }
})

//database connection
mongoose.connect("mongodb://localhost/api_web_tech_assignment", (data) => {
}, (err) => {
    console.log(err);
});

//routers

app.get("/", (req, res) => {
    res.send("BackEnd Working");
});

app.get("/inventory", async (req, res) => {
    const data = await inventoryDetails.find();
    res.send(data);
});

app.get("/inventory/electronics", async (req, res) => {
    const data = await inventoryDetails.find({ inventory_type: "Electronics" });
    res.send(data);
});

app.get("/inventory/furniture", async (req, res) => {
    const data = await inventoryDetails.find({ inventory_type: "Furniture" });
    res.send(data);
});

app.post("/updateinventory", async (req, res) => {
    // console.log(req.body)
    await inventoryDetails.create(req.body);
    const data = await inventoryDetails.find();
    res.send(data)
});

app.post("/user", async (req, res) => {
    const userCheck = await userDetails.find({ email: req.body.email });
    if (userCheck.length) {
        res.send("Email already exists, use different email to proceed");
    }
    else {
        await userDetails.create(req.body);
        const data = await userDetails.find();
        res.send(data);
    }
});

app.post("/order", async (req, res) => {
    const data = await userDetails.find({ email: req.body.email });
    if (data.length) {
        const inventoryQuantity = await inventoryDetails.find({ item_name: req.body.item_name });
        // console.log(inventoryQuantity[0]);
        if (!inventoryQuantity) {
            res.send("Item does not found");
        } else {
            // console.log(inventoryQuantity[0].available_quantity)
            if (inventoryQuantity[0].available_quantity < req.body.quantity) {
                res.send("out of stock");
            } else {
                const user = await orderDetails.find({ customer_id: data[0].customer_id });
                if (user.length) {
                    await inventoryDetails.updateOne({ item_name: req.body.item_name }, { available_quantity: inventoryQuantity[0].available_quantity - req.body.quantity });
                    const updatedData = await orderDetails.updateOne({ customer_id: user[0].customer_id }, { quantity: user[0].quantity + req.body.quantity });
                    const orderData = await orderDetails.find();
                    res.send(orderData)
                } else {
                    await inventoryDetails.updateOne({ item_name: req.body.item_name }, { available_quantity: inventoryQuantity[0].available_quantity - req.body.quantity });
                    const orderData = await orderDetails.create({
                        customer_id: data[0].customer_id,
                        inventory_id: inventoryQuantity[0].inventory_id,
                        item_name: req.body.item_name,
                        quantity: req.body.quantity
                    })
                    res.send(orderData);
                }
            }
        }
    } else {
        res.send("Invalid user are not allowed too make the order");
    }
});

app.post("/ordercheck", async (req, res) => {
    const user = await userDetails.find({ email: req.body.email });
    if (user.length) {
        const inventory = await inventoryDetails.find({ item_name: req.body.item_name });
        if (inventory.length) {
            const data = await orderDetails.find({ customer_id: user[0].customer_id });
            if (data[0].item_name === req.body.item_name) {
                res.send("You have bought" + " " + data[0].quantity + " " + `${req.body.item_name}`);
            } else {
                res.send("You have not bought this item")
            }
        } else {
            res.send("we don't have this item to sell")
        }
    } else {
        res.send("Invalid user")
    }
})