<?php
/*
 * This is a proof of concept and a learning tool for the design
 * of an automated system for loading a game box from a zip file. 
 * 
 * Copyright (c) 2015 Richard E. Price under the The MIT License.
 * A copy of this license can be found in the LICENSE.text file.
 */
/*
require_once('auth.php');
if ($playerlevel != 'admin' && $playerlevel != 'author') {
  error_log("gameGet: Not an admin or author level player");
  echo $errResp;
  exit;
}
 */
require_once('php/rm_r.php');
require_once('php/loadGameBox.php');
if(isset($_POST['submit'])) { // If reload via zform submit.
  $reportout = loadBox($_FILES);
}

?>
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>BOARD18 - Remote Play Tool For 18xx Style Games</title>
    <link rel="shortcut icon" href="images/favicon.ico" >
    <link rel="stylesheet" href="style/board18com.css" />
    <link rel="stylesheet" href="style/board18Boxes.css" />
    <script type="text/javascript" src="scripts/jquery.js">
    </script> 
    <script type="text/javascript" src="scripts/jquery.ui.position.js">
    </script>
    <script type="text/javascript" src="scripts/jquery.contextMenu.js">
    </script>
    <script type="text/javascript" src="scripts/board18com.js">
    </script>
    <script type="text/javascript" src="scripts/board18Boxes.js">
    </script>
    <script type="text/javascript" >
      $(function() {
        if (!window.File) { // Check for File API support.
           // The File API is not supported.
           alert('The file upload API is not supported on this browser.');
        }
        $('#content .error').hide();
        $('#zfile').val('');
        <?php
        if (isset($_POST['submit'])) { // If reload via zform submit.
          echo "zipBoxOk($reportout);";
        }
        ?>
        $('#buttonz2').click(function() {
          $('#content .error').hide();
          $('#zfile').val('');
          return false;
        }); // end button2 click
        $('#buttonz3').click(function() {
          // nothing for now.
          return false;
        }); // end button3 click
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
    </div>
    <div id="leftofpage">
    </div>
    <div id="rightofpage"> 
      <div id="content">
        <form action="board18Boxes2.php" method="post"
              name="loadbox" class="boxform" id="zform" 
              enctype="multipart/form-data">
          <fieldset>
            <p>
              <label for="zfile">Select ZIP file to upload:</label><br>
              <input type="file" id="zfile" name="zfile" required/>
              <label class="error" for="zfile" id="zfile_error"></label>
            </p>
            <p>
              <input type="submit" name="submit" class="zfbutton"  
                     id="buttonz1" value="Load Gamebox" >
              <input type="button" name="resbutton" class="zfbutton"  
                     id="buttonz2" value="Reset Form">
              <input type="button" name="canbutton" class="zfbutton"  
                     id="buttonz3" value="Exit"><br>
            </p>
          </fieldset>
        </form>
      </div>
    </div>  
  </body>
</html>