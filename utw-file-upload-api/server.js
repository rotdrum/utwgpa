let express = require('express');
let app = express()
var bodyParser = require("body-parser");
const cors = require("cors");

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }));

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

require('dotenv').config();
const authRepo = process.env.AuthRepo;
app.listen(parseInt(process.env.port), () => {
  console.log("server utw-file-upload-api is running....");
});

let endpoint = "/uat/utw-file-upload-api";
if (authRepo == "prd") {
  endpoint = "/utw-file-upload-api";
} 

const registerExDocumentModule = require("./register/example-document.js");
app.post(`${endpoint}/register/settings/document/:order`, cors(corsOptions), registerExDocumentModule)

const registerStudentSingUpModule = require("./register/student-signup.js");
app.post(`${endpoint}/register/singup/:id_card`, cors(corsOptions), registerStudentSingUpModule)
