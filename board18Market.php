<?php
/*
 * The market page consists of the page header, the stock  
 * market and the left sidebar containing the token trays.
 * 
 * Copyright (c) 2013 Richard E. Price under the The MIT License.
 * A copy of this license can be found in the LICENSE.text file.
 */

require_once('php/auth.php');
require_once('php/config.php'); 

//Function to sanitize values received from POST. 
//Prevents SQL injection
function clean( $conn, $str ) {
  $str = @trim($str);
  return mysqli_real_escape_string( $conn, $str );
}

//Initialize $gamefound and $status flags.
$gamefound = 'no';
$status = 'ok';

$link = mysqli_connect(DB_HOST, DB_USER, DB_PASSWORD, DB_DATABASE);
if ( !$link ) {
	error_log('Failed to connect to server: ' . mysqli_connect_error());
	$status = 'fail';
}  
  
//Sanitize the dogame value
$dogame = clean( $link, $_REQUEST['dogame']);

$qry1 = "SELECT game_id FROM game_player 
        WHERE player_id = $loggedinplayer";
$result1 = mysqli_query( $link, $qry1 );
if ($result1) {
  while ($row1 = mysqli_fetch_array($result1)) {
    if (intval($row1[0]) == intval($dogame)) {
      $gamefound = 'yes';
      break;
    }
  }
  
  if ($gamefound == 'no') {
    $headermessage = 'You are not a player in the selected game.';
  } 

  $intgame = intval($dogame);
  $qry2 = "SELECT * FROM game 
            WHERE game_id = $intval($intgame)";
  $result2 = mysqli_query( $link, $qry2 );
  if ($result2 && (mysqli_num_rows($result2) == 1)) { 
    $row2 = mysqli_fetch_assoc($result2);
    $gamestat = $row2[status]; // game status
    $gname = $row2[gname]; // game name
  } else {   
    error_log("status query failed");
    $status = 'fail';
  }
} else {
  error_log("game_id query failed");
  $status = 'fail';
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
    <link rel="stylesheet" href="style/board18Market.css" />
    <link rel="stylesheet" href="style/jquery.contextMenu.css" />
    <script type="text/javascript" src="scripts/jquery.js">
    </script> 
    <script type="text/javascript" src="scripts/board18com.js">
    </script>
    <script type="text/javascript" src="scripts/jqueryMigrate.js">
    </script> 
    <script type="text/javascript" src="scripts/jquery.ui.position.js">
    </script>
    <script type="text/javascript" src="scripts/jquery.contextMenu.js">
    </script>
    <script type="text/javascript" src="scripts/board18Market1.js">
    </script> 
    <script type="text/javascript" src="scripts/board18Market2.js">
    </script> 
    <script type="text/javascript" src="scripts/board18Market3.js">
    </script> 
    <script type="text/javascript" src="scripts/board18Market4.js">
    </script> 
    <script type="text/javascript" src="scripts/board18Market5.js">
    </script> 
    <script type="text/javascript" src="scripts/board18Market6.js">
    </script> 
    <script type="text/javascript" src="scripts/board18Market7.js">
    </script> 
    <script type="text/javascript">
      $(function() {
        if ('<?php echo "$status"; ?>' === 'fail') {
          var errmsg = 'Data Base access failed.\n';
          errmsg += 'Please contact the BOARD18 webmaster.';
          alert(errmsg);
        }
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
        $("#snapname").submit(function() {  
          snapshot();
          return false;
        }); // end snapname submit
        $("#button2").click(function(){  //cancel snapshot
          $('#snapname form').slideUp(300);
          BD18.isSnap = false;
          return false;
        }); // end button2 click
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
        <h1>BOARD18 - <?php echo $gname; ?> - 
          <span style="font-size: smaller">Status: 
            <?php echo $gamestat; ?></span></h1>
      </div>
      <div>
        <span id="newmainmenu"> MENU </span>
        <p id="lognote"></p>
      </div>
    </div>

    <div id="topleftofpage">
      <span id="traymenu"> Trays </span>
    </div>  
    <div id="botleftofpage">
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
    
    <div id="snapname">
      <form name="snapname" class="hideform" action="">
        <fieldset>
          <p style="font-size: 130%">Take a snapshot of
             <br><?php echo $gname; ?>.
          </p>
          <p>
             Pressing the Snapshot button will take a snapshot
             of the current game status and then display a list 
             of all the snapshots that exist for this game.
          </p>
          <p>
            <label for="rname"> Enter Stock or Operating Round: </label>
            <input type="text" name="rname" id="rname">
            <label class="error" for="rname" id="rname_error">
              This field is required. </label>
          </p>
          <p>
            <input type="submit" name="snapbutton"  
                   id="button1" value="Take Snapshot" >
            <input type="button" name="canbutton"  
                   id="button2" value="Cancel" >              
          </p>
        </fieldset>
      </form>
    </div>     
    
  </body>
</html>