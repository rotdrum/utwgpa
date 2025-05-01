const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const cron = require('node-cron');

app.use(bodyParser.json({ limit: "25mb" }));
app.use(
  bodyParser.urlencoded({
    extended: true,
    limit: "25mb",
    parameterLimit: 25000000000000000000,
  })
);

require('dotenv').config();
const authRepo = process.env.AuthRepo;
app.use(cors());
app.listen(parseInt(process.env.port), () => {
  console.log("server utw-modify-api is running....");
});

const whitelist = [
  "http://localhost",
  "http://localhost:3005",
  "https://utwgpa.com",
  "http://utwgpa.com",
  "https://www.utwgpa.com",
  "http://www.utwgpa.com",
];
const corsOptions = {
  origin: function (origin, callback) {
    // เมื่อขึ้น serve ลบ (origin === undefined) ออก
    if ((origin === undefined) || (whitelist.indexOf(origin) !== -1)) {
      callback(null, true);
    } else {
      // callback(new Error('Not allowed by CORS'))
      callback("Something is went wrong!");
    }
  },
};

let endpoint = "/uat/utw-modify-api";
if (authRepo == "prd") {
    endpoint = "/utw-modify-api";
} 
const timezone = {
  scheduled: true,
  timezone: "Asia/Bangkok"
};

/** API */
const testModule = require("./controllers/test");
app.get(endpoint + "/test/:id", cors(corsOptions), testModule);

const courseAlldModule = require("./controllers/course-getall");
app.get(endpoint + "/course", cors(corsOptions), courseAlldModule);

const courseByIdModule = require("./controllers/course-getbyid");
app.get(endpoint + "/course/:id", cors(corsOptions), courseByIdModule);

const groubCourseCreateModule = require("./controllers/groub-course-create");
app.post(endpoint + "/groub-course/create", cors(corsOptions), groubCourseCreateModule);

const groubCourseByIdModule = require("./controllers/groub-course-create");
app.get(endpoint + "/groub-course/:id", cors(corsOptions), groubCourseByIdModule);