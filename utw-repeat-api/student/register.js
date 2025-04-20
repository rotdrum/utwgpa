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
    const updated_at = new Date();
    const start_date = new Date();
    const input = _.get(req, ["body", "end_date"]); // Assuming 'date' contains the string to add, like "aa" or "bb"
    
    dbGrade.query('update `repeat` set status = ?, start_date = ?, end_date = ?, updated_at = ? WHERE id = ? ', [
      'register', start_date, input, updated_at, req.params.id
    ], (err) => {
        if(!err) {
          dbGrade.query("select * from `repeat` WHERE id = ?", [
            req.params.id
          ], (err, data) => {
            if (data && data[0]) {
              return success(res, data[0]);
            } else if (err) {
              return error(res, err);
            } else {
              return empty(res);
            }
          });
        } else {
          return error(res, err);
        }
    })
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
