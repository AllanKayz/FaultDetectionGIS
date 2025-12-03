<?php
	include("response.php");
    $newObj = new Employee();
    $geodata = $newObj->getEmployees();

    echo json_encode($geodata);
?>