<?php
    require_once('config.php');
    require_once('resource/header.php');

    if($_SERVER['REQUEST_METHOD'] == "POST") {
        try {
            $department_id = $_POST['department_id'];

            $select_stmt = $db->prepare("SELECT 
            subject.id AS id, 
            subject.name AS name, 
            subject.subject_code AS subject_code, 
            subject.class AS class, 
            subject.room AS room, 
            subject.department_id AS department_id,
            subject.created_at AS created_at,
            subject.updated_at AS updated_at,
            department.id AS department_id, 
            department.name AS department_title 
            FROM subject INNER JOIN department ON subject.department_id = department.id 
            WHERE subject.department_id = ?");
            $select_stmt->execute([$department_id]);
            
            try {
                $data_item = array();
                while ($row = $select_stmt->fetch(PDO::FETCH_ASSOC)) {
                    extract($row);
                    $data_row = $row;
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