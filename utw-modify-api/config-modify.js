require('dotenv').config();
const authRepo = process.env.AuthRepo;
let database = "utw_modify_grade_uat";

if (authRepo == "prd") {
  database = "utw_modify_grade";
} 

module.exports = function () {
  return {
    host: process.env.CorsHost,
    user: process.env.CorsUsername,
    password: process.env.CorsPassword,
    database: database,
  };
}