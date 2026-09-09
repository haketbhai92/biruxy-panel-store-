const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 10000;

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "BIRUXYADMIN123";

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const users = [];
const orders = [];

// ================= REGISTER =================

app.post("/api/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      success: false,
      message: "Username aur password required hai"
    });
  }

  if (users.some(u => u.username === username)) {
    return res.json({
      success: false,
      message: "Username already registered hai"
    });
  }

  users.push({
    username,
    password
  });

  res.json({
    success: true,
    message: "Registration successful"
  });
});

// ================= LOGIN =================

app.post("/api/login", (req, res) => {
  const { username, password } = req.body;

  const user = users.find(
    u => u.username === username && u.password === password
  );

  if (!user) {
    return res.json({
      success: false,
      message: "Wrong username ya password"
    });
  }

  res.json({
    success: true,
    message: "Login successful"
  });
});

// ================= ORDER =================

app.post("/api/orders", (req, res) => {
  const {
    orderId,
    username,
    product,
    type,
    plan,
    price
  } = req.body;

  if (!orderId || !username || !product || !plan || !price) {
    return res.status(400).json({
      success: false,
      message: "Invalid order"
    });
  }

  const order = {
    orderId,
    username,
    product,
    type,
    plan,
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

// ================= MY KEY =================

app.get("/api/mykey", (req, res) => {
  const username = req.query.username;

  const result = orders.filter(
    o => o.username === username
  );

  res.json({
    success: true,
    orders: result
  });
});

// ================= ADMIN ORDERS =================

app.get("/api/admin/orders", (req, res) => {
  if (req.headers["admin-password"] !== ADMIN_PASSWORD) {
    return res.status(401).json({
      success: false,
      message: "Wrong admin password"
    });
  }

  res.json({
    success: true,
    orders
  });
});

// ================= KEY GENERATOR =================

function generateKey(product) {

  // Product ke naam se safe prefix
  const prefix = product
    .replace(/[^a-zA-Z0-9]/g, "")
    .substring(0, 12)
    .toUpperCase();

  // Random part
  const random =
    Math.random().toString(36).substring(2, 8).toUpperCase();

  const randomNumber =
    Math.floor(1000 + Math.random() * 9000);

  return prefix + random + randomNumber;
}

// ================= ADMIN APPROVE =================

app.post("/api/admin/approve", (req, res) => {

  if (req.headers["admin-password"] !== ADMIN_PASSWORD) {
    return res.status(401).json({
      success: false,
      message: "Wrong admin password"
    });
  }

  const order = orders.find(
    o => o.orderId === req.body.orderId
  );

  if (!order) {
    return res.status(404).json({
      success: false,
      message: "Order not found"
    });
  }

  // Already approved hai to new key generate nahi hogi
  if (order.status === "approved" && order.key) {
    return res.json({
      success: true,
      message: "Order already approved",
      order
    });
  }

  // APPROVE hote hi automatic key
  order.status = "approved";
  order.key = generateKey(order.product);

  console.log(
    "ORDER APPROVED:",
    order.orderId,
    "KEY:",
    order.key
  );

  res.json({
    success: true,
    message: "Order approved and key generated",
    order
  });
});

// ================= ADMIN REJECT =================

app.post("/api/admin/reject", (req, res) => {

  if (req.headers["admin-password"] !== ADMIN_PASSWORD) {
    return res.status(401).json({
      success: false,
      message: "Wrong admin password"
    });
  }

  const order = orders.find(
    o => o.orderId === req.body.orderId
  );

  if (!order) {
    return res.status(404).json({
      success: false,
      message: "Order not found"
    });
  }

  order.status = "rejected";
  order.key = null;

  res.json({
    success: true,
    message: "Order rejected"
  });
});

// ================= FRONTEND =================

app.use((req, res) => {
  res.sendFile(
    path.join(__dirname, "public", "index.html")
  );
});

// ================= START =================

app.listen(PORT, () => {
  console.log(
    "BIRUXY DIGITAL SHOP running on port " + PORT
  );
});
