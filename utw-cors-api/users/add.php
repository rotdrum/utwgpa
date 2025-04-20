<?php
    require_once('../config.php');
    require_once('../resource/header.php');
    require_once('../auth/token-admin.php');

    if ($code !== 200) {
        echo $result;
    } else {
        if($_SERVER['REQUEST_METHOD'] == "POST") {
            $txt_email = $_POST['email'];
            $domain = substr(strrchr($txt_email, "@"), 1);
    
            $select_stmt = $db->prepare("SELECT * FROM user WHERE email = ? ");
            $select_stmt->execute([$txt_email]);
            
            $row = $select_stmt->fetch(PDO::FETCH_ASSOC);
    
            if ($domain !== 'utw.ac.th') {
                require_once('../resource/errEmailFormat.php');
                echo json_encode($items);
            } else if (is_array($row)) {
                require_once('../resource/errEmailDuplicate.php');
                echo json_encode($items);
            } else {
                $user_no = null;
                if ($_POST['user_no'] !== ''){
                    $user_no = $_POST['user_no'];
                }
                
                $tname = $_POST['tname'];
                $fname = $_POST['fname'];
                $lname = $_POST['lname'];
                $email = $_POST['email'];
                $auth_role = $_POST['auth_role']; /* student || teacher */
    
                $department_id = null;
                if ($_POST['department_id'] !== ''){
                    $department_id = $_POST['department_id'];
                }
                
                $status = "used";
                $class = $_POST['class'];
                $room = $_POST['room'];
                $part = $_POST['part'];
                $mail_token = 'admin_generate';
                $access_token = md5($_POST['email']).'@'.md5($_POST['auth_role']).'@'.md5($currentDate);
        
                $table_name = 'user';
                $column = '`user_no`, `tname`, `fname`, `lname`, `email`, `auth_role`, `department_id`, `status`, `class`, `room`, `part`, `mail_token`, `access_token`';
                $val = '?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?';
        
                $query = "INSERT INTO ". $table_name ." (". $column .") VALUES (". $val .")";
                $stmt = $db->prepare($query);
                if($stmt->execute([
                    $user_no, $tname, $fname, $lname, $email, $auth_role, $department_id, $status, $class, $room, $part, $mail_token, $access_token
                ])) {
                    $selectGet = $db->prepare("SELECT * FROM user WHERE email = ? ");
                    $selectGet->execute([$email]);
                    
                    $row = $selectGet->fetch(PDO::FETCH_ASSOC);
                    if (is_array($row))  {
                        $items["data"] = $row;
                        require_once('../resource/success.php');
                    } else {
                        $items["data"] = [];
                        require_once('../resource/empty.php');
                    }
                    echo json_encode($items);
                } else {
                    require_once('../resource/errPram.php');
                    echo json_encode($items);
                }
            }
        }
        else {
            http_response_code(405);
        }
    }
?>