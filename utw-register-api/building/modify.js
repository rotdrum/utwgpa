const mysql = require("mysql2");
const root = require("../config-cors.js");
const _ = require('lodash');
let db = mysql.createPool(root());
const success = require("../response/success.js");
const error = require("../response/error.js");
const authorization = require("../response/authorization.js");

function modify(req, res) {
  const build_no = _.get(req, ["body", "build_no"]);
  const title = _.get(req, ["body", "title"]);
  const address = _.get(req, ["body", "address"]);
  const updated_at = new Date();

  if(build_no && title && address) {
    db.query('update building set build_no = ?, title = ?, address = ?, updated_at = ? WHERE id = ? ', [
      build_no, title, address, updated_at, req.params.id
    ], (err) => {
        if(!err) {
          getOne(req, res);
        } else {
          return error(res, err);
        }
    }) 
  } else {
    return error(res, 'Error Param');
  }
}

function getOne(req, res) {
  try {
    db.query(
      "select * from building where id = ? ",
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
