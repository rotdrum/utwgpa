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

    var teacher_id = parseInt(req.body.user_id);
    var pon1 = req.body.pon1;
    var pon2 = req.body.pon2;
    var subject = parseInt(req.body.subject);

    var before_mid_score = req.body.before_mid_score ? req.body.before_mid_score : null;
    var mid_score = req.body.mid_score ? req.body.mid_score : null;
    var before_final_score = req.body.before_final_score ? req.body.before_final_score : null;
    var final_score = req.body.final_score ? req.body.final_score : null;


    if (teacher_id && subject) {

      var [data1] = await dbGrade.query("select * from indicators_master where teacher_id = ?", [teacher_id])
      if (data1 && data1[0]) {
        dbGrade.query("update  indicators_master set  indicators=?,outcomes=?, updated_at=?, before_mid_score=?, mid_score=?, before_final_score=?, final_score=? where teacher_id =? and  subject_id =? ", 
          [pon1, pon2,  new Date(), before_mid_score, mid_score, before_final_score, final_score,teacher_id, subject])
            console.log(error)
            return success(res, [teacher_id]);
      }
      else {
        await dbGrade.query("insert into indicators_master (indicators,outcomes, teacher_id, subject_id,  created_at, updated_at) values (?,?,?,?,?,?)", 
          [pon1, pon2, teacher_id, subject, new Date(), new Date()] )
            console.log(error)
            return success(res, [teacher_id]);
      }
    }
    else {
      return success(res, []);
    }
  } catch (err) {
    console.log(err)
    return error(res, err);
  }
};
