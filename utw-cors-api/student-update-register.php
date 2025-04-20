<?php
    require_once('config.php');
    require_once('resource/header.php');

    if($_SERVER['REQUEST_METHOD'] == "POST") {
        $txt_email = $_POST['email'];
        $domain = substr(strrchr($txt_email, "@"), 1);

        $select_stmt = $db->prepare("SELECT * FROM user WHERE email = ? ");
        $select_stmt->execute([$txt_email]);
        
        $row = $select_stmt->fetch(PDO::FETCH_ASSOC);

        if ($domain !== 'utw.ac.th') {
            require_once('resource/errEmailFormat.php');
            echo json_encode($items);
        } else {
            $auth_role = 'student';
            $id = $_POST['id'];
            $class = $_POST['class'];
            $room = $_POST['room'];
            $mail_token = $_POST['mail_token'];
            $access_token = md5($_POST['email']).'@'.md5($auth_role).'@'.md5($currentDate);
    
            $table_name = 'user';
            $stmtUpdate = $db->prepare("UPDATE ". $table_name ." SET class = ?, room = ?, mail_token = ?, access_token = ?, updated_at = ? WHERE id = ? ");
            $stmtUpdate->execute([$class, $room, $mail_token, $access_token, $updated_at,  $id]);
            
            $stmtGet = $db->prepare("SELECT * FROM ". $table_name ." WHERE id = ? ");
            $stmtGet->execute([$id]);
            $row = $stmtGet->fetch(PDO::FETCH_ASSOC);

            $items["data"] = $row;
            require_once('resource/success.php');
            echo json_encode($items);
        }
    }
    else {
        http_response_code(405);
    }
?>