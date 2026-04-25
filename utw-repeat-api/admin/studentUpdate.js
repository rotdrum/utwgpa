const mysql = require("mysql2");
const root = require("../config-cors.js");
const rootGrade = require("../config-modify.js");
const _ = require('lodash');
let db = mysql.createPool(root());
let dbGrade = mysql.createPool(rootGrade());

const success = require("../response/success.js");
const empty = require("../response/empty.js");
const error = require("../response/error.js");
const authorization = require("../response/authorization.js");

function getOne(req, res) {
  db.query("SELECT * FROM user WHERE email = ?  ",
    [req.body.email],
    (err, teac) => {
      if (teac && teac[0]) {
        
        db.query(`update user set  user_no=?, tname=?, fname=?, lname=?, auth_role=?, department_id=?, status=?, class=?, room=?, part=?, mail_token=?, access_token=?
          where email=?`,
          [
            req.body.user_no,
            req.body.tname,
            req.body.fname,
            req.body.lname,
            req.body.auth_role,
            req.body.department_id ? req.body.department_id : null,
            "used",
            req.body.class,
            req.body.room,
            req.body.part,
            'a',
            'a',
            req.body.email,
          ],
          (error, data) => {
            if (error) {
              console.log(error);
              return error(res, err);
            }
            return success(res, []);
          })
      } else if (err) {
        return error(res, err);
      } else {
        return empty(res);
      }
    });
}

module.exports = function (req, res) {
  if (!req.headers['authorization']) {
    return authorization(res, 'Token Not Found');
  }

  const bearerToken = req.headers['authorization'].split(' ')[1];

  try {
    db.query(
      "select * from token_basic where token = ? ",
      [bearerToken],
      (err, data) => {
        if (!data[0]) {
          return error(res, 'Token Invalid');
        } else {
          getOne(req, res);
        }
      }
    );
  } catch (err) {
    return error(res, err);
  }
};
