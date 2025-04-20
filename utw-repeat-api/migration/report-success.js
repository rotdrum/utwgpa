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
    let settings = {};
    db.query(
      "select * from settings where key_address = ? ",
      ['modify_grade_date'],
      (err, data) => {
        if (data && data[0]) {
          settings = {
            term_at: data[0].in_data.date_term,
            round_at: data[0].in_data.date_section,
            year_at: data[0].in_data.date_year_education
          };
        } else if (err) {
          return error(res, err);
        } else {
          return empty(res);
        }
      }
    );

    dbGrade.query(
      "select *, groub_course.id as g_id FROM groub_course INNER JOIN course ON groub_course.course_id = course.id  WHERE course.department_id = ? ",
      [req.params.id],
      (err, data) => {
        if (data && data[0]) {
          let errAdd = false;

          for (let row of data) {
          let stdFail = [];
          if (row.activity) {
            for (let student of row.activity) {
              if (student?.confirm_date) {
                const std = {
                  id: student.id,
                  part: student.part,
                  room: student.room,
                  class: student.class,
                  fname: student.fname,
                  lname: student.lname,
                  tname: student.tname,
                }

                let teachers = null;
                db.query(
                  "select * from user where id = ? ",
                  [+row.user_id],
                  (err, teac) => {
                    if (teac && teac[0]) {
                      teachers = JSON.stringify({
                        id: teac[0].id,
                        part: teac[0].part,
                        room: teac[0].room,
                        class: teac[0].class,
                        fname: teac[0].fname,
                        lname: teac[0].lname,
                        tname: teac[0].tname,
                      });

                      dbGrade.query(
                        'insert into report_course_modify (student_id, student_activity, student, department_id, subject_id, subject_title, subject_code, subject_class, teacher_id, teacher, grade_old, grade_new, confirm_date, round_at, term_at, year_at) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) ', 
                        [std.id, JSON.stringify(student.work), JSON.stringify(std), row.department_id, row.subject_id, row.subject_title, row.subject_code, row.subject_class, row.user_id, teachers, student.grade_old, student.grade_new, student.confirm_date, settings?.round_at, settings?.term_at, settings?.year_at]
                      , (err, resp) => {
                        if (err) throw err;
                          if(!err) {
                            console.log("create id course " + row.id + " : success");
                          } else {
                            errAdd = true;
                            return error(res, err);
                          }
                      }) 
                    } else if (err) {
                      return error(res, err);
                    } else {
                      dbGrade.query(
                        'insert into report_course_modify (student_id, student_activity, student, department_id, subject_id, subject_title, subject_code, subject_class, teacher_id, teacher, grade_old, grade_new, confirm_date, round_at, term_at, year_at) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) ', 
                        [std.id, JSON.stringify(student.work), JSON.stringify(std), row.department_id, row.subject_id, row.subject_title, row.subject_code, row.subject_class, row.user_id, null, student.grade_old, student.grade_new, student.confirm_date, settings?.round_at, settings?.term_at, settings?.year_at]
                      , (err, resp) => {
                        if (err) throw err;
                          if(!err) {
                            console.log("create id course " + row.id + " : success");
                          } else {
                            errAdd = true;
                            return error(res, err);
                          }
                      }) 
                    }
                  }
                );
              }

              if (!student?.confirm_date) {
                stdFail.push(student);
              }
            }
          }

          if (errAdd === false) {
            dbGrade.query('update groub_course set activity = ? WHERE id = ? ', [
              JSON.stringify(stdFail), row.g_id
            ], (err) => {
                if(!err) {
                  console.log("update report-success complate");
                } else {
                  return error(res, err);
                }
            })
          } else {
            console.log("update report-success not delete");
          }
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
