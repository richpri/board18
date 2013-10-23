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
  die('Connect error: (' . mysqli_connect_errno() . ') ' . mysqli_connect_error());
  exit; // just in case
}

//Sanitize the POST values
$fname = clean($link, $_REQUEST['fname']);
$lname = clean($link, $_REQUEST['lname']);
$login = clean($link, $_REQUEST['pname']);
$passwd = "";
$email = clean($link, $_REQUEST['email']);
if (array_key_exists('passwrd',$_REQUEST)) {
  $passwd = clean($link, $_REQUEST['passwrd']);
};

//Check for existing login ID
$qry1 = "SELECT * FROM players WHERE login='$login'";
$result1 = mysqli_query($link, $qry1);
if ($result1) {
  if (mysqli_num_rows($result1) === 0) { // no such user!
    echo 'nouser';
    exit;
  } else {
    $playerrow = mysqli_fetch_assoc($result1);
    $playerid = $playerrow['player_id'];
    // allow for unchanged password
    if ($passwd === "") $passwd = $playerrow['passwd']; 
  }
} else {
  error_log("Check for existing user: Query failed");
  exit;
}

//Check for ill formed email address
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
  // The email address is ill formed
  echo 'bademail';
  exit;
}

//Check for duplicate email address
$qry2 = "SELECT login FROM players WHERE email='$email'";
$result2 = mysqli_query($link, $qry2);
if ($result2) {
  if (mysqli_num_rows($result2) > 0) { 
    while ($playerrow2 = mysqli_fetch_assoc($result2)) {
      if ($playerrow2['login'] !== $login) { // duplicate email
        $duperr = 'email' . $playerrow['login'];
        echo $duperr;
        exit;
      }
    };
  }
} else {
  error_log("Check duplicate email: Query failed");
  exit;
}

//Create UPDATE query
$qry = "UPDATE players SET firstname='$fname', lastname='$lname',
          email='$email', login='$login', passwd='$passwd'
          WHERE player_id=$playerid";
$result = @mysqli_query($link, $qry);
if ($result) {   // Was the query successful
  echo 'success';
} else {
  error_log("Update player: Query failed");
  echo 'failed';
}
?>
