<?php
    $input = array("john", "Morpheus", "Trinity", "Cypher", "Tank");

    shuffle($input);
    echo json_encode($input)."<br/>";

    $rand_keys = array_rand($input, 4);
    echo $input[$rand_keys[0]] . "\n";


    $test = mt_rand(3,5);
    echo $test;
?>