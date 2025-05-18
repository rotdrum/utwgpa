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
const {checkTokenAdmin, getDateNow, MD5, genval} = require("../middlewares/bearbug.js");

module.exports = async function (req, res) {
  try {
    var token = req.body.token;
    const authResult = await checkTokenAdmin(token);
    if (!authResult) {
      return empty(res);
    }
    
    var subject_code = req.body.subject_code;
    var name = req.body.name;
    var classx = req.body.class;
    var room = req.body.room;
    var department_id = req.body.department_id;

    if (token) {
     

        var [data2] = await dbCors.query("SELECT * FROM subject WHERE subject_code = ? ", [subject_code]);
        if (data2 && data2[0]) {
          return empty(res);
          // return success(res, data2);
        }
        else {
          await dbCors.query("INSERT INTO subject (subject_code, name, class, room, department_id) VALUES (?, ?, ?, ?, ?) ", 
            [subject_code, name, classx, room, department_id]);
            return success(res, [subject_code]);
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
