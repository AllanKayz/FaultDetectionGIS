$(document).ready(function(){
	/* Handling get employee */
	function get_employee() {
		$.ajax({				
			type : 'GET',
			url  : 'response.php?action=list',
			success : function(response){
				response = JSON.parse(response);
				var tr;
		      	$('#emp_body').html('');
		      	$.each(response, function( index, emp ) {
				  tr = $('<tr/>');
		            tr.append("<td>" + emp.gid + "</td>");
		            tr.append("<td>" + emp.errors + "</td>");
		            tr.append("<td>" + emp.feeder + "</td>");
 
	            	var action = "<td><div class='btn-group' data-toggle='buttons'>";
	            	action += "<a href='#' target='_blank' class='btn btn-warning btn-xs' data-toggle='modal' data-target='#edit_model'>Edit</a>";
	            	action += "<a href='#' target='_blank' class='btn btn-danger btn-xs'>Delete</a>";
		            tr.append(action);
		            $('#emp_body').append(tr);
				});
			}
		});
	}
	
	//initialize method on load
 	function init() {
 		get_employee();
 	}
 	init();
});