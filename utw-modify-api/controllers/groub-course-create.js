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

    var user_id = JSON.parse(req.body.users_id);
    var indicators = JSON.parse(req.body.indicators);
    var grade_old = JSON.parse(req.body.grade_old);
    var score_old = JSON.parse(req.body.score_old);
    var title = req.body.title;
    var course_id = req.body.course_id;
    // var indicators = req.body.indicators;
    var arr_indicators = [];
    var arr_users = [];
    var index = 0;

    if (indicators && indicators[0]) {
      for (let i = 0; i < indicators.length; i++) {
        const element = indicators[i];
        arr_indicators.push({
          "indicator": element,
          "status": "register",
        })
      }
    }

    var arr_users = [];
    if (user_id && user_id[0]) {
      console.log(`SELECT * FROM user WHERE id IN (${genval(user_id.length)})`, user_id)
      const [data] = await dbCors.query(`SELECT * FROM user WHERE id IN (${genval(user_id.length)})`,
        user_id
      );
      console.log(data)
      if (data.length && data[0]) {
        for (let i = 0; i < data.length; i++) {
          const element = data[i];
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

          arr_users.push({
            "id": element.id,
            "tname": element.tname,
            "fname": element.fname,
            "lname": element.lname,
            "class": element.class,
            "room": element.room,
            "part": element.part,
            "grade_old": grade_old[i],
            "score_old": score_old[i],
            "grade_new": grade_new,
            "select_grade": select_grade,
            "confirm_date": null,
            "status": "wait_register",
            "work": arr_indicators,
          })
        }

        var activity = JSON.stringify(arr_users);
        await dbGrade.query(`INSERT INTO groub_course (title, course_id, indicators, user_ids, activity) VALUES (?, ?, ?, ?, ?)`
          , [title, course_id, JSON.stringify(indicators), JSON.stringify(user_id), activity]
        )
        return success(res, [{
          "title": title,
          "course_id": course_id,
          "indicators": indicators,
          "user_ids": user_id,
          "activity": activity,
        }]);
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
