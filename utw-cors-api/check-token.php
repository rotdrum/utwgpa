<?php
    require_once('./config.php');
    require_once('./resource/header.php');

     $access_token = $_POST['access_token'];
 
     $select_stmt = $db->prepare("SELECT * FROM user WHERE access_token = ? ");
     $select_stmt->execute([$access_token]);
 
     $row = $select_stmt->fetch(PDO::FETCH_ASSOC);
     if (!is_array($row))  {
         require_once('resource/authorization.php');
         echo json_encode($items);
     } else {
        require_once('resource/success.php');
        echo json_encode($items);
     }
?>