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
  db.query(
    "select * from user where id = ? ",
    [+req.params.teacher_id],
    (err, teac) => {
      if (teac && teac[0]) {
        const teachers = JSON.stringify({
          id: teac[0].id,
          part: teac[0].part,
          room: teac[0].room,
          class: teac[0].class,
          fname: teac[0].fname,
          lname: teac[0].lname,
          tname: teac[0].tname,
        });

        dbGrade.query('update `repeat` set teacher_id = ?, teacher = ?, updated_at = ? WHERE id = ? ', [
          req.params.teacher_id, teachers, new Date(), req.params.id
        ], (err) => {
            if(!err) {
              return success(res, []);
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
