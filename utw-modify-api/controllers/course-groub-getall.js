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
        `SELECT groub_course.id, groub_course.course_id, course.user_id, course.subject_id, course.subject_title, course.subject_code, course.subject_class,
                groub_course.title, groub_course.indicators, groub_course.user_ids, groub_course.activity, groub_course.created_at, groub_course.updated_at 
                FROM groub_course INNER JOIN course ON groub_course.course_id = course.id  WHERE course.user_id = ?  `, 
        [user_id]
      );
  
      if (data.length && data[0]) {
        return success(res, data);
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
