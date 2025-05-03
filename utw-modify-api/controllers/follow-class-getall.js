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

    // var id = req.body.id;
    // var student_id = req.body.student_id;
    // var student_work = JSON.parse(req.body.student_work);





    var [data1] = await dbGrade.query(`SELECT groub_course.id, groub_course.course_id, course.user_id, course.subject_id, course.subject_title, course.subject_code, course.subject_class,
                groub_course.title, groub_course.indicators, groub_course.user_ids, groub_course.activity, groub_course.created_at, groub_course.updated_at 
                FROM groub_course INNER JOIN course ON groub_course.course_id = course.id `);
    if (data1 && data1[0]) {
      var data_item = [];
      for (let i = 0; i < data1.length; i++) {
        const element = data1[i];
        var activities = (element.activity);
        var tname = '';
        var fname = '';
        var lname = '';
        var classx = '';
        var room = '';
        var part = '';
        var work = '';
        var student_id = '';
        var grade_old = '';
        var grade_new = '';
        var select_grade = '';
        var confirm_date = '';
        var status_register = '';
        var works = '';
        var data_item_activity = [];

        if (activities && activities[0]) {
          for (let x = 0; x < activities.length; x++) {
            const element2 = activities[x];
            student_id = element2.id;
            tname = element2.tname;
            fname = element2.fname;
            lname = element2.lname;
            classx = element2.class;
            room = element2.room;
            part = element2.part;
            grade_old = element2.grade_old;
            grade_new = element2.grade_new;
            select_grade = element2.select_grade;
            confirm_date = element2.confirm_date;
            status_register = element2.status;
            works = element2.work;

            var countIndex = 0;
            var countStatus = 0;

            if (works && works[0]) {
              for (let z = 0; z < works.length; z++) {
                const element3 = works[z];
                if (element3.status === 'success') {
                  countStatus++;
                }
                countIndex++;
              }
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
                status_work = 'begin';
              }
            }

            data_item_activity.push({
              'id': student_id,
              'tname': tname,
              'fname': fname,
              'lname': lname,
              'class': classx,
              'room': room,
              'part': part,
              'status': status_register,
              'work': works,
              'status_work': status_work,
              'grade_old': grade_old,
              'grade_new': grade_new,
              'select_grade': select_grade,
              'confirm_date': confirm_date,
            })
          }

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
            "activity": JSON.stringify(data_item_activity),
            "created_at": element.created_at,
            "updated_at": element.updated_at,
          })

          return success(res, data_item);
        }
        else {
          return empty(res);
        }
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
