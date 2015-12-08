<?php
/*
 * This is a proof of concept and a learning tool for the design
 * of an automated system for loading a game box from a zip file. 
 * 
 * Copyright (c) 2015 Richard E. Price under the The MIT License.
 * A copy of this license can be found in the LICENSE.text file.
 */
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
        $('#buttonz1').click(function() {
          loadBox();
          return false;
        }); // end button1 click
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
        <form name="loadbox" class="boxform" id="zform"
              enctype='multipart/form-data' action="">
          <fieldset>
            <p>
              <label for="zfile">Select ZIP file to upload:</label><br>
              <input type="file" id="zfile" name="zfile"/>
              <label class="error" for="zfile" id="zfile_error">
                This field is required.</label>
            </p>
            <p>
              <input type="button" name="loadbutton" class="zfbutton"  
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
