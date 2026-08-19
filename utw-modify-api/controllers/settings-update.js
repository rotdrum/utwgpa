const mysql = require("mysql2/promise");
const rootCors = require("../config-cors.js");

const dbCors = mysql.createPool(rootCors());

const success = require("../response/success.js");
const empty = require("../response/empty.js");
const error = require("../response/error.js");

module.exports = async function (req, res) {
  try {
    const keyAddress = req.body.key_address;
    let inData = req.body.in_data;

    if (!keyAddress || inData === undefined) {
      return empty(res);
    }

    if (typeof inData === "string") {
      try {
        inData = JSON.parse(inData);
      } catch {
        return res.status(422).json({
          data: [],
          status: {
            code: 422,
            message: "Invalid settings data",
          },
        });
      }
    }

    if (keyAddress === "repeat_date") {
      const currentEducationYear = new Date().getFullYear() + 543;
      const minimumEducationYear = currentEducationYear - 1;
      const educationYear = Number(inData.date_year_education);

      if (
        !Number.isInteger(educationYear) ||
        educationYear < minimumEducationYear ||
        educationYear > currentEducationYear
      ) {
        return res.status(422).json({
          data: [],
          status: {
            code: 422,
            message: `Education year must be between ${minimumEducationYear} and ${currentEducationYear}`,
          },
        });
      }
    }

    const [result] = await dbCors.query(
      "UPDATE settings SET in_data = ?, updated_at = ? WHERE key_address = ?",
      [JSON.stringify(inData), new Date(), keyAddress]
    );

    if (!result.affectedRows) {
      return empty(res);
    }

    const [data] = await dbCors.query(
      "SELECT * FROM settings WHERE key_address = ?",
      [keyAddress]
    );

    return success(res, data[0]);
  } catch (err) {
    console.log(err);
    return error(res, err);
  }
};
