<?php
    require_once('../config.php');
    require_once('../resource/header.php');
    require_once('../call-api.php');

    if ($code !== 200) {
        echo $result;
    } else {
        if ($_SERVER['REQUEST_METHOD'] == "POST") {
            $id = $_POST['id'];
            $student_id = $_POST['student_id'];
    
            $select_stmt = $db->prepare("SELECT * FROM groub_course WHERE id = ? ");
            $select_stmt->execute([$id]);

            try {
                $row = $select_stmt->fetch(PDO::FETCH_ASSOC);
                if (is_array($row))  {
                    $activities = json_decode($row['activity']);
                    $flag = 0;
                    $tname = '';
                    $fname = '';
                    $lname = '';
                    $class = '';
                    $room = '';
                    $part = '';
                    $work = '';
                    
                    foreach ($activities as $activity) {
                        if ($activity->id == $student_id) {
                            $flag = 1;
                            $tname = $activity->tname;
                            $fname = $activity->fname;
                            $lname = $activity->lname;
                            $class = $activity->class;
                            $room = $activity->room;
                            $part = $activity->part;
                            $work = $activity->work;
                        }
                    }

                    if ($flag === 0) {
                        $items["data"] = [];
                    } else {
                        $items["data"] = [
                            'id' => $row['id'],
                            'course_id' => $row['course_id'],
                            'title' => $row['title'],
                            'student_id' => $student_id,
                            'student' => [
                                'id' => $student_id,
                                'tname' => $tname,
                                'fname' => $fname,
                                'lname' => $lname,
                                'class' => $class,
                                'room' => $room,
                                'part' => $part,
                            ],
                            'work' => $work,
                            'indicators' => $row['indicators'],
                            'created_at' => $row['created_at'],
                            'updated_at' => $row['updated_at'],
                        ];
                    }
                   
                    require_once('../resource/success.php');
                } else {
                    $items["data"] = [];
                    require_once('../resource/empty.php');
                }
                
                echo json_encode($items);
            }
            catch(PDOException $e) {
                require_once('../resource/errPram.php');
                echo json_encode($items);
            }
        }
    }
?>