const mysql = require("mysql2/promise");
const root = require("../config-cors.js");
const rootGrade = require("../config-modify.js");
const rootCors = require("../config-cors.js");

const dbGrade = mysql.createPool(rootGrade());
const dbCors = mysql.createPool(rootCors());

const success = require("../response/success.js");
const empty = require("../response/empty.js");
const error = require("../response/error.js");
const authenticate = require("../middlewares/authenticate.js");

module.exports = async function (req, res) {
  try {
    const { department_id } = req.body;
    if (!department_id || +department_id !== 0) return error(res, "กรุณาระบุ department_id");

    // ดึงรายวิชาทั้งหมดในแผนก
    const [subjects] = await dbCors.query(`
      SELECT 
        id, name, subject_code, class, room, department_id, created_at, updated_at
      FROM subject
      WHERE department_id = ?`,
      [department_id]
    );

    if (!subjects || subjects.length === 0) return empty(res);

    const results = [];

    // วนแต่ละวิชา
    for (const subj of subjects) {
      // หา course ของแต่ละวิชา (ไม่ต้องส่ง user_id แล้ว)
      const [courseRows] = await dbGrade.query(`
        SELECT * FROM course WHERE subject_id = ?`,
        [subj.id]
      );

      let course = null;
      let course_id = 0;
      let teacher_id = null;
      if (courseRows && courseRows[0]) {
        course = courseRows[0];
        course_id = course.id;
        teacher_id = course.user_id;
      }

      // ดึง groub_course ที่ confirm แล้ว
      const [groupConfirmed] = await dbGrade.query(`
        SELECT * FROM groub_course
        WHERE course_id = ? AND JSON_UNQUOTE(JSON_EXTRACT(activity, '$.confirm_date')) IS NOT NULL`,
        [course_id]
      );

      // ดึง groub_course ที่ยังไม่ confirm
      const [groupNotConfirmed] = await dbGrade.query(`
        SELECT * FROM groub_course
        WHERE course_id = ? AND JSON_UNQUOTE(JSON_EXTRACT(activity, '$.confirm_date')) IS NULL`,
        [course_id]
      );

      const groupAll = [];
      for (const g of [...groupConfirmed, ...groupNotConfirmed]) {
        groupAll.push({
          id: g.id,
          title: g.title,
          course_id: g.course_id,
          indicators: g.indicators,
          user_ids: g.user_ids,
          activity: g.activity,
          created_at: g.created_at,
          updated_at: g.updated_at,
        });
      }

      // ดึงข้อมูลครูผู้สอน (ถ้ามี)
      let teacher = null;
      if (teacher_id) {
        const [userRows] = await dbCors.query(`SELECT * FROM user WHERE id = ?`, [teacher_id]);
        teacher = userRows && userRows[0] ? userRows[0] : null;
      }

      // รวมข้อมูลสุดท้ายของแต่ละวิชา
      results.push({
        id: subj.id,
        subject_code: subj.subject_code,
        name: subj.name,
        class: subj.class,
        room: subj.room,
        department_id: subj.department_id,
        course,
        teacher_id,
        teacher,
        groub_course: groupAll,
        created_at: subj.created_at,
        updated_at: subj.updated_at,
      });
    }

    return success(res, results);

  } catch (err) {
    console.log(err);
    return error(res, err);
  }
};

