<?php

require_once('php/auth.php');
require_once('php/config.php');
/*
 * Copyright (c) 2013 Richard E. Price under the The MIT License.
 * A copy of this license can be found in the LICENSE.text file.
 */
//Function to sanitize values received from POST. 
//Prevents SQL injection
function clean( $conn, $str ) {
  $str = @trim($str);
  return mysqli_real_escape_string( $conn, $str );
}

$link = mysqli_connect(DB_HOST, DB_USER, DB_PASSWORD, DB_DATABASE);
if ( !$link ) {
	error_log('Failed to connect to server: ' . mysqli_connect_error());
	die( 'Connect error: (' . mysqli_connect_errno() . ') ' . 
          mysqli_connect_error() );
	exit; // just in case
}


//Sanitize the dogame value
$dogame = clean( $link, $_REQUEST['dogame']);
//Initialize $gamefound flag.
$gamefound = 'no';
$qry = "SELECT game_id FROM game_player 
        WHERE player_id = $loggedinplayer";
$result = mysqli_query( $link, $qry );
if ($result) {
  while ($row = mysqli_fetch_array($result)) {
    if (intval($row[0]) == intval($dogame)) {
      $gamefound = 'yes';
      break;
    }
  }
}
if ($gamefound == 'no') {
  $_SESSION['SESS_HEADER_MESSAGE'] =
          'You are not a player in the selected game!';
  header("location: board18Main.php");
}
?>
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>BOARD18 - Remote Play Tool For 18xx Style Games
    </title>
    <link rel="shortcut icon" href="images/favicon.ico" >
    <link rel="stylesheet" href="style/board18com.css" />
    <link rel="stylesheet" href="style/board18Map.css" />
    <link rel="stylesheet" href="style/jquery.contextMenu.css" />
    <script type="text/javascript" src="scripts/jquery.js">
    </script> 
    <script type="text/javascript" src="scripts/board18com.js">
    </script>
    <script type="text/javascript" src="scripts/jquery.ui.position.js">
    </script>
    <script type="text/javascript" src="scripts/jquery.contextMenu.js">
    </script>
    <script type="text/javascript" src="scripts/board18Map1.js">
    </script> 
    <script type="text/javascript" src="scripts/board18Map2.js">
    </script> 
    <script type="text/javascript" src="scripts/board18Map3.js">
    </script> 
    <script type="text/javascript" src="scripts/board18Map4.js">
    </script> 
    <script type="text/javascript" src="scripts/board18Map5.js">
    </script>
    <script type="text/javascript" src="scripts/board18Map6.js">
    </script>
    <script type="text/javascript" src="scripts/board18Map7.js">
    </script> 
    <script type="text/javascript">
      $(function() {
        BD18.welcomename = "<?php echo "$welcomename"; ?>";
        BD18.headermessage = "<?php echo "$headermessage"; ?>";
        BD18.gameID = "<?php echo $dogame; ?>";
        var startMessage = BD18.welcomename + ": ";
        startMessage += BD18.headermessage;
        $('#lognote').text(startMessage);
        setUpKeys();
        $('#content').on({
          "mousedown": mapMouseEvent
        });
        registerMainMenu();
        var gameToPlay = 'session=<?php echo $dogame; ?>';
        $.getJSON("php/gameSession.php", gameToPlay, loadSession)
                .error(function() {
          var msg = "Error loading game file. \n";
          alert(msg);
        });
      });
    </script>    
  </head>

  <body>

    <div id="topofpage">
      <div id="logo">
        <img src="images/logo.png" alt="Logo"/> 
      </div>
      <div id="heading">
        <h1>BOARD18 - Remote Play Tool For 18xx Style Games</h1>
      </div>
      <div>
        <span id="newmainmenu"> MENU </span>
        <p id="lognote"></p>
      </div>
    </div>

    <div id="leftofpage">
      <span id="traymenu"> Trays </span>
      <div id="sidebar">
        <div id="tiles" onclick="traySelect(event);">
          <canvas id="canvas0" width="120">
            Your browser does not support the HTML 5 Canvas. 
          </canvas>
        </div> 

      </div>
    </div>

    <div id="rightofpage">
      <div id="content">
        <canvas id="canvas1">
          Your browser does not support the HTML 5 Canvas. 
        </canvas>
        <canvas id="canvas2">
        </canvas>
      </div>  
      <canvas id="canvas3">
      </canvas>
    </div>

  </body>
</html>
