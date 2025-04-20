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
  console.log("server utw-register-api is running....");
});

const whitelist = [
  "http://localhost",
  "http://localhost:3001",
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

let endpoint = "/uat/utw-register-api";
if (authRepo == "prd") {
    endpoint = "/utw-register-api";
} 
const timezone = {
  scheduled: true,
  timezone: "Asia/Bangkok"
};

/** API */
const giveClassroomModule = require("./register/give-classroom.js");
app.patch(endpoint + "/give-classroom/:id/:part", cors(corsOptions), giveClassroomModule);

const updateFileModule = require("./register/update-file.js");
app.patch(endpoint + "/modify/:id/:part", cors(corsOptions), updateFileModule);

const unapproveModule = require("./register/unapprove.js");
app.patch(endpoint + "/unapprove/:id/:part", cors(corsOptions), unapproveModule);

const identifyModule = require("./register/identify.js");
app.patch(endpoint + "/identify/:id/:part", cors(corsOptions), identifyModule);

const changeLevelModule = require("./register/change-level.js");
app.patch(endpoint + "/change-level/:id/:part", cors(corsOptions), changeLevelModule);

const scoreShowModule = require("./register/score-information.js");
app.get(endpoint + "/score/information/:part/card/:id_card", cors(corsOptions), scoreShowModule);

const informationShowModule = require("./register/information.js");
app.get(endpoint + "/information/show/:part/card/:id_card", cors(corsOptions), informationShowModule);

const registerShowModule = require("./register/get-one.js");
app.get(endpoint + "/register/show/:part", cors(corsOptions), registerShowModule);

const registerGetModule = require("./register/get-all.js");
app.get(endpoint + "/register/:part", cors(corsOptions), registerGetModule);

const registerCountGetModule = require("./register/get-all-count.js");
app.get(endpoint + "/register-count/:part", cors(corsOptions), registerCountGetModule);

const registerGetRoomModule = require("./register/get-all-room.js");
app.get(endpoint + "/register/:title/:part", cors(corsOptions), registerGetRoomModule);

const registerGetReportModule = require("./register/get-all-report.js");
app.get(endpoint + "/register/report/:part", cors(corsOptions), registerGetReportModule);

const registerGetEditModule = require("./register/get-all-edit.js");
app.get(endpoint + "/register/report/edit/:part", cors(corsOptions), registerGetEditModule);

const registerGetUnapproveModule = require("./register/get-all-unapprove.js");
app.get(endpoint + "/register/report/not-approve/:part", cors(corsOptions), registerGetUnapproveModule);

const registerGetSummeryModule = require("./register/summery.js");
app.get(endpoint + "/register/report/summery/:part", cors(corsOptions), registerGetSummeryModule);

const registerGetReportDailyModule = require("./register/get-daily-report.js");
app.post(endpoint + "/register/report-daily/:part", cors(corsOptions), registerGetReportDailyModule);

const registerMidModule = require("./register/create.js");
app.post(endpoint + "/register/mid", cors(corsOptions), registerMidModule);

const registerHighModule = require("./register/create-high.js");
app.post(endpoint + "/register/high", cors(corsOptions), registerHighModule);

const registerCheckCradIdModule = require("./register/check-id-card.js");
app.post(endpoint + "/check/id-card", cors(corsOptions), registerCheckCradIdModule);

const buildingGetAllModule = require("./building/get-all.js");
app.get(endpoint + "/building", cors(corsOptions), buildingGetAllModule);

const buildingGetOneModule = require("./building/get-one.js");
app.get(endpoint + "/building/:id", cors(corsOptions), buildingGetOneModule);

const buildingCreateModule = require("./building/create.js");
app.post(endpoint + "/building", cors(corsOptions), buildingCreateModule);

const buildingDestroyModule = require("./building/destroy.js");
app.delete(endpoint + "/building/:id", cors(corsOptions), buildingDestroyModule);

const buildingModifyModule = require("./building/modify.js");
app.patch(endpoint + "/building/:id", cors(corsOptions), buildingModifyModule);

const buildingIsActiveModule = require("./building/is-active.js");
app.patch(endpoint + "/building/:id/status", cors(corsOptions), buildingIsActiveModule);

const classroomGetAllModule = require("./classroom/get-all.js");
app.get(endpoint + "/classroom", cors(corsOptions), classroomGetAllModule);

const classroomCreateModule = require("./classroom/create.js");
app.post(endpoint + "/classroom", cors(corsOptions), classroomCreateModule);

const classroomGetOneModule = require("./classroom/get-one.js");
app.get(endpoint + "/classroom/:id", cors(corsOptions), classroomGetOneModule);

const classroomDestroyModule = require("./classroom/destroy.js");
app.delete(endpoint + "/classroom/:id", cors(corsOptions), classroomDestroyModule);

const classroomModifyModule = require("./classroom/modify.js");
app.patch(endpoint + "/classroom/:id", cors(corsOptions), classroomModifyModule);

const classroomIsActiveModule = require("./classroom/is-active.js");
app.patch(endpoint + "/classroom/:id/status", cors(corsOptions), classroomIsActiveModule);

/** Cron Job */
const summeryMidOfDayCorn = require("./cron/mid-of-day.js");
cron.schedule('30 23 * * *', summeryMidOfDayCorn, timezone);

const summeryHighOfDayCorn = require("./cron/high-of-day.js");
cron.schedule('40 23 * * *', summeryHighOfDayCorn, timezone);