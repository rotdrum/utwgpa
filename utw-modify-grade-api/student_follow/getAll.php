<?php
    require_once('../config.php');
    require_once('../resource/header.php');
    require_once('../call-api.php');

    if ($code !== 200) {
        echo $result;
    } else {
        if ($_SERVER['REQUEST_METHOD'] == "POST") {
            $select_stmt = $db->prepare("SELECT groub_course.id, groub_course.course_id, course.user_id, course.subject_id, course.subject_title, course.subject_code, course.subject_class,
                groub_course.title, groub_course.indicators, groub_course.user_ids, groub_course.activity, groub_course.created_at, groub_course.updated_at 
                FROM groub_course INNER JOIN course ON groub_course.course_id = course.id");
            
            $select_stmt->execute();
            $data_item = array();

            while($row = $select_stmt->fetch(PDO::FETCH_ASSOC)) {
                extract($row);
                foreach (json_decode($user_ids) as $arr_user_id) {
                    if ($arr_user_id == $_POST['user_id']) {
                        foreach (json_decode($activity) as $atv) {
                            if ($atv->id == $_POST['user_id']) {
                                $student_id = $atv->id;
                                $tname = $atv->tname;
                                $fname = $atv->fname;
                                $lname = $atv->lname;
                                $class = $atv->class;
                                $room = $atv->room;
                                $part = $atv->part;
                                $grade_old = $atv->grade_old;
                                $grade_new = $atv->grade_new;
                                $select_grade = $atv->select_grade;
                                $confirm_date = $atv->confirm_date;
                                $status = $atv->status;
                                $status_register = $atv->status;
                                $works = $atv->work;

                                $countIndex = 0;
                                $countStatus = 0;
                                foreach ($works as $work) {
                                    if ($work->status === 'success') {
                                        $countStatus++;
                                    }
                                    $countIndex++;
                                }
            
                                $status_work = '';
                                if ($status_register === "wait_register") {
                                    $status_work = 'wait_begin';
                                } else {
                                    if ($countIndex === $countStatus) {
                                        $status_work = 'success';
                                    } else if ($countStatus > 0) {
                                        $status_work = 'process';
                                    } else if ($countStatus === 0) {
                                        $status_work = 'begin';
                                    }
                                }
            
                                $data_row_activity = [
                                    'id' => $student_id,
                                    'tname' => $tname,
                                    'fname' => $fname,
                                    'lname' => $lname,
                                    'class' => $class,
                                    'room' => $room,
                                    'part' => $part,
                                    'work' => $works,
                                    'status' => $status,
                                    'status_work' => $status_work,
                                    'grade_old' => $grade_old,
                                    'grade_new' => $grade_new,
                                    'select_grade' => $select_grade,
                                    "confirm_date" => $confirm_date,
                                ];
                            }
                        }

                        $data_row = array(
                            "id" => $id,
                            "course_id" => $course_id,
                            "user_id" => $user_id,
                            "subject_id" => $subject_id,
                            "subject_title" => $subject_title,
                            "subject_code" => $subject_code,
                            "subject_class" => $subject_class,
                            "title" => $title,
                            "indicators" => $indicators,
                            "user_ids" => $user_ids,
                            "activity" => $data_row_activity,
                            "created_at" => $created_at,
                            "updated_at" => $updated_at,
                        );
                        array_push($data_item, $data_row);
                    }
                }
            }

            $items['data'] = $data_item;
            require_once('../resource/success.php');
            echo json_encode($items);
        }
    }
?>



