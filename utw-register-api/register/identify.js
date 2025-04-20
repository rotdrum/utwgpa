const mysql = require("mysql2");
const root = require("../config-cors.js");
const _ = require('lodash');
let db = mysql.createPool(root());
const success = require("../response/success.js");
const error = require("../response/error.js");
const authorization = require("../response/authorization.js");

function modify(req, res) {
  const information = _.get(req, ["body", "information"]);
  const address = _.get(req, ["body", "address"]);
  const is_grade = _.get(req, ["body", "is_grade"]);
  const education = _.get(req, ["body", "education"]);
  const parent = _.get(req, ["body", "parent"]);
  const document = _.get(req, ["body", "document"]);
  const status = _.get(req, ["body", "status"]);
  const updated_at = new Date();

  if (status === 'correct') {
    const tranfered_at = new Date();

    db.query(`update register_${req.params.part} set information = ?, address = ?, is_grade = ?, education = ?, parent = ?, document = ?, status = ?, tranfered_at = ?, updated_at = ? WHERE id = ? `, [
      JSON.stringify(information), JSON.stringify(address), is_grade, JSON.stringify(education), JSON.stringify(parent), JSON.stringify(document), status, tranfered_at, updated_at, req.params.id
    ], (err) => {
        if(!err) {
          console.log(JSON.stringify({
            response: 200,
            message: 'success',
            api: '/api/admin_approve',
            date: new Date() + '',
            id: req.params.id,
            result: JSON.stringify(information),
          }));
          getOne(req, res);
        } else {
          console.log(JSON.stringify({
            response: 422,
            message: 'bad : ' + JSON.stringify(err),
            api: '/api/admin_approve',
            date: new Date() + '',
            id: req.params.id,
            result: JSON.stringify(information),
          }));
          return error(res, err);
        }
    }) 
  } else {
    db.query(`update register_${req.params.part} set information = ?, address = ?, is_grade = ?, education = ?, parent = ?, document = ?, status = ?, updated_at = ? WHERE id = ? `, [
      JSON.stringify(information), JSON.stringify(address), is_grade, JSON.stringify(education), JSON.stringify(parent), JSON.stringify(document), status, updated_at, req.params.id
    ], (err) => {
        if(!err) {
          console.log(JSON.stringify({
            response: 200,
            message: 'success',
            api: '/api/admin_approve',
            date: new Date() + '',
            id: req.params.id,
            result: JSON.stringify(information),
          }));
          getOne(req, res);
        } else {
          console.log(JSON.stringify({
            response: 422,
            message: 'bad : ' + JSON.stringify(err),
            api: '/api/admin_approve',
            date: new Date() + '',
            id: req.params.id,
            result: JSON.stringify(information),
          }));
          return error(res, err);
        }
    }) 
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
