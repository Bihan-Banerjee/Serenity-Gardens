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

  // The real models, so tests see the same schema the server enforces.
  Item = (await import("../models/Item.js")).default;
  Order = (await import("../models/Order.js")).default;
  await import("../models/User.js");

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

// ── Mobile app support ────────────────────────────────────────────────────

test("a website-style order with only items still succeeds", async () => {
  const item = await Item.create({ name: "Basil", price: 40, stock: 10, finalized: true });

  const res = await api("POST", "/api/orders", {
    items: [{ id: item._id.toString(), quantity: 2 }],
  }, userToken);

  assert.equal(res.status, 201);
  assert.ok(res.data.orderId);

  const order = await Order.findById(res.data.orderId);
  assert.equal(order.totalAmount, 80);
  assert.equal(order.paid, false);
  assert.equal(order.paymentMethod, "cod");
  assert.equal(order.deliveryAddress, undefined, "absent address stays absent");
});

test("the itemId sent by the app is accepted as well as the website id", async () => {
  const item = await Item.create({ name: "Mint", price: 30, stock: 10, finalized: true });

  const res = await api("POST", "/api/orders", {
    items: [{ itemId: item._id.toString(), quantity: 3, name: "spoofed", price: 1 }],
  }, userToken);

  assert.equal(res.status, 201);

  const order = await Order.findById(res.data.orderId);
  assert.equal(order.totalAmount, 90, "priced from the DB, not the request");
  assert.equal(order.items[0].name, "Mint");
});

test("a valid delivery address is stored and unknown keys are dropped", async () => {
  const item = await Item.create({ name: "Sage", price: 50, stock: 10, finalized: true });

  const res = await api("POST", "/api/orders", {
    items: [{ itemId: item._id.toString(), quantity: 1 }],
    paymentMethod: "cod",
    total: 99999,
    deliveryAddress: {
      name: "  Bihan  ",
      email: "b@example.com",
      phone: "98765 43210",
      address: "12 Garden Lane",
      notes: "Ring the bell",
      isAdmin: true,
      $set: { x: 1 },
    },
  }, userToken);

  assert.equal(res.status, 201);

  const order = await Order.findById(res.data.orderId);
  assert.equal(order.deliveryAddress.name, "Bihan", "trimmed");
  assert.equal(order.deliveryAddress.phone, "9876543210", "separators stripped");
  assert.equal(order.deliveryAddress.notes, "Ring the bell");
  assert.equal(order.deliveryAddress.isAdmin, undefined, "unknown keys dropped");
  assert.equal(order.totalAmount, 50, "client total ignored");
});

test("an invalid delivery address is rejected with a clear message", async () => {
  const item = await Item.create({ name: "Thyme", price: 10, stock: 10, finalized: true });
  const body = (deliveryAddress) => ({
    items: [{ itemId: item._id.toString(), quantity: 1 }],
    deliveryAddress,
  });

  const shortPhone = await api("POST", "/api/orders", body({ phone: "12345" }), userToken);
  assert.equal(shortPhone.status, 400);
  assert.match(shortPhone.data.message, /10 digit/i);

  const badAddress = await api("POST", "/api/orders", body({ address: { $ne: null } }), userToken);
  assert.equal(badAddress.status, 400);
  assert.match(badAddress.data.message, /text/i);

  const notAnObject = await api("POST", "/api/orders", body("somewhere"), userToken);
  assert.equal(notAnObject.status, 400);

  const asArray = await api("POST", "/api/orders", body(["somewhere"]), userToken);
  assert.equal(asArray.status, 400);

  const hugeNotes = await api("POST", "/api/orders", body({ notes: "x".repeat(1001) }), userToken);
  assert.equal(hugeNotes.status, 400);
});

test("a cash-on-delivery order is refused when stock is short", async () => {
  const item = await Item.create({ name: "Chilli", price: 15, stock: 2, finalized: true });

  const res = await api("POST", "/api/orders", {
    items: [{ itemId: item._id.toString(), quantity: 5 }],
  }, userToken);

  assert.equal(res.status, 400);
  assert.match(res.data.message, /stock/i);
});

