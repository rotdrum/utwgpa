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

    var subject_id = req.body.subject_id;
    var teacher_id = req.body.teacher_id;
    var term = req.body.term;
    var year = req.body.year;
    var round = req.body.round;

    if (subject_id && teacher_id) {
      var [data1] = await dbGrade.query("select rp.*, rs.* "+
            "from `repeat` rp "+
            "left join repeat_student_score rs on rp.student_id = rs.student_id "+
            "where rp.subject_id = ? and rp.status = 'success' and rp.teacher_id = ? and rp.stamp_term_at = ? and rp.stamp_year_at = ? and rp.stamp_round_at =? ; " ,
        [subject_id, teacher_id, term, year, round]
      );

      return success(res, data1);
    }
    else {
      return empty(res);
    }
  } catch (err) {
    console.log(err)
    return error(res, err);
  }
};
