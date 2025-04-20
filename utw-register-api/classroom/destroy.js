const mysql = require("mysql2");
const root = require("../config-cors.js");

let db = mysql.createPool(root());
const success = require("../response/success.js");
const error = require("../response/error.js");
const authorization = require("../response/authorization.js");

function destroy(req, res) {
  try {
    db.query(
      "delete from classroom where id = ? ",
      [req.params.id],
      (err, data) => {
        if (!err) {
          return success(res, []);
        } else {
          return error(res, err);
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
          destroy(req, res);
        }
      }
    );
  } catch (err) {
    return error(res, err);
  }
};
