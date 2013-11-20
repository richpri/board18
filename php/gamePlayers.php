<?php
/*
 * gamePlayers.php is the server side code for the 
 * AJAX gamePlayers call.
 * 
 * Input is the gameID.
 * 
 * Output is the following stringified JSON data structure. 
 *   {
 *     "stat":"success",
 *     "game":"aaaaaa",
 *     "players":
 *     [
 *       {
 *         "player_id":"nnnn",
 *         "login":"aaaa",
 *         "firstname":"aaaa",
 *         "lastname":"aaaa"
 *       },
 *       . . . . more players . . . . . 
 *     ]
 *   }
 *
 * Copyright (c) 2013 Richard E. Price under the The MIT License.
 * A copy of this license can be found in the LICENSE.text file.
 */
require_once('auth.php'); 
require_once('config.php');

class Playerline
{
  public $player_id;
  public $login;
  public $firstname;
  public $lastname;
}
class Response
{
  public $stat;
  public $game;
  public $players;
}

// set up fail return object.
$errorResp = new Response();
$errorResp->stat = "fail";
$errResp = json_encode($errorResp);

$link = mysqli_connect(DB_HOST, DB_USER, DB_PASSWORD, DB_DATABASE);
if (!$link) {
  error_log('Failed to connect to server: ' . mysqli_connect_error());
  echo $errResp;
  exit; 
}

//Function to sanitize values received from the form. 
//Prevents SQL injection
function clean($conn, $str) {
  $str = @trim($str);
  return mysqli_real_escape_string($conn, $str);
}

//Sanitize the POST value
$gameid = clean($link, $_REQUEST['gameID']);

$qry0 = "SELECT gname FROM game WHERE game_id='$gameid'";
$result0 = mysqli_query($link,$qry0);
if (!$result0 || (mysqli_num_rows($result0) !== 1)) { 
  $logMessage = 'Failed to find name for game' . mysqli_error($link);
  error_log($logMessage);
  echo($errResp);
  exit;
} else {
  $rowg = mysqli_fetch_array($result0);
  $gname =  $rowg[0];
}

$qry1 = "SELECT a.player_id, b.login, b.firstname, b.lastname
          FROM game_player AS a 
            JOIN (players AS b)
              ON (a.game_id = $gameid
                  AND a.player_id = b.player_id)
          ORDER BY a.player_id";
$result1 = mysqli_query($link,$qry1);
if ($result1) {
  if (mysqli_num_rows($result) === 0) { // no players.
    error_log('Failed to find any players for game ' . $gname);
    $noneResp = new Response();
    $noneResp->stat = "none";
    $noneResp->game = $gname;
    echo json_encode($noneResp);
    exit;
  } else {
    $playerlist = array();
    $ii = 0;
    while ($row = mysqli_fetch_array($result1)) {
      $playerlist[$ii] = new Playerline();
      $playerlist[$ii]->player_id = $row[0];
      $playerlist[$ii]->login = $row[1];
      $playerlist[$ii]->firstname = $row[2];
      $playerlist[$ii]->lastname = $row[3];
      $ii += 1;
    }
    $succResp = new Response();
    $succResp->stat = "success";
    $succResp->game = $gname;
    $succResp->players = $playerlist;
    
    echo json_encode($succResp);
    exit;
  }
} else {
  $logMessage = 'Error on SELECT query: ' . mysqli_error($link);
  error_log($logMessage);
  echo $errResp;
}