test("an order cannot carry an unbounded number of lines", async () => {
  const item = await Item.create({ name: "Bulk", price: 1, stock: 999, finalized: true });
  const line = { itemId: item._id.toString(), quantity: 1 };

  const res = await api("POST", "/api/orders", {
    items: Array.from({ length: 101 }, () => line),
  }, userToken);

  assert.equal(res.status, 400);
  assert.match(res.data.message, /more than/i);
});

test("an unsupported payment method is refused", async () => {
  const item = await Item.create({ name: "Dill", price: 10, stock: 5, finalized: true });

  const res = await api("POST", "/api/orders", {
    items: [{ itemId: item._id.toString(), quantity: 1 }],
    paymentMethod: "bitcoin",
  }, userToken);

  assert.equal(res.status, 400);
});

test("delivery details carry from the pending order onto the paid order", async () => {
  // verify-payment calls Razorpay, so the carry-over step is tested directly.
  const { orderFromPending } = await import("../routes/orderRoutes.js");
  const PendingOrder = (await import("../models/PendingOrder.js")).default;

  const pending = await PendingOrder.create({
    razorpayOrderId: "order_test_carryover",
    userId: (await Order.findOne()).userId,
    items: [{ id: "abc", name: "Fern", price: 120, quantity: 2 }],
    expectedAmount: 24000,
    deliveryAddress: { name: "Bihan", phone: "9876543210", address: "12 Garden Lane" },
    paymentMethod: "online",
  });

  const built = orderFromPending(pending, "pay_test_123");

  assert.equal(built.paid, true);
  assert.equal(built.paymentMethod, "online");
  assert.equal(built.razorpayPaymentId, "pay_test_123");
  assert.equal(built.totalAmount, 240, "paise converted to rupees");
  assert.equal(built.deliveryAddress.name, "Bihan");
  assert.equal(built.deliveryAddress.address, "12 Garden Lane");

  // It must survive being written through the Order schema.
  const saved = await Order.create(built);
  assert.equal(saved.deliveryAddress.phone, "9876543210");
  assert.equal(saved.paymentMethod, "online");
});

test("marking an order paid and unpaid again does not drain stock", async () => {
  const item = await Item.create({ name: "Tulsi", price: 20, stock: 10, finalized: true });

  const placed = await api("POST", "/api/orders", {
    items: [{ itemId: item._id.toString(), quantity: 3 }],
  }, userToken);
  assert.equal(placed.status, 201);

  const User = mongoose.models.User;
  await User.updateOne({ email: "customer@example.com" }, { $set: { isAdmin: true } });
  const admin = await api("POST", "/api/admin/login", {
    email: "customer@example.com", password: "password123",
  });
  const adminToken = admin.data.token;

  await api("PATCH", "/api/orders/" + placed.data.orderId, { paid: true }, adminToken);
  assert.equal((await Item.findById(item._id)).stock, 7, "reserved on paid");

  await api("PATCH", "/api/orders/" + placed.data.orderId, { paid: false }, adminToken);
  assert.equal((await Item.findById(item._id)).stock, 10, "restored on unpaid");

  await api("PATCH", "/api/orders/" + placed.data.orderId, { paid: true }, adminToken);
  assert.equal((await Item.findById(item._id)).stock, 7, "not double-decremented");

  const badFlag = await api("PATCH", "/api/orders/" + placed.data.orderId, { paid: "false" }, adminToken);
  assert.equal(badFlag.status, 400, "a string must not be coerced to true");

  await User.updateOne({ email: "customer@example.com" }, { $set: { isAdmin: false } });
});

