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
  const ids = _.get(req, ["body", "ids"]);
  const grade_old = _.get(req, ["body", "grade_old"]);
  const start_date = _.get(req, ["body", "start_date"]);
  const end_date = _.get(req, ["body", "end_date"]);
  const stamp_round_at = _.get(req, ["body", "stamp_round_at"]);
  const stamp_term_at = _.get(req, ["body", "stamp_term_at"]);
  const stamp_year_at = _.get(req, ["body", "stamp_year_at"]);

  let grade_new = "1";
  if (grade_old === "มผ.") {
    grade_new = "ผ";
  }

  for (let id of JSON.parse(ids)) {
    dbGrade.query('update `repeat` set `input_type` = ?, stamp_round_at = ?, stamp_term_at = ?, stamp_year_at = ?, grade_new = ?, grade_old = ?, start_date = ?, status = ?, end_date = ?, updated_at = ?, confirm_date = ? WHERE id = ? ', [
      'update_manual', stamp_round_at, stamp_term_at, stamp_year_at, grade_new, grade_old, start_date, 'success', end_date, new Date(), new Date(), id
    ], (err) => {
        if(!err) {
          console.log(`update id : ${id} success`);
        } else {
          return error(res, err);
        }
    })
  }

  return success(res, []);
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
