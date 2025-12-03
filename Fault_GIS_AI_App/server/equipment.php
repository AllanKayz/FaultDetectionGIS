<?php
include("../dbcon/conn.php");

$params = $_REQUEST;
$action = isset($params['action']) && $params['action'] != '' ? $params['action'] : 'equipment';
$equipmentCls = new Equipment();

switch ($action) {
    case 'equipment':
        $equipmentCls->getEquipment();
        break;
    default:
        return;
}

class Equipment
{

    protected $conn;
    protected $data = array();
    function __construct()
    {

        $db = new dbObj();
        $connString = $db->getConnstring();
        $this->conn = $connString;
    }

    public function getEquipment()
    {

        $sql = "SELECT equipment.type, equipment.name, equipment.condition FROM equipment";

        $queryRecords = pg_query($this->conn, $sql) or die("error: failed to equipment data");
        $data = pg_fetch_all($queryRecords);
        echo json_encode($data);
    }
}
?>