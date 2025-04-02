const jsonServer = require("json-server");
const express = require("express");
const stripe = require("stripe")("sk_test_51R9LK6PV1vZmFxw33cLa8OEfQgBCueX2Q9IxncYQVCjKQDfZBe2GbWnQvHiZ1NXTMzq4kK22crqfWSMSOQPCFfnh00J3eGFCIy"); 
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const server = express();
const router = jsonServer.router("db.json");
const middleware = jsonServer.defaults();

const port = 8080;

server.use(express.json());
server.use(cors()); 
server.use(middleware);
server.use("/api", router);

// Payment Route
server.post("/api/create-payment-intent", async (req, res) => {
    try {
        const { amount, currency } = req.body;
        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency,
            payment_method_types: ["card"],
        });

        res.send({
            clientSecret: paymentIntent.client_secret,
        });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

server.listen(port, () => console.log(`Server started on port ${port}`));
