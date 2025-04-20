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
  try {
    dbGrade.query("select * from `report_course_modify` where department_id = ? and round_at = ? and term_at = ? and year_at = ? ORDER BY confirm_date", [
      _.get(req, ["body", "department_id"]), _.get(req, ["body", "round_at"]), _.get(req, ["body", "term_at"]), _.get(req, ["body", "year_at"])
    ], (err, data) => {
      if (data && data[0]) {
        return success(res, data);
      } else if (err) {
        return error(res, err);
      } else {
        return empty(res);
      }
    });
  } catch (err) {
    return error(res, err);
  }
}

module.exports = function (req, res) {
  if(!req.headers['authorization']){
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
