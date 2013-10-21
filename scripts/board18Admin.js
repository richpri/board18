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