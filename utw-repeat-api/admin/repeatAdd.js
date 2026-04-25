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
  // student
  //      0             1               2                 3                 4               5               6
  // ${element.id}|${element.tname}|${element.fname}|${element.lname}|${element.part}|${element.room}|${element.class}

  // teacher
  //        0               1                 2             3               4               5               6
  // ${element.id}|${element.tname}|${element.fname}|${element.lname}|${element.part}|${element.room}|${element.class}

  // subject
  //            0                 1                   2                   3               4
  // ${element.subject_code}|${element.name}|${element.department_id}|${element.id|${element.class}
  dbGrade.query("insert into `repeat` (student_id, student, student_activity, learn_amount, learn_total, status, department_id, subject_id, subject_title, subject_code, subject_class, teacher_id, teacher, grade_old, grade_new, confirm_date, round_at, term_at, year_at, input_type) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);",
    [
      req.body.student.split("|")[0],
      JSON.stringify({"id": parseInt(req.body.student.split("|")[0]), "part": req.body.student.split("|")[4], "room": req.body.student.split("|")[5] != "-" ? parseInt(req.body.student.split("|")[5]) : "-", "class": parseInt(req.body.student.split("|")[6]), "fname": req.body.student.split("|")[2], "lname": req.body.student.split("|")[3], "tname": req.body.student.split("|")[1]}),
      null,
      null,
      null,
      "wait_register",
      parseInt(req.body.subject.split("|")[2]),
      parseInt(req.body.subject.split("|")[3]),
      req.body.subject.split("|")[1],
      req.body.subject.split("|")[0],
      parseInt(req.body.subject.split("|")[4]),
      parseInt(req.body.teacher.split("|")[0]),
      JSON.stringify({"id": parseInt(req.body.teacher.split("|")[0]), "part": req.body.teacher.split("|")[0] != "-" ? parseInt(req.body.teacher.split("|")[0]) : "-", "room": parseInt(req.body.teacher.split("|")[5]), "class": parseInt(req.body.teacher.split("|")[6]), "fname": req.body.teacher.split("|")[2], "lname": req.body.teacher.split("|")[3], "tname": req.body.teacher.split("|")[1]}),
      req.body.gradeold,
      null,
      null,
      parseInt(req.body.at),
      parseInt(req.body.term),
      parseInt(req.body.termyear),
      'manual'
    ],
    (err, data) => {
      if (err) {
        console.log(err)
        return error(res, err);
      } else {
        return success(res, []);
      }
    });
}

module.exports = function (req, res) {
  if (!req.headers['authorization']) {
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
