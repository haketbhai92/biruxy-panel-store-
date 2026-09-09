const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

const orders = [];

app.post("/api/orders", (req, res) => {
  const { orderId, product, price } = req.body;

  if (!orderId || !product || !price) {
    return res.status(400).json({
      success: false,
      message: "Invalid order"
    });
  }

  const order = {
    orderId,
    product,
    price,
    status: "pending",
    key: null,
    createdAt: new Date().toISOString()
  };

  orders.push(order);

  console.log("NEW ORDER:", order);

  res.json({
    success: true,
    message: "Order received",
    order
  });
});

app.get("/api/orders", (req, res) => {
  res.json(orders);
});

app.use((req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`BIRUXY SHOP running on port ${PORT}`);
});
