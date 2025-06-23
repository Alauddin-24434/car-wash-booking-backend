import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join((process.cwd(), ".env")) });

export default {
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,
  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
  jwt_access_secret: process.env.JWT_ACCESS_SECRET || '',
  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET || '',
  jwt_access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN,
  jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN,
  NODE_ENV: process.env.NODE_ENV,
  signature_key:process.env.AAMARPAY_SIGNATURE_KEY,
  stote_id:process.env.AAMARPAY_STORE_ID,
  payment_url:process.env.PAYMENT_URL,
  payment_verify_url:process.env.PAYMENT_VERIFY_URL,





};


