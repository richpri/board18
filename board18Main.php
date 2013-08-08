<?php
require_once('php/auth.php');
?>
<!doctype html>
<!--
Copyright (c) 2013 Richard E. Price under the The MIT License.
A copy of this license can be found in the LICENSE.text file.
-->
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>BOARD18 - Remote Play Tool For 18xx Style Games</title>
    <link rel="shortcut icon" href="images/favicon.ico" >
    <link rel="stylesheet" href="style/jquery.contextMenu.css" />
    <link rel="stylesheet" href="style/board18com.css" />
    <link rel="stylesheet" href="style/board18Main.css" />
    <script type="text/javascript" src="scripts/jquery.js">
    </script> 
    <script type="text/javascript" src="scripts/jquery.ui.position.js">
    </script>
    <script type="text/javascript" src="scripts/jquery.contextMenu.js">
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
        registerMainMenu();
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
        <img src="images/logo.png" alt="Logo"/> 
      </div>
      <div id="heading">
        <h1>BOARD18 - Remote Play Tool For 18xx Style Games</h1>
      </div>
      <div>
        <span id="newmainmenu"> MENU </span>
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
