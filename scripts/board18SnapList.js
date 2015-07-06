/*
 * Copyright (c) 2015 Richard E. Price under the The MIT License.
 * A copy of this license can be found in the LICENSE.text file.
 *
 * All BD18 global variables are contained in one
 * 'master variable' called BD18.  This isolates 
 * them from global variables in other packages. 
 */

/* Function listReturn is the success callback function for 
 * the ajax snapShow.php call. It appends a list if games
 * to the table in board18SnapList.php.
 */
function listReturn(response) {
  if (response.indexOf("<!doctype html>") !== -1) { // User has timed out.
    window.location = "access-denied.html";
  }
  var resp = jQuery.parseJSON(response);
  if (resp.stat === 'success') {
    var snapHTML = '<table id="snaplist"> <tr>';
    snapHTML += '<th>Game Round</th> <th>Snaped By</th>';
    snapHTML += '<th>Last Update By</th> <th>Snap Date</th></tr>';       
    $.each(resp.snaps,function(index,listInfo) {
      snapHTML += '<tr class="snaprow"> <td>';
      snapHTML += '<a href="board18SnapMap.php?show=';
      snapHTML += listInfo.cp_id + ' ">';
      snapHTML += listInfo.round + '</a></td> <td>';
      snapHTML += listInfo.snaper + '</td> <td>';
      snapHTML += listInfo.updater + '</td> <td>';
      snapHTML += listInfo.cp_date + '</td> </tr>';
    }); // end of each
    snapHTML += '</table>';
    $("#snaplist").remove();
    $('#snaps').append(snapHTML);
  } else if (resp.stat === 'none') {
    var nosnaps = '<p id="snaphead">';
    nosnaps += 'No snapshots have been taken of this game.</p>';
    $("#snaplist").remove();
    $('#snaps').append(nosnaps);
  } else if (resp.stat === 'fail') {
    var errmsg1 = 'Program error in snapShow.php.\n';
    errmsg1 += 'Please contact the BOARD18 webmaster.';
    alert(errmsg1);
  } else {  // Something is definitly wrong in the code.
    var nerrmsg = 'Invalid return code from snapShow.php.\n';
    nerrmsg += response + '\nPlease contact the BOARD18 webmaster.';
    alert(nerrmsg);
  }
} // end of listReturn

/* This function performs an AJAX call
 * to the snapShow.php function.
 */
function doPageList() {
  var gameid = BD18.gameID;
  var blocksize = BD18.pagesize; 
  var startrow = BD18.pagesize * (BD18.curpage - 1);
  var outstring = "gameid=" + gameid; 
  outstring += "&blocksz=" + blocksize;
  outstring += "&startrow=" + startrow;
  $.post("php/snapShow.php", outstring, listReturn);
}

/* Function doPageLinks create page links for multi page
 * snapshot list output. 
 */
function doPageLinks() {
  var snaps = BD18.snapcount;
  var pages = BD18.pagecount;
  var curpage = BD18.curpage;
  if (pages > 1) {
    var plist = "<div id='paginator'>";
    for(var i = 1; i <= pages; i++) { 
      if (i === curpage) {
        plist += "<p><a href='#' class='pagor selected'>Page ";
        plist += i + "</a></p>";
      } else {
        plist += "<p><a href='#' class='pagor'>Page ";
        plist += i + "</a></p>";
      }
    }
    plist += "</div>";
    $("#paginator").remove();
    $("#pagelinks").append(plist);
  }
}

function registerMainMenu() {
  $.contextMenu({
    selector: "#newmainmenu", 
    trigger: "left",
    className: "bigMenu",
    items: {
      goback: {
        name: "Return To Game",
        callback: function(){
          window.location = "board18Map.php?dogame=" + BD18.gameID;
        }
      },
      mainpage: {
        name: "Main Page",
        callback: function(){
          window.location = "board18Main.php";
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
          window.open(BD18.help, "HelpGuide");
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
