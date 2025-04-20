<?php
    require_once('config.php');
    require_once('resource/header.php');

    if($_SERVER['REQUEST_METHOD'] == "POST") {
        try {
            $subject_id = $_POST['subject_id'];

            $select_stmt = $db->prepare("SELECT 
            subject.id AS id, 
            subject.name AS name, 
            subject.subject_code AS subject_code, 
            subject.class AS class, 
            subject.room AS room, 
            subject.department_id AS department_id,
            subject.created_at AS created_at,
            subject.updated_at AS updated_at
            FROM subject 
            WHERE subject.id = ?");
            $select_stmt->execute([$subject_id]);
            $row = $select_stmt->fetch(PDO::FETCH_ASSOC);
            if (is_array($row)) {
                $items['data'] = $row;
                require_once('resource/success.php');
                echo json_encode($items);
            } else {
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