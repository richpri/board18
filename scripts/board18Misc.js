/*
 * Copyright (c) 2013 Richard E. Price under the The MIT License.
 * A copy of this license can be found in the LICENSE.text file.
 */

/* 
 * All BD18 global variables are contained in one
 * 'master variable' called BD18.  This isolates 
 * them from global variables in other packages. 
 */
BD18.self = 0;

/* 
 * Function emailPlayerResult is the call back function for the
 * ajax calls to emailPlayerAdd.php and emailPlayerRem.php. 
 * 
 * Output from either program is an echo return status:
 *   "success" - Email sent.
 *   "fail"    - Uexpected error - No email sent.
 */
function emailPlayerResult(response) {
  if (response === 'success') {
    if (BD18.pcount === 2) {
      BD18.pcount = 1;
    } else {
      window.location.reload(true);
    }
  }
  else if (response === 'fail') {
    var errmsg = 'Send email to player failed.\n';
    errmsg += 'Please contact the BOARD18 webmaster.';
    alert(errmsg);
  }
  else { // Something is definitly wrong in the code.
    var nerrmsg ='Invalid return code from emailPlayers.php.\n';
    nerrmsg += response + '\nPlease contact the BOARD18 webmaster.';
    alert(nerrmsg);
  }
}

/* 
 * Function changePlayerResult is the call back function for the
 * ajax changePlayers.php call. 
 * 
 * Output from changePlayers.php is an echo return status:
 *   "success" - All changes have been made.
 *   "fail"    - Uexpected error - No changes have been made.
 *   "dupadd"  - Add ID is duplicate - No changes have been made.
 */
function changePlayerResult(response) {
  if (response.indexOf("<!doctype html>") !== -1) { // User has timed out.
    window.location = "access-denied.html";
  }
  else if (response === 'success') {
    var cString;
    BD18.pcount = 1;
    switch(BD18.mode) {
      case 1:
        cString = 'game=' + BD18.gname + '&login=' + BD18.prem;
        $.post("php/emailPlayerRem.php", cString, emailPlayerResult);
        break;
      case 2:
        cString = 'game=' + BD18.gname + '&login=' + BD18.padd;
        $.post("php/emailPlayerAdd.php", cString, emailPlayerResult);     
        break;
      case 3:
        cString = 'game=' + BD18.gname + '&login=' + BD18.padd;
        $.post("php/emailPlayerAdd.php", cString, emailPlayerResult);
        cString = 'game=' + BD18.gname + '&login=' + BD18.prem;
        $.post("php/emailPlayerRem.php", cString, emailPlayerResult);
        BD18.pcount = 2;
    }
  }
  else if (response === 'dupadd') {
    $("#pname4_error").text('Player is already in game.').show();
    $("#pname4").focus();
  }
  else if (response === 'fail') {
    var errmsg = 'Data Base update failed.\n';
    errmsg += 'Please contact the BOARD18 webmaster.';
    alert(errmsg);
  }
  else { // Something is definitly wrong in the code.
    var nerrmsg ='Invalid return code from changePlayers.php.\n';
    nerrmsg += response + '\nPlease contact the BOARD18 webmaster.';
    alert(nerrmsg);
  }
}

/* 
 * Function changePlayer is called by the on-
 * click method of the players submit button. 
 * It sets BD18.mode based on missing fields
 * and does an ajax call to changePlayers.php. 
 */
function changePlayer(login, game) {
  $('.error').hide();
  BD18.mode = 0;
  var prem = $("input#pname3").val();
  if (prem !== "") {  // Has a "remove player" login been entered?
    if (prem === login) { // Is player trying to remove himself??
      if (BD18.self === 0) { // Is this the first try?
        $("#pname3_error").show(); // Ask if he is sure.
        $("#pname3").focus();
        BD18.self = 1;
        return false;
      }
    }
    BD18.mode += 1; // Have changePlayers.php do a remove.
    BD18.prem = prem;
  }
  var padd = $("input#pname4").val();
  if (padd !== "") { // Has an "add player" login been entered?
    BD18.mode += 2; // Have changePlayers.php do an add.
    BD18.padd = padd;
  } else if (BD18.mode === 0) { // If nothing to do.
    $("#pname4_error").show();
    $("#pname4").focus();
    return false;
  }
  var cString = 'mode=' + BD18.mode.toString();
  cString += '&game=' + game;
  cString += '&prem=' + prem + '&padd=' + padd;
  $.post("php/changePlayers.php", cString, changePlayerResult);
  return false;
}