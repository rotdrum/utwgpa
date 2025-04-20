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
            `select * from register_${req.params.part} where id_card = ? ORDER BY updated_at DESC`,
            [req.params.id_card],
            (err, data) => {
              if (data && data[0]) {
                console.log(JSON.stringify({
                  response: 200,
                  message: 'success',
                  api: '/api/check_status',
                  date: new Date() + '',
                  part: req.params.part,
                  id_card: req.params.id_card,
                  status: data[0].status
                }));
                return success(res, data[0]);
              } else if (err) {
                console.log(JSON.stringify({
                  response: 422,
                  message: 'bad : ' + JSON.stringify(err),
                  api: '/api/check_status',
                  date: new Date() + '',
                  part: req.params.part,
                  id_card: req.params.id_card,
                  status: '-'
                }));
                return error(res, err);
              } else {
                console.log(JSON.stringify({
                  response: 200,
                  message: 'success : not found data',
                  api: '/api/check_status',
                  date: new Date() + '',
                  part: req.params.part,
                  id_card: req.params.id_card,
                  status: '-'
                }));
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
