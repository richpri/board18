/*
 * The board18oxLoad script contains all of the js functions
 * for the board18BoxLoad page.
 * 
 * Copyright (c) 2015 Richard E. Price under the The MIT License.
 * A copy of this license can be found in the LICENSE.text file.
 *
 * All BD18 global variables are contained in one 'master variable'
 * called BD18.  This isolates them from all other global variables. 
 */

/* 
 * Function emailPlayerResult is the call back function for an
 * ajax call to emailPlayer.php. 
 * It only needs to check for errors. 
 *  
 * Output from emailPlayer.php is an echo return status:
 *   "success" - Email sent.
 *   "fail"    - Uexpected error - This email not sent.
 */
function emailPlayerResult(response) {
  if (response === 'fail') {
    var errmsg = 'Send email to player failed.\n';
    errmsg += 'Please contact the BOARD18 webmaster.';
    alert(errmsg);
  }
  else if (response !== 'success') {
    // Something is definitly wrong in the code.
    var nerrmsg = 'Invalid return code from emailPlayer.php.\n';
    nerrmsg += response + '\nPlease contact the BOARD18 webmaster.';
    alert(nerrmsg);
  }
}

/* 
 * Function doMail sends an Email report to the author after the
 * ajax loadBoxZip.php call returna a success or an email status.
 */
function doMail(report) {
  var body = "";
  report.forEach(function(line) {
    body += line + "\n";
  });
  var cString = 'login=rich&subject=loadBoxZip test';
  cString += '&body=' + body;
  $.post("php/emailPlayer.php", cString, emailPlayerResult);
}

/* Function zipBoxOk processes the return from the loadBoxZip.php call. 
 * 
 * resp.stat will be "success||"fail"||"nofile"||"toobig"||"email"
 * 
 * On a status of success or email it will send an email to the author.
 */
function zipBoxOk(resp) {
 // var resp = jQuery.parseJSON(status); 
  if (resp.stat === 'nofile') {
    $("#zfile_error").text('The input zip file is missing.').show();
    $("#zfile").focus();
  } else if (resp.stat === 'toobig') {
    $("#zfile_error").text('The input zip file is too big.').show();
    $("#zfile").focus();
  } else if (resp.stat === 'success') {
    var succmsg = 'The game box creation was successful.\n';
    succmsg += 'You will be emailed a detailed report.';
    alert(succmsg);
    doMail(resp.rpttext);
  } else if (resp.stat === 'email') {
    var emailmsg = 'The game box creation failed.\n';
    emailmsg += 'You will be emailed a detailed report.';
    alert(emailmsg);
    doMail(resp.rpttext);
  } else if (resp.stat === 'fail') {
    var errmsg = 'Data Base access failed.\n';
    errmsg += 'Please contact the BOARD18 webmaster.';
    alert(errmsg);
  } else { // Something is definitly wrong in the code.
    var nerrmsg = 'Invalid return code from loadBoxZip.php.\n';
    nerrmsg += resp.stat + '\nPlease contact the BOARD18 webmaster.';
    alert(nerrmsg);
  }
}