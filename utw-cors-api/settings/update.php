<?php
    require_once('../config.php');
    require_once('../resource/header.php');

    if($_SERVER['REQUEST_METHOD'] == "POST") {
        $key_address = $_POST['key_address'];
        $in_data = $_POST['in_data'];

        $select_stmt = $db->prepare("SELECT * FROM settings WHERE key_address = ?");
        $select_stmt->execute([$key_address]);
        $row = $select_stmt->fetch(PDO::FETCH_ASSOC);
        if (is_array($row)) {
            $stmtUpdate = $db->prepare("UPDATE settings SET in_data = ?, updated_at = ? WHERE key_address = ? ");
            $stmtUpdate->execute([$in_data, $updated_at, $key_address]);
            
            $selectGet = $db->prepare("SELECT * FROM settings WHERE key_address = ?");
            $selectGet->execute([$key_address]);
            $row = $selectGet->fetch(PDO::FETCH_ASSOC);

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