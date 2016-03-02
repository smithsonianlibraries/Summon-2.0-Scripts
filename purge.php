#!/usr/bin/env php

<?php

// File that defines database connection parameters
include('config.php');

$now = strtotime('-1 hour');

// SQL to remove all match table entries more than an hour old.

$result = $db->query('DELETE FROM matches WHERE timestamp < "$now"');

if($result) {

	echo 'Purged Summon match database';
}