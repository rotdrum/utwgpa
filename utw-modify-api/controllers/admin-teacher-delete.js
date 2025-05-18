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

    var id = req.body.id;



    if (id) {
      await dbCors.query(`DELETE FROM user WHERE id = ?`,
        [id]);
      return success(res, [id]);
    }
    else {
      return empty(res);
    }
  } catch (err) {
    console.log(err)
    return error(res, err);
  }
};
