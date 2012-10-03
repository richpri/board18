<?php
	//Start session
	session_start();
	
	//Unset the variables stored in session
	unset($_SESSION['SESS_PLAYER_ID']);
  unset($_SESSION['SESS_PLAYER_LEVEL']);
	unset($_SESSION['SESS_FIRST_NAME']);
	unset($_SESSION['SESS_LAST_NAME']);
  echo "success";
?>
