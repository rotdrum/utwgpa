<?php
    require_once('config.php');
    require_once('resource/header.php');

    if($_SERVER['REQUEST_METHOD'] == "POST") {
        try {
            $auth_role = "teacher";

            $select_stmt = $db->prepare("SELECT * FROM user WHERE auth_role = ?");
            $select_stmt->execute([$auth_role]);
            
            try {
                $data_item = array();
                while ($row = $select_stmt->fetch(PDO::FETCH_ASSOC)) {
                    extract($row);
                    $data_row = array(
                        "id" => $id,
                        "user_no" => $user_no,
                        "tname" => $tname,
                        "fname" => $fname,
                        "lname" => $lname,
                        "email" => $email,
                        "auth_role" => $auth_role,
                        "department_id" => $department_id,
                        "status" => $status,
                        "class" => $class,
                        "room" => $room,
                        "part" => $part,
                        "mail_token" => $mail_token,
                        "access_token" => $access_token,
                        "created_at" => $created_at,
                        "updated_at" => $updated_at,
                    );
                    array_push($data_item, $data_row);
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