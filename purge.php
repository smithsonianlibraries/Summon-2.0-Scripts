#!/usr/bin/env php

<?php

// File that defines database connection parameters
include('config.php');


$db = new mysqli($db_host, $db_user, $db_pass, $db_database);
if ($db->connect_errno) {
	printf("Connect failed: %s\n", $db->connect_error);
	exit();
}

$now = strtotime('-1 hour');

// SQL to remove all match table entries more than an hour old.

$result = $db->query('DELETE FROM matches WHERE timestamp < "$now"');

if($result) {

	echo 'Purged Summon match database';
}