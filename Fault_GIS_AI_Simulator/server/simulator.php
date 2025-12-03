<?php
include("../dbcon/conn.php");
 
$params = $_REQUEST;
$action = isset($params['action']) && $params['action'] !='' ? $params['action'] : 'list';
$faultCls = new Fault();
 
switch($action) {
 case 'list':
  $faultCls->getFaults();
 break;

 case 'add':
	$faultCls->insertFault();
 break;

 default:
 return;
}

class Fault {
  protected $conn;
  protected $data = array();
  function __construct() {
 
	$db = new dbObj();
	$connString =  $db->getConnstring();
    $this->conn = $connString;
  }
  
  public function getFaults() {

	$geojson = array(
		'type'    => 'FeatureCollection',
		'features'  => array()
	);

	$sql = "SELECT row_to_json(f) As feature 
			FROM (SELECT 'Feature' As type 
			, ST_AsGeoJSON(geom)::json As geometry 
			, row_to_json((SELECT l FROM (SELECT fid, type, fname, priority_level, description, rectification) As l)) As properties 
			FROM fault) As f;";

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

   function insertFault() {
	/*$data = $resp = array();
	$resp['status'] = false;
	$data['type'] = $_POST["type"];
	$data['fname'] = $_POST["fname"];
    $data['severity'] = $_POST["severity"];
	$data['description'] = $_POST["description"];
	$data['geom'] = $_POST['geom'];
	
	$result = pg_insert($this->conn, 'fault' , $data) or die("error to insert fault data");
	
	$resp['status'] = true;
	$resp['Record'] = $data;
	echo json_encode($resp);  // send data as json format*/

	//Arstisan Assistant Query
	$sqlAssistant = "SELECT empid FROM employees WHERE rank = 'Artisan Assistant'";
	$res2 = pg_query($this->conn,$sqlAssistant) or die ("failed to get Artisan Assistant data");
	$arrayAssistant = pg_fetch_all($res2);
	$n = count($arrayAssistant);
	shuffle($arrayAssistant);
	$rand_keys = array_rand($arrayAssistant, $n);
	$assist = $arrayAssistant[$rand_keys[0]];

	
	$type = $_POST['type'];
	$fname = $_POST['fname'];
	$severity = $_POST['severity'];
	$description = $_POST['description'];
	$artisan = mt_rand(3,5);
	$assistant = print_r(assist['empid']);
	$geom = $_POST['geom'];

	$psql = "INSERT INTO fault (type,fname,severity,description,artisan,assistant,geom) VALUES ('$type','$fname','$severity','$description','$artisan','$assistant', ST_GeomFromText('POINT($geom)', 4326))";
	$results = pg_query($this->conn, $psql) or die("failed to insert data");
	
	}

	function simulateTaskAllocation(){
		
		//List of present personnel and their skills
		$sql0 = "SELECT firstname, surname, rank, employees.empid FROM employees INNER JOIN register ON employees.empid = register.empid WHERE status = 'Present'";
		
		$sql1 = "SELECT firstname, surname, rank, empid FROM employees WHERE rank = 'Artisan'";
		$sql2 = "SELECT firstname, surname, rank, empid FROM employees WHERE rank = 'Artisan Assistant'";
		$sql3 = "SELECT firstname, surname, rank, empid FROM employees WHERE rank = 'Lineworker'";

		$results = pg_query($this->conn, $sql0) or die("failed to insert data");
		
		$array = pg_fetch_row($results);

		echo json_encode($array);

	}

	function simulator(){
		// List of present employees
		$sqlemployees = "SELECT employees.empid,firstname, surname, rank FROM employees INNER JOIN register ON employees.empid = register.empid WHERE status = 'Present'";
		$res1 = pg_query($this->conn, $sqlemployees) or die("failed to get employee data");
		$arrayEmployees = pg_fetch_all($res1);

		//Get other employees and group them with skillset

		//Get artisans only from the above list
		$sqlArtisans = "SELECT * FROM employees WHERE rank = 'Artisan'";
		$res2 = pg_query($this->conn,$sqlArtisans) or die ("failed to get Artisan data");
		$arrayArtisan = pg_fetch_all($res2);
		
		//List of faults faults
		$sqlfaults = "SELECT type, fname, priority_level, severity, description, rectification, day_occurrence FROM fault";
		$res3 = pg_query($this->conn, $sqlfaults) or die("failed to get fault data");
		$arrayFaults = pg_fetch_all($res3);

		//Get fault type and match skillset

		//Get only not rectified faults
		$sqlfaultsRect = "SELECT type, fname, priority_level, severity, description, rectification, day_occurrence FROM fault WHERE rectification = 'Pending'";
		$res4 = pg_query($this->conn, $sqlfaultsRect) or die("failed to get fault data");
		$arrayFaultsRect = pg_fetch_all($res4);

		//Allocate faults to artisan maximum of four per each

		$sqlAssistant = "SELECT empid FROM employees WHERE rank = 'Artisan Assistant'";
		$res2 = pg_query($this->conn,$sqlAssistant) or die ("failed to get Artisan Assistant data");
		$arrayAssistant = pg_fetch_all($res2);
		$n = count($arrayAssistant);
		shuffle($arrayAssistant);
		$rand_keys = array_rand($arrayAssistant, $n);
		$assistant = $arrayAssistant[$rand_keys[0]];
	
		echo $n;
		$z = print_r($assistant['empid']);

		//echo $z;


	}
}	

?>