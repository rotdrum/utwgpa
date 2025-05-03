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
const { json } = require("body-parser");

module.exports = async function (req, res) {
  try {
    const authResult = await authenticate(req, res);
    if (authResult !== true) {
      return; // ไม่ผ่าน auth ก็จบ
    }

    function getDateNow() {
      var d = new Date()
      var dy = d.getFullYear();
      var dm = (d.getMonth() + 1) < 10 ? '0' + (d.getMonth() + 1) : (d.getMonth() + 1);
      var dd = d.getDate() < 10 ? '0' + d.getDate() : d.getDate();

      var th = d.getHours() < 10 ? '0' + d.getHours() : d.getHours();
      var tm = d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes();
      var ts = d.getSeconds() < 10 ? '0' + d.getSeconds() : d.getSeconds();
      return `${dy}-${dm}-${dd} ${th}:${tm}:${ts}`;
    }

    var id = req.body.id;
    var student_id = req.body.student_id;
    var student_work = JSON.parse(req.body.student_work);

    if (id) {
      var [data1] = await dbGrade.query(`SELECT * FROM groub_course WHERE id = ? `,
        [id]
      );
      if (data1 && data1[0]) {
        var activities = (data1[0].activity);
        var arr_activities = [];
        if (activities && activities[0]) {
          for (let i = 0; i < activities.length; i++) {
            const element = activities[i];
            if (element.id == student_id) {
              arr_activities.push({
                "id": element.id,
                "tname": element.tname,
                "fname": element.fname,
                "lname": element.lname,
                "class": element.class,
                "room": element.room,
                "part": element.part,
                "status": element.status,
                "work": student_work,
                "grade_old": element.grade_old,
                "grade_new": req.body.grade_new,
                "select_grade": element.select_grade,
                "confirm_date": element.confirm_date,
                "score_old": element.score_old,
              })
            }
            else {
              arr_activities.push({
                "id": element.id,
                "tname": element.tname,
                "fname": element.fname,
                "lname": element.lname,
                "class": element.class,
                "room": element.room,
                "part": element.part,
                "status": element.status,
                "work": element.work,
                "grade_old": element.grade_old,
                "grade_new": element.grade_new,
                "select_grade": element.select_grade,
                "confirm_date": element.confirm_date,
                "score_old": element.score_old,
              })
            }
          }

          var updated_at = getDateNow();
          await dbGrade.query(`UPDATE groub_course SET activity = ?, updated_at = ? WHERE id = ? `,
            [JSON.stringify(arr_activities), updated_at, id]
          );

          var [data2] = await dbGrade.query(`SELECT * FROM groub_course WHERE id = ? `,
            [id]
          );

          return success(res, data2);
        }
        else {
          return empty(res);
        }
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
