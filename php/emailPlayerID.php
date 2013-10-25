<?php

require_once('config.php');
require_once('sendEmail.php');

$link = mysqli_connect(DB_HOST, DB_USER, DB_PASSWORD, DB_DATABASE);
if (!$link) {
  error_log('Failed to connect to server: ' . mysqli_connect_error());
  echo 'fail';
  exit; // just in case
}

//Function to sanitize values received from the form. 
//Prevents SQL injection
function clean($conn, $str) {
  $str = @trim($str);
  return mysqli_real_escape_string($conn, $str);
}

//Sanitize the POST value
$email = clean($link, $_REQUEST['email']);

//Check for ill formed email address
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
  // The email address is ill formed
  echo 'bademail';
  exit;
}

// Look up player via email address and send email
// to that address with associated player ID [login].
$qry1 = "SELECT * FROM players WHERE email='$email'";
$result1 = mysqli_query($link, $qry1);
if ($result1) {
  if (mysqli_num_rows($result1) === 0) { // No email!
    echo 'fail';
    error_log("Look up email address: No Email address found!");
    exit;
  } else { // Found email address in database!
    $playerrow = mysqli_fetch_assoc($result1);
    $subject = 'BOARD18 Player ID recovery';
    $body = 'The player id for user ' . $email .
            ' is ' . $playerrow['login'] . '.';
    sendEmail($email, $subject, $body);
    exit;
  }
} else {
  echo 'fail';
  error_log("Look up email address: Query failed");
  exit;
}
?>