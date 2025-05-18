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
const { checkTokenAdmin, getDateNow, MD5, genval } = require("../middlewares/bearbug.js");

module.exports = async function (req, res) {
  try {
    var token = req.body.token;
    const authResult = await checkTokenAdmin(token);
    if (!authResult) {
      return empty(res);
    }

    var id = req.body.id
    var subject_code = req.body.subject_code
    var name = req.body.name
    var classx = req.body.class
    var room = req.body.room
    var department_id = req.body.department_id
    var updated_at = getDateNow();

    if (token) {


      await dbCors.query("UPDATE subject SET name = ?, class = ?, room = ?, department_id = ?, updated_at = ? WHERE id = ?",
        [name, classx, room, department_id, updated_at, id]);

      var [data2] = await dbCors.query("SELECT * FROM subject WHERE id = ? ",
        [id]);
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
