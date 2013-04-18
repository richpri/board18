/* Function loginOK is the callback function for the ajax
 * Validate User call. 
 */
function loginOK(response) { 
  var resp = jQuery.parseJSON(response);
  if(resp.stat == 'success') {
    $('#login #password').val('');
    $('#login :text').val('');
    var loginNote ='You are logged in as ';
    loginNote += resp.firstname + ' ';
    loginNote += resp.lastname + ' at ';
    loginNote += resp.level + ' level';
    $('#lognote').text(loginNote);
    $('#login form').slideUp(300);
    window.location = "board18Main.php";
  } else if(resp.stat == 'fail') {
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
  if (name == "") {  
    $("#name_error").show();  
    $("#username").focus();  
    return false;  
  }  
  var passwd = $("input#password").val();  
  if (passwd == "") {  
    $("#password_error").show();  
    $("#password").focus();  
    return false;  
  }  
  var hash = hex_sha256(passwd);
  var dataString = 'login='+ name + '&password=' + hash;  
  $.post("php/validateUser.php", dataString, loginOK);
  return false;
}

/* Function regResult is the callback function 
 * for the ajax newUser call. 
 */
function regResult(response) { 
  if(response == 'duplicate') {
    $("#newuser_error").text('Username is already in use.').show();  
    $("#newuser").focus();
  }
  else if(response == 'success') {
    $('#login #password').val('');
    $('#login :text').val('');
    $('#register form').slideUp(300);
    $('#login form').slideDown(300);
    var loginNote ='You have successfully registered. ';
    $('#lognote').text(loginNote);
  }
  else {
    var errmsg ='Invalid return code from newUser.php.\n'
    errmsg += response + '\nThis should not happen.'
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
  if (name == "") {  
    $("#newuser_error").show();  
    $("#newuser").focus();  
    return false;  
  }  
  var passwrd1 = $("input#passwrd1").val();  
  if (passwrd1 == "") {  
    $("#passwrd1_error").show();  
    $("#passwrd1").focus();  
    return false;  
  }  
  var passwrd2 = $("input#passwrd2").val();  
  if (passwrd2 != passwrd1) {  
    $("#passwrd2_error").show();  
    $("#passwrd2").focus();  
    return false;  
  } 
  var regString = $('.reg').serialize();
  var hash = hex_sha256(passwrd1);
  regString += '&passwrd=' + hash;
  $.post("php/newUser.php", regString, regResult);
  return false;
}