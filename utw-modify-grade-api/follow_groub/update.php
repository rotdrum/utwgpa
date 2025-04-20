<?php
    require_once('../config.php');
    require_once('../resource/header.php');
    require_once('../call-api.php');

    if ($code !== 200) {
        echo $result;
    } else {
        if ($_SERVER['REQUEST_METHOD'] == "POST") {
            $id = $_POST['id'];
            $student_id = $_POST['student_id'];
            $student_work = json_decode($_POST['student_work']);

          
            $select_stmt = $db->prepare("SELECT * FROM groub_course WHERE id = ? ");
            $select_stmt->execute([$id]);

            $row = $select_stmt->fetch(PDO::FETCH_ASSOC);
            if (is_array($row))  {
                $activities = json_decode($row['activity']);

                $arr_activities = array();
                foreach ($activities as $activity) {
                    if ($activity->id == $student_id) {
                        $arr_activity = array(
                            "id" => $activity->id,
                            "tname" => $activity->tname,
                            "fname" => $activity->fname,
                            "lname" => $activity->lname,
                            "class" => $activity->class,
                            "room" => $activity->room,
                            "part" => $activity->part,
                            "status" => $activity->status,
                            "work" => $student_work,
                            "grade_old" => $activity->grade_old,
                            "grade_new" => $_POST['grade_new'],
                            "select_grade" => $activity->select_grade,
                            "confirm_date" => $activity->confirm_date,
                        );
                        array_push($arr_activities, $arr_activity);
                    } else {
                        $arr_activity = array(
                            "id" => $activity->id,
                            "tname" => $activity->tname,
                            "fname" => $activity->fname,
                            "lname" => $activity->lname,
                            "class" => $activity->class,
                            "room" => $activity->room,
                            "part" => $activity->part,
                            "work" => $activity->work,
                            "status" => $activity->status,
                            "grade_old" => $activity->grade_old,
                            "grade_new" => $activity->grade_new,
                            "select_grade" => $activity->select_grade,
                            "confirm_date" => $activity->confirm_date,
                        );
                        array_push($arr_activities, $arr_activity);
                    }
                }

                try {
                    $stmtUpdate = $db->prepare("UPDATE groub_course SET activity = ?, updated_at = ? WHERE id = ? ");
                    $stmtUpdate->execute([json_encode($arr_activities), $updated_at, $id]);
                    
                    $stmtGet = $db->prepare("SELECT * FROM groub_course WHERE id = ? ");
                    $stmtGet->execute([$id]);
                    $row = $stmtGet->fetch(PDO::FETCH_ASSOC);
    
                    $items["data"] = $row;
                    require_once('../resource/success.php');
                    echo json_encode($items);
                }
                catch(PDOException $e) {
                    require_once('../resource/errPram.php');
                    echo json_encode($items);
                }
            }
        }
    }
?>