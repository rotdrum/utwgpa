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

module.exports = async function (req, res) {
  try {
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
    
    const authResult = await authenticate(req, res);
    if (authResult !== true) {
      return; // ไม่ผ่าน auth ก็จบ
    }

    var updated_at = getDateNow();

    var id = req.body.id;
    var subject_id = req.body.subject_id;
    var subject_title = req.body.subject_title;
    var subject_code = req.body.subject_code;
    var subject_class = req.body.subject_class;
    var indicators = req.body.indicators;

    if (id && subject_id) {
      await dbGrade.query(`UPDATE course SET subject_id = ?, subject_title = ?, subject_code = ?, subject_class = ?, indicators = ?, updated_at = ? WHERE id = ?`,
        [subject_id, subject_title, subject_code, subject_class, indicators, updated_at, id]
      );

      const [data] = await dbGrade.query(`SELECT * FROM course WHERE id = ? `,
        [id]
      );
      if (data.length && data[0]) {
        return success(res, data);
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
