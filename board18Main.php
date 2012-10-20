<?php
$welcome = '';
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

function showBoxes() {
  prepareDatabase();
  $qry = "SELECT box_id, name, version, author, create_date FROM box";
  $result = mysql_query($qry);
  if ($result) {
    echo "<table border='1'> <tr>
        <th>ID</th> <th>Box Name</th> <th>Version</th>
        <th>Author</th> <th>Date</th> </tr>";
    while ($row = mysql_fetch_array($result)) {
      echo "<tr> <td>$row[0]</td> <td>$row[1]</td> <td>$row[2]</td>
        <td>$row[3]</td> <td>$row[4]</td> </tr>";
    }
    echo "</table>";
  } else {
    echo "<p class=error>There are no game boxes in the database</p>";
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
        $('.error').hide(); 
        $('#logout').click(function() {
          $.post("php/logout.php", logoutOK);
        }); // end logout
        $('#openng').click(function() {
          $('#newgame .error').hide();
          $('#newgame :text').val('');
          $('#newgame form').slideToggle(300);
          $("#sessionname").focus(); 
        }); // end openng
        $("#newgame").submit(function() {  
          newgame();
          return false;
        }); // end newgame
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
        <h3 id="lognote"><?php echo "Welcome $welcome"; ?>. 
          <span style="font-size: 60%">
            Click <a href="index.html">here</a> 
            if you are not <?php echo $welcome; ?>.
          </span>
        </h3>
      </div>
    </div>
    <div id="leftofpage">
      <p id="logout" class="sidebaritem">Logout</p>
      <p id="openng" class="sidebaritem">New Game</p>
    </div>
    <div id="rightofpage"> 
      <div id="content">    
        <div id="boxes">
          <h3>Available Game Boxes</h3>
              <?php showBoxes(); ?>
        </div>
        <div id="newgame">
          <form name="newgame" class="hideform" action="">
            <fieldset>
              <p style="font-size: 130%">Create new game session here.</p>
              <p>
                <label for="sessionname">Game Name:</label>
                <input type="text" name="sessionname" id="sessionname">
                <label class="error" for="sessionname" id="sn_error">
                  This field is required.</label>
              </p>
              <p>
                <label for="playercount"># of Players:</label>
                <input type="text" name="playercount" id="playercount">
                <label class="error" for="playercount" id="pc_error">
                  This field is required.</label>
              </p>
              <p>
                <label for="boxidnumb">Game Box ID:</label>
                <input type="text" name="boxidnumb" id="boxidnumb">
                <label class="error" for="boxidnumb" id="bi_error">
                  This field is required.</label>
              </p>
              <p>
                <input type="submit" name="pwbutton" class="pwbutton" 
                       id="button1" value="Submit" >
                <label class="error" for="button1" id="signon_error">
                  Duplicate Game Name.</label>
              </p>
            </fieldset>
          </form>
        </div>
        <p><b>This is the main page of the Board18 application.</b></p>
        <p>It will eventually contain options to start up new games and
          to join existing games. <br/>
          It will probably contain other configuration options and 
          administrative stuff. 
        </p>
        <p>But for now it only contains the following button.</p>
        <div style="position:relative; left:40px;"> 
          <a href="board18Map.php"><img src="images/start.png" 
                                        alt="Start BOARD18" /></a>     
        </div>
      </div> 
      <footer>
        This is a nonfunctional mockup.
      </footer>
    </div>  

  </body>
</html>
