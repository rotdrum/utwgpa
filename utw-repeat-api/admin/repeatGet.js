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
  dbGrade.query("select student,teacher,subject_code,subject_title,year_at,id from `repeat`",
    (err, data) => {
      if (data && data[0]) {
        return success(res, data);
      } else if (err) {
        console.log(err)
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
