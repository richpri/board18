<?php
/*
 * emailPlayerAll.php is the server side code for the 
 * AJAX emailPlayerAll call. It creates a text email 
 * for each player. For each successful email
 * creation it then calls sendEmail.php.
 * Upon completion it exits without returning a status.
 * This leaves it to sendEmail to return the
 * 'success' status for each email. 
 * 
 * Input consists the following parameters:
 *   subject
 *   body
 * 
 * Output, if any, is the echo return status "fail". 
 *
 * Copyright (c) 2015 Richard E. Price under the The MIT License.
 * A copy of this license can be found in the LICENSE.text file.
 */
 
// require_once('auth.php'); test
require_once('config.php');
require_once('sendEmail.php');

$link = mysqli_connect(DB_HOST, DB_USER, DB_PASSWORD, DB_DATABASE);
if (!$link) {
  error_log('Failed to connect to server: ' . mysqli_connect_error());
  echo 'fail';
  exit; 
}

//Function to sanitize values received from the form. 
//Prevents SQL injection
function clean($conn, $str) {
  $str = @trim($str);
  return mysqli_real_escape_string($conn, $str);
}

//Sanitize the POST value
$subject = clean($link, $_REQUEST['subject']);
$midbody = $_REQUEST['body'];

// Look up each player and send email to each player.
$qry1 = "SELECT * FROM players";
$result1 = mysqli_query($link, $qry1);
if ($result1) {
  while ($playerrow = mysqli_fetch_assoc($result1)) {
    $subject = '[BOARD18] ' . $subject;
    $body = 'This is a message from the BOARD18 server at ';
    $body .= $_SERVER['SERVER_NAME'] . ".\n \n";
    $body .= $midbody;
    sendEmail($playerrow['email'], $subject, $body);
  }
  exit;
} else {
  echo 'fail';
  error_log("Look up player: Query failed");
  exit;
}
?>