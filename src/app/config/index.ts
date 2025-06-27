import dotenv from "dotenv";
import path from "path";

// Load environment variables from .env file
dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
  // ---------- Server Config ----------
  port: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV,

  // ---------- Database ----------
  database_url: process.env.DATABASE_URL,

  // ---------- Security ----------
  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,

  // ---------- JWT ----------
  jwt_access_secret: process.env.JWT_ACCESS_SECRET || '',
  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET || '',
  jwt_access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN,
  jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN,

  // ---------- AamarPay Payment Gateway ----------
  aamarpay_stote_id: process.env.AAMARPAY_STORE_ID,
  aamarpay_signature_key: process.env.AAMARPAY_SIGNATURE_KEY,
  aamarpay_sanbox_mode: process.env.AAMARPAY_SANDBOX_MODE, // true for sandbox, false for live
  aamarpay_sucess_url: process.env.AAMARPAY_SUCCESS_URL,
  aamarpay_fail_url: process.env.AAMARPAY_FAIL_URL,
  aamarpay_cancel_url: process.env.AAMARPAY_CANCEL_URL,
};
