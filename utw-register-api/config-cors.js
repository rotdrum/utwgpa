require('dotenv').config();
const authRepo = process.env.AuthRepo;
let database = "utw_cors_uat";

if (authRepo == "prd") {
  database = "utw_cors";
} 

module.exports = function () {
  return {
    host: process.env.CorsHost,
    user: process.env.CorsUsername,
    password: process.env.CorsPassword,
    database: database,
  };
}