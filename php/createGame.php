<?php
	session_start();
  $player = $_SESSION['SESS_PLAYER_ID'];
  require_once('config.php');
	$link = mysql_connect(DB_HOST, DB_USER, DB_PASSWORD);
	if(!$link) {
		error_log('Failed to connect to server: ' . mysql_error());
    exit;
	}
	$db = mysql_select_db(DB_DATABASE);
	if(!$db) {
		error_log("Unable to select database");
    exit;
	}
	
	//Function to sanitize values received from the form. 
  //Prevents SQL injection
	function clean($str) {
		$str = @trim($str);
		return mysql_real_escape_string($str);
	}
	
	//Sanitize the POST values
	$sname = clean($_REQUEST['name']);
	$count = clean($_REQUEST['pc']);
	$boxid = clean($_REQUEST['id']);

	//Check for valid boxid ID
  $qry1 = "SELECT name FROM box WHERE box_id='$boxid'";
	$result1 = mysql_query($qry1);
	if($result1) {
		if(mysql_num_rows($result1) == 0) { // Invalid Box ID!
      echo 'nobox';
      exit;
		}
	}
	else {
		error_log("Check for valid box: Query failed");
    exit;
	}

	//Create INSERT query
	$qry2 = "INSERT INTO game SET name='$sname', box_id='$boxid',
          player_count='$count', json_text='empty'";  // ***Fix json_text***
	$result2 = mysql_query($qry2);
	if(!$result2) {   // Did the query fail
	  error_log("Insert new game: Query failed");
    exit;
	}
  $gameid = mysql_insert_id(); 
   
  // Fix start date
  $qry3 = "SELECT activity_date FROM game WHERE game_id = '$gameid'";
  $result3 = mysql_query($qry3);
	if(!$result3  || (mysql_num_rows($result3) != 1)) {
		error_log("SELECT activity_date: Query failed");
    exit;
	}
  $ad = mysql_fetch_array($result3);
  $qry4 = "UPDATE game SET start_date = '$ad[0]' WHERE game_id = '$gameid'";
  $result4 = mysql_query($qry4);
	if(!$result4) {   // Did the query fail
	  error_log("SET start_date: Query failed");
    exit;
	}
  // create game_player row.
	$qry5 = "INSERT INTO game_player SET game_id='$gameid', player_id='$player'";
	$result5 = mysql_query($qry5);
	if(!$result5) {   // Did the query fail
	  error_log("Insert new game_player: Query failed");
    exit;
	}
  echo 'success';
?>
