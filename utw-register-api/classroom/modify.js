const mysql = require("mysql2");
const root = require("../config-cors.js");
const _ = require('lodash');
let db = mysql.createPool(root());
const success = require("../response/success.js");
const error = require("../response/error.js");
const authorization = require("../response/authorization.js");

function modify(req, res) {
  const building_id = _.get(req, ["body", "building_id"]);
  const title = _.get(req, ["body", "title"]);
  const seat = _.get(req, ["body", "seat"]);
  const updated_at = new Date();

  if(building_id && title && seat) {
    db.query('update classroom set building_id = ?, title = ?, seat = ?, updated_at = ? WHERE id = ? ', [
      building_id, title, seat, updated_at, req.params.id
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
      "select * from classroom where id = ? ",
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
