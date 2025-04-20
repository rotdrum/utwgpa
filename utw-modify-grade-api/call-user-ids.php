<?php
    $url = $urlCoreApi . '/user-ids.php';
    $parameters = array(
        "_method" => "GET", 
        "user_ids" => $user_ids,
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
    $users = $response->data;
?>