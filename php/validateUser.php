<?php
	//Start session
	session_start();
	require_once('config.php');
	
	//Function to sanitize values received from the form. 
  //Prevents SQL injection.
	function clean( $conn, $str) {
		$str = @trim($str);
		return mysqli_real_escape_string( $conn, $str );
	}
  
  // setup JSON failure object.
  $farray = array("stat" => "fail");
  $fail = rtrim(ltrim(json_encode($farray), "["), "]");
	error_log($fail);
  
	$link = mysqli_connect(DB_HOST, DB_USER, DB_PASSWORD, DB_DATABASE);
	if ( !$link ) {
		error_log('Failed to connect to server: ' . mysqli_connect_error());
    echo $fail;
		exit; 
	}
	
	//Sanitize the parameter values
	$login = clean( $link, $_REQUEST['login'] );
	$password = clean( $link, $_REQUEST['password'] );
	
	//Create query
	$qry="SELECT * FROM players WHERE login='$login' AND passwd='$password'";
	$result = mysqli_query( $link, $qry );

	//Check whether the query was successful or not
	if($result) {
		if(mysqli_num_rows($result) == 1) {
			//Login Successful
			session_regenerate_id();
			$playerrow = mysqli_fetch_assoc($result);
			$_SESSION['SESS_PLAYER_ID'] = $playerrow['player_id'];
      if ($playerrow['firstname'] == '') {
        $firstname = $login;
      } else {
        $firstname = $playerrow['firstname'];
      }
			$_SESSION['SESS_FIRST_NAME'] = $firstname;
			$_SESSION['SESS_LAST_NAME'] = $playerrow['lastname'];
			$_SESSION['SESS_PLAYER_LEVEL'] = $playerrow['level'];
			$_SESSION['SESS_HEADER_MESSAGE'] = 'Login Successful.';
      session_write_close();
			$response = array(
        "stat" => "success",
        "id" => $playerrow['player_id'],
        "firstname" => $firstname,
        "lastname" => $playerrow['lastname'],
        "level" => $playerrow['level']
      );
		}else {
			//Login failed
			$response = array(
        "stat" => "no",
        "id" => "",
        "firstname" => "",
        "lastname" => "",      
        "level" => ""
      );
		}
    $res = rtrim(ltrim(json_encode($response), "["), "]");
    echo $res;
	}else {
		error_log("Query failed");
    echo $fail;
	}
?>
