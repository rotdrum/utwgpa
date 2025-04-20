require('dotenv').config();

const authRepo = process.env.AuthRepo;
let endpoint = "http://localhost:3002";
if (authRepo == "prd") {
  endpoint = "https://utwgpa.com";
} else if (authRepo == "uat") {
  endpoint = "https://utwgpa.com/uat";
}

module.exports = function () {
  return endpoint;
}