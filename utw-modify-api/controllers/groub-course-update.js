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

    var id = req.body.id;
    var course_id = req.body.course_id;
    var title = req.body.title;
    var indicators = JSON.parse(req.body.indicators);
    var test_user = JSON.parse(req.body.users_id);
    var grade_old = JSON.parse(req.body.grade_old);
    var score_old = JSON.parse(req.body.score_old);
    var arr_indicators = [];
    var arr_users = [];

    if (indicators && indicators[0]) {
      for (let i = 0; i < indicators.length; i++) {
        const element = indicators[i];
        arr_indicators.push({
          "indicator": element,
          "status": "register"
        })
      }
    }

    const [data] = await dbGrade.query(`SELECT * FROM groub_course WHERE id = ? `,
      [id]
    );
    if (data && data[0]) {
      var activities = JSON.parse(data[0].activity);


      for (let i = 0; i < user_id.length; i++) {
        const element = user_id[i];

        var [data1] = await dbCors.query(`SELECT * FROM user WHERE id = ? `, [element])
        if (data1 && data1[0]) {

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
                arr_indicators.push({
                  "indicator" : element3,
                  "status" : "register",
                })
              }

              arr_users.push({
                
              })
            }
          }
        }
      }
    }

    // if (data.length && data[0]) {
    //   return success(res, data[0]);
    // } else {
    //   return empty(res);
    // }

  } catch (err) {
    return error(res, err);
  }
};
