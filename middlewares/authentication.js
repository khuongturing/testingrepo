import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

/**
 *
 *
 * @class Authentication
 */
class Authentication {
  /**
   *
   *
   * @static
   * @param {*} req
   * @param {*} res
   * @param {*} next
   * @returns
   * @memberof Authentication
   */
  static verifyUser(req, res, next) {
    if (!req.headers["authorization"]) {
      return res.status(403).json({
        code: "AUT_01",
        status: 403,
        message: "Authorization code is empty"
      });
    }
    const token = req.headers["authorization"].split(" ")[1];
    jwt.verify(token, process.env.SECRET_KEY, (err, decode) => {
      if (err) {
        return res.status(500).json({
          code: "AUT_02",
          status: 403,
          message: " Access Unauthorized"
        });
      }
      req.email = decode.email;
      next();
    });
  }
}

export default Authentication;
