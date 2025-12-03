<?php
	include("../server/simulator.php");
    $newObj = new Fault();
    $geodata = $newObj->insertFault();

    echo json_encode($geodata);
?>