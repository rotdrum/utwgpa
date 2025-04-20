<?php
    $db_host = '159.223.71.242';
    $db_name = 'utw_cors';
    $db_user = 'mheenoi';
    $db_pass = 'Re@lbe@rpro!3310';

    header('Content-Type: application/json');
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Headers: *");
    header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token');
    date_default_timezone_set("Asia/Bangkok");

    try {
        $db = new PDO("mysql:host=${db_host}; dbname=${db_name}", $db_user, $db_pass);
        $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        // echo "database is connected";
    }
    catch(PEOException $e) {
        echo $e->getMessage();
    }
?>