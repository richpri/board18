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

//Initialize $gamefound, $snapfound and $status flags.
$gamefound = 'no';
$snapfound = 'no';
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
            WHERE game_id = $intgame";
  $result2 = mysqli_query( $link, $qry2 );
  if ($result2 && (mysqli_num_rows($result2) == 1)) { 
    $row2 = mysqli_fetch_assoc($result2);
    $gamestat = $row2['status']; // game status
    $gname = $row2['gname']; // game name
    $qry3 = "SELECT * FROM game_snap
            WHERE game_id = $intgame ORDER BY cp_id DESC";
    $result3 = mysqli_query( $link, $qry3 );
    if ($result3) {
      if (mysqli_num_rows($result3) != 0) {
        $snapfound = 'yes';
        $row3 = mysqli_fetch_assoc($result3);
        $roundname = $row3['game_round']; // game round name
        $snapername = $row3['player']; // snaped by
        $snapdate = $row3['cp_date']; // snap date
      }
    } else {   
      error_log("snap query failed");
      $status = 'fail';
    }
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
    <link rel="stylesheet" href="style/board18Market-20151208.css" />
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
        var gameToPlay = 'session=<?php echo $dogame; ?>';
        $.getJSON("php/gameSession.php", gameToPlay, loadSession)
                .error(function() {
          var msg = "Error loading game file. \n";
          alert(msg);
        });
	if ("ontouchstart" in window) {
		$('#topofpage').append('<div id="keyShortcut"><input type="password"/></div>');
	}

      });
    </script>    
  </head>

  <body onclick="$('.menu').hide();">

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
        <span id="newmainmenu" onclick="$('.menu').hide();$('#mainmenu').toggle();event.stopPropagation();"> MENU </span>
        <p id="lognote"></p>
	<div id="mainmenu" class="menu">
          <ul class="bigMenu">
            <li onclick="acceptMove();">Accept Move</li>
            <li onclick="trayCanvasApp();mainCanvasApp();toknCanvasApp();">Cancel Move</li>
            <li onclick="window.location = 'board18Map.php?dogame=' + BD18.gameID;">Map Board</li>
            <li onclick="$('#snapname .error').hide();$('#snapname :text').val('');$('#snapname form').slideDown(300);
				BD18.isSnap = true;$('#rname').focus();">Take Snapshot</li>
            <li onclick="window.location = 'board18SnapList.php?gameid=' + BD18.gameID;">Show Snap List</li>
            <li onclick="window.location = 'board18Main.php';">Main Page</li>
            <li onclick="var swapstring = '&gameid=' + BD18.gameID;$.post('php/statSwap.php', swapstring,  statswapOK);">Toggle Status</li>
            <li onclick="$.post('php/logout.php', logoutOK);">Log Out</li>
            <li onclick="window.open(BD18.help, 'HelpGuide');">Help</li>
            <li onclick="$('.menu').hide();">Close Menu</li>
          </ul>
        </div> 
      </div>
    </div>

    <div id="topleftofpage">
      <span id="traybutton" onclick="$('.menu').hide();$('#traymenu').toggle();event.stopPropagation();"> Trays </span>
    </div>
    <div id="traymenu" class="menu"></div>
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
          <?php if ($snapfound == 'no') { ?>
          <p>No snapshots have been taken for this game.</p>
          <?php } else { ?>
          <p>
            The last snapshot taken for this game was 
              <?php echo $roundname;?>.
          </p>
          <p>
            It was taken by <?php echo $snapername; ?>
            at <?php echo $snapdate; ?>.
          </p>
          <?php } ?>
          <p>
             Pressing the Snapshot button will take a snapshot
             of the current game status. Please take a snapshot
             once per round and include the round in its name.
          <p>
            <label for="rname"> Enter Snapshot Name: </label>
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
