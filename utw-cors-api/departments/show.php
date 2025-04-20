<?php
    require_once('../config.php');
    require_once('../resource/header.php');
    require_once('../auth/token-admin.php');

    if ($code !== 200) {
        echo $result;
    } else {
        if($_SERVER['REQUEST_METHOD'] == "POST") {
            try {
                $id = $_POST['id'];
    
                $select_stmt = $db->prepare("SELECT * FROM department WHERE id = ? ");
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
            } catch(PDOException $e) {
                require_once('../resource/errMethod.php');
                echo json_encode($items);
            }
        }
        else {
            http_response_code(405);
        }
    }
?>