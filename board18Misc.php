<?php
/*
 * The board18Misc.php page can be used to perform miscellaneous 
 * service actions on an in progress game session. 
 * 
 * Copyright (c) 2013 Richard E. Price under the The MIT License.
 * A copy of this license can be found in the LICENSE.text file.
 */

require_once('php/auth.php');
require_once('php/makeTables.php');

//Function to sanitize values received from POST. 
//Prevents SQL injection
function clean($conn, $str) {
  $str = @trim($str);
  return mysqli_real_escape_string($conn, $str);
}

//Sanitize the dogame value
$dogame = clean($theLink, $_REQUEST['dogame']);

// Find login ID of current player.
$qry1 = "SELECT * FROM players WHERE player_id='$loggedinplayer'";
$result1 = mysqli_query($theLink, $qry1);
// Check whether the query was successful or not
if ($result1) {
  if (mysqli_num_rows($result1) == 1) {
    // Query Successful
    $playerrow = mysqli_fetch_assoc($result1);
    $login = $playerrow['login'];
  } else {
    //Player not found
    header("location: access-denied.html");
  }
} else {
  error_log("player_id query failed");
  $open = 'fail';
}

// Find name of current game.
$qry2 = "SELECT * FROM game WHERE game_id='$dogame'";
$result2 = mysqli_query($theLink, $qry2);
// Check whether the query was successful or not
if ($result2 && mysqli_num_rows($result2) == 1) {
  // Query Successful
  $gamerow = mysqli_fetch_assoc($result2);
  $gname = $gamerow['gname'];
} else {
  error_log("game name query failed");
  $open = 'fail';
}
?>

<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>BOARD18 - Remote Play Tool For 18xx Style Games</title>
    <link rel="shortcut icon" href="images/favicon.ico" >
    <link rel="stylesheet" href="style/board18com.css" />
    <link rel="stylesheet" href="style/board18Misc.css" />
    <script type="text/javascript" src="scripts/jquery.js">
    </script> 
    <script type="text/javascript" src="scripts/jqueryMigrate.js">
    </script> 
    <script type="text/javascript" src="scripts/board18com.js">
    </script>
    <script type="text/javascript" src="scripts/board18Misc.js">
    </script>
    <script type="text/javascript" >
      $(function() {
        $('.error').hide();
        if ('<?php echo "$open"; ?>' === 'fail') {
          var errmsg = 'Data Base access failed.\n';
          errmsg += 'Please contact the BOARD18 webmaster.';
          alert(errmsg);
        }
        BD18.login = '<?php echo $login; ?>';
        BD18.gname = '<?php echo $gname; ?>'; 
        $('.plnm').hide();
        $('.plall').mouseover(function() {
          $(this).children('.plnm').show();
        });
        $('.plall').mouseout(function() {
          $(this).children('.plnm').hide();
        });
        $('.plall').mousedown(function() {
          $('#pname4').val($(this).children('.plid').text());
        });
        $('.playerrow').mousedown(function() {
          $('#pname3').val($(this).children('.login').text());
        });
        $('#playerform').submit(function(event) {
          changePlayer(BD18.login, '<?php echo "$dogame"; ?>');  
          event.preventDefault();
        }); // end playerform
        $('#button6').click(function() {
          window.location = "board18Main.php";
          return false;
        }); // end button6 click
        var space;
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
        <p id="lognote"><?php echo "$welcomename: $headermessage"; ?>
          <span style="font-size: 70%">
            Click <a href="index.html">here</a> 
            if you are not <?php echo "$welcomename"; ?>.
          </span>
        </p>
      </div>
    </div>

    <div id="leftofpage">
      <div id='sidebar'>
        <?php showPlayers($theLink);?>
      </div>;
    </div>

    <div id="rightofpage"> 
      <div id="content">    
        <div id="players">
          <table id='playerlist'>
            <?php gamePlayers($dogame, $theLink);?> 
          </table>
          <form name="player" id="playerform" action="">
            <fieldset>
              <p>
                <label for="pname3">
                  Enter login of player to remove from game.
                </label>
                <input type="text" name="pname3" id="pname3">
                <label class="error" for="pname3" id="pname3_error">
                  Press submit again to remove yourself.</label>
              </p>
              <p>
                <label for="pname4">
                  Enter login of player to add to game.
                </label>
                <input type="text" name="pname4" id="pname4">
                <label class="error" for="pname4" id="pname4_error">
                  No player action selected.</label>
              </p>
              <p>
                <input type="submit" name="playerbutton" class="pwbutton"  
                       id="button5" value="Submit" >
                <input type="button" name="canbutton" class="pwbutton"  
                       id="button6" value="Exit" >
              </p>
            </fieldset>
          </form>
        </div>        
      </div> 
    </div>  
  </body>
</html>