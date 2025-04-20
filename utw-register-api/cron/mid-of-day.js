const mysql = require("mysql2");
const root = require("../config-cors.js");
const _ = require('lodash');
let db = mysql.createPool(root());

function getDateSetting() {
  try {
    db.query(
      `select * from settings where key_address = ?`,
      ['register_date'],
      (err, data) => {
        if (err) {
          console.log(err);
        } else {
          getStudentSuccess(data);
        }
      }
    );
  } catch (err) {
    console.log(err);
  }
}

function getStudentSuccess(dateSetting) {
  try {
    db.query(
      `select * from register_mid where status = ? and is_report = ?`,
      ['approve', 0],
      (err, data) => {
        if (err) {
          console.log(err);
        } else {
          const now = new Date();
          if (
            now >= Date.parse(dateSetting[0]?.in_data.date_begin) &&
            now <= Date.parse(dateSetting[0]?.in_data.date_last_doc)
          ) {
            addSumCount(data.length);
          } else {
            console.log("cron out time: mid-of-day");
          }
        }
      }
    );
  } catch (err) {
    console.log(err);
  }
}

function addSumCount(amount) {
  db.query('insert into report_register_mid_daily (amount) values (?) ', [
    amount
  ], (err, resp, field) => {
      if(!err) {
        const updated_at = new Date();
        db.query('update register_mid set is_report = ?, updated_at = ? WHERE status = ? and is_report = ? ', [
          1, updated_at, 'approve', 0
        ], (err) => {
            if(!err) {
              console.log('cron success :', updated_at);
            } else {
              console.log(err);
            }
        }) 
      } else {
        console.log(err);
      }
  }) 
}

module.exports = function () {
  getDateSetting();
};
