<?php
    require_once('../config.php');
    require_once('../resource/header.php');

    if($_SERVER['REQUEST_METHOD'] == "POST") {
        $key_address = $_POST['key_address'];

        $select_stmt = $db->prepare("SELECT * FROM settings WHERE key_address = ?");
        $select_stmt->execute([$key_address]);
        $row = $select_stmt->fetch(PDO::FETCH_ASSOC);
        if (is_array($row)) {
            $items["data"] = [
                "id" => $row['id'],
                "key_address" => $row['key_address'],
                "in_data" => json_decode($row['in_data']),
                "created_at" => $row['created_at'],
                "updated_at" => $row['updated_at'],
            ];
            require_once('../resource/success.php');
            echo json_encode($items);
        } else {
            $items["data"] = [];
            require_once('../resource/empty.php');
            echo json_encode($items);
        }
    }
?>