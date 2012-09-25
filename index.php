<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>BOARD18 - Remote Play Tool For 18xx Style Games</title>
    <link rel="shortcut icon" href="images/favicon.ico" >
    <link rel="stylesheet" href="style/board18com.css" />
    <link rel="stylesheet" href="style/board18Index.css" />
    <script type="text/javascript" src="scripts/jquery.js">
    </script> 
    <script type="text/javascript" src="scripts/board18com.js">
    </script>
    <script type="text/javascript" >
      $(function() {
        $('#open').click(function() {
          $('#login form').slideToggle(300);
        })
        $('.error').hide();  
        $("#pwbutton").click(function() {  
          $('.error').hide();  
          var name = $("input#username").val();  
          if (name == "") {  
            $("label#name_error").show();  
            $("input#username").focus();  
            return false;  
          }  
          var passwd = $("input#password").val();  
          if (passwd == "") {  
            $("label#password_error").show();  
            $("input#password").focus();  
            return false;  
          }  
          var dataString = 'name='+ name + '&password=' + passwd;  
          alert (dataString); return false;  
          $.ajax({  
            type: "POST",  
            url: "bin/logon-exec.php",  
            data: dataString,  
            success: function() {  
              $('#contact_form').html("<div id='message'></div>");  
              $('#message').html("<h2>Contact Form Submitted!</h2>")  
              .append("<p>We will be in touch soon.</p>")  
              .hide()  
              .fadeIn(1500, function() {  
                $('#message').append("<img id='checkmark' src='images/check.png' />");  
              });  
            }  
          });  
          return false;
        }); 
      }); // end ready
    </script>
  </head>
  <body>
    <div id="topofpage">
      <div id="logo">
        <img src="images/logo.png" alt="Logo" /> 
      </div>

      <div id="heading">
        <h1>BOARD18 - Remote Play Tool For 18xx Style Games</h1>
      </div>
    </div>
    <div id="leftofpage">
      <p id="open">Login</p>
    </div>
    <div id="rightofpage"> 
      <div id="login">
        <form name="login" action="">
          <p>
            <label for="username">Username:</label>
            <input type="text" name="username" id="username">
            <label class="error" for="username" id="name_error">
              This field is required.</label>
          </p>
          <p>
            <label for="password">Password: </label>
            <input type="text" name="password" id="password">
            <label class="error" for="password" id="password_error">
              This field is required.</label>
          </p>
          <p>
            <input type="submit" name="button" id="pwbutton" value="Submit" >
          </p>
        </form>
      </div>
      <div id="content">    
        <p><b>This is the main page of the Board18 application.</b></p>
        <p>It will eventually contain options to start up new games and to 
          join existing games. <br/>
          It will probably contain other configuration options and 
          administrative stuff. <br/>
          It will also present security features such as session sign in, 
          password recovery and user ID setup.</p>
        <p>But for now it only contains the following button.</p>
        <div style="position:relative; left:40px;"> 
          <a href="board18Map.php"><img src="images/start.png" 
                                        alt="Start BOARD18" /></a>     
        </div>
        <footer>
          This is a nonfunctional mockup.
        </footer>
      </div> 
    </div>  

  </body>
</html>
