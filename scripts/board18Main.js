/* All BD18 global variables are contained in one
 * 'master variable' called BD18.  This isolates 
 * them from global variables in other packages. 
 */

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
} // end of logoutOK

/* Function listReturn is the success callback function for 
 * the ajax myGameList.php call. It appends a list if games
 * to the table in board18Main.php.
 */
function listReturn(response) {
  if (response.indexOf("<!doctype html>") !== -1) { // User has timed out.
    window.location = "access-denied.html";
  }
  var resp = jQuery.parseJSON(response);
  if (resp.stat === 'success') {
    var gameHTML ='';
    $.each(resp.games,function(index,listInfo) {
      gameHTML += '<tr> <td class="gamename">';
      gameHTML += '<a href="board18Map.php?dogame=';
      gameHTML += listInfo.game_id + ' ">';
      gameHTML += listInfo.gname + '</a></td> <td>';
      gameHTML += listInfo.bname + '</td> <td>';
      gameHTML += listInfo.version + '</td> <td>';
      gameHTML += listInfo.start_date + '</td> </tr>';
    }); // end of each
    $('#gamelist').append(gameHTML);
  } else if (resp.stat === 'none') {
    var nogames = '<p id="gamehead">';
    nogames += 'You are not currently playing any games</p>';
    $('#games').append(nogames);
  } else if (resp.stat === 'fail') {
    var errmsg1 = 'Program error in myGameList.php.\n';
    errmsg1 += 'Please contact the BOARD18 webmaster.';
    alert(errmsg1);
  } else {  // Something is definitly wrong in the code.
    var nerrmsg = 'Invalid return code from myGameList.php.\n';
    nerrmsg += response + '\nPlease contact the BOARD18 webmaster.';
    alert(nerrmsg);
  }
} // end of listReturn

function registerMainMenu() {
  $.contextMenu({
    selector: "#newmainmenu", 
    trigger: "left",
    className: "bigMenu",
    items: {
      newgame: {
        name: "Make New Game",
        callback: function(){
          window.location = "board18New.php";
        }
      },
      administration: {
        name: "Administration",
        callback: function(){
          window.location = "board18Admin.php?changeit=no";
        }
      },
      logout: {
        name: "Log Out",
        callback: function(){
          $.post("php/logout.php", logoutOK);
        }
      },
      help: {
        name: "Help",
        callback: function(){
          window.open("http://wiki.board18.org/w/User%27s_Guide", "UserGuide");
        }
      },
      close: {
        name: "Close Menu",
        callback: function(){}
      }
    },
    zIndex: 10,
    position: function(opt, x, y) {
      opt.$menu.position({
        my: 'left top',
        at: 'left bottom',
        of: opt.$trigger
      });
    },
    callback: function(key, options) {
      var m = "clicked on " + key + " on element ";
      m =  m + options.$trigger.attr("id");
      alert(m); 
    }
  });
}