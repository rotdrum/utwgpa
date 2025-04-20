<?php
    require_once('./config.php');
    require_once('./resource/header.php');

    $url = $urlCoreApi . '/subject-find-department-id.php';
    $parameters = array(
        "_method" => "GET", 
        "department_id" => $_GET['department_id'],
    );

    $options = array(
        'http' => array(
            'header'  => "Content-type: application/x-www-form-urlencoded\r\n",
            'method'  => 'POST',
            'content' => http_build_query($parameters)
        )
    );
    
    $context  = stream_context_create($options);
    $result = file_get_contents($url, false, $context);
    if ($result === FALSE) { /* Handle error */ }

    $response = json_decode($result);

    $code = $response->status->code;
    $msg = $response->status->massage;
    $subjects = $response->data;

    $data_item = array();
    foreach ($subjects as $subject) {
        $select_stmt = $db->prepare("
            SELECT DISTINCT c.* FROM course c
            JOIN groub_course gc ON c.id = gc.course_id
            WHERE c.subject_id = ? AND JSON_UNQUOTE(JSON_EXTRACT(gc.activity, '$.confirm_date')) IS NOT NULL
        ");
        $select_stmt->execute([$subject->id]);
        $data_course_item = array();
    
        while ($row = $select_stmt->fetch(PDO::FETCH_ASSOC)) {
            extract($row);
            $select_get = $db->prepare("SELECT * FROM groub_course WHERE course_id = ?");
            $select_get->execute([$id]);
            $data_groub_course_item = array();
    
            while ($row_get = $select_get->fetch(PDO::FETCH_ASSOC)) {
                extract($row_get);
                $row2 = array(
                    "id" => $id,
                    "title" => $title,
                    "course_id" => $course_id,
                    "indicators" => $indicators,
                    "user_ids" => $user_ids,
                    "activity" => $activity,
                    "created_at" => $created_at,
                    "updated_at" => $updated_at,
                );
                array_push($data_groub_course_item, $row2);
            }
    
            $selectUser = $db_cors->prepare("SELECT * FROM user WHERE id = ?");
            $selectUser->execute([$user_id]);
            $rowUser = $selectUser->fetch(PDO::FETCH_ASSOC);
    
            $row_course = array(
                "id" => $id,
                "groub_course" => $data_groub_course_item,
                "subject_id" => $subject_id,
                "subject_title" => $subject_title,
                "subject_code" => $subject_code,
                "subject_class" => $subject_class,
                "teacher_id" => $user_id,
                "teacher" => $rowUser,
                "indicators" => $indicators,
                "created_at" => $created_at,
                "updated_at" => $updated_at,
            );
            array_push($data_course_item, $row_course);
        }
    
        $data_row = array(
            "id" => $subject->id,
            "subject_code" => $subject->subject_code,
            "course" => $data_course_item,
            "name" => $subject->name,
            "class" => $subject->class,
            "room" => $subject->room,
            "is_active" => $subject->is_active,
            "department_id" => $subject->department_id,
            "department_title" => $subject->department_title,
            "created_at" => $subject->created_at,
            "updated_at" => $subject->updated_at,
        );
        array_push($data_item, $data_row);
    }

    foreach ($subjects as $subject) {
        $select_stmt = $db->prepare("
            SELECT DISTINCT c.* FROM course c
            JOIN groub_course gc ON c.id = gc.course_id
            WHERE c.subject_id = ? AND JSON_UNQUOTE(JSON_EXTRACT(gc.activity, '$.confirm_date')) IS NULL
        ");
        $select_stmt->execute([$subject->id]);
        $data_course_item = array();
    
        while ($row = $select_stmt->fetch(PDO::FETCH_ASSOC)) {
            extract($row);
            $select_get = $db->prepare("SELECT * FROM groub_course WHERE course_id = ?");
            $select_get->execute([$id]);
            $data_groub_course_item = array();
    
            while ($row_get = $select_get->fetch(PDO::FETCH_ASSOC)) {
                extract($row_get);
                $row2 = array(
                    "id" => $id,
                    "title" => $title,
                    "course_id" => $course_id,
                    "indicators" => $indicators,
                    "user_ids" => $user_ids,
                    "activity" => $activity,
                    "created_at" => $created_at,
                    "updated_at" => $updated_at,
                );
                array_push($data_groub_course_item, $row2);
            }
    
            $selectUser = $db_cors->prepare("SELECT * FROM user WHERE id = ?");
            $selectUser->execute([$user_id]);
            $rowUser = $selectUser->fetch(PDO::FETCH_ASSOC);
    
            $row_course = array(
                "id" => $id,
                "groub_course" => $data_groub_course_item,
                "subject_id" => $subject_id,
                "subject_title" => $subject_title,
                "subject_code" => $subject_code,
                "subject_class" => $subject_class,
                "teacher_id" => $user_id,
                "teacher" => $rowUser,
                "indicators" => $indicators,
                "created_at" => $created_at,
                "updated_at" => $updated_at,
            );
            array_push($data_course_item, $row_course);
        }
    
        $data_row = array(
            "id" => $subject->id,
            "subject_code" => $subject->subject_code,
            "course" => $data_course_item,
            "name" => $subject->name,
            "class" => $subject->class,
            "room" => $subject->room,
            "is_active" => $subject->is_active,
            "department_id" => $subject->department_id,
            "department_title" => $subject->department_title,
            "created_at" => $subject->created_at,
            "updated_at" => $subject->updated_at,
        );
        array_push($data_item, $data_row);
    }
    
    $items['data'] = $data_item;

    require_once('./resource/success.php');
    echo json_encode($items);
?>