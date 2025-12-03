<?php
include("../dbcon/conn.php");
 
/*$params = $_REQUEST;
$action = isset($params['action']) && $params['action'] !='' ? $params['action'] : 'list';
$empCls = new Employee();
 
switch($action) {
 case 'list':
  $empCls->getEmployees();
 break;
 default:
 return;
}*/
 
 
class Employee {
  protected $conn;
  protected $data = array();
  function __construct() {
 
	$db = new dbObj();
	$connString =  $db->getConnstring();
    $this->conn = $connString;
  }
  
  public function getEmployees() {

    $geojson = array(
        'type'    => 'FeatureCollection',
        'features'  => array()
    );

    $sql = "SELECT row_to_json(f) As feature 
            FROM (SELECT 'Feature' As type 
            , ST_AsGeoJSON(geom)::json As geometry 
            , row_to_json((SELECT l FROM (SELECT gid, errors, feeder) As l)) As properties 
            FROM errors) As f;";

    $queryRecords = pg_query($this->conn, $sql) or die("error to fetch data");
    $query = pg_fetch_all($queryRecords);

    $count = 0;
    foreach ($query as $q){
        array_push($geojson["features"],json_decode($query[$count]["feature"]));
        $count ++;
    }

    return $geojson;
    echo json_encode($geojson);
}
}
?>