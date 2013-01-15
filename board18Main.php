<?php
require_once('php/auth.php');
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
    <script type="text/javascript" src="scripts/nav1.1.min.js">
    </script>
    <script type="text/javascript" src="scripts/board18com.js">
    </script>
    <script type="text/javascript" src="scripts/board18Main.js">
    </script>
    <script type="text/javascript" >
      $(function() {
        $.ajax({
          type: 'GET',
          url: 'php/myGameList.php',
          processData: true,
          data: {},
          dataType: 'json',
          success: listReturn,
          error: listError
        }); // end of ajax
        $('#logout').click(function() {
          $.post("php/logout.php", logoutOK);
        }); // end logout
        $('#newgame').click(function() {
          window.location = "board18New.php"
        }); // end newgame
        $("#mainmenu").navPlugin({
          'itemWidth': 120,
          'itemHeight': 40,
          'navEffect': "slide",
          'speed': 250
        }); // end navPlugin
        $('.gamename').mouseover(function() {
          var ttLeft,
          ttTop,
          $this = $(this),
          $tip = $('#gamelink'),
          triggerPos = $this.offset(),
          tipH = $tip.outerHeight();
          ttTop = triggerPos.top - tipH;
          ttLeft = triggerPos.left + 100;
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
      </div>
      <div>
        <ul id="mainmenu">
          <li><span>Menu</span>
            <ul>
              <li><span id="newgame">New Game</span></li>
              <li><span id="logout">Logout</span></li>
            </ul>
          </li>
        </ul>
        <p id="lognote"><?php echo "$welcomename: $headermessage"; ?>
          <span style="font-size: 70%">
            Click <a href="index.html">here</a> 
            if you are not <?php echo "$welcomename"; ?>.
          </span>
        </p>
      </div>


    </div>
    <div id="leftofpage">
      
    </div>
    <div id="rightofpage"> 
      <div id="content">    
        <div id="games">
          <table id='gamelist'> 
            <tr>
              <th>Game Name</th> <th>Box Name</th> 
              <th>Version</th> <th>Start Date</th> 
            </tr>
          </table>
        </div>
        <div>
        <p>At this point you can select an existing game to play 
          <br>or you can use the menu to start up a new game,<br>
          perform configuration options or do other stuff. 
        </p>   
        </div>
      </div> 
    </div>  
    <div id="gamelink"><p>Click link to play this game.</p></div>
  </body>
</html>