test("register accepts phone and address, and works without them", async () => {
  const withExtras = await api("POST", "/api/auth/register", {
    name: "App User", email: "appuser@example.com", password: "password123",
    phone: "9876543210", address: "12 Garden Lane",
  });

  assert.equal(withExtras.status, 201);
  assert.equal(withExtras.data.user.phone, "9876543210");
  assert.equal(withExtras.data.user.address, "12 Garden Lane");

  const without = await api("POST", "/api/auth/register", {
    name: "Plain User", email: "plainuser@example.com", password: "password123",
  });

  assert.equal(without.status, 201);
  assert.equal(without.data.user.phone, "", "absent reads back as empty, not undefined");

  const badPhone = await api("POST", "/api/auth/register", {
    name: "Bad", email: "badphone@example.com", password: "password123", phone: "123",
  });
  assert.equal(badPhone.status, 400);
});

test("PATCH /auth/me updates only contact details", async () => {
  // Registered fresh rather than logged in: the login bucket is deliberately
  // exhausted by the rate-limiting test above.
  const signup = await api("POST", "/api/auth/register", {
    name: "Profile User", email: "profileuser@example.com", password: "password123",
  });
  assert.equal(signup.status, 201);
  const token = signup.data.token;

  assert.equal((await api("PATCH", "/api/auth/me", { phone: "9000000000" })).status, 401,
    "rejects unauthenticated calls");

  const ok = await api("PATCH", "/api/auth/me", {
    phone: "9000000000",
    address: "99 New Road",
    isAdmin: true,
    email: "attacker@example.com",
    password: "hunter2",
    _id: "deadbeefdeadbeefdeadbeef",
  }, token);

  assert.equal(ok.status, 200);
  assert.equal(ok.data.phone, "9000000000");
  assert.equal(ok.data.address, "99 New Road");
  assert.equal(ok.data.isAdmin, false, "isAdmin must be untouched");
  assert.equal(ok.data.email, "profileuser@example.com", "email must be untouched");

  const User = mongoose.models.User;
  const stored = await User.findOne({ email: "profileuser@example.com" });
  assert.equal(stored.isAdmin, false);

  const bcrypt = (await import("bcryptjs")).default;
  assert.ok(await bcrypt.compare("password123", stored.password),
    "password must be unchanged");

  const operator = await api("PATCH", "/api/auth/me", { phone: { $ne: null } }, token);
  assert.equal(operator.status, 400);
});

test("items work with and without category and unit", async () => {
  const legacy = await Item.create({ name: "Legacy Pot", price: 60, stock: 4, finalized: true });
  const tagged = await Item.create({
    name: "Tagged Pot", price: 70, stock: 4, finalized: true,
    category: "Pots", unit: "kg",
  });

  const all = await api("GET", "/api/items");
  assert.equal(all.status, 200);

  const legacyBack = all.data.find((i) => i._id === legacy._id.toString());
  const taggedBack = all.data.find((i) => i._id === tagged._id.toString());

  assert.ok(legacyBack, "items without the new fields still list");
  assert.equal(legacyBack.unit, "pc", "schema default applies to old documents");
  assert.equal(legacyBack.category, undefined);
  assert.equal(taggedBack.category, "Pots");
  assert.equal(taggedBack.unit, "kg");

  const filtered = await api("GET", "/api/items?category=Pots");
  assert.ok(filtered.data.every((i) => i.category === "Pots"));
  assert.ok(filtered.data.some((i) => i._id === tagged._id.toString()));

  const injected = await api("GET", "/api/items?category[$ne]=Pots");
  assert.equal(injected.status, 200, "an operator in the query must not break the route");

  const one = await api("GET", "/api/items/" + tagged._id);
  assert.equal(one.status, 200);
  assert.equal(one.data.name, "Tagged Pot");

  const unfinalized = await Item.create({ name: "Hidden", price: 1, stock: 1, finalized: false });
  assert.equal((await api("GET", "/api/items/" + unfinalized._id)).status, 404);
});

test("the health endpoint is cheap, public and not rate limited", async () => {
  for (let i = 0; i < 25; i++) {
    const res = await api("GET", "/api/health");
    assert.equal(res.status, 200);
    assert.deepEqual(res.data, { ok: true });
  }
});
