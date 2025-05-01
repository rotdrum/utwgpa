const mysql = require("mysql2/promise");
const root = require("../config-cors.js");
const rootGrade = require("../config-cors.js");

const dbCoruse = mysql.createPool(rootGrade());

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
    
    var department_id = req.body.department_id;
    var is_active = 1;
    if(department_id) {
      const [data] = await dbCoruse.query(
        `SELECT * FROM subject WHERE is_active = ? AND (department_id = ? OR department_id = ?)`, 
        [is_active, department_id, 0]
      );
  
      if (data.length && data[0]) {
        return success(res, data);
      } else {
        return empty(res);
      }
    }
    else {
      return empty(res);
    }
  } catch (err) {
    return error(res, err);
  }
};
