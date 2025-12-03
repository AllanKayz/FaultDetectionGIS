<?php
include("../dbcon/conn.php");

$params = $_REQUEST;
$action = isset($params['action']) && $params['action'] != '' ? $params['action'] : 'crewmembers';
$registerCls = new Crew();

switch ($action) {
    case 'crewmembers':
        $registerCls->getCrew();
        break;
    default:
        return;
}

class Crew
{

    protected $conn;
    protected $data = array();
    function __construct()
    {

        $db = new dbObj();
        $connString = $db->getConnstring();
        $this->conn = $connString;
    }

    public function getCrew()
    {

        $sql = "SELECT employees.firstname, employees.surname, employees.rank, expertise.skillset FROM 
                employees INNER JOIN allocatecrew ON employees.empid = allocatecrew.empid
                INNER JOIN expertise ON allocatecrew.expertise_id = expertise.id ";

        $queryRecords = pg_query($this->conn, $sql) or die("error: failed to crew data");
        $data = pg_fetch_all($queryRecords);
        echo json_encode($data);
    }
}
?>