<?php
    require_once('../config.php');
    require_once('../resource/header.php');
    require_once('../auth/token-admin.php');

    if ($code !== 200) {
        echo $result;
    } else {
        if ($_SERVER['REQUEST_METHOD'] == "POST") {
            $id = $_POST['id'];
            $name = $_POST['name'];
    
            try {
                $table_name = 'department';

                $stmtUpdate = $db->prepare("UPDATE ". $table_name ." SET name = ?, updated_at = ? WHERE id = ? ");
                $stmtUpdate->execute([$name, $updated_at, $id]);
                
                $stmtGet = $db->prepare("SELECT * FROM ". $table_name ." WHERE id = ? ");
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
?>