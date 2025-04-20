<?php
    require_once('./config.php');
    require_once('./resource/header.php');

    $url = $urlCoreApi . '/subject-find-id.php';
    $parameters = array(
        "_method" => "GET", 
        "subject_id" => $_POST['subject_id'],
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
    $subject = $response->data;

    $data_item = array();
    $select_stmt = $db->prepare("SELECT * FROM course WHERE subject_id = ? AND user_id = ?");
    $select_stmt->execute([$subject->id, $_POST['user_id']]);
    $course = [];
    $course_id = 0;
    $teacher_id = null;
    $row = $select_stmt->fetch(PDO::FETCH_ASSOC);
    if (is_array($row))  {
        $course = $row;
        $course_id = $row['id'];
        $teacher_id = $row['user_id'];
    }

    $groub_course = [];
    $select_get = $db->prepare("
        SELECT * FROM groub_course 
        WHERE course_id = ? AND JSON_UNQUOTE(JSON_EXTRACT(activity, '$.confirm_date')) IS NOT NULL
    ");
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

    $select_get = $db->prepare("
        SELECT * FROM groub_course 
        WHERE course_id = ? AND JSON_UNQUOTE(JSON_EXTRACT(activity, '$.confirm_date')) IS NULL
    ");
    $select_get->execute([$course_id]);
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
        "course" => $course,
        "teacher_id" => $teacher_id,
        "teacher" => $user,
        "groub_course" => $data_groub_course_item,
        "name" => $subject->name,
        "class" => $subject->class,
        "room" => $subject->room,
        "is_active" => $subject->is_active,
        "department_id" => $subject->department_id,
        "department_title" => $subject->department_title,
        "created_at" => $subject->created_at,
        "updated_at" => $subject->updated_at,
    );
    // array_push($data_item, $data_row);
    $items['data'] = $data_row;

    require_once('./resource/success.php');
    echo json_encode($items);
?>