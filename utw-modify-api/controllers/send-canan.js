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

    var student_id = parseInt(req.body.student_id);
    var teacher_id = parseInt(req.body.teacher_id);
    var subject_id = parseInt(req.body.subject);

    var pon1 = req.body.pon1;
    var pon2 = req.body.pon2;

    var before_mid_score = req.body.before_mid_score ? parseFloat(req.body.before_mid_score) : null;
    var mid_score = req.body.mid_score ? parseFloat(req.body.mid_score) : null;
    var before_final_score = req.body.before_final_score ? parseFloat(req.body.before_final_score) : null;
    var final_score = req.body.final_score ? parseFloat(req.body.final_score) : null;

    var own1 = req.body.own1 ? parseFloat(req.body.own1) : 0;
    var own2 = req.body.own2 ? parseFloat(req.body.own2) : 0;
    var own3 = req.body.own3 ? parseFloat(req.body.own3) : 0;
    var own4 = req.body.own4 ? parseFloat(req.body.own4) : 0;

    var kon1 = req.body.kon1 ? parseFloat(req.body.kon1) : 0;
    var kon2 = req.body.kon2 ? parseFloat(req.body.kon2) : 0;
    var kon3 = req.body.kon3 ? parseFloat(req.body.kon3) : 0;
    var kon4 = req.body.kon4 ? parseFloat(req.body.kon4) : 0;
    var kon5 = req.body.kon5 ? parseFloat(req.body.kon5) : 0;
    var kon6 = req.body.kon6 ? parseFloat(req.body.kon6) : 0;
    var kon7 = req.body.kon7 ? parseFloat(req.body.kon7) : 0;
    var kon8 = req.body.kon8 ? parseFloat(req.body.kon8) : 0;
    var konavg = req.body.konavg ? parseFloat(req.body.konavg) : 0;

    var kean1 = req.body.kean1 ? parseFloat(req.body.kean1) : 0;
    var kean2 = req.body.kean2 ? parseFloat(req.body.kean2) : 0;
    var kean3 = req.body.kean3 ? parseFloat(req.body.kean3) : 0;
    var kean4 = req.body.kean4 ? parseFloat(req.body.kean4) : 0;
    var kean5 = req.body.kean5 ? parseFloat(req.body.kean5) : 0;
    var keanavg = req.body.keanavg ? parseFloat(req.body.keanavg) : 0;

    var sumscore = own1+ own2+ own3+ own4;




    if (teacher_id && subject_id) {

      await dbGrade.query(`
        insert into repeat_student_score 
        (student_id, teacher_id, subject_id, 
        before_mid_score, mid_score, before_final_score, final_score, sum_score,
        ac_1, ac_2, ac_3, ac_4, ac_5, ac_6, ac_7, ac_8, ac_avg,
        rtw_1, rtw_2, rtw_3, rtw_4, rtw_5, rtw_avg, 
        updated_at, created_at) 
        values (${genval(25)})`,
        [
          student_id, teacher_id, subject_id, 
          own1, own2, own3, own4, sumscore,
          kon1, kon2, kon3, kon4, kon5, kon6, kon7, kon8, konavg,
          kean1, kean2, kean3, kean4, kean5, keanavg,
          new Date(), new Date(),
        ])

      console.log(error)
      return success(res, [teacher_id]);
    }
    else {
      return success(res, []);
    }
  } catch (err) {
    console.log(err)
    return error(res, err);
  }
};
