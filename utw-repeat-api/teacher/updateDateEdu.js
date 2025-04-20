const mysql = require("mysql2");
const root = require("../config-cors.js");
const rootGrade = require("../config-modify.js");
const _ = require('lodash');
let db = mysql.createPool(root());
let dbGrade = mysql.createPool(rootGrade());

const success = require("../response/success.js");
const empty = require("../response/empty.js");
const error = require("../response/error.js");
const authorization = require("../response/authorization.js");

function getOne(req, res) {
  try {
    dbGrade.query("select * from `repeat` WHERE id = ?", [
      req.params.id
    ], (err, data) => {
      if (data && data[0]) {
      
        const input = _.get(req, ["body", "date"]); // Assuming 'date' contains the string to add, like "aa" or "bb"

if (input) {
  // Retrieve current `time_learning` data to update it
  dbGrade.query('SELECT `time_learning` FROM `repeat` WHERE id = ?', [req.params.id], (selectErr, data) => {
    if (selectErr) {
      return error(res, selectErr);  // Handle SQL query error
    }
    
    // Check if data was returned and process accordingly
    if (data && data.length > 0) {
      let time_learning = [];

      if (data[0].time_learning) {
        time_learning = data[0].time_learning;
      }
      
      // Push the new date into the array, only if it's not already there to avoid duplicates
      if (!time_learning.includes(input)) {
        time_learning.push(input);
      }

      // Update the database with the new or updated `time_learning` array
      dbGrade.query('UPDATE `repeat` SET time_learning = ?, updated_at = ? WHERE id = ?', [
        JSON.stringify(time_learning), new Date(), req.params.id
      ], (updateErr) => {
          if (!updateErr) {
            return success(res, {time_learning: time_learning});  // Return updated data
          } else {
            return error(res, updateErr);  // Handle SQL update error
          }
      });
    } else {
      return error(res, new Error("No data found for the given ID"));  // No data was found
    }
  });
} else {
  // Input date is undefined or not given, handle error
  return error(res, new Error("Input date is required"));
}


      } else if (err) {
        return error(res, err);
      } else {
        return empty(res);
      }
    });
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
          getOne(req, res);
        }
      }
    );
  } catch (err) {
    return error(res, err);
  }
};
