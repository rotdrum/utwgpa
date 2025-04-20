<?php
    require_once('../config.php');
    require_once('../resource/header.php');
    require_once('../call-api.php');

    if ($code !== 200) {
        echo $result;
    } else {
        if ($_SERVER['REQUEST_METHOD'] == "POST") {
            $id = $_POST['id'];
    
            $select_stmt = $db->prepare("SELECT * FROM course WHERE id = ? ");
            $select_stmt->execute([$id]);

            try {
                $row = $select_stmt->fetch(PDO::FETCH_ASSOC);
                if (is_array($row))  {
                    $items["data"] = $row;
                    require_once('../resource/success.php');
                } else {
                    $items["data"] = [];
                    require_once('../resource/empty.php');
                }
                echo json_encode($items);
            }
            catch(PDOException $e) {
                require_once('../resource/errPram.php');
                echo json_encode($items);
            }
        }
    }
?>