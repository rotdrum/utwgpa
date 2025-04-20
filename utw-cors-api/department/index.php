<?php
    require_once('../config.php');
    require_once('../resource/header.php');
    require_once('../auth/token.php');

    if ($checkToken === true) {
        if($_SERVER['REQUEST_METHOD'] == "POST") {
            try {
                $is_active = 1;

                $select_stmt = $db->prepare("SELECT * FROM department WHERE is_active = ? ");
                $select_stmt->execute([$is_active]);
    
                try {
                    $data_item = array();
                    while($row = $select_stmt->fetch(PDO::FETCH_ASSOC)) {
                        extract($row);
                        $data_row = array(
                            "id" => $id,
                            "name" => $name,
                            "is_active" => $is_active,
                            "created_at" => $created_at,
                            "updated_at" => $updated_at,
                        );
                        array_push($data_item, $data_row);
                    }

                    $items['data'] = $data_item;
                    require_once('../resource/success.php');
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