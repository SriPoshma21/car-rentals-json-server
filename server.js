// const jsonServer = require("json-server");
// const express = require("express");
// const cors = require("cors");
// const dotenv = require("dotenv").config();
// const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// const server = express();
// const router = jsonServer.router("db.json");
// const middleware = jsonServer.defaults();

// const port = 8080;

// server.use(express.json());
// server.use(cors());
// server.use(middleware);
// server.use("/api", router);

// server.get("/", (req, res) => {
//   res.send("this is root page");
// });

// server.post("/hello", (req, res) => {
//   res.json(req.body);
// });

// // Payment Route
// server.post("/create-payment-intent", async (req, res) => {
//   try {
//     const { amount, currency } = req.body;
//     console.log(amount, currency);
//     const paymentIntent = await stripe.paymentIntents.create({
//       amount,
//       currency,
//       payment_method_types: ["card"],
//     });

//     res.send({
//       clientSecret: paymentIntent.client_secret,
//     });
//   } catch (error) {
//     res.status(500).send({ error: error.message });
//   }
// });

// server.listen(port, () => console.log(`Server started on port ${port}`));



const express = require("express");
const jsonServer = require("json-server");
const cors = require("cors");
const dotenv = require("dotenv");
const stripe = require("stripe");

// Load environment variables
dotenv.config();

const app = express();
const router = jsonServer.router("db.json");
const middleware = jsonServer.defaults();
const PORT = process.env.PORT || 8080;

// Ensure Stripe secret key is available
if (!process.env.STRIPE_SECRET_KEY) {
  console.error("⚠️ Stripe Secret Key is missing in the environment variables.");
  process.exit(1);
}

// Initialize Stripe with the secret key
const stripeInstance = stripe(process.env.STRIPE_SECRET_KEY);

// Middleware
app.use(express.json());
app.use(cors());
app.use(middleware);
app.use("/api", router);

// Root Route
app.get("/", (req, res) => {
  res.send("Welcome to the API!");
});

// Test Route
app.post("/hello", (req, res) => {
  res.json(req.body);
});

// Payment Route
app.post("/create-payment-intent", async (req, res) => {
  try {
    const { amount, currency } = req.body;

    if (!amount || !currency) {
      return res.status(400).json({ error: "Amount and currency are required." });
    }

    console.log(`Processing payment: ${amount} ${currency}`);

    const paymentIntent = await stripeInstance.paymentIntents.create({
      amount,
      currency,
      payment_method_types: ["card"],
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    res.status(500).json({ error: error.message });
  }
});

// Start Server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
