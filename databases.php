<?php

// Show database recommender entries with searches

// File that defines database connection parameters
include('config.php');

$db = new mysqli($db_host, $db_user, $db_pass, $db_database);
if ($db->connect_errno) {
	printf("Connect failed: %s\n", $db->connect_error);
	exit();
}

$search_results = $db->query("SELECT d.db_id, d.search_id, d.database_text, s.search_query, s.instances
							FROM database_recommendations as d, searches as s
							WHERE s.id = d.db_id
							GROUP BY s.search_query
							ORDER BY s.id ASC") or die($db->error);

?>
<!DOCTYPE html>
<html lang="en">
<head>
	<title>Summon Searches with Database Recommendation Results</title>

	<style>
	table { 
  width: 100%; 
  border-collapse: collapse; 
}

tr:nth-of-type(odd) { 
  background: #eee; 
}
th { 
  background: #333; 
  color: white; 
  font-weight: bold; 
}
td, th { 
  padding: 6px; 
  border: 1px solid #ccc; 
  text-align: left; 
} 

.selected {
	background-color: #c09853 !important;
}

tr.link-hover:hover {
	background-color: #fcf8e3 !important;
}

tr.link-hover:hover td:nth-child(1) {

background-image: url(link.png);
background-repeat: no-repeat;
background-position: 75%;

}


@media 
only screen and (max-width: 760px),
(min-device-width: 768px) and (max-device-width: 1024px)  {

	
	table, thead, tbody, th, td, tr { 
		display: block; 
	}
	
	
	thead tr { 
		position: absolute;
		top: -9999px;
		left: -9999px;
	}
	
	tr { border: 1px solid #ccc; }
	
	td { 
		
		border: none;
		border-bottom: 1px solid #eee; 
		position: relative;
		padding-left: 50%; 
	}
	
	td:before { 
		
		position: absolute;
		
		top: 6px;
		left: 6px;
		width: 45%; 
		padding-right: 10px; 
		white-space: nowrap;
	}
	
	td:nth-of-type(1):before { content: "Row"; }
	td:nth-of-type(2):before { content: "Search"; }
	td:nth-of-type(3):before { content: "Database Recommendation"; }
	td:nth-of-type(6):before { content: "Instances"; }
	
}

	</style>

</head>
<body>

<table>
	<thead>
	  <tr>
	  	<th>Row Number</th>
		<th>Search Query</th>
		<th>Database Recommendation</th>
		<th>Instances</th>
	  </tr>
	</thead>
	<tbody>

<?php 

$i = 1;

if($search_results) {
	while($row = $search_results->fetch_assoc()) {
		echo '<tr id="' . $i . '">';
			echo '<td>' . $i . '</td>';
			echo '<td>' . $row['search_query'] . '</td>';
			echo '<td>' . $row['database_text'] . '</td>';
			echo '<td>' . $row['instances'] . '</td>';
		echo '</tr>';
		$i++;
	}
}

?>
	</tbody>
</table>


<script src="//ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script>
<script>

$('tr').css('cursor', 'pointer');
$('tr').addClass('link-hover');

$('tr').click(function() {

	// Get id
	var rowID = $(this).attr('id');
	console.log(rowID);

	// Remove previous highlight classes
	$('tr').removeClass('selected');

	$(this).addClass('selected');

	window.location.hash = rowID;

});

</script>


</body>
</html>