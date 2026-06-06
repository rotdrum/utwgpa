function getWorkStatus(statusRegister, works) {
  if (statusRegister === "wait_register") {
    return "wait_begin";
  }

  const workItems = Array.isArray(works) ? works : [];
  const completedCount = workItems.filter((work) => work.status === "success").length;

  if (completedCount === workItems.length) {
    return "success";
  }
  if (completedCount > 0) {
    return "process";
  }
  return "begin";
}

function buildCurrentActivities(activities, studentsById) {
  if (!Array.isArray(activities)) {
    return [];
  }

  return activities.flatMap((activity) => {
    const student = studentsById.get(Number(activity.id));
    if (!student) {
      return [];
    }

    const works = Array.isArray(activity.work) ? activity.work : [];

    return [{
      id: student.id,
      tname: student.tname,
      fname: student.fname,
      lname: student.lname,
      class: student.class,
      room: student.room,
      part: student.part,
      status: activity.status,
      work: works,
      status_work: getWorkStatus(activity.status, works),
      grade_old: activity.grade_old,
      grade_new: activity.grade_new,
      select_grade: activity.select_grade,
      confirm_date: activity.confirm_date,
    }];
  });
}

module.exports = {
  buildCurrentActivities,
  getWorkStatus,
};
