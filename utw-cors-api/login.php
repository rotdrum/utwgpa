<?php
    require_once('config.php');
    require_once('resource/header.php');

    if($_SERVER['REQUEST_METHOD'] == "POST") {
        try {
            $txt_email = $_POST['email'];
            $txt_access_token = $_POST['access_token'];
            $access_token = md5($_POST['email']).'@'.md5($_POST['auth_role']).'@'.md5($currentDate);
            $updated_at = date("Y-m-d H:i:s");

            $select_stmt = $db->prepare("SELECT * FROM user WHERE email = ? AND access_token = ? ");
            $select_stmt->execute([$txt_email, $txt_access_token]);
            
            try {
                $row = $select_stmt->fetch(PDO::FETCH_ASSOC);
                if (is_array($row))  {
                    $stmt = $db->prepare("UPDATE user SET access_token = ?, updated_at = ? WHERE id = ? ");
                    $stmt->execute([$access_token, $updated_at, $row['id']]);
                    
                    $items["data"] = [
                        "id" => $row['id'],
                        "user_no" => $row['user_no'],
                        "tname" => $row['tname'],
                        "fname" => $row['fname'],
                        "lname" => $row['lname'],
                        "email" => $row['email'],
                        "auth_role" => $row['auth_role'],
                        "department_id" => $row['department_id'],
                        "status" => $row['status'],
                        "class" => $row['class'],
                        "room" => $row['room'],
                        "part" => $row['part'],
                        "mail_token" => $row['mail_token'],
                        "access_token" => $access_token,
                    ];
                    
                    require_once('resource/success.php');
                } else {
                    require_once('resource/notFound.php');
                }
                echo json_encode($items);
            } catch(PDOException $e) {
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