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
    const stundent_id = _.get(req, ["body", "stundent_id"]);
    const teacher_id = _.get(req, ["body", "teacher_id"]);
    const round_at = _.get(req, ["body", "round_at"]);
    const term_at = _.get(req, ["body", "term_at"]);
    const year_at = _.get(req, ["body", "year_at"]);
    const department_id = _.get(req, ["body", "department_id"]);
    const subject_id = _.get(req, ["body", "subject_id"]);
    const subject_title  = _.get(req, ["body", "subject_title"]);
    const subject_code = _.get(req, ["body", "subject_code"]);
    const subject_class = _.get(req, ["body", "subject_class"]);

    let old_grade = '0';
    if (department_id == 0) {
      old_grade = 'มผ.';
    }


    let tea = null;
    db.query(
      "select * from user where id = ? ",
      [+teacher_id],
      (err, teachers) => {
        if(!err) {
          tea = JSON.stringify({
            id: teachers[0].id,
            part: teachers[0].part,
            room: teachers[0].room,
            class: teachers[0].class,
            fname: teachers[0].fname,
            lname: teachers[0].lname,
            tname: teachers[0].tname,
          }); 

          console.log(tea);
          
          db.query(
            "select * from user where id = ? ",
            [+stundent_id],
            (err, dataStudents) => {
              if (dataStudents && dataStudents[0]) {
                const std = JSON.stringify({
                  id: dataStudents[0].id,
                  part: dataStudents[0].part,
                  room: dataStudents[0].room,
                  class: dataStudents[0].class,
                  fname: dataStudents[0].fname,
                  lname: dataStudents[0].lname,
                  tname: dataStudents[0].tname,
                });
      
                dbGrade.query(
                  'insert into `repeat` (student_id, student, status, department_id, subject_id, subject_title, subject_code, subject_class, teacher_id, grade_old, round_at, term_at, year_at, teacher, input_type) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) ', 
                  [stundent_id, std, 'wait_register', department_id, subject_id, subject_title, subject_code, subject_class, teacher_id, old_grade, round_at, term_at, year_at, tea, 'manual']
                , (err, resp) => {
                  if (err) throw err;
                    if(!err) {
                      console.log("create id course : success");
                    } else {
                      return error(res, err);
                    }
                }) 
              } else if (err) {
                return error(res, err);
              } else { }
            }
          );
        } else {
          return error(res, err);
        }
      }
    );

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
