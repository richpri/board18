/* 
 * Function loginOK is the callback function for the ajax
 * Validate User call. 
 */
function loginOK(response) {
  if (response.indexOf("<!doctype html>") !== -1) { // User has timed out.
    window.location = "access-denied.html";
  } 
  var resp = jQuery.parseJSON(response);
  if(resp.stat === 'success') {
    $('#login #password').val('');
    $('#login :text').val('');
    var loginNote ='You are logged in as ';
    loginNote += resp.firstname + ' ';
    loginNote += resp.lastname + ' at ';
    loginNote += resp.level + ' level';
    $('#lognote').text(loginNote);
    $('#login form').slideUp(300);
    window.location = "board18Main.php";
  } else if(resp.stat === 'fail') {
    $("#signon_error").show();  
    $("#username").focus(); 
   } else {
    var nerrmsg ='Invalid return code from createGame.php.\n';
    nerrmsg += response + '\nThis should not happen.';
    alert(nerrmsg);
  }
}

/* 
 * Function login is called by the on-click
 * method of the login submit button. It 
 * checks the input for missing fields and
 * does an ajax call to validateUser.php. 
 */
function login() {
  $('.error').hide();  
  var name = $("input#username").val();  
  if (name === "") {  
    $("#name_error").show();  
    $("#username").focus();  
    return false;  
  }  
  var passwd = $("input#password").val();  
  if (passwd === "") {  
    $("#password_error").show();  
    $("#password").focus();  
    return false;  
  }  
  var hash = hex_sha256(passwd);
  var dataString = 'login='+ name + '&password=' + hash;  
  $.post("php/validateUser.php", dataString, loginOK);
  return false;
}

/* 
 * Function regResult is the callback function 
 * for the ajax newUser call. 
 */
function regResult(response) { 
  if (response.indexOf("<!doctype html>") !== -1) { // User has timed out.
    window.location = "access-denied.html";
  } 
  if(response === 'duplicate') {
    $("#newuser_error").text('Username is already in use.').show();  
    $("#newuser").focus();
  }
  else if(response === 'bademail') {
    $("#email_error").text('Invalid email format, please correct.').show();  
    $("#email").focus();
  }
  else if(response.substring(0,5) === 'email') {
    var logmessage = 'User ' + response.substring(5);
    logmessage += ' is already using this email.';
    $("#email_error").text(logmessage).show();  
    $("#email").focus();
  }
  else if(response === 'success') {
    $('#login #password').val('');
    $('#login :text').val('');
    $('#register form').slideUp(300);
    $('#login form').slideDown(300);
    var loginNote ='You have successfully registered. ';
    $('#lognote').text(loginNote);
  }
  else {
    var errmsg ='Invalid return code from newUser.php.\n';
    errmsg += response + '\nThis should not happen.';
    alert(errmsg);
  }  
}
   
/* 
 * Function register is called by the on-click
 * method of the register submit button. It 
 * checks the input for missing fields and
 * does an ajax call to newuser.php. 
 */
function register() {
  $('.error').hide();  
  var name = $("input#newuser").val();  
  if (name === "") {  
    $("#newuser_error").show();  
    $("#newuser").focus();  
    return false;  
  }  
  var passwrd1 = $("input#passwrd1").val();  
  if (passwrd1 === "") {  
    $("#passwrd1_error").show();  
    $("#passwrd1").focus();  
    return false;  
  }  
  var passwrd2 = $("input#passwrd2").val();  
  if (passwrd2 !== passwrd1) {  
    $("#passwrd2_error").show();  
    $("#passwrd2").focus();  
    return false;  
  } 
  var email = $("input#email").val();  
  if (email === "") {  
    $("#email_error").show();  
    $("#email").focus();  
    return false;  
  }
  var regString = $('.reg').serialize();
  var hash = hex_sha256(passwrd1);
  regString += '&passwrd=' + hash;
  $.post("php/newUser.php", regString, regResult);
  return false;
}

/* 
 * Function emailPlayerResult is the callback function 
 * for the ajax emailPlayerID call. 
 */
function emailPlayerResult(response) {
  if(response === 'sentemail') {
    $("#email1_error").text('Email has been sent.').show();  
    $("#email1").focus();
  }
  else if(response === 'bademail') {
    $("#email1_error").text('Format of email address is invalid.')
                      .show();  
    $("#email1").focus();
  }
  else if(response === 'noemail') {
    $("#email1_error").text('Entered email address is not on file.')
                      .show();  
    $("#email1").focus();
  }
  else if(response === 'cantsend') {
    $("#email1_error").text('SMTP server could not send this email.')
                      .show();  
    $("#email1").focus();
  }
  else if(response === 'error') {  
    $("#email1_error").text('An error ocured while sending this email.')
                      .show();  
    $("#email1").focus();
  }
  else {   
    $("#email1_error").text('Invalid return code. This should never happen.')
                      .show();  
    $("#email1").focus(); 
  } 
} 

/* 
 * Function lostid is called by the on-click
 * method of the lostid submit button. It 
 * checks the input for missing fields and
 * does an ajax call to emailPlayerID.php. 
 */
function lostid() {
  $('.error').hide();  
  var email = $("input#email1").val();  
  if (email === "") {  
    $("#email1_error").show();  
    $("#email1").focus();  
    return false;  
  }  
  var dataString = 'email=' + email;  
  $.post("php/emailPlayerID.php", dataString, emailPlayerResult);
  return false;
}

/* 
 * The registerMainMenu function creates the 
 * main menu on the board18 index page. It uses
 * the jquery context menu plugin.
 */
function registerMainMenu() {
  $.contextMenu({
    selector: "#newmainmenu", 
    trigger: "left",
    className: "bigMenu",
    items: {
      login: {
        name: "Log In",
        callback: function(){
          $('#login .error').hide();
          $('#login #password').val('');
          $('#login :text').val('');
          $('#register form').hide();
          $('#login form').slideToggle(300);
          $("#username").focus();
        }
      },
      register: {
        name: "Register",
        callback: function(){
          $('#register .error').hide();
          $('#register :password').val('');
          $('#register :text').val('');
          $('#register form').slideToggle(300);
          $("#newuser").focus();
        }
      },
      help: {
        name: "Help",
        callback: function(){
          window.open("http://wiki.board18.org/w/User%27s_Guide", "UserGuide");
        }
      },
      close: {
        name: "Close Menu",
        callback: function(){}
      }
    },
    zIndex: 10,
    position: function(opt, x, y) {
      opt.$menu.position({
        my: 'left top',
        at: 'left bottom',
        of: opt.$trigger
      });
    },
    callback: function(key, options) {
      var m = "clicked on " + key + " on element ";
      m =  m + options.$trigger.attr("id");
      alert(m); 
    }
  });
}
