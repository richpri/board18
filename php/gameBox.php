<?php
/*
 * This is the server side code for the AJAX gameBox call.
 * Input is the game box id.
 * Output is JSON game box data.
 */

// require_once('auth.php');
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
$boxid = clean($_REQUEST['box']);

//Check for valid box ID and get JSON text for box.
$qry1 = "SELECT json_text FROM box WHERE box_id='$boxid'";
$result1 = mysql_query($qry1);
if ($result1) {
  if (mysql_num_rows($result1) == 0) { // Invalid box ID!
  $_SESSION['SESS_HEADER_MESSAGE'] = 
    'The selected box is not in the data base!';
  header("location: ../board18Main.php");
  }
} else {
  error_log("Check for valid box: Query failed");
  exit;
}

$ad = mysql_fetch_array($result1); // $ad[0] is json_data

echo $ad[0];
?>
