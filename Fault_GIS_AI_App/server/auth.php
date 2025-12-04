<?php
function authenticate_user($email, $password) {
    include_once("../dbcon/conn.php");
    $db = new dbObj();
    $conn = $db->getConnstring();

    $stmt = pg_prepare($conn, "login_query", 'SELECT rank, password FROM employees WHERE email = $1');
    $result = pg_execute($conn, "login_query", array($email));

    if ($row = pg_fetch_assoc($result)) {
        if (password_verify($password, $row['password'])) {
            return $row;
        }
    }
    return false;
}
?>