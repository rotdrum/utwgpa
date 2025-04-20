const mysql = require("mysql2");
const root = require("../config-cors.js");
const rootGrade = require("../config-modify.js");

let db = mysql.createPool(root());
let dbGrade = mysql.createPool(rootGrade());
const _ = require('lodash');

const success = require("../response/success.js");
const empty = require("../response/empty.js");
const error = require("../response/error.js");
const authorization = require("../response/authorization.js");

function getOne(req, res) {
  try {
    let countStudent = 0;
    let countTeacher = 0;
    let countSubject = 0;
    let countDepartment = 0;
    let countClassroom = 0;
    let countBuilding = 0;

    db.query(
      "select COUNT(id) from user where auth_role = ?",
      ["student"],
      (err, student) => {
        if (student && student[0]) {
          countStudent = _.get(student[0], "COUNT(id)", 0);
          db.query(
            "select COUNT(id) from user where auth_role = ?",
            ["teacher"],
            (err, teacher) => {
              if (teacher && teacher[0]) {
                countTeacher = _.get(teacher[0], "COUNT(id)", 0);
                db.query(
                  "select COUNT(id) from `subject`",
                  [],
                  (err, subject) => {
                    if (subject && subject[0]) {
                      countSubject = _.get(subject[0], "COUNT(id)", 0);
                      db.query(
                        "select COUNT(id) from department",
                        [],
                        (err, department) => {
                          if (department && department[0]) {
                            countDepartment = _.get(department[0], "COUNT(id)", 0);
                            db.query(
                              "select COUNT(id) from classroom",
                              [],
                              (err, classroom) => {
                                if (classroom && classroom[0]) {
                                  countClassroom = _.get(classroom[0], "COUNT(id)", 0);
                                  db.query(
                                    "select COUNT(id) from building",
                                    [],
                                    (err, building) => {
                                      if (building && building[0]) {
                                        countBuilding = _.get(building[0], "COUNT(id)", 0);
                                        return success(res, {
                                          teacher: countTeacher,
                                          student: countStudent,
                                          department: countDepartment,
                                          subject: countSubject,
                                          classroom: countClassroom,
                                          building: countBuilding,
                                        });
                                      } else if (err) {
                                        return error(res, err);
                                      } else {
                                        return empty(res);
                                      }
                                    }
                                  );
                                } else if (err) {
                                  return error(res, err);
                                } else {
                                  return empty(res);
                                }
                              }
                            );
                          } else if (err) {
                            return error(res, err);
                          } else {
                            return empty(res);
                          }
                        }
                      );
                    } else if (err) {
                      return error(res, err);
                    } else {
                      return empty(res);
                    }
                  }
                );
              } else if (err) {
                return error(res, err);
              } else {
                return empty(res);
              }
            }
          );
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

module.exports = async function (req, res) {
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
