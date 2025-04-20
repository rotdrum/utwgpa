<?php
    require_once('./config.php');
    require_once('./resource/header.php');

     $email = $_POST['email'];
 
     $select_stmt = $db->prepare("SELECT * FROM user WHERE email = ? AND (class IS NULL OR room IS NULL OR access_token IS NULL) ");
     $select_stmt->execute([$email]);
 
     $row = $select_stmt->fetch(PDO::FETCH_ASSOC);
     if (!is_array($row))  {
         require_once('resource/authorization.php');
         echo json_encode($items);
     } else {
        require_once('resource/success.php');
        echo json_encode($items);
     }
?>