const mysql = require("mysql2/promise");
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

    const studentClass = req.body.class;
    const studentRoom = req.body.room;
    if (!studentClass || !studentRoom) {
      return empty(res);
    }

    const [students] = await dbCors.query(
      `SELECT id, tname, fname, lname, class, room, part
       FROM user
       WHERE auth_role = ? AND class = ? AND room = ?`,
      ["student", studentClass, studentRoom]
    );
    if (!students.length) {
      return success(res, []);
    }

    const studentsById = new Map(
      students.map((student) => [Number(student.id), student])
    );
    const placeholders = students.map(() => "?").join(",");
    const [reports] = await dbGrade.query(
      `SELECT *
       FROM report_course_modify
       WHERE student_id IN (${placeholders})
       ORDER BY confirm_date DESC`,
      [...studentsById.keys()]
    );

    const data = reports.map((report) => ({
      ...report,
      student: studentsById.get(Number(report.student_id)),
    }));

    if (data.length) {
      return success(res, data);
    }
    return empty(res);
  } catch (err) {
    console.log(err);
    return error(res, err);
  }
};
