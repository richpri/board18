<?php
	session_start();
	require_once('config.php');

	//Function to sanitize values received from the form. 
  //Prevents SQL injection
	function clean( $conn, $str ) {
		$str = @trim($str);
		return mysqli_real_escape_string( $conn, $str);
	}

	$link = mysqli_connect(DB_HOST, DB_USER, DB_PASSWORD, DB_DATABASE);
	if ( !$link ) {
		error_log('Failed to connect to server: ' . mysqli_connect_error());
		die( 'Connect error: (' . mysqli_connect_errno() . ') ' . mysqli_connect_error() );
		exit; // just in case
	}
	
	//Sanitize the POST values
	$fname = clean( $link, $_REQUEST['fname'] );
	$lname = clean( $link, $_REQUEST['lname'] );
	$login = clean( $link, $_REQUEST['newuser'] );
	$passwrd = clean( $link, $_REQUEST['passwrd'] );
	$email = clean( $link, $_REQUEST['email'] );

	//Check for duplicate login ID
  $qry1 = "SELECT * FROM players WHERE login='$login'";
	$result1 = mysqli_query( $link, $qry1 );
	if($result1) {
		if(mysqli_num_rows($result1) > 0) { // duplicate name!
      echo 'duplicate';
      exit;
		}
	}
	else {
		error_log("Check duplicate name: Query failed");
    exit;
	}

	//Create INSERT query
	$qry = "INSERT INTO players SET firstname='$fname', lastname='$lname',
          email='$email', login='$login', passwd='$passwrd'";
	$result = @mysqli_query( $link, $qry );
	if($result) {   // Was the query successful
		echo 'success';
	}else {
		error_log("Insert new player: Query failed");
    echo 'failed';
	}
?>