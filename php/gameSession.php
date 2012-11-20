<?php
/*
This is the server side code for the AJAX gameSession call.
Input is the game_id.
Output is JSON game session data.
*/

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

//Sanitize the POST value
$gameid = clean($_REQUEST['session']);

//Check for valid gameid ID and get JSON text for game.
$qry1 = "SELECT json_text FROM game WHERE game_id='$gameid'";
$result1 = mysql_query($qry1);
if ($result1) {
  if (mysql_num_rows($result1) == 0) { // Invalid Game ID!
  $_SESSION['SESS_HEADER_MESSAGE'] = 
    'The selected game is not in the data base!';
  header("location: board18Main.php");
  }
} else {
  error_log("Check for valid box: Query failed");
  exit;
}

$ad = mysql_fetch_array($result1); // $ad[0] is json_data

echo $ad[0];
?>
