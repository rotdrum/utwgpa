const mysql = require("mysql2");
const root = require("../config-cors.js");
const _ = require('lodash');
let db = mysql.createPool(root());
const success = require("../response/success.js");
const error = require("../response/error.js");
const authorization = require("../response/authorization.js");

function addCountClassroom(req, res) {
  try {
    db.query(
      `select * from classroom where amount_register_${req.params.part} < seat `,
      [],
      (err, data) => {
        if (data && data[0]) {
          const amount = _.get(data[0], `amount_register_${req.params.part}`) + 1;
          const updated_at = new Date();
          db.query(`update classroom set amount_register_${req.params.part} = ?, updated_at = ? WHERE id = ? `, [
            amount, updated_at, _.get(data[0], 'id')
          ], (err) => {
              if(!err) {
                modifyRegister(req, res, _.get(data[0], 'title'));
              } else {
                return error(res, err);
              }
          }) 
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

function modifyRegister(req, res, exam_room) {
  const updated_at = new Date();

  db.query(`update register_${req.params.part} set exam_room = ?, updated_at = ? WHERE id = ? `, [
    exam_room, updated_at, req.params.id
  ], (err) => {
      if(!err) {
        getOne(req, res);
      } else {
        return error(res, err);
      }
  }) 
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

function checkStudentHaveClassroom(req, res) {
  try {
    db.query(
      `select * from register_${req.params.part} where id = ? and exam_room IS NULL `,
      [req.params.id],
      (err, data) => {
        if (data && data[0]) {
          addCountClassroom(req, res);
        } else if (err) {
          return error(res, err);
        } else {
          return error(res, 'Student Have Classroom');
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
          checkStudentHaveClassroom(req, res);
        }
      }
    );
  } catch (err) {
    return error(res, err);
  }
};
