<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET POST');
header('Access-Control-Allow-Headers: X-Requested-With');
header("Content-Type:application/json");
	include("../server/overhead_lines.php");
    $newObj = new OverheadLines();
    $geodata = $newObj->getOverhead_Lines();

    echo json_encode($geodata);
?>