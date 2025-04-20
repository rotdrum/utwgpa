<?php
    require_once('./config.php');
    require_once('./resource/header.php');

    if($_SERVER['REQUEST_METHOD'] == "POST") {
        try {
            $select_stmt = $db->prepare("SELECT * FROM subject ");
            $select_stmt->execute([]);

            try {
                $data_item = array();
                while($row = $select_stmt->fetch(PDO::FETCH_ASSOC)) {
                    extract($row);
                    array_push($data_item, $row);
                }

                $items['data'] = $data_item;
                require_once('resource/success.php');
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