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
    function getDateNow() {
      var d = new Date();
      var dy = d.getFullYear();
      var dm = (d.getMonth()+1) < 10 ? '0'+(d.getMonth()+1) : (d.getMonth()+1);
      var dd = d.getDate() < 10 ? '0'+d.getDate() : d.getDate();
    
      var th = d.getHours() < 10 ? '0'+d.getHours() : d.getHours();
      var tm = d.getMinutes() < 10 ? '0'+d.getMinutes() : d.getMinutes();
      var ts = d.getSeconds() < 10 ? '0'+d.getSeconds() : d.getSeconds();
      return `${dy}-${dm}-${dd} ${th}:${tm}:${ts}`;
    }

    const authResult = await authenticate(req, res);
    if (authResult !== true) {
      return; // ไม่ผ่าน auth ก็จบ
    }

    var id = req.body.id;
    var course_id = req.body.course_id;
    var title = req.body.title;
    var indicators = JSON.parse(req.body.indicators);
    var test_user = JSON.parse(req.body.users_id);
    var grade_old = JSON.parse(req.body.grade_old);
    var score_old = JSON.parse(req.body.score_old);
    var arr_indicators = [];
    var arr_user = [];

    if (indicators && indicators[0]) {
      for (let i = 0; i < indicators.length; i++) {
        const element = indicators[i];
        arr_indicators.push({
          "indicator": element,
          "status": "register"
        })
      }
    }
    user_ids = req.body.users_id;

    const [data] = await dbGrade.query(`SELECT * FROM groub_course WHERE id = ? `,
      [id]
    );
    if (data && data[0]) {
      var activities = (data[0].activity);
      console.log(activities)


      for (let i = 0; i < test_user.length; i++) {
        const element = test_user[i];
        console.log("element",element)

        var [data1] = await dbCors.query(`SELECT * FROM user WHERE id = ? `, [element])
        if (data1 && data1[0]) {
          console.log("data1",data1[0])

          var grade_new = null;
          var select_grade = [];
          if (grade_old[i] == 'ร') {
            grade_new = '1';
            select_grade = ['4', '3.5', '3', '2.5', '2', '1.5', '1'];
          } else if (grade_old[i] == '0') {
            grade_new = '1';
            select_grade = ['1'];
          } else if (grade_old[i] == 'มส.') {
            grade_new = '1';
            select_grade = ['1'];
          } else if (grade_old[i] == 'มผ.') {
            grade_new = 'ผ';
            select_grade = ['ผ'];
          }

          var flag = 0;
          var work_user = '';
          var aty_confirm_date = null;
          var aty_status = '';

          if (activities && activities[0]) {
            for (let x = 0; x < activities.length; x++) {
              const element2 = activities[x];
              if(data1[0].id == element2.id) {
                flag = 1;
                aty_confirm_date = element2.confirm_date;
                aty_status = element2.status;
                work_user = element2.work;
              }
            }

            if (flag == 0) {
              var arr_new_indicators = [];
              for (let x = 0; x < indicators.length; x++) {
                const element3 = indicators[x];
                arr_new_indicators.push({
                  "indicator" : element3,
                  "status" : "register",
                })
              }

              arr_user.push({
                "id" : data1[0].id,
                "tname" : data1[0].tname,
                "fname" : data1[0].fname,
                "lname" : data1[0].lname,
                "class" : data1[0].class,
                "room" : data1[0].room,
                "part" : data1[0].part,
                "grade_old" : grade_old[i],
                "score_old" : score_old[i],
                "grade_new" : grade_new,
                "confirm_date" : null,
                "select_grade" : select_grade,
                "status" : 'wait_register',
                "work" : arr_indicators,
              })
            }
            else {
              arr_user.push({
                "id" : data1[0].id,
                "tname" : data1[0].tname,
                "fname" : data1[0].fname,
                "lname" : data1[0].lname,
                "class" : data1[0].class,
                "room" : data1[0].room,
                "part" : data1[0].part,
                "grade_old" : grade_old[i],
                "score_old" : score_old[i],
                "grade_new" : grade_new,
                "confirm_date" : null,
                "select_grade" : select_grade,
                "status" : 'wait_register',
                "work" : arr_indicators,
              })
            }
          }
        }
      }

      var title = req.body.title;
      var course_id = req.body.course_id;
      var indicators = req.body.indicators;
      var activity = JSON.stringify(arr_user);
      var updated_at = getDateNow();

      await dbGrade.query(`UPDATE groub_course SET course_id = ?, title = ?, indicators = ?, user_ids = ?, activity = ?, updated_at = ? WHERE id = ?`, 
        [course_id, title, indicators, user_ids, activity, updated_at, id])

      var [data2] = await dbGrade.query(`SELECT * FROM groub_course WHERE id = ?`, 
        [id])
        return success(res, data2);
    }
    else {
      return empty(res);
    }
  } catch (err) {
    console.log(err)
    return error(res, err);
  }
};
