const mysql = require("mysql2");
const root = require("../config-cors.js");
const _ = require('lodash');
let db = mysql.createPool(root());
const success = require("../response/success.js");
const error = require("../response/error.js");
const authorization = require("../response/authorization.js");

function modify(req, res) {
  const is_grade = _.get(req, ["body", "level"]);
  const updated_at = new Date();

  const tranfered_at = new Date();

  console.log(is_grade);

  if (is_grade == 0) {
    db.query(
      "select * from settings where key_address = ? ",
      ['register_doc_student_waiting'],
      (err, data) => {
        if (err) {
          return error(res, 'Key Address Invalid');
        } else {
          const fileary = data[0]?.in_data;
          let document = [];
          for (let i = 0; i < fileary.length; i++) {
            const obj = {
                title: fileary[i].title,
                path: '-',
                status: 'correct',
                comment: 'ถูกแก้เอกสารทั้งหมด เนื่องจากเลือกระดับการศึกษาผิด'
            }
            document.push(obj);
          }

          db.query(`update register_${req.params.part} set is_grade = ?, document = ?, status = ?, tranfered_at = ?, updated_at = ? WHERE id = ? `, [
            is_grade, JSON.stringify(document), 'correct', tranfered_at, updated_at, req.params.id
          ], (err) => {
              if(!err) {
                getOne(req, res);
              } else {
                return error(res, err);
              }
          }) 
        }
      }
    );
  } else {
    db.query(
      "select * from settings where key_address = ? ",
      ['register_doc_student_success'],
      (err, data) => {
        if (err) {
          return error(res, 'Key Address Invalid');
        } else {
          const fileary = data[0]?.in_data;
          let document = [];
          for (let i = 0; i < fileary.length; i++) {
            const obj = {
                title: fileary[i].title,
                path: '-',
                status: 'correct',
                comment: 'ถูกแก้เอกสารทั้งหมด เนื่องจากเลือกระดับการศึกษาผิด'
            }
            document.push(obj);
          }

          db.query(`update register_${req.params.part} set is_grade = ?, document = ?, status = ?, tranfered_at = ?, updated_at = ? WHERE id = ? `, [
            is_grade, JSON.stringify(document), 'correct', tranfered_at, updated_at, req.params.id
          ], (err) => {
              if(!err) {
                getOne(req, res);
              } else {
                return error(res, err);
              }
          }) 
        }
      }
    );
  }
}

function getOne(req, res) {
  try {
    db.query(
      `select * from register_${req.params.part} where id = ? `,
      [req.params.id],
      (err, data) => {
        if (data && data[0]) {
          return success(res, data[0]);
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
          modify(req, res);
        }
      }
    );
  } catch (err) {
    return error(res, err);
  }
};
