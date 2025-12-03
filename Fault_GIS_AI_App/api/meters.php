<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET POST');
header('Access-Control-Allow-Headers: X-Requested-With');
header("Content-Type:application/json");
	include("../server/meters.php");
    $newObj = new Meters();
    $geodata = $newObj->getMeters();

    echo json_encode($geodata);
?>