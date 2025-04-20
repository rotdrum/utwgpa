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
        'header' => "Content-type: application/x-www-form-urlencoded\r\n",
        'method' => 'POST',
        'content' => http_build_query($parameters)
    )
);

$context = stream_context_create($options);
$result = file_get_contents($url, false, $context);
if ($result === FALSE) { /* Handle error */
}

$response = json_decode($result);

$code = $response->status->code;
$msg = $response->status->massage;
$subjects = $response->data;

$data_item = array();
foreach ($subjects as $subject) {
    $select_stmt = $db->prepare("SELECT * FROM course WHERE subject_id = ? ");
    $select_stmt->execute([$subject->id]);
    $data_course_item = array();
    while ($row = $select_stmt->fetch(PDO::FETCH_ASSOC)) {
        extract($row);
        // array_push($data_course_item, $row);

        // $select_get = $db->prepare("SELECT * FROM groub_course WHERE course_id = ? ");
        // $select_get->execute([$row['id']]);
        // $data_groub_course_item = array();
        // while($row_get = $select_get->fetch(PDO::FETCH_ASSOC)) {
        //     extract($row_get);
        //     $row2 = array(
        //         "id" => $row_get['id'],
        //         "title" => $row_get['title'],
        //         "course_id" => $row_get['course_id'],
        //         "indicators" => $row_get['indicators'],
        //         "user_ids" => $row_get['user_ids'],
        //         "activity" => $row_get['activity'],
        //         "created_at" => $row_get['created_at'],
        //         "updated_at" => $row_get['updated_at'],
        //     );
        //     array_push($data_groub_course_item, $row2);
        // }

        // $url = $urlCoreApi . '/user-id.php';
        // $parameters = array(
        //     "_method" => "GET", 
        //     "id" => $row['user_id'],
        // );

        // $options = array(
        //     'http' => array(
        //         'header'  => "Content-type: application/x-www-form-urlencoded\r\n",
        //         'method'  => 'POST',
        //         'content' => http_build_query($parameters)
        //     )
        // );

        // $context  = stream_context_create($options);
        // $result = file_get_contents($url, false, $context);
        // if ($result === FALSE) { /* Handle error */ }

        // $response = json_decode($result);

        // $code = $response->status->code;
        // $msg = $response->status->massage;
        // $user = $response->data;

        $row_course = array(
            "id" => $row['id'],
            // "groub_course" => $data_groub_course_item,
            "subject_id" => $row['subject_id'],
            "subject_title" => $row['subject_title'],
            "subject_code" => $row['subject_code'],
            "subject_class" => $row['subject_class'],
            "teacher_id" => $row['user_id'],
            "teacher" => $user,
            "indicators" => $row['indicators'],
            "created_at" => $row['created_at'],
            "updated_at" => $row['updated_at'],
        );
        array_push($data_course_item, $row_course);
    }
    $data_row = array(
        "course" => $data_course_item,
    );
    array_push($data_item, $data_row);
    // $data_row = array(
    //     "id" => $subject->id,
    //     "subject_code" => $subject->subject_code,
    //     "course" => $data_course_item,
    //     "name" => $subject->name,
    //     "class" => $subject->class,
    //     "room" => $subject->room,
    //     "is_active" => $subject->is_active,
    //     "department_id" => $subject->department_id,
    //     "department_title" => $subject->department_title,
    //     "created_at" => $subject->created_at,
    //     "updated_at" => $subject->updated_at,
    // );
    // array_push($data_item, $data_row);
}
// $items['data'] = $data_item;
$items['data'] = $data_item;
// $items['subject'] = $subjects;

require_once('./resource/success.php');
echo json_encode($items);
?>