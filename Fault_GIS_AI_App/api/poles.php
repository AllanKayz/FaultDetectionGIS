<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET POST');
header('Access-Control-Allow-Headers: X-Requested-With');
header("Content-Type:application/json");
	include("../server/poles.php");
    $newObj = new Poles();
    $geodata = $newObj->getPoles();

    echo json_encode($geodata);
?>