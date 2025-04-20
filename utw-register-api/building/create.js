const mysql = require("mysql2");
const _ = require('lodash');
const root = require("../config-cors.js");
let db = mysql.createPool(root());
const success = require("../response/success.js");
const empty = require("../response/empty.js");
const error = require("../response/error.js");
const authorization = require("../response/authorization.js");

function create(req, res) {
  const build_no = _.get(req, ["body", "build_no"]);
  const title = _.get(req, ["body", "title"]);
  const address = _.get(req, ["body", "address"]);

  try {
    if(build_no && title && address) {
      db.query('insert into building (build_no, title, address) values (?,?,?) ', [
        build_no, title, address
      ], (err, resp, field) => {
          if(!err) {
              return success(res, {
                build_no: build_no,
                title: title,
                address: address,
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
