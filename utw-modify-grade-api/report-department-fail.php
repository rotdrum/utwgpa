<?php
    require_once('./config.php');
    require_once('./resource/header.php');

    $url = $urlCoreApi . '/subject-find-department-id.php';
    $parameters = array(
        "_method" => "GET", 
        "department_id" => $_POST['department_id'],
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
        $select_stmt = $db->prepare("SELECT * FROM course WHERE subject_id = ? ");
        $select_stmt->execute([$subject->id]);
        $course = [];
        $course_id = 0;
        $teacher_id = null;
        $data_course_item = array();
        while ($row = $select_stmt->fetch(PDO::FETCH_ASSOC)) {
            extract($row);
            $teacher_id = $row['user_id'];
            $groub_course = [];
            $select_get = $db->prepare("SELECT * FROM groub_course WHERE course_id = ? ");
            $select_get->execute([$course_id]);
    
            $data_groub_course_item = array();
            while($row_get = $select_get->fetch(PDO::FETCH_ASSOC)) {
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

            $row_course = array(
                "id" => $id,
                "subject_id" => $subject_id,
                "subject_title" => $subject_title,
                "subject_code" => $subject_code,
                "groub_course" => $data_groub_course_item,
                "indicators" => $indicators,
                "user_id" => $user_id,
                "created_at" => $created_at,
                "updated_at" => $updated_at,
            );
            array_push($data_course_item, $row_course);
        }

        $url = $urlCoreApi . '/user-id.php';
        $parameters = array(
            "_method" => "GET", 
            "id" => $teacher_id,
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
        $user = $response->data;

        $data_row = array(
            "id" => $subject->id,
            "subject_code" => $subject->subject_code,
            "course" => $data_course_item,
            "teacher_id" => $teacher_id,
            "teacher" => $user,
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