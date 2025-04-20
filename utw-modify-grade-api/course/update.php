<?php
    require_once('../config.php');
    require_once('../resource/header.php');
    require_once('../call-api.php');

    if ($code !== 200) {
        echo $result;
    } else {
        if ($_SERVER['REQUEST_METHOD'] == "POST") {
            $id = $_POST['id'];
            $subject_id = $_POST['subject_id'];
            $subject_title = $_POST['subject_title'];
            $subject_code = $_POST['subject_code'];
            $subject_class = $_POST['subject_class'];
            $indicators = $_POST['indicators'];
    
            try {
                $stmtUpdate = $db->prepare("UPDATE course SET subject_id = ?, subject_title = ?, subject_code = ?, subject_class = ?, indicators = ?, updated_at = ? WHERE id = ? ");
                $stmtUpdate->execute([$subject_id, $subject_title, $subject_code, $subject_class, $indicators, $updated_at, $id]);
                
                $stmtGet = $db->prepare("SELECT * FROM course WHERE id = ? ");
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