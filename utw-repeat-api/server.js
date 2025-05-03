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
  console.log("server utw-repeat-api is running....");
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
      callback(null, true);
      // callback("Something is went wrong!");
    }
  },
};

let endpoint = "/uat/utw-repeat-api";
if (authRepo == "prd") {
    endpoint = "/utw-repeat-api";
} 
const timezone = {
  scheduled: true,
  timezone: "Asia/Bangkok"
};

/** API */
const migrationDepartmentModule = require("./migration/department.js");
app.get(endpoint + "/migration/department/:id", cors(corsOptions), migrationDepartmentModule);

const migrationReportSuccessModule = require("./migration/report-success.js");
app.get(endpoint + "/migration/report-success/:id", cors(corsOptions), migrationReportSuccessModule);

const migrationStoreRepeatsModule = require("./migration/store-repeat.js");
app.get(endpoint + "/migration/store-repeat/:id", cors(corsOptions), migrationStoreRepeatsModule);

const adminDashboardModule =  require("./admin/dashboard.js");
app.get(endpoint + "/admin/dashboard", cors(corsOptions), adminDashboardModule);

const migrationTeacherHistory = require("./report/report-teacher.js");
app.get(endpoint + "/history/teacher/:id", cors(corsOptions), migrationTeacherHistory);

const migrationAdminHistory = require("./report/report-admin.js");
app.post(endpoint + "/history/admin", cors(corsOptions), migrationAdminHistory);

const studentList = require("./student/getMe.js");
app.post(endpoint + "/student/list/:id", cors(corsOptions), studentList);

const studentListSuccess = require("./student/getModifySuccess.js");
app.post(endpoint + "/student/list/success/:id", cors(corsOptions), studentListSuccess);

const studentDetail = require("./student/getOne.js");
app.post(endpoint + "/student/detail/:id", cors(corsOptions), studentDetail);

const studentRegister = require("./student/register.js");
app.post(endpoint + "/student/register/:id", cors(corsOptions), studentRegister);

const teacherListRegister = require("./teacher/getMeRegister.js");
app.post(endpoint + "/teacher/list-register/:id", cors(corsOptions), teacherListRegister);

const teacherListFollow = require("./teacher/getMeFollow.js");
app.post(endpoint + "/teacher/list-follow/:id", cors(corsOptions), teacherListFollow);

const teacherListClassroom = require("./teacher/getInClass.js")
app.post(endpoint + "/teacher/list-class/:class/:room", cors(corsOptions), teacherListClassroom);

const teacherRegisterStudent = require("./teacher/registeStudent.js");
app.post(endpoint + "/teacher/register-student", cors(corsOptions), teacherRegisterStudent);

const teacherUpdateWork = require("./teacher/updateWork.js");
app.post(endpoint + "/teacher/update-work/:id", cors(corsOptions), teacherUpdateWork);

const teacherUpdateWork2 = require("./teacher/updateDateEdu.js");
app.post(endpoint + "/teacher/update-time-edu/:id", cors(corsOptions), teacherUpdateWork2);

const teacherUpdateWork3 = require("./teacher/popDateEdu.js");
app.post(endpoint + "/teacher/delete-time-edu/:id", cors(corsOptions), teacherUpdateWork3);

const teacherConfirmGrade = require("./teacher/confirmGrade.js");
app.post(endpoint + "/teacher/confirm-grade/:id", cors(corsOptions), teacherConfirmGrade);

const aaaa = require("./teacher/getMeReportList.js");
app.post(endpoint + "/teacher/list-report/:id", cors(corsOptions), aaaa);

const bbbbb = require("./teacher/getMeReportDetail.js");
app.post(endpoint + "/teacher/detail-report/:id/:subject_id", cors(corsOptions), bbbbb);

const ccccc = require("./admin/getReportNow.js");
app.post(endpoint + "/admin/now-report/:department_id", cors(corsOptions), ccccc);

const dasdsad = require("./admin/getReportOld.js");
app.post(endpoint + "/admin/now-report-old/:department_id/:term_at/:year_at", cors(corsOptions), dasdsad);

const dddd = require("./admin/getReportSuccess.js");
app.post(endpoint + "/admin/success-report/:department_id/:round_at/:term_at/:year_at", cors(corsOptions), dddd);

const ddrrr = require("./admin/getReportSuccessSubject.js");
app.post(endpoint + "/admin/success-report-subject/:subject_id/:round_at/:term_at/:year_at/:user_id", cors(corsOptions), ddrrr);

const ffff = require("./admin/getNotSuccess.js");
app.post(endpoint + "/admin/find/register-again", cors(corsOptions), ffff);

const gggg = require("./admin/updateRegisterAgain.js");
app.post(endpoint + "/admin/update/register-again", cors(corsOptions), gggg);

const hhhhh = require("./admin/getRepeatByAdmin.js");
app.post(endpoint + "/admin/get/repeat-me", cors(corsOptions), hhhhh);

const iiii = require("./admin/storeRepeatByAdmin.js");
app.post(endpoint + "/admin/add/repeat-me", cors(corsOptions), iiii);

const jjjj = require("./admin/getWaitRegister.js");
app.post(endpoint + "/admin/get/repeat-wait-register", cors(corsOptions), jjjj);

const kkkk = require("./admin/getUpdateSuccessByAdmin.js");
app.post(endpoint + "/admin/get/repeat-success-me", cors(corsOptions), kkkk);

const llll = require("./admin/updateSuccessByAdmin.js");
app.post(endpoint + "/admin/update/repeat-success-me", cors(corsOptions), llll);

const zzzz = require("./admin/subject.js");
app.post(endpoint + "/admin/get/subject", cors(corsOptions), zzzz);

const xxxx = require("./admin/student.js");
app.post(endpoint + "/admin/get/student", cors(corsOptions), xxxx);

const yyyy = require("./admin/teacher.js");
app.post(endpoint + "/admin/get/teacher", cors(corsOptions), yyyy);

const rrrr = require("./admin/deleteRepeat.js");
app.post(endpoint + "/admin/delete-repeat/:id", cors(corsOptions), rrrr);

const abcd = require("./admin/changeTeacher.js");
app.post(endpoint + "/admin/change-teacher/:id/:teacher_id", cors(corsOptions), abcd);

