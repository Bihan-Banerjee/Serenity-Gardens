import { MongoMemoryServer } from "mongodb-memory-server";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";
import assert from "node:assert/strict";
import test, { after, before } from "node:test";

const serverDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PORT = 5099;
const BASE = `http://127.0.0.1:${PORT}`;

let mongo;
let child;
let mongoose;
let Item;
let Order;
let userToken;

const api = async (method, url, body, token) => {
  const res = await fetch(`${BASE}${url}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  let data = null;
  try {
    data = await res.json();
  } catch {
    // some responses have no body
  }
  return { status: res.status, data, headers: res.headers };
};

before(async () => {
  mongo = await MongoMemoryServer.create();
  const uri = mongo.getUri();

  child = spawn("node", ["server.js"], {
    cwd: serverDir,
    stdio: ["ignore", "pipe", "pipe"],
    env: {
      ...process.env,
      MONGO_URI: uri,
      PORT: String(PORT),
      JWT_SECRET: "test-secret",
      RAZORPAY_KEY_ID: "rzp_test_dummy",
      RAZORPAY_KEY_SECRET: "dummysecret",
    },
  });

  let booted = false;
  for (let i = 0; i < 160 && !booted; i++) {
    try {
      const res = await fetch(`${BASE}/health`);
      booted = res.ok;
    } catch {
      await new Promise((r) => setTimeout(r, 500));
    }
  }
  assert.ok(booted, "server failed to start");

  mongoose = (await import("mongoose")).default;
  await mongoose.connect(uri);

  Item = mongoose.model(
    "Item",
    new mongoose.Schema({
      name: String,
      price: Number,
      description: String,
      image: String,
      stock: Number,
      finalized: Boolean,
    })
  );

  Order = mongoose.model(
    "Order",
    new mongoose.Schema({
      userId: mongoose.Schema.Types.ObjectId,
      items: Array,
      totalAmount: Number,
      paid: Boolean,
      razorpayPaymentId: String,
      createdAt: Date,
    })
  );

  const reg = await api("POST", "/api/auth/register", {
    name: "Customer",
    email: "customer@example.com",
    password: "password123",
  });
  assert.equal(reg.status, 201);
  userToken = reg.data.token;
});

after(async () => {
  if (mongoose) await mongoose.disconnect();
  if (child) child.kill();
  if (mongo) await mongo.stop();
});

test("security headers are set and the framework is not advertised", async () => {
  const res = await api("GET", "/health");
  assert.equal(res.headers.get("x-content-type-options"), "nosniff");
  assert.equal(res.headers.get("x-powered-by"), null);
});

test("registration rejects weak or malformed input", async () => {
  const shortPassword = await api("POST", "/api/auth/register", {
    name: "A", email: "a@b.com", password: "short",
  });
  assert.equal(shortPassword.status, 400);

  const badEmail = await api("POST", "/api/auth/register", {
    name: "A", email: "notanemail", password: "longenough1",
  });
  assert.equal(badEmail.status, 400);
});

test("login rejects a non-string email so operators cannot be injected", async () => {
  const res = await api("POST", "/api/auth/login", {
    email: { $ne: null },
    password: "anything",
  });
  assert.equal(res.status, 400);
});

test("login succeeds and wrong passwords are rejected", async () => {
  const ok = await api("POST", "/api/auth/login", {
    email: "customer@example.com", password: "password123",
  });
  assert.equal(ok.status, 200);
  assert.ok(ok.data.token);

  const bad = await api("POST", "/api/auth/login", {
    email: "customer@example.com", password: "wrong",
  });
  assert.equal(bad.status, 400);
});

test("a customer cannot read every order", async () => {
  assert.equal((await api("GET", "/api/orders")).status, 401);
  assert.equal((await api("GET", "/api/orders", undefined, userToken)).status, 403);
  assert.equal((await api("GET", "/api/orders/my", undefined, userToken)).status, 200);
});

test("a customer cannot reach admin item routes", async () => {
  assert.equal((await api("GET", "/api/items/all", undefined, userToken)).status, 403);
});

test("a customer can place a cash-on-delivery order", async () => {
  const item = await Item.create({ name: "Rose", price: 100, stock: 5, finalized: true });

  const res = await api("POST", "/api/orders", {
    items: [{ id: item._id.toString(), quantity: 2 }],
  }, userToken);

  assert.equal(res.status, 201);

  const order = await Order.findById(res.data.orderId);
  assert.equal(order.totalAmount, 200);
  assert.equal(order.paid, false);
});

test("prices and names come from the database, not the request", async () => {
  const item = await Item.create({ name: "Tulip", price: 250, stock: 5, finalized: true });

  const res = await api("POST", "/api/orders", {
    items: [{ id: item._id.toString(), quantity: 2, price: 1, name: "Hacked" }],
  }, userToken);

  assert.equal(res.status, 201);

  const order = await Order.findById(res.data.orderId);
  assert.equal(order.totalAmount, 500, "client price must be ignored");
  assert.equal(order.items[0].name, "Tulip", "client name must be ignored");
});

test("quantities must be positive whole numbers and ids must be real", async () => {
  const item = await Item.create({ name: "Lily", price: 10, stock: 5, finalized: true });
  const id = item._id.toString();

  assert.equal((await api("POST", "/api/orders", { items: [{ id, quantity: -5 }] }, userToken)).status, 400);
  assert.equal((await api("POST", "/api/orders", { items: [{ id, quantity: 1.5 }] }, userToken)).status, 400);
  assert.equal((await api("POST", "/api/orders", { items: [{ id, quantity: 0 }] }, userToken)).status, 400);
  assert.equal((await api("POST", "/api/orders", { items: [] }, userToken)).status, 400);
  assert.equal((await api("POST", "/api/orders", { items: [{ id: "nope", quantity: 1 }] }, userToken)).status, 400);
});

test("stock is checked before a payment is started", async () => {
  const item = await Item.create({ name: "Orchid", price: 50, stock: 3, finalized: true });

  const res = await api("POST", "/api/orders/create-razorpay-order", {
    items: [{ id: item._id.toString(), quantity: 99 }],
  }, userToken);

  assert.equal(res.status, 400);
  assert.match(res.data.message, /stock/i);
});

test("payment verification requires every field and a valid signature", async () => {
  assert.equal((await api("POST", "/api/orders/verify-payment", { razorpay_order_id: "x" }, userToken)).status, 400);

  const badSignature = await api("POST", "/api/orders/verify-payment", {
    razorpay_order_id: "order_x",
    razorpay_payment_id: "pay_x",
    razorpay_signature: "deadbeef",
  }, userToken);

  assert.equal(badSignature.status, 400);
  assert.match(badSignature.data.message, /signature/i);
});

test("reviews can be submitted, read back and are length bounded", async () => {
  const before = await api("GET", "/api/reviews");
  assert.equal(before.status, 200);
  assert.ok(Array.isArray(before.data));

  const posted = await api("POST", "/api/reviews/submit", {
    name: "Customer", review: "Lovely gardens",
  }, userToken);
  assert.equal(posted.status, 201);

  const after_ = await api("GET", "/api/reviews");
  assert.equal(after_.data.length, before.data.length + 1);

  const tooLong = await api("POST", "/api/reviews/submit", {
    name: "C", review: "x".repeat(5000),
  }, userToken);
  assert.equal(tooLong.status, 400);
});

test("unknown routes return JSON rather than an HTML error page", async () => {
  const res = await api("GET", "/api/does-not-exist");
  assert.equal(res.status, 404);
  assert.equal(res.data.message, "Not found");
});

test("repeated failed logins are rate limited", async () => {
  let limited = false;

  for (let i = 0; i < 40 && !limited; i++) {
    const res = await api("POST", "/api/auth/login", {
      email: "customer@example.com", password: "wrong",
    });
    limited = res.status === 429;
  }

  assert.ok(limited, "expected a 429 after repeated failures");
  assert.equal((await api("GET", "/health")).status, 200, "health must stay reachable");
});

test("the catalogue is readable without logging in", async () => {
  await Item.create({ name: "Public Fern", price: 20, stock: 2, finalized: true });

  const res = await api("GET", "/api/items");

  assert.equal(res.status, 200);
  assert.ok(Array.isArray(res.data));
  assert.ok(res.data.some((i) => i.name === "Public Fern"));
});

test("the current user can be fetched, so a reload keeps the session", async () => {
  assert.equal((await api("GET", "/api/auth/me")).status, 401);

  const res = await api("GET", "/api/auth/me", undefined, userToken);

  assert.equal(res.status, 200);
  assert.equal(res.data.email, "customer@example.com");
  assert.equal(res.data.isAdmin, false);
  assert.ok(res.data._id, "the client reads _id");
  assert.equal(res.data.password, undefined, "the hash must never be returned");
});

test("admin login refuses a non-admin and accepts an admin", async () => {
  const User = mongoose.models.User || mongoose.model(
    "User",
    new mongoose.Schema({ name: String, email: String, password: String, isAdmin: Boolean })
  );

  const denied = await api("POST", "/api/admin/login", {
    email: "customer@example.com",
    password: "password123",
  });
  assert.equal(denied.status, 403, "a signed-up customer is not an admin");

  await User.updateOne({ email: "customer@example.com" }, { $set: { isAdmin: true } });

  const allowed = await api("POST", "/api/admin/login", {
    email: "customer@example.com",
    password: "password123",
  });
  assert.equal(allowed.status, 200);
  assert.equal(allowed.data.user.isAdmin, true);

  const adminToken = allowed.data.token;
  assert.equal((await api("GET", "/api/orders", undefined, adminToken)).status, 200);

  await User.updateOne({ email: "customer@example.com" }, { $set: { isAdmin: false } });
});

test("admin login is case-insensitive on the stored email", async () => {
  const res = await api("POST", "/api/admin/login", {
    email: "CUSTOMER@example.com",
    password: "password123",
  });
  assert.notEqual(res.status, 500);
  assert.ok([400, 403].includes(res.status), "resolves the user, then rejects on role");
});

test("reviews are served from both paths the clients use", async () => {
  const root = await api("GET", "/api/reviews");
  const all = await api("GET", "/api/reviews/all");

  assert.equal(root.status, 200);
  assert.equal(all.status, 200);
  assert.equal(all.data.length, root.data.length);
});

test("a review keeps its rating and rejects an out-of-range one", async () => {
  const ok = await api("POST", "/api/reviews/submit", {
    name: "Rater", review: "Four stars", rating: 4,
  }, userToken);
  assert.equal(ok.status, 201);

  const list = await api("GET", "/api/reviews/all");
  assert.equal(list.data.find((r) => r.name === "Rater").rating, 4);

  const bad = await api("POST", "/api/reviews/submit", {
    name: "Rater", review: "Nope", rating: 9,
  }, userToken);
  assert.equal(bad.status, 400);
});
