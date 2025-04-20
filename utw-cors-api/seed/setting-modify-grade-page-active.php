<?php
    require_once('../config.php');
    require_once('../resource/header.php');

    $key_address = 'modify_grade_page_active';
    $in_data = [
        'page_student_register_grade' => 1,
        'page_teacher_register_grade' => 1,
        'page_teacher_me_follow' => 1,
        'page_teacher_class_follow' => 1,
    ];

    $select_stmt = $db->prepare("SELECT * FROM settings WHERE key_address = ?");
    $select_stmt->execute([$key_address]);
    $row = $select_stmt->fetch(PDO::FETCH_ASSOC);
    if (is_array($row)) {
        require_once('../resource/errKeyDuplicate.php');
        echo json_encode($items);
    } else {
        $table_name = 'settings';
        $column = '`key_address`, `in_data`';
        $val = '?, ?';

        $query = "INSERT INTO ". $table_name ." (". $column .") VALUES (". $val .")";
        $stmt = $db->prepare($query);
        if($stmt->execute([
            $key_address, json_encode($in_data)
        ])) {
            $items["data"] = [
                "key_address" => $key_address,
                "in_data" => $in_data,
            ];
            require_once('../resource/success.php');
            echo json_encode($items);
        } else {
            require_once('../resource/errPram.php');
            echo json_encode($items);
        }
    }
?>