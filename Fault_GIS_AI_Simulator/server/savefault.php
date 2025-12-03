<?php

    include("../dbcon/conn.php");

    $db = new dbObj();
    $connString =  $db->getConnstring();
    $conn = $connString;

    $sql = "SELECT empid, rank FROM employees WHERE rank='Artisan'";
    


    $type = $_POST['type'];
	$fname = $_POST['fname'];
	$severity = $_POST['severity'];
	$description = $_POST['description'];
	$geom = $_POST['geom'];

	$psql = "INSERT INTO faults (type,fname,severity,description,geom) VALUES ('$type','$fname','$severity','$description', ST_GeomFromText('POINT($geom)', 4326))";
    $results = pg_query($conn, $psql) or die("failed to insert data");

    header("location: ../pages/simulator.html");
 
?>