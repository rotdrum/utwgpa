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

async function getOne(req, res) {
  try {
    // Convert db.query to return a Promise
    const students = await new Promise((resolve, reject) => {
      db.query(
        "select * from `user` WHERE auth_role = ? and class = ? and room = ?",
        ['student', req.params.class, req.params.room],
        (errCore, results) => {
          if (errCore) {
            reject(errCore);
          } else {
            resolve(results);
          }
        }
      );
    });

    if (students && students[0]) {
      let repeats = [];

      // Use Promise.all to wait for all dbGrade queries to finish
      await Promise.all(
        students.map(async (student) => {
          const data = await new Promise((resolve, reject) => {
            dbGrade.query(
              "select * from `repeat` WHERE student_id = ?",
              [student.id],
              (err, result) => {
                if (err) {
                  reject(err);
                } else {
                  resolve(result);
                }
              }
            );
          });

          if (data && data[0]) {
            repeats.push(...data);
          }
        })
      );

      return success(res, repeats);
    } else {
      return empty(res);
    }


    // db.query("select * from `settings` WHERE key_address = ?", [
    //   "repeat_date"
    // ], (errCore, dataCore) => {
    //   if (dataCore && dataCore[0]) {
    //     const setting = dataCore[0].in_data;
    //     let classroom = +req.params.class;
    //     let yearAt = +setting.date_year_education;

    //     if (setting.date_term == 1) {
    //       classroom = (+req.params.class) - 1;
    //       yearAt = yearAt-1;
    //     }
    //     dbGrade.query( "SELECT * FROM `repeat` WHERE JSON_UNQUOTE(student->'$.class') = ? AND JSON_UNQUOTE(student->'$.room') = ? AND year_at = ?", [
    //       classroom, req.params.room, yearAt
    //     ], (err, data) => {
    //       if (data && data[0]) {
    //         return success(res, data);
    //       } else if (err) {
    //         return error(res, err);
    //       } else {
    //         return success(res, []);
    //       }
    //     });
    //   } else if (errCore) {
    //     return error(res, errCore);
    //   } else {
    //     return empty(res);
    //   }
    // });
    

    // db.query("select * from `user` WHERE auth_role = ? and class = ? and room = ?", [
    //   'student', req.params.class, req.params.room
    // ], (err, students) => {
    //   if (students && students[0]) {
    //     let repeats = [];
    //     let iCount = 0;
    //     let flag = 0;
    //     for (let student of students) {
    //       iCount = iCount + 1;
    //       if (iCount < students.length) {
    //         dbGrade.query("select * from `repeat` WHERE student_id = ?", [
    //           student.id
    //         ], (err, data) => {
    //           if (data && data[0]) {
    //             flag = 1;
    //             for (let aa of data) {
    //               repeats.push(aa);
    //             }
    //           } else if (err) {
    //             return error(res, err);
    //           }
    //         });
    //       } else {
    //         let iCountRow = 0;

    //         dbGrade.query("select * from `repeat` WHERE student_id = ?", [
    //           student.id
    //         ], (err, data) => {
    //           if (data && data[0]) {
    //             flag = 1;
    //             for (let aa of data) {
    //               iCountRow = iCountRow + 1;
    //               if (iCountRow < data.length) {
    //                 repeats.push(aa);
    //               } else {
    //                 repeats.push(aa);
    //                 return success(res, repeats);
    //               }
    //             }
    //           } else if (flag == 0) {
    //             return success(res, repeats);
    //           } else if (err) {
    //             return error(res, err);
    //           }
    //         });

    //         // Some code only for the last element
    //       }
    //     }

    //   } else if (err) {
    //     return error(res, err);
    //   } else {
    //     return empty(res);
    //   }
    // });

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
