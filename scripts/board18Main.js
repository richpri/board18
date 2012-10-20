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
  if(resp == 'success') {
    window.location = "index.html"
  }
  else {
    alert("Logout failed! This should never happen.") 
  } 
}

/* Function newgameOK is the callback function for the ajax
 * newgame call. 
 */
function newgameOK(response) {
  if (response == "nobox") {
    $("#bi_error").show();  
    $("#boxidnumb").focus();
  } else if (response == "success") {
    $('#newgame .error').hide();
    $('#newgame :text').val('');
    $('#newgame form').slideUp(300);
    var loginNote ='New game has been created.';
    $('#lognote').text(loginNote);
  } else {
    var nerrmsg ='Invalid return code from createGame.php.\n'
    nerrmsg += response + '\nThis should not happen.'
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
  var name = $("input#sessionname").val();  
  if (name == "") {  
    $("#sn_error").show();  
    $("#sessionname").focus();  
    return;  
  }
  var players = $("input#playercount").val();
  if (players == "") {  
    $("#pc_error").show();  
    $("#playercount").focus();  
    return;  
  }
  if (!isNumber(players) || (players < 2) || (players > 6)) {  
    $("#pc_error").text('# of players must be between 2 and 6.').show();  
    $("#playercount").focus();  
    return;  
  }
  var boxid = $("input#boxidnumb").val();
  if (boxid == "") {  
    $("#bi_error").show();  
    $("#boxidnumb").focus();
    return; 
  }
  if (!isNumber(boxid) || (boxid <= 0)) {  
    $("#bi_error").text('Invalid box id.').show();  
    $("#playercount").focus();  
    return;  
  }
  var dataString = 'name='+ name + '&pc=' + players + '&id=' + boxid; 
  alert(dataString);
  $.post("php/createGame.php", dataString, newgameOK);
}
