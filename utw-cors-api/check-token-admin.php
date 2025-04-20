<?php
    require_once('./config.php');
    require_once('./resource/header.php');

     $token = $_POST['token'];
 
     $select_stmt = $db->prepare("SELECT * FROM token_basic WHERE token = ? ");
     $select_stmt->execute([$token]);
 
     $row = $select_stmt->fetch(PDO::FETCH_ASSOC);
     if (!is_array($row))  {
         require_once('resource/authorization.php');
         echo json_encode($items);
     } else {
        require_once('resource/success.php');
        echo json_encode($items);
     }
?>