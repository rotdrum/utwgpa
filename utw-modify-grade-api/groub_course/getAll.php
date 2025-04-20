<?php
    require_once('../config.php');
    require_once('../resource/header.php');
    require_once('../call-api.php');

    if ($code !== 200) {
        echo $result;
    } else {
        if ($_SERVER['REQUEST_METHOD'] == "POST") {
            $user_id = $_POST['user_id'];
    
            $select_stmt = $db->prepare("SELECT groub_course.id, groub_course.course_id, course.user_id, course.subject_id, course.subject_title, course.subject_code, course.subject_class,
                groub_course.title, groub_course.indicators, groub_course.user_ids, groub_course.activity, groub_course.created_at, groub_course.updated_at 
                FROM groub_course INNER JOIN course ON groub_course.course_id = course.id  WHERE course.user_id = ? ");
            
            $select_stmt->execute([$user_id]);
            $data_item = array();

            while($row = $select_stmt->fetch(PDO::FETCH_ASSOC)) {
                extract($row);
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
                    "activity" => $activity,
                    "created_at" => $created_at,
                    "updated_at" => $updated_at,
                );
                array_push($data_item, $data_row);
            }

            $items['data'] = $data_item;
            require_once('../resource/success.php');
            echo json_encode($items);
        }
    }
?>