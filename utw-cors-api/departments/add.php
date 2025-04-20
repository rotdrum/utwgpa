<?php
    require_once('../config.php');
    require_once('../resource/header.php');
    require_once('../auth/token-admin.php');

    if ($code !== 200) {
        echo $result;
    } else {
        if ($_SERVER['REQUEST_METHOD'] == "POST") {
            $table_name = 'department';
            $title = $_POST['name'];

            $select_stmt = $db->prepare("SELECT * FROM ". $table_name ." WHERE `name` = ? ");
            $select_stmt->execute([$title]);
            
            $row = $select_stmt->fetch(PDO::FETCH_ASSOC);
    
            if (is_array($row)) {
                require_once('../resource/errDataDuplicate.php');
                echo json_encode($items);
            } else {
                $column = '`name`';
                $val = '?';
        
                $query = "INSERT INTO ". $table_name ." (". $column .") VALUES (". $val .")";
                $stmt = $db->prepare($query);
                if($stmt->execute([
                    $title
                ])) {
                    $items["data"] = [
                        "name" => $title,
                    ];
                    require_once('../resource/success.php');
                    echo json_encode($items);
                } else {
                    require_once('../resource/errPram.php');
                    echo json_encode($items);
                }
            }
        } else {
            http_response_code(405);
        }
    }
?>