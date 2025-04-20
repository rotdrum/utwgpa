const mysql = require("mysql2");
const root = require("../config-cors.js");
const _ = require('lodash');
let db = mysql.createPool(root());
const success = require("../response/success.js");
const empty = require("../response/empty.js");
const error = require("../response/error.js");
const authorization = require("../response/authorization.js");

function create(req, res) {
  const building_id = _.get(req, ["body", "building_id"]);
  const title = _.get(req, ["body", "title"]);
  const seat = _.get(req, ["body", "seat"]);

  try {
    if(building_id && title && seat) {
      db.query('insert into classroom (building_id, title, seat) values (?,?,?) ', [
        building_id, title, seat
      ], (err, resp, field) => {
          if(!err) {
              return success(res, {
                building_id: building_id,
                title: title,
                seat: seat,
              });
          } else {
            return error(res, err);
          }
      }) 
    } else {
      return error(res, 'Error Param');
    }
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
          create(req, res);
        }
      }
    );
  } catch (err) {
    return error(res, err);
  }
};
