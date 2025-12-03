<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET POST');
header('Access-Control-Allow-Headers: X-Requested-With');
header("Content-Type:application/json");
	include("../server/faults.php");
    $newObj = new Faults();
    $geodata = $newObj->getFaults();

    echo json_encode($geodata);
?>