<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET POST');
header('Access-Control-Allow-Headers: X-Requested-With');
header("Content-Type:application/json");
	include("../server/employeeRegister.php");
    $newObj = new Register();
    $geodata = $newObj->getRegister();

    echo json_encode($geodata);
?>