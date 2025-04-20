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
  console.log('test ttttt');
  try {
    dbGrade.query("select * from `repeat` WHERE id = ?", [
      req.params.id
    ], (err, data) => {
      if (data && data[0]) {
        const input = JSON.parse(_.get(req, ["body", "activities"]));
        const activities = data[0].student_activity;
        let aa = [];
        let status = 'progress';
        let grade_new = null;
        if (activities.length === input.length) {
          status = 'wait_success';
          if (data[0].grade_old === "มผ.") {
            grade_new = "ผ";
          } else {
            grade_new = "1";
          }
        }

        for (let activity of activities) {
          if (input.includes(activity.indicator) && activity.successDate === null) {
            aa.push({
              indicator: activity.indicator,
              successDate: new Date(),
            });
          } else {
            aa.push({
              indicator: activity.indicator,
              successDate: activity.successDate,
            });
          }
        }

        dbGrade.query('update `repeat` set grade_new = ?, student_activity = ?, status = ?, updated_at = ? WHERE id = ? ', [
          grade_new, JSON.stringify(aa), status, new Date(), req.params.id
        ], (err) => {
            if(!err) {
              return success(res, data[0]);
            } else {
              return error(res, err);
            }
        })
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
