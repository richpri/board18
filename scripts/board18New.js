/*jshint forin:true, noarg:true, noempty:true, eqeqeq:true, 
 *bitwise:true, undef:true, curly:true, browser:true, 
 *jquery:true, es5:true, indent:4, maxerr:50 
 */

/* All BD18 global variables are contained in one
 * 'master variable' called BD18.  This isolates 
 * them from global variables in other packages. 
 */

/* I found this generalized numeric test function
 * at http://stackoverflow.com/questions/18082/
 *    validate-numbers-in-javascript-isnumeric 
 */
function isNumber(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

/* Function logoutOK is the callback function for the ajax
 * lgout call. 
 */
function logoutOK(resp) {
  if(resp === 'success') {
    window.location = "index.html";
  }
  else {
    alert("Logout failed! This should never happen.");
  } 
}

/* Function makeNewGame creates a JSON object for the ajax
 * newgame call. 
 */
function makeNewGame(name, boxid, players, player) {
  var pp = [];
  var i;
  for(i=0; i<players; i++) { pp[i] = player[i]; }
  return JSON.stringify({
    gname : name,
    boxid : boxid,
    players : pp, 
  });
}

/* Function newgameOK is the callback function for the ajax
 * newgame call. 
 */
function newgameOK(response) {
  if (response === "nobox") {
    $("#bi_error").text('Invalid Game Box ID.').show();  
    $("#boxid").focus();
  } else if (response.indexOf("noplayer") != -1) {  
    // Response contains "noplayer".
    var plerr = 'Player #' + response.substr(9) + ' does not exist';
    $("#pc_error").text(plerr).show();  
    $("#player1").focus();
  } else if (response === "success") {
    $('#newgame .error').hide();
    $('#newgame :text').val('');
    var loginNote ='New game has been created.';
    $('#lognote').text(loginNote);
  } else if (response === "failure") {
    var ferrmsg ='New game was not created due to an error.\n';
    ferrmsg += 'Please contact the site administrator.';
    alert(ferrmsg);
  } else {
    var nerrmsg ='Invalid return code from createGame.php.\n';
    nerrmsg += response + '\nThis should not happen.';
    alert(nerrmsg);
  }
}

/* 
 * Function newgame is called by the on-click
 * method of the newgame submit button. It 
 * checks the input for missing fields and
 * does an ajax call to createGame.php. 
 */
function newgame() {
  $('.error').hide();  
  BD18.name = $("input#sessionname").val();  
  if (BD18.name === "") {  
    $("#sn_error").show();  
    $("#sessionname").focus();  
    return;  
  }
  BD18.boxid = $("input#boxid").val();
  if (BD18.boxid === "") {  
    $("#bi_error").text('This field is required.').show();  
    $("#boxid").focus();
    return; 
  }
  if (!$.isNumeric(BD18.boxid) || (parseInt(BD18.boxid) <= 0)) {  
    $("#bi_error").text('Invalid box id.').show();  
    $("#boxid").focus();  
    return;  
  }
  BD18.playerCount = $("input#pcount").val();
  if (BD18.playerCount === "") {  
    $("#pc_error").text('# of Players is required.').show();  
    $("#pcount").focus();  
    return;  
  }
  if (!isNumber(BD18.playerCount) || (BD18.playerCount < 2) || 
    (BD18.playerCount > 6)) {  
    $("#pc_error").text('# of players must be between 2 and 6.').show();  
    $("#pcount").focus();  
    return;  
  }
  var pp = 0;
  BD18.player = [];
  BD18.errtxt = "";
  $('.fn2').each(function(i) {
    BD18.player[i] = $(this).val();
    if (BD18.player[i] === "" && i < BD18.playerCount) { 
      pp = i + 1;
      BD18.errtxt = 'Player' + pp + ' is missing.';
      $("#pc_error").text(BD18.errtxt).show();  
      $(this).focus();  
      return false;  
    } 
    if (BD18.player[i] !== "" && i >= BD18.playerCount) {  
      BD18.errtxt = 'There are more than ' + BD18.playerCount 
        + ' players.';
      $("#pc_error").text(BD18.errtxt).show();  
      $("#pcount").focus();  
      return false;  
    }
  });
  if (BD18.errtxt === "") {
    var dataString = makeNewGame(BD18.name, BD18.boxid, 
    BD18.playerCount, BD18.player); 
    var postString = 'newgame=' + dataString;
    $.post("php/createGame.php", postString,  function(response) {
      newgameOK(response);
    });
  }
}
