<?php
    require_once('../config.php');
    require_once('../resource/header.php');
    require_once('../auth/token.php');

    if ($code !== 200) {
        echo $result;
    } else {
        if ($_SERVER['REQUEST_METHOD'] == "POST") {
            $is_active = 1;
            $department_id = $_POST['department_id'];

            $select_stmt = $db->prepare("SELECT * FROM subject WHERE is_active = ? AND (department_id = ? OR department_id = ?)");
            $select_stmt->execute([$is_active, $department_id, 0]);

            $data_item = array();
            while($row = $select_stmt->fetch(PDO::FETCH_ASSOC)) {
                extract($row);
                $data_row = array(
                    "id" => $id,
                    "subject_code" => $subject_code,
                    "name" => $name,
                    "class" => $class,
                    "room" => $room,
                    "is_active" => $is_active,
                    "department_id" => $department_id,
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