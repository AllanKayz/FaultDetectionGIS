<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET POST');
header('Access-Control-Allow-Headers: X-Requested-With');
header("Content-Type:application/json");
	include("../server/crew.php");
    $newObj = new Crew();
    $geodata = $newObj->getCrew();

    echo json_encode($geodata);
?>