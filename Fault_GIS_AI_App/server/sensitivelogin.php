<?php
session_start();
include_once("auth.php");

$usermail = $_POST['uname'];
$userpwd = $_POST['psw'];

$user_data = authenticate_user($usermail, $userpwd);

if ($user_data) {
    $_SESSION['user'] = $usermail;
    if($user_data["rank"]=="Foreman"){
        header("location: ../pages/foreman.html");
    }
    else if($user_data["rank"]=="Lead Artisan"){
        header("location: ../pages/leadartisan.html");
    }
    else if($user_data["rank"]=="Artisan"){
        header("location: ../pages/artisan.html");
    }
    else if($user_data["rank"]=="Artisan Assistant"){
        header("location: ../pages/artisanassistant.html");
    }
    else{
        header("location: ../index.html?error=1");
    }
} else {
    header("location: ../index.html?error=1");
}
?>