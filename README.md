# MyThesis

## Install the following software packages to run the system

 1. Xampp
 2. postgres + postgis

### steps to run program

   1. copy the folder "FaultDetectionGIS" to C://xampp/htdocs.
   2. open cmd and navigate to folder faultdetectiongis.
   3. run the command "psql -U postgres -f faultdetectiongis.sql" to add the database faultdetectiongis to your local postgres DBMS.
   4. navigate to 'C://xampp/htdocs/faultdetectiongis/config/config.php' and change database password to your postgres password
   4. start apache in xampp user interface.
   5. open web browser and navigate to url "http://localhost/faultdetectiongis"
   
   6. Foreman Login Credentials
	  user email: kmukondiwa@powerutility.com
	  password: 12345
   
   7. Artisan Login Credentials
	  user email: fzimuto@powerutility.com
	  password: 12345
	  
   8. Artisan Assistant Login Credentials
	  user email: vmanganda@powerutility.com
	  password: 12345
	  
	Paste the following in your web browser url 
	To run the simulator open http://localhost/FaultDetectionGIS/Fault_GIS_AI_Simulator/
	To run the main app open http://localhost/FaultDetectionGIS/Fault_GIS_AI_App/
