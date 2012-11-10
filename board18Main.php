<?php
require_once('php/auth.php');
require_once('php/config.php');

function prepareDatabase() {
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
}

function showGames() {
  prepareDatabase();
  $you = $_SESSION['SESS_PLAYER_ID'];
  
  $qry = "SELECT b.game_id, b.bname, c.gname, 
                 c.version, DATE(b.start_date) 
          FROM game_player AS a 
            JOIN (game AS b, box AS c)
              ON (a.player_id = $you
                AND a.game_id = b.game_id
                AND b.box_id = c.box_id)
          ORDER BY b.bname";
  $result = mysql_query($qry);
  if ($result) {
    echo '<h3>You are currently playing the following games</h3>';
    echo "<table border='1'> <tr>
        <th>Game Name</th> <th>Box Name</th> 
        <th>Version</th> <th>Start Date</th> </tr>";
    while ($row = mysql_fetch_array($result)) {
      echo "<td class='gamename'>
        <a href='board18Map?dogame=$row[0]'>$row[1]</a></td> 
        <td>$row[2]</td> <td>$row[3]</td> <td>$row[4]</td> </tr>";
    }
    echo "</table>";
  } else {
    echo "<h3>You are not currently playing any games</h3>";
  }
}
?>
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>BOARD18 - Remote Play Tool For 18xx Style Games</title>
    <link rel="shortcut icon" href="images/favicon.ico" >
    <link rel="stylesheet" href="style/board18com.css" />
    <link rel="stylesheet" href="style/board18Main.css" />
    <script type="text/javascript" src="scripts/jquery.js">
    </script> 
    <script type="text/javascript" src="scripts/board18com.js">
    </script>
    <script type="text/javascript" src="scripts/board18Main.js">
    </script>
    <script type="text/javascript" >
      $(function() {
        $('#logout').click(function() {
          $.post("php/logout.php", logoutOK);
        }); // end logout
        $('#newgame').click(function() {
          window.location = "board18New.php"
        }); // end newgame
        $('.gamename').mouseover(function() {
          var ttLeft,
          ttTop,
          $this = $(this),
          $tip = $('#gamelink'),
          triggerPos = $this.offset(),
          tipH = $tip.outerHeight();
          ttTop = triggerPos.top - tipH - 10;
          ttLeft = triggerPos.left;
          $tip
          .css({
            left : ttLeft ,
            top : ttTop,
            position: 'absolute'
          })
          .show();
        }); // end mouseover
        $('.gamename').mouseout(function() {
          $('#gamelink').hide();
        }); // end mouseout
      }); // end ready
    </script>
  </head>
  <body>
    <div id="topofpage">
      <div id="logo">
        <img src="images/logo.png" alt="Logo" /> 
      </div>
      <div id="heading">
        <h1>BOARD18 - Remote Play Tool For 18xx Style Games </h1>
        <h3 id="lognote"><?php echo "$welcomename: $headermessage."; ?>
          <span style="font-size: 60%">
            Click <a href="index.html">here</a> 
            if you are not <?php echo "$welcomename"; ?>.
          </span>
        </h3>
      </div>
    </div>
    <div id="leftofpage">
      <p id="logout" class="sidebaritem">Logout</p>
      <p id="newgame" class="sidebaritem">New Game</p>
    </div>
    <div id="rightofpage"> 
      <div id="content">    
        <div id="games">
          <?php showGames(); ?>
        </div>
        <div>
        <p>At this point you can select an existing game to play 
          or you can use the menu to the left to start up a new game,<br>
          perform configuration options or do other administrative stuff. 
        </p>   
        </div>
      </div> 
      <footer>
        This is a nonfunctional mockup.
      </footer>
    </div>  
    <div id="gamelink"><p>Click link to play this game.</p></div>
  </body>
</html>
