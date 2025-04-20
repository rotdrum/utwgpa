<?php
    require_once('../config.php');
    require_once('../resource/header.php');
    require_once('../call-api.php');

    if ($code !== 200) {
        echo $result;
    } else {
        if ($_SERVER['REQUEST_METHOD'] == "POST") {
            $user_ids = $_POST['users_id'];
            require_once('../call-user-ids.php');

            $indicators = json_decode($_POST['indicators']);
            $arr_indicators = array();
            foreach ($indicators as $indicator) {
                $arr_indicator = array(
                    "indicator" => $indicator,
                    "status" => "register",
                );
                array_push($arr_indicators, $arr_indicator);
            }

            $grade_old = json_decode($_POST['grade_old']);
            $score_old = json_decode($_POST['score_old']);

            $arr_users = array();
            $index = 0;
            foreach ($users as $user) {
                $grade_new = null;
                $select_grade = [];
                if ($grade_old[$index] == 'ร') {
                    $grade_new = '1';
                    $select_grade = ['4', '3.5', '3', '2.5', '2', '1.5', '1'];
                } else if ($grade_old[$index] == '0') {
                    $grade_new = '1';
                    $select_grade = ['1'];
                } else if ($grade_old[$index] == 'มส.') {
                    $grade_new = '1';
                    $select_grade = ['1'];
                } else if ($grade_old[$index] == 'มผ.') {
                    $grade_new = 'ผ';
                    $select_grade = ['ผ'];
                }
                $arr_user = array(
                    "id" => $user->id,
                    "tname" => $user->tname,
                    "fname" => $user->fname,
                    "lname" => $user->lname,
                    "class" => $user->class,
                    "room" => $user->room,
                    "part" => $user->part,
                    "grade_old" => $grade_old[$index],
                    "score_old" => $score_old[$index],
                    "grade_new" => $grade_new,
                    "select_grade" => $select_grade,
                    "confirm_date" => null,
                    "status" => "wait_register",
                    "work" => $arr_indicators,
                );
                array_push($arr_users, $arr_user);
                $index++;
            }
            
            $title = $_POST['title'];
            $course_id = $_POST['course_id'];
            $indicators = $_POST['indicators'];
            $activity = json_encode($arr_users);
    
            $table_name = 'groub_course';
            $column = '`title`, `course_id`, `indicators`, `user_ids`, `activity`';
            $val = '?, ?, ?, ?, ?';
    
            $query = "INSERT INTO ". $table_name ." (". $column .") VALUES (". $val .")";
            $stmt = $db->prepare($query);
            if($stmt->execute([
                $title, $course_id, $indicators, $user_ids, $activity
            ])) {
                $items["data"] = [
                    "title" => $title,
                    "course_id" => $course_id,
                    "indicators" => $indicators,
                    "user_ids" => $user_ids,
                    "activity" => $activity,
                ];
                require_once('../resource/success.php');
                echo json_encode($items);
            } else {
                require_once('../resource/errPram.php');
                echo json_encode($items);
            }
        }
    }
?>