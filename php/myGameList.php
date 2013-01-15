<?php
/*
 * This is the server side code for the AJAX myGameList call.
 * 
 * There are no input parameters.
 *
 * Output is the following JSON data structure. 
 * {
 *  {gamelist: [
 *   {"game_id": "nn",
 *   "gname": "aaaa",
 *   "bname": "bbbb", 
 *   "version": "cccc",
 *   "start_date": "mm/dd/yyyy"}
 *    . . . . . . .
 *   ] 
 * }
 */
require_once('auth.php');
require_once('config.php');

$link = @mysqli_connect(DB_HOST, DB_USER, 
        DB_PASSWORD, DB_DATABASE);
if (mysqli_connect_error()) {
  $logMessage = 'MySQL Error 1: ' . mysqli_connect_error();
  error_log($logMessage);
  exit;
}

$you = intval($_SESSION['SESS_PLAYER_ID']);
$qry = "SELECT b.game_id, b.gname, c.bname, 
               c.version, DATE(b.start_date) 
          FROM game_player AS a 
            JOIN (game AS b, box AS c)
              ON (a.player_id = $you
                AND a.game_id = b.game_id
                AND b.box_id = c.box_id)
          ORDER BY b.gname";
  $result = mysqli_query($link,$qry);
if ($result) {
  $first = true;
  echo '{"gamelist": [';
  while ($row = mysqli_fetch_array($result)) {
    if ($first) {  
      $first = false;
    } else {
      echo ', ';
    };
    echo '{"game_id": "';
    echo $row[0];
    echo '", "gname": "';
    echo $row[1];
    echo '", "bname": "';
    echo $row[2];
    echo '", "version": "';
    echo $row[3];
    echo '", "start_date": "';
    echo $row[4];
    echo '" }';
  }
  echo "]}";
} else {
  $logMessage = 'MySQL Error 2: ' . mysqli_error($link);
  error_log($logMessage);
}
?>
