<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET POST');
header('Access-Control-Allow-Headers: X-Requested-With');
header("Content-Type:application/json");
	include("../server/substations.php");
    $newObj = new Substations();
    $geodata = $newObj->getSubstations();

    echo json_encode($geodata);
?>