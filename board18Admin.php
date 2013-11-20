<?php
/*
 * Copyright (c) 2013 Richard E. Price under the The MIT License.
 * A copy of this license can be found in the LICENSE.text file.
 */

require_once('php/auth.php');
require_once('php/makeTables.php');

//Function to sanitize values received from POST. 
//Prevents SQL injection
function clean( $conn, $str ) {
  $str = @trim($str);
  return mysqli_real_escape_string( $conn, $str );
}

//Sanitize the dogame value
$dogame = 'no';
if (isset($_REQUEST['dogame'])) {
    $dogame = clean( $theLink, $_REQUEST['dogame']);
}

//Create query
$qry = "SELECT * FROM players WHERE player_id='$loggedinplayer'";

$result = mysqli_query($theLink, $qry);
//Check whether the query was successful or not
if ($result) {
  if (mysqli_num_rows($result) == 1) {
    //Query Successful
    $playerrow = mysqli_fetch_assoc($result);
    $firstname = $playerrow['firstname'];
    $lastname = $playerrow['lastname'];
    $email = $playerrow['email'];
    $login = $playerrow['login'];
    $passwd = $playerrow['passwd'];
    $changeit = $playerrow['changeit'];
  } else {
    //Player not found
    header("location: access-denied.html");
  }
} else {
  error_log("player_id query failed");
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
    <link rel="stylesheet" href="style/board18Admin.css" />
    <script type="text/javascript" src="scripts/jquery.js">
    </script> 
    <script type="text/javascript" src="scripts/sha256-min.js">
    </script>
    <script type="text/javascript" src="scripts/board18com.js">
    </script>
    <script type="text/javascript" src="scripts/board18Admin.js">
    </script>
    <script type="text/javascript" >
      $(function() {
        $('.error').hide();
        if ('<?php echo "$open"; ?>' === 'fail') {
          var errmsg = 'Data Base access failed.\n';
          errmsg += 'Please contact the BOARD18 webmaster.';
          alert(errmsg);
        }
        if (<?php echo "$changeit"; ?> === 1) {
          $('#passwd form').show();
        } else {
          if ('<?php echo "$dogame"; ?>' !== 'no')  {
            $('#players form').show();
            $('#players table').show();
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
            var curgame = <?php echo "$dogame"; ?>;
            var gameString = 'gameID=' + curgame;
            $.post("php/gamePlayers.php", gameString, gamePlayersResult);
          } else {
            $('#admin form').show();
          }
        } // end changeit
        $("#passwd").submit(function() {
          forceChange('<?php echo $passwd; ?>');
          return false;
        }); // end passwd
        $("#admin").submit(function() {
          administrate('<?php echo $passwd; ?>');
          return false;
        }); // end admin
        $("#button2").click(function() {
          $('.error').hide();
          $('#admin form #pname').val('<?php echo $login; ?>');
          $('#admin form #email').val('<?php echo $email; ?>');
          $('#admin form #fname').val('<?php echo $firstname; ?>');
          $('#admin form #lname').val('<?php echo $lastname; ?>');
          $('#admin form #oldpw1').val('');
          $('#admin form #passwrd1').val('');
          $('#admin form #passwrd2').val('');
          return false;
        }); // end button2 click
        $("#button4").click(function() {
          window.location = "board18Main.php";
          return false;
        }); // end button4 click
        $("#button6").click(function() {
          window.location = "board18Main.php";
          return false;
        }); // end button6 click
       
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
<?php
  if ($dogame != 'no') {
    echo "<div id='sidebar'>";
    showPlayers($theLink);
    echo "</div>";
  }
?>
    </div>

    <div id="rightofpage"> 
      <div id="content">    
        <div id="admin">
          <form name="admin" class="hideform" action="">
            <fieldset>
              <p>
                <label for="pname">Player ID:</label>
                <input type="text" name="pname" id="pname" class="reg"
                       value="<?php echo $login; ?>">
                <label class="error" for="pname" id="pname_error">
                  This field is required.</label>
              </p>
              <p>
                <label for="oldpw1">Enter Current Password:</label>
                <input type="password" name="oldpw1" id="oldpw1" 
                       value="" autocomplete="off">
                <label class="error" for="oldpw1" id="oldpw1_error">
                  This field is required.</label><br>
                The current Password is required to change any field.
              </p>
              <p>
                <label for="passwrd1">Enter New Password: </label>
                <input type="password" name="passwrd1" id="passwrd1">
                <label class="error" for="passwrd1" id="passwrd1_error">
                  This field is required.</label>
              </p>
              <p>
                <label for="passwrd2">Reenter New Password: </label>
                <input type="password" name="passwrd2" id="passwrd2">
                <label class="error" for="passwrd2" id="passwrd2_error">
                  Password field mismatch.</label> <br>
                The <span style="font-weight:bold">same</span> 
                new Password must be entered both times.
              </p>
              <p>
                <label for="email">Change Email Address: </label>
                <input type="text" name="email" id="email" class="reg"
                       value="<?php echo $email; ?>">
                <label class="error" for="email" id="email_error">
                  This field is required.</label>
              </p>

              <p>
                <label for="fname">Change First Name: </label>
                <input type="text" name="fname" id="fname" class="reg"
                       value="<?php echo $firstname; ?>">
              </p>
              <p>
                <label for="lname">Change Last Name: </label>
                <input type="text" name="lname" id="lname" class="reg"
                       value="<?php echo $lastname; ?>">
              </p>
              <p>
                <input type="submit" name="adminbutton" class="pwbutton"  
                       id="button1" value="Submit" >
                <input type="button" name="canbutton" class="pwbutton"  
                       id="button2" value="Reset Form" >
                <input type="button" name="canbutton" class="pwbutton"  
                       id="button4" value="Exit" >
              </p>
            </fieldset>
          </form>
        </div>

        <div id="passwd">
          <form name="passwd" class="hideform" action="">
            <fieldset>
              <p style="font-size: 110%">
                Please change your temporary password before proceeding.
              </p>
              <p>
                <label for="pname2">Enter Player ID:</label>
                <input type="text" name="pname2" id="pname2">
                <label class="error" for="pname2" id="pname2_error">
                  This field is required.</label>
              </p>
              <p>
                <label for="passwrd3">Enter Password: </label>
                <input type="password" name="passwrd3" id="passwrd3">
                <label class="error" for="passwrd3" id="passwrd3_error">
                  This field is required.</label>
              </p>
              <p>
                <label for="passwrd4">Reenter Password: </label>
                <input type="password" name="passwrd4" id="passwrd4">
                <label class="error" for="passwrd4" id="passwrd4_error">
                  Password field mismatch.</label>
              </p>
              <p>
                <input type="submit" name="changeitbutton" class="pwbutton"  
                       id="button3" value="Submit" >
              </p>
            </fieldset>
          </form>
        </div>
        
        <div id="players">
          <table id='playerlist'> 
            <caption>Players in game:<br></caption>
            <tr>
              <th>Login</th><th>First Name</th><th>Last Name</th>
            </tr>
          </table>
          <form name="player" class="hideform" id="playerform" action="">
            <fieldset>
              <p style="font-size: 110%">
                Enter login of player to remove from game.
              </p>
              <p>
                <label for="pname3">Enter Player login:</label>
                <input type="text" name="pname3" id="pname3">
                <label class="error" for="pname3" id="pname3_error">
                  This field is required.</label>
              </p>
              <p style="font-size: 110%">
                Enter login of player to add to game.
              </p>
              <p>
                <label for="pname4">Enter Player login:</label>
                <input type="text" name="pname4" id="pname4">
                <label class="error" for="pname4" id="pname4_error">
                  This field is required.</label>
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