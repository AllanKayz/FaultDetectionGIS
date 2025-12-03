<?php
	include("../dbcon/conn.php");
class Boundaries {
	protected $conn;
	//protected $data = array();
	function __construct() {
 
		$db = new dbObj();
		$connString =  $db->getConnstring();
		$this->conn = $connString;
	}
	
	public function getBoundaries() {

		$geojson = array(
            'type'    => 'FeatureCollection',
            'features'  => array()
        );

        $sql = "SELECT row_to_json(f) As feature 
                FROM (SELECT 'Feature' As type 
                , ST_AsGeoJSON(geom)::json As geometry 
                , row_to_json((SELECT l FROM (SELECT bid) As l)) As properties 
                FROM boundaries_districts) As f;";

        $queryRecords = pg_query($this->conn, $sql) or die("error to fetch data");
        $query = pg_fetch_all($queryRecords);

        $count = 0;
        foreach ($query as $q){
            array_push($geojson["features"],json_decode($query[$count]["feature"]));
            $count ++;
        }

        return $geojson;
    }
    
    public function getEmployees(){
        $sql = "SELECT * FROM employees;";
        $queryRecords = pg_query($this->conn,$sql) or die("error");
        $query = pg_fetch_all($queryRecords);

        return $query;
    }
}
?>