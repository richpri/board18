/* All BD18 global variables are contained in one
 * 'master variable' called BD18.  This isolates 
 * them from global variables in other packages. 
 */

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
} // end of logoutOK

/* Function listReturn is the success callback function for 
 * the ajax myGameList.php call. It appends a list if games
 * to the table in board18Main.php.
 */
function listReturn(response) {
  if (response) {
    if (typeof response === "string") { // User has timed out.
      window.location = "access-denied.html";
    }   
    var gameHTML ='';
    $.each(response.gamelist,function(index,listInfo) {
      gameHTML += '<tr> <td class="gamename">';
      gameHTML += '<a href="board18Map?dogame=';
      gameHTML += listInfo.game_id + ' ">';
      gameHTML += listInfo.gname + '</a></td> <td>';
      gameHTML += listInfo.bname + '</td> <td>';
      gameHTML += listInfo.version + '</td> <td>';
      gameHTML += listInfo.start_date + '</td> </tr>';
    }); // end of each
    $('#gamelist').append(gameHTML);
  } else {
    var nogames = '<p id="gamehead">'
    nogames += 'You are not currently playing any games</p>'
    $('#games').append(nogames);
  } 
} // end of listReturn

/* Function listError is the error callback function for 
 * the ajax myGameList.php call. It should never be used.
 * It alerts the player about the error.
 */
function listError(a, b, c) {
  var errmsg = 'Error returned to board18New from myGameList.php:\n';
  errmsg += (c ? c : a.status);
  alert(errmsg);
} // end of listError 