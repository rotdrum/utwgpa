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
      return;
    }

    const { teacher_id, course_id, indicators, student_id, activity, student_name, student_class, student_room, old_grade, new_grade, status, confirmed_at } = req.body;

    const [rows] = await dbGrade.query(
      "SELECT * FROM new_groub_course WHERE teacher_id = ? AND course_id = ?",
      [teacher_id, course_id]
    );

    if (rows.length === 0) {
      return error(res, "Course does not exist for this user.");
    }

    const [result] = await dbGrade.query(
      "UPDATE new_groub_course SET `indicators` = ?, `student_id` = ?, `activity` = ?, `student_name` = ?, `student_class` = ?, `student_room` = ?, `old_grade` = ?, `new_grade` = ?, `status` = ?, `confirmed_at` = ? WHERE `teacher_id` = ? AND `course_id` = ?",
      [
        JSON.stringify(indicators), 
        student_id, 
        JSON.stringify(activity), 
        student_name, 
        student_class, 
        student_room, 
        old_grade, 
        new_grade, 
        status, 
        confirmed_at, 
        teacher_id, 
        course_id
      ]
    );

    if (result.affectedRows > 0) {
      return success(res, {
        course_id,
        indicators,
        student_id,
        activity,
        student_name,
        student_class,
        student_room,
        old_grade,
        new_grade,
        status,
        confirmed_at,
        teacher_id
      });
    } else {
      return error(res, "Failed to update course.");
    }
  } catch (err) {
    return error(res, err);
  }
};
