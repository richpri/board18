/* Function loginOK is the callback function for the ajax
 * Validate User call. 
 */
function loginOK(response) { 
  var resp = jQuery.parseJSON(response);
  if(resp.stat == 'success') {
    $('#login #password').val('');
    $('#login :text').val('');
    $('#login form').slideUp(300);
    var loginNote ='You are logged in as ';
    loginNote += resp.firstname + ' ';
    loginNote += resp.lastname + ' at ';
    loginNote += resp.level + ' level'
    $('#lognote').text(loginNote)
    $('#logout').show();
  }
  else {
    $("#signon_error").show();  
    $("#username").focus(); 
  }  
}

/* 
 * Function login is called by the on-click
 * method of the login submit button. It 
 * does an ajax call to updategame.php. 
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

/* Function logoutOK is the callback function for the ajax
 * lgout call. 
 */
function logoutOK(resp) {
  if(resp == 'success') {
    $('#logout').hide();
    var logoutNote ='Logout successful';
    $('#lognote').text(logoutNote);
  }
  else {
    alert("Logout failed! This should never happen.") 
  }  
}
   
