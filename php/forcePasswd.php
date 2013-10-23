<?php

session_start();
require_once('config.php');

//Function to sanitize values received from the form. 
//Prevents SQL injection
function clean($conn, $str) {
  $str = @trim($str);
  return mysqli_real_escape_string($conn, $str);
}

$link = mysqli_connect(DB_HOST, DB_USER, DB_PASSWORD, DB_DATABASE);
if (!$link) {
  error_log('Failed to connect to server: ' . mysqli_connect_error());
  die('Connect error: (' . mysqli_connect_errno() . ') ' . 
          mysqli_connect_error());
  exit; // just in case
}

//Sanitize the POST value
$passwd = clean($link, $_REQUEST['passwd']);

//Check for existing login ID
$qry1 = "SELECT * FROM players WHERE player_id='$loggedinplayer'";
$result1 = mysqli_query($link, $qry1);
if ($result1) {
  if (mysqli_num_rows($result1) === 0) { // no such user!
    echo 'nouser';
    exit;
  } 
} else {
  error_log("Check for existing user: Query failed");
  exit;
}

//Create UPDATE query
$qry = "UPDATE players SET passwd='$passwd' WHERE player_id=$loggedinplayer";
$result = @mysqli_query($link, $qry);
if ($result) {   // Was the query successful
  echo 'success';
} else {
  error_log("Update player: Query failed");
  echo 'failed';
}
?>
