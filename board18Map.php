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
    <script type="text/javascript">
      $(function(){
        BD18.welcomename = "<?php echo "$welcomename"; ?>";
        BD18.headermessage = "<?php echo "$headermessage"; ?>";
        BD18.gameID = "<?php echo $dogame; ?>";
        var startMessage = BD18.welcomename + ": ";
        startMessage += BD18.headermessage;
        $('#lognote').text(startMessage);
        $('#trays').mouseover(
          function() {
            $('.tray:not(":contains(\'unused\')")').each(function(i) {
              $(this).delay(i * 100).fadeIn();
            });
          }
        ); // end mouse over
        $('.tray').click(function() {
          $(".acttray").fadeOut();
          var trayid = $(this).attr('id');
          var inx = parseInt(trayid.substring(4),10);
          BD18.trays[inx].place(null);
        }); // end tray click
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
      <div id="sidebar">
        <div id="traylist">        
          <p id="trays" class="sidebaritem"><b>Trays</b></p>
          <p id="tray0" class="sidebaritem tray">unused</p>
          <p id="tray1" class="sidebaritem tray">unused</p>
          <p id="tray2" class="sidebaritem tray">unused</p>
          <p id="tray3" class="sidebaritem tray">unused</p>
          <p id="tray4" class="sidebaritem tray">unused</p>
          <p id="tray5" class="sidebaritem tray">unused</p>
          <p id="tray6" class="sidebaritem tray">unused</p>
          <p id="tray7" class="sidebaritem tray">unused</p>
          <p id="tray8" class="sidebaritem tray">unused</p>
          <p id="tray9" class="sidebaritem tray">unused</p>
        </div>

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
