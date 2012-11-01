<?php

require_once('auth.php');
require_once('config.php');
$link = mysql_connect(DB_HOST, DB_USER, DB_PASSWORD);
if (!$link) {
  error_log('Failed to connect to server: ' . mysql_error());
  exit;
}
$db = mysql_select_db(DB_DATABASE);
if (!$db) {
  error_log("Unable to select database");
  exit;
}

//Function to sanitize values received from the form. 
//Prevents SQL injection
function clean($str) {
  $str = @trim($str);
  return mysql_real_escape_string($str);
}

$game = json_decode($_REQUEST['newgame'], true);

//Sanitize the POST values
$name = clean($game["name"]);
$boxid = clean($game["boxid"]);
$count = count($game["players"]);
for ($i = 0; $i < $count; $i++) {
  $player[$i] = clean($game["players"][$i]);
}
//Check for valid boxid ID
$qry1 = "SELECT name FROM box WHERE box_id='$boxid'";
$result1 = mysql_query($qry1);
if ($result1) {
  if (mysql_num_rows($result1) == 0) { // Invalid Box ID!
    echo 'nobox';
    exit;
  }
} else {
  error_log("Check for valid box: Query failed");
  exit;
}

// Validate Player Names and lookup player IDs.
for ($i = 0; $i < $count; $i++) {
  $j = $i + 1;
  $qry5 = "SELECT player_id FROM players WHERE login = '$player[$i]'";
  $result5 = mysql_query($qry5);
  if ($result5) {
    if (mysql_num_rows($result5) == 0) { // Invalid Player name!
      echo "noplayer $j";
      exit;
    } else {
      $temp = mysql_fetch_array($result5);
      $playerid[$i] = $temp[0];
    }
  } else {
    error_log("Check for valid player $j: Query failed");
    exit;
  }
  mysql_free_result($result5);
}

//Create INSERT query
$jtxt = '{ "sessionName": "$name", "box_id": "$boxid",';
$jtxt .= '"boardTiles": [], "boardTokens": [], "marketTokens": [] }';
$qry2 = "INSERT INTO game SET name='$name', box_id='$boxid',
          player_count='$count', json_text='$jtxt'";  
$result2 = mysql_query($qry2);
if (!$result2) {   // Did the query fail
  error_log("Insert new game: Query failed");
  exit;
}
$gameid = mysql_insert_id();

// Fix start date
$qry3 = "SELECT activity_date FROM game WHERE game_id = '$gameid'";
$result3 = mysql_query($qry3);
if (!$result3 || (mysql_num_rows($result3) != 1)) {
  error_log("SELECT activity_date: Query failed");
  exit;
}
$ad = mysql_fetch_array($result3);
$qry4 = "UPDATE game SET start_date = '$ad[0]' WHERE game_id = '$gameid'";
$result4 = mysql_query($qry4);
if (!$result4) {   // Did the query fail
  error_log("SET start_date: Query failed");
  exit;
}

// create game_player rows.
for ($i = 0; $i < $count; $i++) {
  $qry6 = "INSERT INTO game_player SET game_id='$gameid', 
      player_id='$playerid[$i]'";
  $result6 = mysql_query($qry6);
  if (!$result6) {   // Did the query fail
    error_log("Insert new game_player: Query failed");
    exit;
  }
}
echo 'success';
?>
