<?php
    require_once('../config.php');
    require_once('../resource/header.php');
    require_once('../call-api.php');

    if ($code !== 200) {
        echo $result;
    } else {
        if ($_SERVER['REQUEST_METHOD'] == "POST") {
            $user_id = $_POST['user_id'];
    
            $select_stmt = $db->prepare("SELECT * FROM course WHERE user_id = ? ");
            $select_stmt->execute([$user_id]);
            $data_item = array();

            while($row = $select_stmt->fetch(PDO::FETCH_ASSOC)) {
                $select_gc = $db->prepare("SELECT * FROM groub_course WHERE course_id = ? ");
                $select_gc->execute([$row['id']]);
                $row_gc = $select_gc->fetch(PDO::FETCH_ASSOC);
                if (is_array($row_gc))  {
                    $data_row = array(
                        "id" => $row['id'],
                        "subject_id" => $row['subject_id'],
                        "subject_title" => $row['subject_title'],
                        "subject_code" => $row['subject_code'],
                        "subject_class" => $row['subject_class'],
                        "disable_delete" => true,
                        "user_id" => $row['user_id'],
                        "indicators" => $row['indicators'],
                        "created_at" => $row['created_at'],
                        "updated_at" => $row['updated_at'],
                    );
                    array_push($data_item, $data_row);
                } else {
                    $data_row = array(
                        "id" => $row['id'],
                        "subject_id" => $row['subject_id'],
                        "subject_title" => $row['subject_title'],
                        "subject_code" => $row['subject_code'],
                        "subject_class" => $row['subject_class'],
                        "disable_delete" => false,
                        "user_id" => $row['user_id'],
                        "indicators" => $row['indicators'],
                        "created_at" => $row['created_at'],
                        "updated_at" => $row['updated_at'],
                    );
                    array_push($data_item, $data_row);
                }
            }

            $items['data'] = $data_item;
            require_once('../resource/success.php');
            echo json_encode($items);
        }
    }
?>