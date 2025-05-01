const mysql = require("mysql2/promise"); 
const root = require("../config-cors.js");

let db = mysql.createPool(root());
const authorization = require("../response/authorization.js");

module.exports = async function authenticate(req, res) {
  if (!req.headers['authorization']) {
    return authorization(res, 'Token Not Found');
  }

  const bearerToken = req.headers['authorization'].split(' ')[1];

  try {
    const [tokens] = await db.query(
      "SELECT * FROM token_basic WHERE token = ?",
      [bearerToken]
    );

    if (!tokens.length) {
      return error(res, 'Token Invalid');
    }

    return true; // สำเร็จ
  } catch (err) {
    return authorization(res, err);
  }
};
