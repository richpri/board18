<?php
/*
 * auth.php is included at the start of all password protected pages 
 * and all password protected PHP programs called via AJAX.
 * It starts a php session and then checks to see that the player is
 * logged in and has been active sometime in the last 30 minutes.
 */
	//Start session
	session_start();
  if (isset($_SESSION['LAST_ACTIVITY']) && 
          (time() - $_SESSION['LAST_ACTIVITY'] > 1800)) { // 30 min
    // last request was more than 30 minutes ago
    session_unset();     // unset $_SESSION variable for the run-time 
    session_destroy();   // destroy session data in storage
  }
  $_SESSION['LAST_ACTIVITY'] = time(); // update last activity time stamp
	//Check whether the session variable SESS_PLAYER_ID is present or not
	if(!isset($_SESSION['SESS_PLAYER_ID']) || 
          (trim($_SESSION['SESS_PLAYER_ID']) == '')) {
    $denyloc = "location: http://" . $_SERVER['SERVER_NAME'];
    $denyloc .= "/BOARD18/access-denied.html";
		header($denyloc);
		exit;
	} else {
    $loggedinplayer = $_SESSION['SESS_PLAYER_ID'];
    $welcomename = $_SESSION['SESS_FIRST_NAME'];
    $headermessage = $_SESSION['SESS_HEADER_MESSAGE'];
    $_SESSION['SESS_HEADER_MESSAGE'] = '';
  }
?>
