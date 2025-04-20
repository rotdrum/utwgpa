<?php
    require_once('../config.php');
    require_once('../resource/header.php');
    require_once('../call-api.php');

    if ($code !== 200) {
        echo $result;
    } else {
        if ($_SERVER['REQUEST_METHOD'] == "POST") {
            $id = $_POST['id'];
    
            try {
                $stmtUpdate = $db->prepare("DELETE FROM course WHERE id = ? ");
                $stmtUpdate->execute([$id]);
               
                require_once('../resource/success.php');
                echo json_encode($items);
            }
            catch(PDOException $e) {
                require_once('../resource/empty.php');
                echo json_encode($items, [$e]);
            }
        }
    }
?>