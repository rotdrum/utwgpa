const test = require("node:test");
const assert = require("node:assert/strict");

const {
  buildCurrentActivities,
  getWorkStatus,
} = require("../services/follow-class.js");

test("uses the student's current classroom instead of transaction data", () => {
  const students = new Map([
    [101, {
      id: 101,
      tname: "นาย",
      fname: "พิมมา",
      lname: "ทดสอบ",
      class: 4,
      room: 2,
      part: 1,
    }],
  ]);
  const activities = [{
    id: 101,
    tname: "เด็กชาย",
    fname: "ชื่อเดิม",
    lname: "นามสกุลเดิม",
    class: 3,
    room: 5,
    status: "register",
    work: [{ status: "success" }, { status: "wait" }],
    grade_old: "0",
    grade_new: "1",
  }];

  const result = buildCurrentActivities(activities, students);

  assert.equal(result.length, 1);
  assert.equal(result[0].class, 4);
  assert.equal(result[0].room, 2);
  assert.equal(result[0].fname, "พิมมา");
  assert.equal(result[0].status_work, "process");
  assert.equal(result[0].grade_old, "0");
});

test("removes transactions for users who are no longer current students", () => {
  const result = buildCurrentActivities([{ id: 999 }], new Map());

  assert.deepEqual(result, []);
});

test("keeps existing work status behavior", () => {
  assert.equal(getWorkStatus("wait_register", []), "wait_begin");
  assert.equal(getWorkStatus("register", []), "success");
  assert.equal(getWorkStatus("register", [{ status: "wait" }]), "begin");
  assert.equal(
    getWorkStatus("register", [{ status: "success" }, { status: "wait" }]),
    "process"
  );
  assert.equal(
    getWorkStatus("register", [{ status: "success" }]),
    "success"
  );
});
