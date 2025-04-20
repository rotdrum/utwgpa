const multer = require('multer')
const path = require('path');
const success = require("../response/success.js");
const error = require("../response/error.js");
const fs = require('fs');
const endpoint = require("../config.js");
require('dotenv').config();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, `../storage/settings/example-register/${req.params.order}`)
  },
  filename: (req, file, cb) => {
    if(path.extname(file.originalname).includes('pdf')) {
      cb(null, generateString(30) + '.pdf')
    }
    else if(path.extname(file.originalname).includes('jpeg')) {
      cb(null, generateString(30) + '.jpeg')
    } 
    else {
      cb(null, generateString(30) + '.jpg')
    }
  },
})

const upload = multer({ storage: storage }).single('myfile')
module.exports =  function (req, res) {
  console.log('start upload')
  const pathBegin = `storage/settings/example-register/${req.params.order}`;
  fs.mkdir(`../${pathBegin}`, { recursive: true }, (errMkdir) => {
    if (errMkdir) {
      return error(res, errMkdir);
    }
    else {
      upload(req, res, (errUpload) => {
        if (!errUpload) {
          const createPath = `${endpoint()}/${pathBegin}`;
          console.log(JSON.stringify({
            response: 200,
            message: 'success',
            api: '/api/uploadfile_example_document',
            date: new Date() + '',
            order: req.params.order,
            path: req.file.filename,
            fullpath: `${createPath}/${req.file.filename}`
          }));
          return success(res, {
            path: `${createPath}/${req.file.filename}`,
          });
        } else {
          console.log(JSON.stringify({
            response: 422,
            message: 'error : ' + JSON.stringify(errUpload),
            api: '/api/uploadfile_example_document',
            date: new Date() + '',
            order: req.params.order,
          }));
          return error(res, errUpload);
        }
      })
    }
  });
};

function generateString(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() *
      charactersLength));
  }
  return result;
}
