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
  const works = _.get(req, ["body", "works"]);
  const updated_at = new Date();

  for (let id of JSON.parse(ids)) {
    let student_activity = [];
    for (let work of JSON.parse(works)) {
      student_activity.push({
        indicator: work,
        successDate: null,
      });
    }

    dbGrade.query('update `repeat` set student_activity = ?, status = ?, updated_at = ? WHERE id = ? ', [
      JSON.stringify(student_activity), 'enrol', updated_at, id
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
