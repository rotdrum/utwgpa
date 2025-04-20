const mysql = require("mysql2");
const root = require("../config-cors.js");
const _ = require('lodash');
let db = mysql.createPool(root());
const success = require("../response/success.js");
const error = require("../response/error.js");
const authorization = require("../response/authorization.js");

function modify(req, res) {
  const document = _.get(req, ["body", "document"]);
  const status = 'modify';
  const converted_at = new Date();
  const updated_at = new Date();

  db.query(`update register_${req.params.part} set document = ?, status = ?, converted_at = ?, updated_at = ? WHERE id = ? `, [
    JSON.stringify(document), status, converted_at, updated_at, req.params.id
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
