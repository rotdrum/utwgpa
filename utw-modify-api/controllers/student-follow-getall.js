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
    var data_item = [];
    if (true) {
      var [data1] = await dbGrade.query(`
        SELECT groub_course.id, groub_course.course_id, course.user_id, course.subject_id, course.subject_title, course.subject_code, course.subject_class,
        groub_course.title, groub_course.indicators, groub_course.user_ids, groub_course.activity, groub_course.created_at, groub_course.updated_at 
        FROM groub_course INNER JOIN course ON groub_course.course_id = course.id `);
      if (data1 && data1[0]) {

        for (let a = 0; a < data1.length; a++) {
          const element1 = data1[a];
          var user_ids = element1.user_ids;

          for (let b = 0; b < user_ids.length; b++) {
            const element2 = user_ids[b];
            if (element2 == req.body.user_id) {

              for (let c = 0; c < element1.activity.length; c++) {
                const element3 = element1.activity[c];
                if (element3.id == req.body.user_id) {
                  var student_id = element3.id;
                  var tname = element3.tname;
                  var fname = element3.fname;
                  var lname = element3.lname;
                  var classX = element3.class;
                  var room = element3.room;
                  var part = element3.part;
                  var grade_old = element3.grade_old;
                  var grade_new = element3.grade_new;
                  var select_grade = element3.select_grade;
                  var confirm_date = element3.confirm_date;
                  var status = element3.status;
                  var status_register = element3.status;
                  var works = element3.work;

                  var countIndex = 0;
                  var countStatus = 0;

                  for (let d = 0; d < works.length; d++) {
                    const element4 = works[d];
                    if (element4.status === 'success') {
                      countStatus++;
                    }
                    countIndex++;
                  }

                  var status_work = '';
                  if (status_register === "wait_register") {
                    status_work = 'wait_begin';
                  } else {
                    if (countIndex === countStatus) {
                      status_work = 'success';
                    } else if (countStatus > 0) {
                      status_work = 'process';
                    } else if (countStatus === 0) {
                      $status_work = 'begin';
                    }
                  }

                  var data_row_activity = [{
                    'id': student_id,
                    'tname': tname,
                    'fname': fname,
                    'lname': lname,
                    'class': classX,
                    'room': room,
                    'part': part,
                    'work': works,
                    'status': status,
                    'status_work': status_work,
                    'grade_old': grade_old,
                    'grade_new': grade_new,
                    'select_grade': select_grade,
                    "confirm_date": confirm_date,
                  }];
                }
              }

              //
              data_item.push({
                "id": element1.id,
                "course_id": element1.course_id,
                "user_id": element1.user_id,
                "subject_id": element1.subject_id,
                "subject_title": element1.subject_title,
                "subject_code": element1.subject_code,
                "subject_class": element1.subject_class,
                "title": element1.title,
                "indicators": element1.indicators,
                "user_ids": element1.user_ids,
                "activity": data_row_activity[0],
                "created_at": element1.created_at,
                "updated_at": element1.updated_at,
              })
            }
          }
        }

        return success(res, data_item);
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
