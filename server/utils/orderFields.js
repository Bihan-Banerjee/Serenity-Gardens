// Shared validation for fields the mobile app sends on orders. Everything here
// is optional: the website posts only { items } and must keep working unchanged.

export const MAX_ITEMS_PER_ORDER = 100;

const LIMITS = {
  name: 100,
  email: 200,
  phone: 20,
  address: 500,
  notes: 1000,
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// The app offers "cod" and "razorpay"; the brief calls the online one "online".
// Both are accepted and stored as the canonical "online".
const ONLINE_METHODS = new Set(["online", "razorpay"]);
const COD_METHODS = new Set(["cod", "cash", "cashondelivery"]);

export const isOnlinePaymentMethod = (value) =>
  typeof value === "string" && ONLINE_METHODS.has(value.trim().toLowerCase());

export const normalisePaymentMethod = (value) =>
  isOnlinePaymentMethod(value) ? "online" : "cod";

export const isRecognisedPaymentMethod = (value) => {
  if (value === undefined || value === null || value === "") return true;
  if (typeof value !== "string") return false;
  const v = value.trim().toLowerCase();
  return ONLINE_METHODS.has(v) || COD_METHODS.has(v);
};

const isPlainObject = (value) =>
  typeof value === "object" && value !== null && !Array.isArray(value);

/**
 * Validates and sanitises a delivery address.
 * Returns { ok: true, value } where value is a clean object or undefined,
 * or { ok: false, message } describing the first problem found.
 * Unknown keys are dropped because the result is rebuilt field by field.
 */
export const sanitiseDeliveryAddress = (input) => {
  if (input === undefined || input === null) {
    return { ok: true, value: undefined };
  }

  if (!isPlainObject(input)) {
    return { ok: false, message: "deliveryAddress must be an object" };
  }

  const clean = {};

  for (const field of ["name", "email", "address", "notes"]) {
    const raw = input[field];
    if (raw === undefined || raw === null || raw === "") continue;

    if (typeof raw !== "string") {
      return { ok: false, message: `deliveryAddress.${field} must be text` };
    }

    const trimmed = raw.trim();
    if (!trimmed) continue;

    if (trimmed.length > LIMITS[field]) {
      return {
        ok: false,
        message: `deliveryAddress.${field} must be ${LIMITS[field]} characters or fewer`,
      };
    }

    if (field === "email" && !EMAIL_PATTERN.test(trimmed)) {
      return { ok: false, message: "deliveryAddress.email must be a valid email address" };
    }

    clean[field] = trimmed;
  }

  const rawPhone = input.phone;
  if (rawPhone !== undefined && rawPhone !== null && rawPhone !== "") {
    if (typeof rawPhone !== "string" && typeof rawPhone !== "number") {
      return { ok: false, message: "deliveryAddress.phone must be text" };
    }

    const phone = String(rawPhone).trim();

    if (phone.length > LIMITS.phone) {
      return { ok: false, message: "deliveryAddress.phone must be a 10 digit number" };
    }

    // Tolerate the separators people type, then require exactly 10 digits.
    const digits = phone.replace(/[\s()+-]/g, "");

    if (!/^\d{10}$/.test(digits)) {
      return { ok: false, message: "deliveryAddress.phone must be a 10 digit number" };
    }

    clean.phone = digits;
  }

  return { ok: true, value: Object.keys(clean).length > 0 ? clean : undefined };
};

/** Optional single free-text profile/user field, trimmed and length capped. */
export const sanitiseOptionalText = (input, field, maxLength) => {
  if (input === undefined || input === null || input === "") {
    return { ok: true, value: undefined };
  }

  if (typeof input !== "string") {
    return { ok: false, message: `${field} must be text` };
  }

  const trimmed = input.trim();
  if (!trimmed) return { ok: true, value: "" };

  if (trimmed.length > maxLength) {
    return { ok: false, message: `${field} must be ${maxLength} characters or fewer` };
  }

  return { ok: true, value: trimmed };
};

export const sanitisePhone = (input) => {
  if (input === undefined || input === null || input === "") {
    return { ok: true, value: undefined };
  }

  if (typeof input !== "string" && typeof input !== "number") {
    return { ok: false, message: "phone must be text" };
  }

  const phone = String(input).trim();
  if (!phone) return { ok: true, value: "" };

  if (phone.length > LIMITS.phone) {
    return { ok: false, message: "phone must be a 10 digit number" };
  }

  const digits = phone.replace(/[\s()+-]/g, "");

  if (!/^\d{10}$/.test(digits)) {
    return { ok: false, message: "phone must be a 10 digit number" };
  }

  return { ok: true, value: digits };
};

export const ADDRESS_MAX_LENGTH = LIMITS.address;
