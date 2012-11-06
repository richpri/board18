<?php
require_once('php/auth.php');
require_once('php/config.php');

$link = mysql_connect(DB_HOST, DB_USER, DB_PASSWORD);
if (!$link) {
  error_log('Failed to connect to server: ' . mysql_error());
  exit;
}
$db = mysql_select_db(DB_DATABASE);
if (!$db) {
  error_log("Unable to select database");
  exit;
}


//Function to sanitize values received from POST. 
//Prevents SQL injection
function clean($str) {
	$str = @trim($str);
	return mysql_real_escape_string($str);
}
	
//Sanitize the dogame value
$dogame = clean($_REQUEST['dogame']);
//Initialize $gamefound flag.
$gamefound = 'no';
$qry = "SELECT game_id FROM game_player 
        WHERE player_id = $loggedinplayer";
$result = mysql_query($qry);
if ($result) {
  while ($row = mysql_fetch_array($result)) {
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
    <script type="text/javascript" src="scripts/jquery.js">
    </script> 
    <script type="text/javascript" src="scripts/board18com.js">
    </script> 
    <script type="text/javascript" src="scripts/board18Map.js">
    </script> 
    <script type="text/javascript">
      $(function(){
        var gameToPlay = 'session=<?php echo $dogame; ?>';
        $.getJSON("php/gameSession.php", gameToPlay, loadSession)
        .error(function() { 
          var msg = "Error loading game file. \n";
          alert(msg); 
        });
      })
      
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

      <div id="menu">
        <input type="submit" value="Submit"
               onclick="doit('submit')" />
        <input type="submit" value="Reset"
               onclick="doit('reset')"/>
        <input type="submit" value="Add"
               onclick="doit('add')"/>
        <input type="submit" value="CW"
               onclick="doit('cw')"/>
        <input type="submit" value="CCW" 
               onclick="doit('ccw')"/>
        <span id="statusline">  </span>
      </div>
    </div>

    <div id="leftofpage">
      <div id="sidebar">

        <div id="trays">
          <b>Trays</b><br /><br />
        </div>

        <div id="tiles" onclick="traySelect(event)">
          <canvas id="canvas0" width="120">
            Your browser does not support the HTML 5 Canvas. 
          </canvas>
        </div> 

      </div>
    </div>
    
    <div id="rightofpage">
      <div id="content" onclick="hexSelect(event)">
        <canvas id="canvas1">
          Your browser does not support the HTML 5 Canvas. 
        </canvas>
        <canvas id="canvas2">
        </canvas>
        <footer>
          This is a nonfunctional mockup.
        </footer>
      </div>        
    </div>
    
  </body>
</html>
