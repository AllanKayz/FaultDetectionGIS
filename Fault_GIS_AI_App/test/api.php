<?php
$input = array("Neo", "Morpheus", "Trinity", "Cypher", "Tank");
$rand_keys = array_rand($input, 4);
echo $input[$rand_keys[0]] . "\n";
echo $input[$rand_keys[1]] . "\n";

include("../dbcon/conn.php");

    $db = new dbObj();
    $connString =  $db->getConnstring();
    $conn = $connString;

$result = pg_query($conn, "SELECT * FROM employees");
if (!$result) {
  echo "An error occurred.\n";
  exit;
}

// Get an array of all author names
$arr = pg_fetch_all_columns($result, 0);

var_dump($arr);

?>
?>


