/* Function loginOK is the callback function for the ajax
 * Validate User call. 
 */
function loginOK(response) { 
  var resp = jQuery.parseJSON(response);
  if(resp.stat == 'success') {
    $('#login form #password').val("");
    $('#login form').slideUp(300);
    var loginNote ='You are logged in as ';
    loginNote += resp.firstname + ' ';
    loginNote += resp.lastname + ' at ';
    loginNote += resp.level + ' level'
    $('#lognote').text(loginNote)
    $('#logout').show();
  }
  else {
    $("label#signon_error").show();  
    $("input#username").focus(); 
  }  
}

/* 
 * Function login is called by the on-click
 * method of the login submit button. It 
 * does an ajax call to updategame.php. 
 */
function login(dataString) {
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
   
/* 
 * Function doLogout is called by the on-click
 * method of the logout submit button. It 
 * does an ajax call to logout.php. 
 
function doLogout() {
  $.post("php/logout.php", logoutOK);
  return false;
}
*/