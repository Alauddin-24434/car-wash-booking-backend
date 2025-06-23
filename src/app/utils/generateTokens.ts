import jwt from "jsonwebtoken";
import config from "../config";

export const createAccessToken = (payload: object) => {
 return jwt.sign(payload, config.jwt_access_secret, { expiresIn: "15m" });
};

export const createRefreshToken = (payload: object) => {
 return jwt.sign(payload, config.jwt_refresh_secret, { expiresIn: "7d" });
};