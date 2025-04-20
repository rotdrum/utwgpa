const mysql = require("mysql2");
const root = require("../config-cors.js");
const _ = require('lodash');
let db = mysql.createPool(root());
const success = require("../response/success.js");
const error = require("../response/error.js");
const authorization = require("../response/authorization.js");

function create(req, res) {
  const id_card = _.get(req, ["body", "id_card"]);
  const information = _.get(req, ["body", "information"]);
  const address = _.get(req, ["body", "address"]);
  const is_grade = _.get(req, ["body", "is_grade"]);
  const education = _.get(req, ["body", "education"]);
  const parent = _.get(req, ["body", "parent"]);
  const document = _.get(req, ["body", "document"]);
  const status = 'register';

  try {
    db.query('insert into register_high (id_card, information, address, is_grade, education, parent, document, status) values (?,?,?,?,?,?,?,?) ', [
      id_card, JSON.stringify(information), JSON.stringify(address), is_grade, JSON.stringify(education), JSON.stringify(parent), JSON.stringify(document), status
    ], (err, resp, field) => {
        if(!err) {
            return success(res, {
              id_card: id_card,
              information: information,
              address: address,
              is_grade: is_grade,
              education: education,
              parent: parent,
              document: document,
              status: status,
            });
        } else {
          return error(res, err);
        }
    }) 
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
          db.query(
            "select * from register_high where id_card = ? and status != ? ",
            [_.get(req, ["body", "id_card"]), 'unapprove'],
            (err, data) => {
              if (data[0]) {
                console.log(JSON.stringify({
                  response: 422,
                  message: 'error id duplicate',
                  api: '/api/create_high',
                  date: new Date() + '',
                  id_card: _.get(req, ["body", "id_card"]),
                  status: 'bad'
                }));
                return error(res, 'ID Card Duplicate');
              } else {
                console.log(JSON.stringify({
                  response: 200,
                  message: 'success',
                  api: '/api/create_high',
                  date: new Date() + '',
                  id_card: _.get(req, ["body", "id_card"]),
                  status: 'register'
                }));
                create(req, res);
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
