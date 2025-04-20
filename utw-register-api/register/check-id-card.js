const mysql = require("mysql2");
const root = require("../config-cors.js");
const _ = require('lodash');
let db = mysql.createPool(root());
const success = require("../response/success.js");
const error = require("../response/error.js");
const authorization = require("../response/authorization.js");

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
          db.query(
            "select * from register_mid where id_card = ? and status != ? ",
            [_.get(req, ["body", "id_card"]), 'unapprove'],
            (err, data) => {
              if (data[0]) {
                return error(res, 'ID Card Duplicate');
              } else {
                db.query(
                  "select * from register_high where id_card = ? and status != ? ",
                  [_.get(req, ["body", "id_card"]), 'unapprove'],
                  (err, data) => {
                    if (data[0]) {
                      return error(res, 'ID Card Duplicate');
                    } else {
                      return success(res, {});
                    }
                  }
                );
              }
            }
          );
        }
      }
    );
  } catch (err) {
    return error(res, err);
  }
};
