const mysql = require("mysql2/promise");
const root = require("../config-cors.js");
const rootGrade = require("../config-modify.js");
const rootCors = require("../config-cors.js");

const dbGrade = mysql.createPool(rootGrade());
const dbCors = mysql.createPool(rootCors());

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

    function genval(lng) {
      var sql = '';
      for (let i = 0; i < lng; i++) {
        if (i == (lng - 1)) sql += '?'
        else sql += '?,'
      }
      return sql
    }

    var user_id = req.body.user_id;
    if (user_id) {

      var [data1] = await dbGrade.query("select * from indicators_master where teacher_id = ?", [user_id])
      if (data1 && data1[0]) {
        return success(res, data1[0]);
      }
      else {
        return success(res, []);
      }


    }
    else {
      return success(res, []);
    }
  } catch (err) {
    console.log(err)
    return error(res, err);
  }
};
