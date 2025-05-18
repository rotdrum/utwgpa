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
const { checkTokenAdmin, getDateNow, MD5, genval } = require("../middlewares/bearbug.js");

module.exports = async function (req, res) {
  try {
    const authResult = await authenticate(req, res);
    if (authResult !== true) {
      return; // ไม่ผ่าน auth ก็จบ
    }



    if (true) {
      var [data1] = await dbGrade.query(
        "select rp.subject_id, rp.teacher_id, rp.subject_title, rp.subject_code, rp.stamp_round_at, rp.stamp_term_at, rp.stamp_year_at, rp.subject_class " +
        "from `repeat` rp " +
        "left join repeat_student_score rs on rp.student_id = rs.student_id " +
        "where  rp.status = 'success' " +
        "group by rp.subject_id, rp.teacher_id, rp.subject_title, rp.subject_code, rp.stamp_round_at, rp.stamp_term_at, rp.stamp_year_at, rp.subject_class  ; "
      );

      var [teacher] = await dbCors.query("select id,tname,fname,lname From user where auth_role = 'teacher'")
      if (teacher && teacher[0]) {
        var teacherMap = new Map();
        for (let i = 0; i < teacher.length; i++) {
          const element = teacher[i];
          teacherMap.set(element.id, element)
        }
      }

      if(data1 && data1[0]) {
        for (let i = 0; i < data1.length; i++) {
          const element = data1[i];
          element.teacher = teacherMap.get(element.teacher_id)
        }
      }

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
