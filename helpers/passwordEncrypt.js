import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

const hashPassword = password => {
  return crypto
    .pbkdf2Sync(`${password}`, process.env.PRIVATE_KEY, 10000, 20, "SHA512")
    .toString("hex");
};

const comparePassword = (password, hash) => {
  return hashPassword(password) === hash;
};

export { hashPassword, comparePassword };
