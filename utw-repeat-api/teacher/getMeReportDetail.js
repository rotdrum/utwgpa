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
    dbGrade.query("select * from `repeat` WHERE status = ? AND teacher_id = ? AND subject_id = ? AND confirm_date IS NOT NULL ORDER BY confirm_date ASC", [
      'success', req.params.id, req.params.subject_id
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
