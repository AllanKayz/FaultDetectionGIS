<?php
session_start();
include_once("auth.php");

$usermail = $_POST['user'];
$userpwd = $_POST['password'];

$user_data = authenticate_user($usermail, $userpwd);

if ($user_data) {
    $_SESSION['user'] = $usermail;
    header("location: ../pages/faultmap.html");
} else {
    header("location: ../index.html?error=1");
}
?>