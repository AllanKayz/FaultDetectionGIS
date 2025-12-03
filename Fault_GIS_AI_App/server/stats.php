<?php
include("../dbcon/conn.php");

$params = $_REQUEST;
$action = isset($params['action']) && $params['action'] != '' ? $params['action'] : 'artisanloc';
$comCls = new Stats();

switch ($action) {
    case 'artisanloc':
        $comCls->getArtisans();
        break;
    case 'routes':
        $comCls->getRoutes();
        break;
    case 'commercial':
        $comCls->getCommercial();
        break;
    case 'industrial':
        $comCls->getIndustrial();
        break;
    case 'residential':
        $comCls->getResidential();
        break;
    case 'damagereports':
        $comCls->getDamageReports();
        break;
    case 'currentfaults':
        $comCls->getCurrentFaults();
        break;
    case 'damagedassets':
        $comCls->getDamagedAssets();
        break;
    case 'blackedoutarea':
        $comCls->getBlackedOutArea();
        break;
    case 'areaswithpower':
        $comCls->getAreaPower();
        break;
    case 'activeoutages':
        $comCls->getActiveOutages();
        break;
    case 'estimatedrevenueloss':
        $comCls->getEstimatedRevenueLoss();
        break;
    case 'faulthotspots':
        $comCls->getFaultHotspots();
        break;
    default:
        return;
}

class Stats
{
    protected $conn;
    protected $data = array();
    function __construct()
    {
        $db = new dbObj();
        $connString = $db->getConnstring();
        $this->conn = $connString;
    }

    //get artisan realtime locations
    public function getArtisans()
    {
        $geojson = array(
            'type'    => 'FeatureCollection',
            'features'  => array()
        );
    
        $sql = "SELECT row_to_json(f) As feature 
                FROM (SELECT 'Feature' As type 
                , ST_AsGeoJSON(geom)::json As geometry 
                , row_to_json((SELECT l FROM (SELECT id) As l)) As properties 
                FROM artisanlocations) As f;";
    
        $queryRecords = pg_query($this->conn, $sql) or die("error to fetch artisan locations data");
        $query = pg_fetch_all($queryRecords);
    
        $count = 0;
        foreach ($query as $q){
            array_push($geojson["features"],json_decode($query[$count]["feature"]));
            $count ++;
        }
    
        return $geojson;
        echo json_encode($geojson);
    }

    //get artisans preplanned routes
    public function getRoutes()
    {
        $geojson = array(
            'type'    => 'FeatureCollection',
            'features'  => array()
        );
    
        $sql = "SELECT row_to_json(f) As feature 
                FROM (SELECT 'Feature' As type 
                , ST_AsGeoJSON(geom)::json As geometry 
                , row_to_json((SELECT l FROM (SELECT id) As l)) As properties 
                FROM routes) As f;";
    
        $queryRecords = pg_query($this->conn, $sql) or die("error to fetch route data");
        $query = pg_fetch_all($queryRecords);
    
        $count = 0;
        foreach ($query as $q){
            array_push($geojson["features"],json_decode($query[$count]["feature"]));
            $count ++;
        }
    
        return $geojson;
        echo json_encode($geojson);
    }

    //get affected commercial customers
    public function getCommercial ()
    {
        $sql = "SELECT count(gid) FROM meter WHERE client_typ = 'Commercial'";

        $queryRecords = pg_query($this->conn, $sql) or die("error: failed to get commercial customers without power");
        $data = pg_fetch_all($queryRecords);
        echo json_encode($data);
    }

    //get number of affected industrial customers
    public function getIndustrial ()
    {
        $sql = "SELECT count(gid) FROM meter WHERE client_typ = 'Industrial'";

        $queryRecords = pg_query($this->conn, $sql) or die("error: failed to get industrial customers without power");
        $data = pg_fetch_all($queryRecords);
        echo json_encode($data);
    }

    //get number of affected residential customers
    public function getResidential ()
    {
        $sql = "SELECT count(gid) FROM meter WHERE client_typ = 'Domestic'";

        $queryRecords = pg_query($this->conn, $sql) or die("error: failed to get residential customers without power");
        $data = pg_fetch_all($queryRecords);
        echo json_encode($data);
    }

    //get damage reports
    public function getDamageReports ()
    {
        $sql = "SELECT fid,type,fname,severity,et_occurrence,priority_level,artisan,description,rectification FROM fault";

        $queryRecords = pg_query($this->conn, $sql) or die("error: failed to get damage reports");
        $data = pg_fetch_all($queryRecords);
        echo json_encode($data);
    }

    //get currents faults
    public function getCurrentFaults ()
    {
        $sql = "SELECT fid,type,fname,severity,et_occurrence,priority_level,artisan,description,rectification FROM fault WHERE rectification = 'Pending' OR rectification = 'In progress'";

        $queryRecords = pg_query($this->conn, $sql) or die("error: failed to get current faults");
        $data = pg_fetch_all($queryRecords);
        echo json_encode($data);
    }

    //get damaged assets
    public function getDamagedAssets ()
    {
        $sql = "";

        $queryRecords = pg_query($this->conn, $sql) or die("error: failed to get damaged assets");
        $data = pg_fetch_all($queryRecords);
        echo json_encode($data);
    }

    //get blacked out areas
    public function getBlackedOutArea ()
    {
        $sql = "";

        $queryRecords = pg_query($this->conn, $sql) or die("error: failed to get Blacked out areas");
        $data = pg_fetch_all($queryRecords);
        echo json_encode($data);
    }

    //get areas with power
    public function getAreaPower ()
    {
        $sql = "";

        $queryRecords = pg_query($this->conn, $sql) or die("error: failed to get areas with power");
        $data = pg_fetch_all($queryRecords);
        echo json_encode($data);
    }

    //get active outages
    public function getActiveOutages ()
    {
        $sql = "SELECT count(fid) FROM fault WHERE rectification = 'Pending' OR rectification = 'In progress'";

        $queryRecords = pg_query($this->conn, $sql) or die("error: failed to get active outages");
        $data = pg_fetch_all($queryRecords);
        echo json_encode($data);
    }

    //get Estimated revenue loss
    public function getEstimatedRevenueLoss ()
    {
        $sql = "SELECT count(id) FROM ";

        $queryRecords = pg_query($this->conn, $sql) or die("error: failed to get estimated revenue loss");
        $data = pg_fetch_all($queryRecords);
        echo json_encode($data);
    }

    //get fault hotspots
    public function getFaultHotspots ()
    {
        $sql = "";

        $queryRecords = pg_query($this->conn, $sql) or die("error: failed to get fault hotspots");
        $data = pg_fetch_all($queryRecords);
        echo json_encode($data);
    }

}
?>