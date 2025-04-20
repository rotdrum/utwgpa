<?php
    require_once('../config.php');
    require_once('../resource/header.php');
    require_once('../call-api.php');

    if ($code !== 200) {
        echo $result;
    } else {
        if ($_SERVER['REQUEST_METHOD'] == "POST") {
            $id = $_POST['id'];
            $course_id = $_POST['course_id'];
            $title = $_POST['title'];
            $indicators = json_decode($_POST['indicators']);
            $arr_indicators = array();
            foreach ($indicators as $indicator) {
                $arr_indicator = array(
                    "indicator" => $indicator,
                    "status" => "register",
                );
                array_push($arr_indicators, $arr_indicator);
            }

            $user_ids = $_POST['users_id'];
            // require_once('../call-user-ids.php');

            $select_stmt = $db->prepare("SELECT * FROM groub_course WHERE id = ? ");
            $select_stmt->execute([$id]);
            $row = $select_stmt->fetch(PDO::FETCH_ASSOC);
            $activities = json_decode($row['activity']);
            $arr_activities = array();
            $arr_users = array();
            $grade_old = json_decode($_POST['grade_old']);
            $score_old = json_decode($_POST['score_old']);
            $test_users = json_decode($_POST['users_id']);

            // if ($row['indicators']  === $indicators) {
                for ($index = 0; $index < count($test_users); $index++) {
                    $user = null;
                    $user_id = $test_users[$index];
                    $url = $urlCoreApi . '/user-id.php';
                    $parameters = array(
                        "_method" => "GET", 
                        "id" => $user_id,
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

                    $grade_new = null;
                    $select_grade = [];
                    if ($grade_old[$index] == 'ร') {
                        $grade_new = '1';
                        $select_grade = ['4', '3.5', '3', '2.5', '2', '1.5', '1'];
                    } else if ($grade_old[$index] == '0') {
                        $grade_new = '1';
                        $select_grade = ['1'];
                    } else if ($grade_old[$index] == 'มส.') {
                        $grade_new = '1';
                        $select_grade = ['1'];
                    } else if ($grade_old[$index] == 'มผ.') {
                        $grade_new = 'ผ';
                        $select_grade = ['ผ'];
                    }
                    $flag = 0;
                    $work_user = '';
                    $aty_confirm_date = null;
                    $aty_status = '';
    
                    foreach ($activities as $aty) {
                        if ($user->id == $aty->id) {
                           $flag = 1;
                           $aty_confirm_date = $aty->confirm_date;
                           $aty_status = $aty->status;
                           $work_user = $aty->work;
                        }
                    }
                    
                    if ($flag === 0) {
                        $new_indicators = json_decode($_POST['indicators']);
                        $arr_new_indicators = array();
                        foreach ($new_indicators as $indicator) {
                            $arr_indicator = array(
                                "indicator" => $indicator,
                                "status" => "register",
                            );
                            array_push($arr_new_indicators, $arr_indicator);
                        }

                        $arr_user = array(
                            "id" => $user->id,
                            "tname" => $user->tname,
                            "fname" => $user->fname,
                            "lname" => $user->lname,
                            "class" => $user->class,
                            "room" => $user->room,
                            "part" => $user->part,
                            "grade_old" => $grade_old[$index],
                            "score_old" => $score_old[$index],
                            "grade_new" => $grade_new,
                            "confirm_date" => null,
                            "select_grade" => $select_grade,
                            "status" => 'wait_register',
                            // "work" => $arr_new_indicators,
                            "work" => $arr_indicators,
                        );
                        array_push($arr_users, $arr_user);
                    } else {
                        $arr_user = array(
                            "id" => $user->id,
                            "tname" => $user->tname,
                            "fname" => $user->fname,
                            "lname" => $user->lname,
                            "class" => $user->class,
                            "room" => $user->room,
                            "part" => $user->part,
                            "grade_old" => $grade_old[$index],
                            "score_old" => $score_old[$index],
                            "grade_new" => $grade_new,
                            "select_grade" => $select_grade,
                            "confirm_date" => $aty_confirm_date,
                            "status" => $aty_status,
                            "work" => $work_user,
                            // "work" => $arr_indicators,
                        );
                        array_push($arr_users, $arr_user);
                    }
                }
            // } 
            // else {
            //     $index = 0;
            //     foreach ($users as $user) {
            //         $grade_new = null;
            //         $select_grade = [];
            //         if ($grade_old[$index] == 'ร') {
            //             $grade_new = '1';
            //             $select_grade = ['4', '3.5', '3', '2.5', '2', '1.5', '1'];
            //         } else if ($grade_old[$index] == '0') {
            //             $grade_new = '1';
            //             $select_grade = ['1'];
            //         } else if ($grade_old[$index] == 'มส.') {
            //             $grade_new = '1';
            //             $select_grade = ['1'];
            //         } else if ($grade_old[$index] == 'มผ.') {
            //             $grade_new = 'ผ';
            //             $select_grade = ['ผ'];
            //         }
            //         $flag_user = 0;
            //         $work_user = '';
            //         $aty_confirm_date = null;
            //         $aty_status = '';
            //         foreach ($activities as $aty) {
            //             $aty_confirm_date = $aty->confirm_date;
            //             $aty_status = $aty->status;
            //             if ($user->id == $aty->id) {
            //                $flag_user = 1;
            //                $work_user = $aty->work;

            //                $indicators = json_decode($_POST['indicators']);
            //                $arr_indicators = array();
            //                foreach ($indicators as $indicator) {
            //                    $arr_indicator = array(
            //                        "indicator" => $indicator,
            //                        "status" => "register",
            //                    );
            //                    array_push($arr_indicators, $arr_indicator);
            //                }

            //                foreach ($indicators as $indicator) {
            //                     $flag_work_user = 0;
            //                     $status_work_user = 'wait_register';
            //                     $arr_have_indicators = array();

            //                     foreach ($work_user as $wku) {
            //                         if ($wku->indicator === $indicator) {
            //                             $flag_work_user = 1;
            //                             $status_work_user = $wku->status;
            //                         }
            //                     }

            //                     if ($flag_work_user === 0) {
            //                         $arr_have_indicator = array(
            //                             "indicator" => $indicator,
            //                             "status" => "register",
            //                         );
            //                         array_push($arr_have_indicators, $arr_have_indicator);
            //                     } else {
            //                         $arr_have_indicator = array(
            //                             "indicator" => $indicator,
            //                             "status" => $status_work_user,
            //                         );
            //                         array_push($arr_have_indicators, $arr_have_indicator);
            //                     }
            //                 }
            //             }
            //         }
    
            //         if ($flag_user === 0) {
            //             $arr_user = array(
            //                 "id" => $user->id,
            //                 "tname" => $user->tname,
            //                 "fname" => $user->fname,
            //                 "lname" => $user->lname,
            //                 "class" => $user->class,
            //                 "room" => $user->room,
            //                 "part" => $user->part,
            //                 "grade_old" => $grade_old[$index],
            //                 "grade_new" => $grade_new,
            //                 "select_grade" => $select_grade,
            //                 "confirm_date" => $aty_confirm_date,
            //                 "status" => $aty_status,
            //                 "work" => $arr_indicators,
            //             );
            //             array_push($arr_users, $arr_user);
            //         } else {
            //             $arr_user = array(
            //                 "id" => $user->id,
            //                 "tname" => $user->tname,
            //                 "fname" => $user->fname,
            //                 "lname" => $user->lname,
            //                 "class" => $user->class,
            //                 "room" => $user->room,
            //                 "part" => $user->part,
            //                 "grade_old" => $grade_old[$index],
            //                 "grade_new" => $grade_new,
            //                 "select_grade" => $select_grade,
            //                 "confirm_date" => $aty_confirm_date,
            //                 "status" => $aty_status,
            //                 "work" => $arr_have_indicators,
            //                 // "work" => $arr_indicators,
            //             );
            //             array_push($arr_users, $arr_user);
            //         }
            //         $index++;
            //     }
            // }
            
            $title = $_POST['title'];
            $course_id = $_POST['course_id'];
            $indicators = $_POST['indicators'];
            $activity = json_encode($arr_users);
    
            try {
                $stmtUpdate = $db->prepare("UPDATE groub_course SET course_id = ?, title = ?, indicators = ?, user_ids = ?, activity = ?, updated_at = ? WHERE id = ? ");
                $stmtUpdate->execute([$course_id, $title, $indicators, $user_ids, $activity, $updated_at, $id]);
                
                $stmtGet = $db->prepare("SELECT * FROM groub_course WHERE id = ? ");
                $stmtGet->execute([$id]);
                $row = $stmtGet->fetch(PDO::FETCH_ASSOC);

                $items["data"] = $row;
                require_once('../resource/success.php');
                echo json_encode($items);
            }
            catch(PDOException $e) {
                require_once('../resource/errPram.php');
                echo json_encode($items);
            }
        }
    }
?>