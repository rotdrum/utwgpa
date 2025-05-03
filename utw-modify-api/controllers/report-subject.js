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
    // const authResult = await authenticate(req, res);
    // if (authResult !== true) {
    //   return; // ไม่ผ่าน auth ก็จบ
    // }

    function genval(lng) {
      var sql = '';
      for (let i = 0; i < lng; i++) {
        if (i == (lng - 1)) sql += '?'
        else sql += '?,'
      }
      return sql
    }



    var subject_id = req.body.subject_id;

    var [subject] = await dbCors.query(`
      SELECT 
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
    if (subject && subject[0]) {
      var data_item = [];
      var [subject_id] = await dbGrade.query(`SELECT * FROM course WHERE subject_id = ? AND user_id = ?`,
        [subject[0].id, req.body.user_id]
      );
      var course = [];
      var course_id = 0;
      var teacher_id = null;
      if (subject_id && subject_id[0]) {

        course = subject_id[0];
        course_id = subject_id[0].id;
        teacher_id = subject_id[0].user_id;
      }

      console.log("course_id",course_id)

      var data_groub_course_item = [];

      var [groub_course] = await dbGrade.query(`
        SELECT * FROM groub_course 
        WHERE course_id = ? AND JSON_UNQUOTE(JSON_EXTRACT(activity, '$.confirm_date')) IS NOT NULL`,
        [course_id]
      );
      console.log("groub_course",groub_course)
      if (groub_course && groub_course[0]) {
        for (let i = 0; i < groub_course.length; i++) {
          const element = groub_course[i];
          data_groub_course_item.push({
            "id": element.id,
            "title": element.title,
            "course_id": element.course_id,
            "indicators": element.indicators,
            "user_ids": element.user_ids,
            "activity": element.activity,
            "created_at": element.created_at,
            "updated_at": element.updated_at,
          })
        }
      }

      var [groub_course2] = await dbGrade.query(`
        SELECT * FROM groub_course 
        WHERE course_id = ? AND JSON_UNQUOTE(JSON_EXTRACT(activity, '$.confirm_date')) IS NULL`,
        [course_id]
      );
      if (groub_course2 && groub_course2[0]) {
        for (let x = 0; x < groub_course2.length; x++) {
          const element = groub_course2[x];
          data_groub_course_item.push({
            "id": element.id,
            "title": element.title,
            "course_id": element.course_id,
            "indicators": element.indicators,
            "user_ids": element.user_ids,
            "activity": element.activity,
            "created_at": element.created_at,
            "updated_at": element.updated_at,
          })
        }
      }

      var [user] = await dbCors.query(`SELECT * FROM user WHERE id = ?`,
        [teacher_id]
      );
      console.log("data_groub_course_item",data_groub_course_item)
      if (user && user[0]) {
        var data_row = [];
        for (let x = 0; x < user.length; x++) {
          const element = user[x];
          data_row.push({
            "id": subject_id[0].id,
            "subject_code": subject_id[0].subject_code,
            "course": course,
            "teacher_id": teacher_id,
            "teacher": user[0],
            "groub_course": data_groub_course_item,
            "name": subject_id[0].name,
            "class": subject_id[0].class,
            "room": subject_id[0].room,
            "is_active": subject_id[0].is_active,
            "department_id": subject_id[0].department_id,
            "department_title": subject_id[0].department_title,
            "created_at": subject_id[0].created_at,
            "updated_at": subject_id[0].updated_at,
          })
        }
      }
      return success(res, data_row[0]);
    }
    else {
      return empty(res);
    }
  } catch (err) {
    console.log(err)
    return error(res, err);
  }
};
