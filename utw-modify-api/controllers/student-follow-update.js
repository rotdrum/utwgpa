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


    var id = req.body.id;
    var student_id = req.body.student_id;
    var [data1] = await dbGrade.query(`SELECT * FROM groub_course WHERE id = ?`, [id]);
    if (data1 && data1[0]) {
      for (let i = 0; i < data1.length; i++) {
        const element = data1[i];
        var activities = element.activity;
        var arr_activities = [];
        for (let x = 0; x < activities.length; x++) {
          const element2 = activities[x];
          if (element2.id == student_id) {
            arr_activities.push({
              "id": element2.id,
              "tname": element2.tname,
              "fname": element2.fname,
              "lname": element2.lname,
              "class": element2.class,
              "room": element2.room,
              "part": element2.part,
              "grade_old": element2.grade_old,
              "grade_new": element2.grade_new,
              "select_grade": element2.select_grade,
              "confirm_date": element2.confirm_date,
              "status": 'register',
              "work": element2.work,
            })
          }
          else {
            arr_activities.push({
              "id": element2.id,
              "tname": element2.tname,
              "fname": element2.fname,
              "lname": element2.lname,
              "class": element2.class,
              "room": element2.room,
              "part": element2.part,
              "grade_old": element2.grade_old,
              "grade_new": element2.grade_new,
              "select_grade": element2.select_grade,
              "confirm_date": element2.confirm_date,
              "status": element2.status,
              "work": element2.work,
            })
          }
        }

        //
        await dbGrade.query(`UPDATE groub_course SET activity = ?, updated_at = ? WHERE id = ?`,
          [JSON.stringify(arr_activities), getDateNow(), id]);

        var [data2] = await dbGrade.query(`SELECT * FROM groub_course WHERE id = ?`,
          [id]);
        return success(res, data2);
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
