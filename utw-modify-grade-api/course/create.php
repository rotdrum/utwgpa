<?php
    require_once('../config.php');
    require_once('../resource/header.php');
    require_once('../call-api.php');

    if ($code !== 200) {
        echo $result;
    } else {
        if ($_SERVER['REQUEST_METHOD'] == "POST") {
            $user_id = $_POST['user_id'];

            $subject_id = $_POST['subject_id'];
            $url = $urlCoreApi . '/subject-find-id.php';
            $parameters = array(
                "_method" => "GET", 
                "subject_id" => $subject_id,
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
            $department_id = $subject->department_id;
    
            $select_stmt = $db->prepare("SELECT * FROM course WHERE user_id = ? AND subject_id = ?");
            $select_stmt->execute([$user_id, $subject_id]);
            
            $row = $select_stmt->fetch(PDO::FETCH_ASSOC);
    
            if (is_array($row)) {
                require_once('../resource/errUserCourse.php');
                echo json_encode($items);
            } else {
                $indicators = $_POST['indicators'];
                $subject_title = $_POST['subject_title'];
                $subject_code = $_POST['subject_code'];
                $subject_class = $_POST['subject_class'];
        
                $table_name = 'course';
                $column = '`subject_id`, `department_id`, `subject_title`,  `subject_code`,  `subject_class`, `user_id`, `indicators`';
                $val = '?, ?, ?, ?, ?, ?, ?';
        
                $query = "INSERT INTO ". $table_name ." (". $column .") VALUES (". $val .")";
                $stmt = $db->prepare($query);
                if($stmt->execute([
                    $subject_id, $department_id, $subject_title,  $subject_code,  $subject_class, $user_id, $indicators
                ])) {
                    $items["data"] = [
                        "subject_id" => $subject_id,
                        "department_id" => $department_id,
                        "subject_title" => $subject_title,
                        "subject_code" => $subject_code,
                        "subject_class" => $subject_class,
                        "user_id" => $user_id,
                        "indicators" => $indicators,
                    ];
                    require_once('../resource/success.php');
                    echo json_encode($items);
                } else {
                    require_once('../resource/errPram.php');
                    echo json_encode($items);
                }
            }
        }
    }
?>