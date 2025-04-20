const mysql = require("mysql2");
const root = require("../config-cors.js");

let db = mysql.createPool(root());
const success = require("../response/success.js");
const empty = require("../response/empty.js");
const error = require("../response/error.js");
const authorization = require("../response/authorization.js");

function getAll(req, res) {
  try {
    db.query("select * from building", [], (err, data) => {
      if (data && data[0]) {
        console.log(JSON.stringify({
          api: '/api/get_all',
          date: new Date() + '',
          response: 200,
          message: 'success'
        }))
        return success(res, data);
      } else if (err) {
        console.log(JSON.stringify({
          api: '/api/get_all',
          date: new Date() + '',
          response: 400,
          message: 'bad : ' + err
        }))
        return error(res, err);
      } else {
        console.log(JSON.stringify({
          api: '/api/get_all',
          date: new Date() + '',
          response: 200,
          message: 'bad : empty data'
        }))
        return empty(res);
      }
    });
  } catch (err) {
    console.log(JSON.stringify({
      api: '/api/get_all',
      date: new Date() + '',
      response: 500,
      message: 'system error ' 
    }))
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
          getAll(req, res);
        }
      }
    );
  } catch (err) {
    return error(res, err);
  }
};
