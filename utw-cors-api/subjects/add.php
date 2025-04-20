<?php
    require_once('../config.php');
    require_once('../resource/header.php');
    require_once('../auth/token-admin.php');

    if ($code !== 200) {
        echo $result;
    } else {
        if ($_SERVER['REQUEST_METHOD'] == "POST") {
            $table_name = 'subject';
            $subject_code = $_POST['subject_code'];
            $name = $_POST['name'];
            $class = $_POST['class'];
            $room = $_POST['room'];
            $department_id = $_POST['department_id'];

            if ($_POST['class'] == '') {
                $class = null;
            }
            if ($_POST['room'] == '') {
                $room = null;
            }

            $select_stmt = $db->prepare("SELECT * FROM ". $table_name ." WHERE `subject_code` = ? ");
            $select_stmt->execute([$subject_code]);
            
            $row = $select_stmt->fetch(PDO::FETCH_ASSOC);
    
            if (is_array($row)) {
                require_once('../resource/errDataDuplicate.php');
                echo json_encode($items);
            } else {
                $column = '`subject_code`, `name`, `class`, `room`, `department_id`';
                $val = '?, ?, ?, ?, ?';
        
                $query = "INSERT INTO ". $table_name ." (". $column .") VALUES (". $val .")";
                $stmt = $db->prepare($query);
                if($stmt->execute([
                    $subject_code, $name, $class, $room, $department_id
                ])) {
                    $items["data"] = [
                        "subject_code" => $subject_code,
                        "name" => $name,
                        "class" => $class,
                        "room" => $room,
                        "department_id" => $department_id,
                    ];
                    require_once('../resource/success.php');
                    echo json_encode($items);
                } else {
                    require_once('../resource/errPram.php');
                    echo json_encode($items);
                }
            }
        } else {
            http_response_code(405);
        }
    }
?>