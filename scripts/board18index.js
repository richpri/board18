/* Function loginOK is the callback function for the ajax
 * Validate User call. 
 */
function loginOK(response) { 
  var resp = jQuery.parseJSON(response);
  alert (response + " - " + resp.stat);
  if(resp.stat == 'success') {
    $('#login form').slideUp(300);
    var loginNote ='<h3> You are logged in as '
    loginNote += resp.firstname + ' '
    loginNote += resp.lastname + ' </h3>'
    $('#heading').append(loginNote)
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

