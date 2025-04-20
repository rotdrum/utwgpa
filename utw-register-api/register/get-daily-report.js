const mysql = require("mysql2");
const root = require("../config-cors.js");
const _ = require('lodash');
let db = mysql.createPool(root());
const success = require("../response/success.js");
const error = require("../response/error.js");
const authorization = require("../response/authorization.js");
const empty = require("../response/empty.js");

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
            `select * from register_${req.params.part} where status = ? and updated_at like ? `,
            ['approve', _.get(req, ["body", "date"])],
            (err, data2) => {
              if (data2 && data2[0]) {
                console.log('ok');
                return success(res, data2);
              } else if (err) {
                return error(res, err);
              } else {
                return empty(res);
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
