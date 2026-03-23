import bcrypt from "bcrypt";

const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || "http://localhost:8080";

export function setCorsHeaders(res) {
  res.setHeader("Access-Control-Allow-Origin", ALLOWED_ORIGIN);
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

export function handlePreflight(req, res) {
  if (req.method === "OPTIONS") {
    setCorsHeaders(res);
    return res.status(200).end();
  }
  return null;
}

export function parseBody(req) {
  return typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};
}

export function hashPassword(password) {
  return bcrypt.hash(password, 10);
}

export function comparePassword(password, hash) {
  return bcrypt.compare(password, hash);
}

export function userPayload(row) {
  return {
    user_id: row.user_id,
    first_name: row.first_name,
    last_name: row.last_name,
    email: row.email,
    street_address: row.street_address,
    city: row.city,
    state: row.state,
    zip_code: row.zip_code,
    pickup_or_dropoff: row.pickup_or_dropoff,
  };
}
