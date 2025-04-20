<?php
    require_once('./config.php');
    require_once('./resource/header.php');
    if (
        $_POST['password'] === 'Password@1234' 
        && ($_POST['username'] === 'education@utw.ac.th' || $_POST['username'] === 'education')
    ) {
        try {
            $key_address = 'admin';
            $stmtGet = $db->prepare("SELECT * FROM token_basic WHERE key_address = ? ");
            $stmtGet->execute([$key_address]);
            $row = $stmtGet->fetch(PDO::FETCH_ASSOC);
    
            $items["data"] = $row;
            require_once('./resource/success.php');
            echo json_encode($items);
        }
        catch(PDOException $e) {
            require_once('./resource/errPram.php');
            echo json_encode($items);
        }
    } else {
        require_once('./resource/notFound.php');
    }
?>