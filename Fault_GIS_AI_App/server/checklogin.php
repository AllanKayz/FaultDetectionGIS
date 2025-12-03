<?php
    
    include("../dbcon/conn.php");

 
    $db = new dbObj();
    $connString =  $db->getConnstring();
    $conn = $connString;

    $usermail = $_POST['user'];
    $userpwd = $_POST['password'];

    $usermail = stripslashes($usermail);
    $userpwd = stripslashes($userpwd);

    $usermail = pg_escape_string($usermail);
    $userpwd = pg_escape_string($userpwd);

    $psql = " SELECT * FROM employees WHERE email = '$usermail' AND password = '$userpwd'";
    $result = pg_query($conn, $psql) or die("error to fetch employees data");

    $count = pg_num_rows($result);

    if($count ==1)
    {
        header("location: ../pages/faultmap.html");
    }
    else{
        echo "Wrong Username or Password";
        //header("location: ../index.php");
    }

?>