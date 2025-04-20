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
    db.query("select * from `settings` WHERE key_address = ?", [
      "repeat_date"
    ], (err, data) => {
      if (data && data[0]) {
        const setting = data[0].in_data;
        dbGrade.query('update `repeat` set stamp_round_at = ?, stamp_term_at = ?, stamp_year_at = ?, confirm_date = ?, status = ?, updated_at = ? WHERE id = ? ', [
          setting.date_section, setting.date_term, setting.date_year_education, new Date(), 'success', new Date(), req.params.id
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
