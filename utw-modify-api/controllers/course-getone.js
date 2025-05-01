const mysql = require("mysql2/promise");
const root = require("../config-cors.js");
const rootGrade = require("../config-cors.js");

// const dbGrade = mysql.createPool(rootGrade());
const dbCoruse = mysql.createPool(rootGrade());

const success = require("../response/success.js");
const empty = require("../response/empty.js");
const error = require("../response/error.js");
const authenticate = require("../middlewares/authenticate.js");

module.exports = async function (req, res) {
  try {
    const authResult = await authenticate(req, res);
    if (authResult !== true) {
      return; // ไม่ผ่าน auth ก็จบ
    }

    var key_address = req.body.key_address;
    if(key_address) {
      const [data] = await dbCoruse.query(
        "SELECT * FROM settings WHERE key_address = ?", 
        [key_address]
      );
  
      if (data.length && data[0]) {
        return success(res, data[0]);
      } else {
        return empty(res);
      }
    }
    else {
      return empty(res);
    }
  } catch (err) {
    return error(res, err);
  }
};
