<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET POST');
header('Access-Control-Allow-Headers: X-Requested-With');
header("Content-Type:application/json");
	include("../server/roads.php");
    $newObj = new Roads();
    $geodata = $newObj->getRoads();

    echo json_encode($geodata);
?>