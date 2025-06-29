import dotenv from "dotenv";
import path from "path";

// Load environment variables from .env file
dotenv.config({ path: path.join(process.cwd(), ".env") });

const isDev = process.env.NODE_ENV === "development";

const backend_url = isDev
  ? process.env.BACKEND_DEVELOPMENT_URL
  : process.env.BACKEND_PRODUCTION_URL;

const config = {
  // ---------- Environment ----------
  port: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || "development",

  // ---------- Database ----------
  database_url: process.env.DATABASE_URL || "",

  // ---------- Security ----------
  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS || "10",

  // ---------- JWT ----------
  jwt_access_secret: process.env.JWT_ACCESS_SECRET || "",
  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET || "",
  jwt_access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN || "1h",
  jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN || "7d",

  // ---------- AamarPay Payment ----------
  aamarpay: {
    store_id: process.env.AAMARPAY_STORE_ID,
    signature_key: process.env.AAMARPAY_SIGNATURE_KEY,
    sandbox_mode: process.env.AAMARPAY_SANDBOX_MODE === "true",
    verify_url: process.env.AAMARPAY_VERIFY_URL,

    success_path: process.env.AAMARPAY_SUCCESS_PATH || "/payments/success",
    fail_path: process.env.AAMARPAY_FAIL_PATH || "/payments/fail",
    cancel_path: process.env.AAMARPAY_CANCEL_PATH || "/payments/cancel",

    get post_url() {
      return this.sandbox_mode
        ? "https://sandbox.aamarpay.com/jsonpost.php"
        : "https://secure.aamarpay.com/jsonpost.php";
    },

    get success_url() {
      return `${backend_url}${this.success_path}`;
    },

    get fail_url() {
      return `${backend_url}${this.fail_path}`;
    },

    get cancel_url() {
      return `${backend_url}${this.cancel_path}`;
    },
  },

  // ---------- Backend URL ----------
  backend_url,
};

export default config;
