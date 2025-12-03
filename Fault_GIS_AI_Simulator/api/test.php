<?php
	include("../server/simulator.php");
    $newObj = new Fault();
    $geodata = $newObj->simulator();

    echo json_encode($geodata);
?>