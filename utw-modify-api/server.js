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
app.post(endpoint + "/course", cors(corsOptions), courseAlldModule);

// utw-modify-grade-api/groub_course/getAll.php
const groubCourseGetAll = require("./controllers/course-groub-getall");
app.post(endpoint + "/course-groub-getall", cors(corsOptions), groubCourseGetAll);

// utw-modify-grade-api/groub_course/update.php
const groubCourseUpdate = require("./controllers/groub-course-update");
app.get(endpoint + "/course-groub-update", cors(corsOptions), groubCourseUpdate);

const courseByIdModule = require("./controllers/course-getbyid");
app.get(endpoint + "/course/:id", cors(corsOptions), courseByIdModule);

const groubCourseCreateModule = require("./controllers/groub-course-create");
app.post(endpoint + "/groub-course/create", cors(corsOptions), groubCourseCreateModule);

// const groubCourseByIdModule = require("./controllers/groub-course-create");
// app.get(endpoint + "/groub-course/:id", cors(corsOptions), groubCourseByIdModule);

const courseGetOne = require("./controllers/course-getone");
app.post(endpoint + "/course-getone", cors(corsOptions), courseGetOne);

const subjectShow = require("./controllers/subject-show");
app.post(endpoint + "/subject-show", cors(corsOptions), subjectShow);

const createCourse = require("./controllers/course-create");
app.post(endpoint + "/course-create", cors(corsOptions), createCourse);

const updateCourse = require("./controllers/course-update");
app.post(endpoint + "/course-update", cors(corsOptions), updateCourse);

const deleteCourse = require("./controllers/course-delete");
app.post(endpoint + "/course-delete", cors(corsOptions), deleteCourse);

// utw-cors-api/students.php
const student = require("./controllers/student");
app.post(endpoint + "/student", cors(corsOptions), student);

// utw-modify-grade-api/groub_course/create.php
const groubCourseCreate = require("./controllers/groub-course-create");
app.post(endpoint + "/groub-course-create", cors(corsOptions), groubCourseCreate);

// utw-modify-grade-api/groub_course/delete.php
const groubCourseDelete = require("./controllers/groub-course-delete");
app.post(endpoint + "/groub-course-delete", cors(corsOptions), groubCourseDelete);