<?php
    session_start();
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Headers: *, Authorization");
    header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
    // header("Access-Control-Allow-Headers: Authorization, Origin, X-Requested-With, Content-Type, Accept, X-Auth-Token");
    header('Content-Type: application/json');

    $db_host = "159.223.71.242";
    $db_name = "utw_cors";
    $db_user = "mheenoi";
    $db_password = "Re@lbe@rpro!3310";
    $urlCoreApi = 'https://utwgpa.com/utw-cors-api';

    if((substr_count($_SERVER['REQUEST_URI'],"/uat") > 0) || (substr_count($_SERVER['REQUEST_URI'],"localhost") > 0)) {
        $db_name = "utw_cors_uat";
        $urlCoreApi = 'https://utwgpa.com/uat/utw-cors-api';
    }

    date_default_timezone_set('Asia/Bangkok');
    $currentDate = date("Y-m-d H:i:s");
    $headers = getallheaders();
    $updated_at = date("Y-m-d H:i:s");

    try {
        $db = new PDO("mysql:host={$db_host}; dbname={$db_name}", $db_user, $db_password );
        $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    }
    catch(PDOException $e) {
        $e->getMessage();
    }
?>