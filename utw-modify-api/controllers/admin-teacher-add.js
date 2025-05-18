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
    var user_no = req.body.user_no;
    var tname = req.body.tname;
    var fname = req.body.fname;
    var lname = req.body.lname;
    var classx = req.body.class;
    var room = req.body.room;
    var part = req.body.part;
    var mail_token = "admin_generate";
    var access_token = "";
    var email = req.body.email;
    var auth_role = req.body.auth_role;
    var department_id = req.body.department_id;
    var domain = String(email).split("@")[1];
    var status = "used";

    if (domain != "utw.ac.th") {
      console.log(domain)
      return empty(res);
    }

    if (email) {
      var [data1] = await dbCors.query("SELECT * FROM user WHERE email = ? ", [email]);
      console.log(data1)
      if (data1 && data1[0]) {
        return empty(res);
      }
      else {
        access_token = MD5(email) + "@" + MD5(auth_role) + "@" + MD5(String(new Date().getTime()));
        await dbCors.query(`insert into user (user_no, tname, fname, lname, email, auth_role, department_id, status, class, room, part, mail_token, access_token)
          values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) `,
          [user_no, tname, fname, lname, email, auth_role, department_id, status, classx, room, part, mail_token, access_token]);
        return success(res, [user_no]);
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
