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
  "http://localhost:5500",
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
      // callback("Something is went wrong!");
      callback(null, true);
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

app.get("/health", (req,res) => {
  return res.status(200).json({
    responseCode: "200"
  })
});

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
app.post(endpoint + "/course-groub-update", cors(corsOptions), groubCourseUpdate);

const courseByIdModule = require("./controllers/course-getbyid");
app.get(endpoint + "/course/:id", cors(corsOptions), courseByIdModule);

const groubCourseCreateModule = require("./controllers/groub-course-create");
app.post(endpoint + "/groub-course/create", cors(corsOptions), groubCourseCreateModule);

// const groubCourseByIdModule = require("./controllers/groub-course-create");
// app.get(endpoint + "/groub-course/:id", cors(corsOptions), groubCourseByIdModule);

// utw-modify-grade-api/follow_groub/getAll.php
const followGroubGetAll = require("./controllers/follow-group-getall");
app.post(endpoint + "/follow-group-getall", cors(corsOptions), followGroubGetAll);

// utw-modify-grade-api/groub_course/cancel-grade.php
const groubCourseCancelGrade = require("./controllers/groub-course-cancel-grade");
app.post(endpoint + "/group-course-cancel-grade", cors(corsOptions), groubCourseCancelGrade);

// /utw-modify-grade-api/follow_groub/update.php
const followGroubUpdate = require("./controllers/follow-group-update");
app.post(endpoint + "/follow-group-update", cors(corsOptions), followGroubUpdate);

// utw-modify-grade-api/groub_course/confirm-grade.php
const groubCourseConfirmGrade = require("./controllers/groub-course-confirm-grade");
app.post(endpoint + "/group-course-confirm-grade", cors(corsOptions), groubCourseConfirmGrade);

// follow_class/getAll.php
const followClassGetAll = require("./controllers/follow-class-getall");
app.post(endpoint + "/follow-class-getall", cors(corsOptions), followClassGetAll);

// utw-modify-grade-api/report-subject.php
const reportSubject = require("./controllers/report-subject");
app.post(endpoint + "/report-subject", cors(corsOptions), reportSubject);

// utw-modify-grade-api/student_follow/getAll.php
const studentFollowGetAll = require("./controllers/student-follow-getall");
app.post(endpoint + "/student-follow-getall", cors(corsOptions), studentFollowGetAll);

// utw-modify-grade-api/student_follow/update.php
const studentFollowUpdate = require("./controllers/student-follow-update");
app.post(endpoint + "/student-follow-update", cors(corsOptions), studentFollowUpdate);

// utw-cors-api/check-mail.php
const checkMail = require("./controllers/check-mail");
app.post("/check-mail", cors(corsOptions), checkMail);

// utw-cors-api/login.php
const login = require("./controllers/login");
app.post("/login", cors(corsOptions), login);

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

// utw-cors-api/login-admin.php
const loginAdmin = require("./controllers/login-admin");
app.post(endpoint + "/login-admin", cors(corsOptions), loginAdmin);

const repeatStudentName = require("./controllers/repeat-student-name");
app.post("/admin/repeat-student-name", cors(corsOptions), repeatStudentName);

const repeatStudentNameDelete = require("./controllers/repeat-student-name-delete");
app.post("/admin/repeat-student-name-delete", cors(corsOptions), repeatStudentNameDelete);

const beforeSendGrade = require("./controllers/before-send-grade.js");
app.post(endpoint + "/teacher/before-send-grade", cors(corsOptions), beforeSendGrade);

const afterSendGrade = require("./controllers/after-send-grade.js");
app.post(endpoint + "/teacher/after-send-grade", cors(corsOptions), afterSendGrade);

const sendCanan = require("./controllers/send-canan.js");
app.post(endpoint + "/teacher/sendCanan", cors(corsOptions), sendCanan);

const reportFollowSuccess = require("./controllers/report-course-follow-success");
app.post(endpoint + "/report/course-follow-success", cors(corsOptions), reportFollowSuccess);

const reportFollowSuccessAdmin = require("./controllers/admin-report-course-follow-success");
app.post("/admin/report/course-follow-success", cors(corsOptions), reportFollowSuccessAdmin);