const mysql = require("mysql2/promise");
const root = require("../config-cors.js");
const rootGrade = require("../config-modify.js");

const dbGrade = mysql.createPool(rootGrade());

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
    
    var user_id = req.body.user_id;
    if(user_id) {
      const [data] = await dbGrade.query(
        `SELECT * FROM course WHERE user_id = ? `, 
        [user_id]
      );
  
      if (data.length && data[0]) {
        const [data1] = await dbGrade.query(
          ` SELECT *
            FROM groub_course WHERE course_id = ?  `, 
          [user_id]
        );
        return success(res, {
          data: data
        });
      } else {
        return empty(res);
      }
    }
    else {
      return error(res, err);
    }
  } catch (err) {
    return error(res, err);
  }
};
