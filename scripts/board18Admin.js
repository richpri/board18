/* 
 * Function forceResult is the callback function 
 * for the ajax forcePasswd call. 
 */
function forceResult(response) {
  if (response.indexOf("<!doctype html>") !== -1) { // User has timed out.
    window.location = "access-denied.html";
  }
  if (response === 'nouser') {
    var errmsg = 'Invalid player ID.\n';
    errmsg += response + '\nThis should not happen.';
    alert(errmsg);
  }
  else if (response === 'failed') {
    var errmsg = 'Data Base update failed.\n';
    errmsg += response + '\nThis should not happen.';
    alert(errmsg);
  }
  else if (response === 'success') {
    var loginNote = 'Password successfully changed. ';
    $('#lognote').text(loginNote);
  }
  else {
    var errmsg = 'Invalid return code from forcePasswd.php.\n';
    errmsg += response + '\nThis should not happen.';
    alert(errmsg);
  }
}

/* 
 * Function forceChange is called by the on-click
 * method of the passwd submit button. It checks
 * the input for missing or invalid fields and
 * does an ajax call to updateUser.php. 
 */
function forceChange(currpw) {
  $('.error').hide();  
  var oldpw2 = $("input#oldpw2").val();
  if (oldpw2 === "") {
    $("#oldpw2_error").show();
    $("#oldpw2").focus();
    return false;
  }
  if (oldpw2 === currpw) {
    var pwmessage = "Invalid Current Password.";
    $("#oldpw2_error").text(pwmessage).show();
    $("#oldpw2").focus();
    return false;
  }

  var passwrd3 = $("input#passwrd3").val();
  if (passwrd3 === "") {
    $("#passwrd3_error").show();
    $("#passwrd3").focus();
    return false;
  }

  var passwrd4 = $("input#passwrd4").val();
  if (passwrd4 !== passwrd3) {
    $("#passwrd4_error").show();
    $("#passwrd4").focus();
    return false;
  }

  var hash = hex_sha256(passwrd3);
  var regString = '&passwd=' + hash;
  $.post("php/forcePasswd.php", regString, forceResult);
  return false;
}

/* 
 * Function adminResult is the callback function 
 * for the ajax newUser call. 
 */
function adminResult(response) {
  if (response.indexOf("<!doctype html>") !== -1) { // User has timed out.
    window.location = "access-denied.html";
  }
  if (response === 'nouser') {
    var errmsg = 'Invalid player ID.\n';
    errmsg += '\nThis should not happen.';
    alert(errmsg);
  }
  else if (response === 'bademail') {
    $("#email_error").text('Invalid email format, please correct.').show();
    $("#email").focus();
  }
  else if (response.substring(0, 5) === 'email') {
    var logmessage = 'User ' + response.substring(5);
    logmessage += ' is already using this email.';
    $("#email_error").text(logmessage).show();
    $("#email").focus();
  }
  else if (response === 'success') {
    $('#login #password').val('');
    $('#login :text').val('');
    $('#register form').slideUp(300);
    $('#login form').slideDown(300);
    var loginNote = 'Your registration has been successfully updated. ';
    $('#lognote').text(loginNote);
  }
  else {
    var errmsg = 'Invalid return code from updateUser.php.\n';
    errmsg += response + '\nThis should not happen.';
    alert(errmsg);
  }
}

/* 
 * Function administrate is called by the on-click
 * method of the administrate submit button. 
 * It checks the input for missing fields and
 * does an ajax call to updateuser.php. 
 */
function administrate(currpw) {
  $('.error').hide();
  var oldpw1 = $("input#oldpw1").val();
  if (oldpw1 === "") {
    $("#oldpw1_error").show();
    $("#oldpw1").focus();
    return false;
  }
  if (oldpw1 === currpw) {
    var pwmessage = "Invalid Current Password.";
    $("#oldpw1_error").text(pwmessage).show();
    $("#oldpw1").focus();
    return false;
  }
  var name = $("input#pname").val();
  if (name === "") {
    $("#pname_error").show();
    $("#pname").focus();
    return false;
  }
  var passwrd1 = $("input#passwrd1").val();
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
  var aString = $('.reg').serialize();
  if (passwrd1 !== "") {
    var hash = hex_sha256(passwrd1);
    aString += '&passwd=' + hash;
  }
  $.post("php/updateUser.php", aString, adminResult);
  return false;
}