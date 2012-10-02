<?php
	//Start session
	session_start();
	require_once('config.php');
	
	//Connect to mysql server
	$link = mysql_connect(DB_HOST, DB_USER, DB_PASSWORD);
	if(!$link) {
		error_log('Failed to connect to server: ' . mysql_error());
    exit;
	}
	
	//Select database
	$db = mysql_select_db(DB_DATABASE);
	if(!$db) {
		error_log("Unable to select database");
    exit;
	}
	
	//Function to sanitize values received from the form. Prevents SQL injection
	function clean($str) {
		$str = @trim($str);
		return mysql_real_escape_string($str);
	}
	
	//Sanitize the POST values
	$login = clean($_REQUEST['login']);
	$password = clean($_REQUEST['password']);
	
	//Create query
	$qry="SELECT * FROM players WHERE login='$login' AND passwd='$password'";
	$result=mysql_query($qry);
	// Test code
  // var_dump($qry);
  // var_dump($result);
  // end test code
	//Check whether the query was successful or not
	if($result) {
		if(mysql_num_rows($result) == 1) {
			//Login Successful
			session_regenerate_id();
			$player = mysql_fetch_assoc($result);
			$_SESSION['SESS_PLAYER_ID'] = $player['player_id'];
      if ($player['firstname'] == '') {
        $firstname = $login;
      } else {
        $firstname = $player['firstname'];
      }
			$_SESSION['SESS_FIRST_NAME'] = $firstname;
			$_SESSION['SESS_LAST_NAME'] = $player['lastname'];
			session_write_close();
			$response = array(
        "stat" => "success",
        "id" => $player['player_id'],
        "firstname" => $firstname,
        "lastname" => $player['lastname']
      );
		}else {
			//Login failed
			$response = array(
        "stat" => "fail",
        "id" => "",
        "firstname" => "",
        "lastname" => ""
      );
		}
    $res = rtrim(ltrim(json_encode($response), "["), "]");
    echo $res;
	}else {
		error_log("Query failed");
	}
?>
