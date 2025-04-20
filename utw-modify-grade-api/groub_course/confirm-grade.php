<?php
    require_once('../config.php');
    require_once('../resource/header.php');
    require_once('../call-api.php');

    if ($code !== 200) {
        echo $result;
    } else {
        if ($_SERVER['REQUEST_METHOD'] == "POST") {
            $id = $_POST['group_course_id'];
            $student_id = $_POST['user_id'];
          
            $select_stmt = $db->prepare("SELECT * FROM groub_course WHERE id = ? ");
            $select_stmt->execute([$id]);

            $row = $select_stmt->fetch(PDO::FETCH_ASSOC);
            if (is_array($row))  {
                $activities = json_decode($row['activity']);

                $arr_activities = array();
                foreach ($activities as $activity) {
                    if ($activity->id == $student_id) {

                        $select_stmt2 = $db->prepare("SELECT * FROM course WHERE id = ? ");
                        $select_stmt2->execute([$row['course_id']]);
                        $row2 = $select_stmt2->fetch(PDO::FETCH_ASSOC);

                        // $select_stmt3 = $db->prepare("SELECT * FROM user WHERE id = ? ");
                        // $select_stmt3->execute([$row2['user_id']]);
                        // $row3 = $select_stmt3->fetch(PDO::FETCH_ASSOC);

                        // $arr_activity = array(
                        //     "id" => $activity->id,
                        //     "tname" => $activity->tname,
                        //     "fname" => $activity->fname,
                        //     "lname" => $activity->lname,
                        //     "class" => $activity->class,
                        //     "room" => $activity->room,
                        //     "part" => $activity->part,
                        //     "status" => $activity->status,
                        //     "work" => $activity->work,
                        //     "grade_old" => $activity->grade_old,
                        //     "grade_new" => $activity->grade_new,
                        //     "select_grade" => $activity->select_grade,
                        //     "confirm_date" => $updated_at,
                        // );
                        // array_push($arr_activities, $arr_activity);

                             // Prepare and execute the query
                             $selectStmt = $db_cors->prepare("SELECT * FROM settings WHERE key_address = ?");
                             $selectStmt->execute(['modify_grade_date']);
                             $setting = $selectStmt->fetch(PDO::FETCH_ASSOC);
     
                             if ($setting && !empty($setting['in_data'])) {
                                $in_data = json_decode($setting['in_data'], true);  // Decode JSON to array
                                $settings = (object) [
                                    'term_at' => $in_data['date_term'],
                                    'round_at' => $in_data['date_section'],
                                    'year_at' => $in_data['date_year_education']
                                ];
                            } else {
                                echo "No settings found";
                                die();
                            }

                             $selectStmt2 = $db_cors->prepare("SELECT * FROM user WHERE id = ?");
                             $selectStmt2->execute([$row2['user_id']]);
                             $teacher = $selectStmt2->fetch(PDO::FETCH_ASSOC);
                             
                             if (!$teacher) {
                                 echo "Teacher not found";
                                 die();  // Or handle this scenario appropriately
                             }


                        $table_name = 'report_course_modify';
                        $columns = '`student_id`, `student_activity`, `student`, `department_id`, `subject_id`, `subject_title`, 
                                    `subject_code`, `subject_class`, `teacher_id`, `teacher`, `grade_old`, `grade_new`, 
                                    `confirm_date`, `round_at`, `term_at`, `year_at`';
                        $values = '?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?';
                        
                        $query = "INSERT INTO " . $table_name . " (" . $columns . ") VALUES (" . $values . ")";
                        
                        // Prepare the SQL statement for insertion
                        $insert_stmt = $db->prepare($query);
                      
                        try {
                            // Execute the prepared statement with actual values
                            $insert_stmt->execute([
                                $activity->id, 
                                json_encode($activity->work), 
                                json_encode($activity),  // Assuming you want the entire activity as JSON
                                $row2['department_id'], 
                                $row2['subject_id'], 
                                $row2['subject_title'], 
                                $row2['subject_code'], 
                                $row2['subject_class'], 
                                $row2['user_id'], 
                                json_encode($teacher),  // Assuming $teacher is defined and should be JSON encoded
                                $activity->grade_old, 
                                $activity->grade_new, 
                                $updated_at, 
                                $settings->round_at,   // Assuming $settings is defined and accessible
                                $settings->term_at, 
                                $settings->year_at
                            ]);
                        } catch (PDOException $e) {
                            echo 'Database error: ' . $e->getMessage();
                            die();
                        }
                    } else {
                        $arr_activity = array(
                            "id" => $activity->id,
                            "tname" => $activity->tname,
                            "fname" => $activity->fname,
                            "lname" => $activity->lname,
                            "class" => $activity->class,
                            "room" => $activity->room,
                            "part" => $activity->part,
                            "work" => $activity->work,
                            "status" => $activity->status,
                            "grade_old" => $activity->grade_old,
                            "grade_new" => $activity->grade_new,
                            "select_grade" => $activity->select_grade,
                            "confirm_date" => $activity->confirm_date,
                        );
                        array_push($arr_activities, $arr_activity);
                    }
                }

                try {
                    $stmtUpdate = $db->prepare("UPDATE groub_course SET activity = ?, updated_at = ? WHERE id = ? ");
                    $stmtUpdate->execute([json_encode($arr_activities), $updated_at, $id]);
                    
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
    }
?>