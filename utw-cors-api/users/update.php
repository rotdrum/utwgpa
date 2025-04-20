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
    
            if ($domain !== 'utw.ac.th') {
                require_once('../resource/errEmailFormat.php');
                echo json_encode($items);
            } else {
                $table_name = 'user';
                $id = $_POST['id'];
                
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
                $access_token = md5($_POST['email']).'@'.md5($_POST['auth_role']).'@'.md5($currentDate);
        
                $stmtUpdate = $db->prepare("UPDATE ". $table_name ." SET user_no = ?, tname = ?, fname = ?, lname = ?, email = ?, auth_role = ?, department_id = ?, status = ?, class = ?, room = ?, part = ?, access_token = ?, updated_at = ? WHERE id = ? ");
                $stmtUpdate->execute([$user_no, $tname, $fname, $lname, $email, $auth_role, $department_id, $status, $class, $room, $part, $access_token, $updated_at, $id]);
                
                $stmtGet = $db->prepare("SELECT * FROM ". $table_name ." WHERE id = ? ");
                $stmtGet->execute([$id]);
                $row = $stmtGet->fetch(PDO::FETCH_ASSOC);

                $items["data"] = $row;
                require_once('../resource/success.php');
                echo json_encode($items);
            }
        }
        else {
            http_response_code(405);
        }
    }
?>