<?php
include("../dbcon/conn.php");

$params = $_REQUEST;
$action = isset($params['action']) && $params['action'] != '' ? $params['action'] : 'register';
$registerCls = new Register();

switch ($action) {
    case 'register':
        $registerCls->getRegister();
        break;
    default:
        return;
}

class Register
{

    protected $conn;
    protected $data = array();
    function __construct()
    {

        $db = new dbObj();
        $connString = $db->getConnstring();
        $this->conn = $connString;
    }

    public function getRegister()
    {

        $sql = "SELECT employees.firstname, employees.surname, employees.rank, register.status, register.start_time FROM 
                employees INNER JOIN register ON employees.empid = register.empid ";
				
				//WHERE register.day = CURRENT_DATE

        $queryRecords = pg_query($this->conn, $sql) or die("error: failed to register data");
        $data = pg_fetch_all($queryRecords);
        echo json_encode($data);
    }
}
?>