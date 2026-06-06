const mysql = require("mysql2/promise");
const rootCors = require("../config-cors.js");
const rootGrade = require("../config-modify.js");

const dbCors = mysql.createPool(rootCors());
const dbGrade = mysql.createPool(rootGrade());

const success = require("../response/success.js");
const empty = require("../response/empty.js");
const error = require("../response/error.js");
const authenticate = require("../middlewares/authenticate.js");
const { buildCurrentActivities } = require("../services/follow-class.js");

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
    const studentsById = new Map(
      students.map((student) => [Number(student.id), student])
    );
    const studentIds = [...studentsById.keys()];
    if (studentIds.length === 0) {
      return success(res, []);
    }

    const [courses] = await dbGrade.query(`SELECT groub_course.id, groub_course.course_id, course.user_id, course.subject_id, course.subject_title, course.subject_code, course.subject_class,
                groub_course.title, groub_course.indicators, groub_course.user_ids, groub_course.activity, groub_course.created_at, groub_course.updated_at 
                FROM groub_course INNER JOIN course ON groub_course.course_id = course.id
                WHERE JSON_OVERLAPS(groub_course.user_ids, CAST(? AS JSON))`,
      [JSON.stringify(studentIds)]
    );
    if (courses && courses[0]) {
      const data_item = [];
      for (const element of courses) {
        const activities = buildCurrentActivities(
          element.activity,
          studentsById
        );

        if (activities.length > 0) {
          data_item.push({
            "id": element.id,
            "course_id": element.course_id,
            "user_id": element.user_id,
            "subject_id": element.subject_id,
            "subject_title": element.subject_title,
            "subject_class": element.subject_class,
            "subject_code": element.subject_code,
            "title": element.title,
            "indicators": element.indicators,
            "user_ids": element.user_ids,
            "activity": JSON.stringify(activities),
            "created_at": element.created_at,
            "updated_at": element.updated_at,
          });
        }
      }

      return success(res, data_item);
    }
    else {
      return empty(res);
    }
  } catch (err) {
    console.log(err);
    return error(res, err);
  }
};
