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
    const authResult = await authenticate(req, res);
    if (authResult !== true) {
      return; // ไม่ผ่าน auth ก็จบ
    }

    var user_id = req.body.user_id;
    var subject_id = req.body.subject_id;
    var indicators = req.body.indicators;
    var subject_title = req.body.subject_title;
    var subject_code = req.body.subject_code;
    var subject_class = req.body.subject_class;

    if (subject_id) {
      const [data] = await dbCors.query(`SELECT 
            subject.id AS id, 
            subject.name AS name, 
            subject.subject_code AS subject_code, 
            subject.class AS class, 
            subject.room AS room, 
            subject.department_id AS department_id,
            subject.created_at AS created_at,
            subject.updated_at AS updated_at
            FROM subject 
            WHERE subject.id = ?`,
        [subject_id]
      );
      if (data.length && data[0]) {
        var department_id = data[0].department_id;

        await dbGrade.query(`INSERT INTO course (subject_id, department_id, subject_title,  subject_code,  subject_class, user_id, indicators) 
          VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [subject_id, department_id, subject_title, subject_code, subject_class, user_id, indicators]);
        return success(res, [{
          "subject_id": subject_id,
          "department_id": department_id,
          "subject_title": subject_title,
          "subject_code": subject_code,
          "subject_class": subject_class,
          "user_id": user_id,
          "indicators": indicators,
        }]);
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
