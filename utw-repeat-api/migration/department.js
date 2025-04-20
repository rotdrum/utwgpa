const mysql = require("mysql2");
const root = require("../config-cors.js");
const rootGrade = require("../config-modify.js");

let db = mysql.createPool(root());
let dbGrade = mysql.createPool(rootGrade());

const success = require("../response/success.js");
const empty = require("../response/empty.js");
const error = require("../response/error.js");
const authorization = require("../response/authorization.js");

function getOne(req, res) {
  try {
    dbGrade.query(
      "select * from course",
      [],
      (err, data) => {
        if (data && data[0]) {
          for (let course of data) {
            db.query(
              "select * from subject where id = ? and department_id = ?",
              [course.subject_id, req.params.id],
              (err, subject) => {
                if (subject && subject[0]) {
                  dbGrade.query('update course set department_id = ? WHERE id = ? ', [
                    subject[0].department_id, course.id
                    ], (err) => {
                      if(!err) {
                        console.log("update id course " + course.id + " : success");
                      } else {
                        return error("err update", err);
                      }
                  }) 
                } else if (err) {
                  return error(res, err);
                }
              }
            );
          }
          return success(res, data);
        } else if (err) {
          return error(res, err);
        } else {
          return empty(res);
        }
      }
    );
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
