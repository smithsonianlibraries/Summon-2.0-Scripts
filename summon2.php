<?php
header("Access-Control-Allow-Origin: https://gvsu.summon.serialssolutions.com");
header("Access-Control-Allow-Origin: http://gvsu.summon.serialssolutions.com");

// File that defines database connection parameters
include('config.php');

$db = new mysqli($db_host, $db_user, $db_pass, $db_database);
if ($db->connect_errno) {
	printf("Connect failed: %s\n", $db->connect_error);
	exit();
}

if(isset($_REQUEST['search']) && $_REQUEST['search'] != "") { // Search term is set, it's not blank

	/*
		ProQuest often counts additional facets as a new search, but that's not true. Facet use is
		a refinement of an existing search. We'd rather know how many searches are actually done,
		and track refinements separately. One could easily add a table to record refinements separately
		within this data structure.

		To understand whether a search is new or not, we create a unique key for each search ($unique_hash)
		that is an sha-2 hash of the user's IP address tacked on to the search terms from the search box.
		Any subsequent searches that have the same unique key will not be tracked as new searches
		if the unique key has been matched within the past hour.

		The database does store these unique SHA-2 hashes, at least until another search for the same 
		terms is done with a different IP address. We consider the SHA-2 hash to be fairly secure,
		although I suppose in theory it could be decrypted to reveal a search term with the IP
		address it came from, which could be personally identifiable. 

		Rather than store each query individually, we use an 'instances' value in the table to track
		how many times the search has been done. We therefore do not have individual times the search
		was done, but instead only the last time the query was done. For our purposes, search queries
		are not case sensitive.

		We could run a regular cron job that would clear these unique keys from the database after an
		hour, since after that time their usefulness has ended. That's something we'll look into.

	*/

	$unique_hash = hash('sha256', $_SERVER['REMOTE_ADDR'] . str_replace(" ", "", addslashes(strtolower(urldecode($_REQUEST['search'])))));

	$search_term = $db->real_escape_string(strtolower(urldecode($_REQUEST['search'])));

	db_insert($search_term, $unique_hash);

}

function db_insert($search, $hash){

	global $db;

	$now = time();
	$hourstamp = $now - 3600;

	$count_query = $db->query("SELECT s.id, s.instances, s.search_query, m.hash 
								FROM searches as s,
								matches as m 
								WHERE m.hash = '$hash'
								AND m.id = s.id
								AND m.timestamp > '$hourstamp'") 
					or die($db->error);


	if($count_query->num_rows == 0) { // This search from this IP have not been done in the past 60 minutes

		// Has the search been done before?

		$search_query = $db->query("SELECT s.id, m.id
									FROM searches as s,
									matches as m
									WHERE search_query = '$search'
									AND s.id = m.id
									LIMIT 1")
						or die($db->error);

		if($search_query->num_rows > 0) { // Already a record for this search

			// Increment the search by 1
			$search_array = $search_query->fetch_array();
			$search_id = $search_array['id'];

			$db->query("UPDATE searches as s, matches as m
						SET s.instances=instances+1,
						m.timestamp = '$now',
						m.hash = '$hash'
						WHERE s.id = '$search_id'
						AND m.id = '$search_id'") or die($db->error);

			echo 'Search updated.';

		} else { // No record for this search

			$db->query("INSERT INTO searches (instances, search_query)
  						VALUES('1', '$search')") or die($db->error);

			$db->query("INSERT INTO matches (id, hash, timestamp) 
  						VALUES(LAST_INSERT_ID(),'$hash','$now')") or die($db->error);

			// Check for Topic Explorer mapping

			if((isset($_REQUEST['topic']) && ($_REQUEST['topic'] == true)) { // Save topic explorer data

				// Watch out for naughty bits
				$topic = $db->real_escape_string($_REQUEST['title']);
				$topicFrom = $db->real_escape_string($_REQUEST['from']);
				$topicSummary = $db->real_escape_string($_REQUEST['summary']);

				$db->query("INSERT INTO topics (id, title, from, summary) VALUES (LAST_INSERT_ID(), '$topic', '$topicFrom', '$topicSummary')") or die($db->error);

			}

			echo 'Search saved.';

		}	
	}
}

?>
