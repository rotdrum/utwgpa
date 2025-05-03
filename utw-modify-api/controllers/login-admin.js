const mysql = require("mysql2/promise");
const root = require("../config-cors.js");
const rootCors = require("../config-cors.js");
const rootGrade = require("../config-modify.js");

const dbCors = mysql.createPool(rootCors());
const dbGrade = mysql.createPool(rootGrade());

const success = require("../response/success.js");
const empty = require("../response/empty.js");
const error = require("../response/error.js");
const authenticate = require("../middlewares/authenticate.js");

module.exports = async function (req, res) {
  try {
    // const authResult = await authenticate(req, res);
    // if (authResult !== true) {
    //   return; // ไม่ผ่าน auth ก็จบ
    // }

    var username = req.body.username;
    var password = req.body.password;

    if (username && password) {

      if (password == "Password@1234" &&
        (username == "education@utw.ac.th" || username == "education")
      ) {
        var key_address = "admin";
        var data1 = await dbCors.query(`SELECT * FROM token_basic WHERE key_address = ? `,
          [key_address]
        );
        if (data1 && data1[0]) {
          return success(res, data1);
        }
        else {
          return empty(res);
        }
      }
      else {
        return empty(res);
      }
    }
    else {
      return empty(res);
    }
  } catch (err) {
    console.log(err)
    return error(res, err);
  }
};
