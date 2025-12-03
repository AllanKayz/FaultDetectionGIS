<?php
    include("../dbcon/conn.php");

    $db = new dbObj();
    $connString =  $db->getConnstring();
    $conn = $connString;

    $usermail = $_POST['uname'];
    $userpwd = $_POST['psw'];

    $usermail = stripslashes($usermail);
    $userpwd = stripslashes($userpwd);

    $usermail = pg_escape_string($usermail);
    $userpwd = pg_escape_string($userpwd);

    $psql = " SELECT * FROM employees WHERE email = '$usermail' AND password = '$userpwd'";
    $result = pg_query($conn,$psql);

    $count = pg_num_rows($result);

    if($count == 1)
    {
        $sql = pg_query("SELECT rank FROM employees WHERE email = '$usermail';");
        $row = pg_fetch_array($sql);
        if($row["rank"]=="Foreman"){
            header("location: ../pages/foreman.html");
        }
        else if($row["rank"]=="Lead Artisan"){
            header("location: ../pages/leadartisan.html");
        }
        else if($row["rank"]=="Artisan"){
            header("location: ../pages/artisan.html");
        }
        else if($row["rank"]=="Artisan Assistant"){
            header("location: ../pages/artisanassistant.html");
        }
        else{
            echo "No Such Person";
            //header("location:errorpage.php");
        }   
    }
    else{
        echo "Wrong Username or Password";
        //header("location: ../index.php");
    }
?>

