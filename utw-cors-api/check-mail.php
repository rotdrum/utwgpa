<?php
    require_once('config.php');
    require_once('resource/header.php');

    if($_SERVER['REQUEST_METHOD'] == "POST") {
        try {
            $txt_email = $_POST['email'];

            $select_stmt = $db->prepare("SELECT * FROM user WHERE email = ? ");
            $select_stmt->execute([$txt_email]);
            
            try {
                $row = $select_stmt->fetch(PDO::FETCH_ASSOC);
                if (is_array($row))  {
                    $items["data"] = $row;
                    require_once('resource/success.php');
                } else {
                    $items["data"] = [];
                    require_once('resource/empty.php');
                }
                echo json_encode($items);
            }
            catch(PDOException $e) {
                require_once('resource/errPram.php');
                echo json_encode($items);
            }
        } catch(PDOException $e) {
            require_once('resource/errMethod.php');
            echo json_encode($items);
        }
    }
    else {
        http_response_code(405);
    }
?>