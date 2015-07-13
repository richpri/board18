/*
 * The board18SnapMap.js file contains all the functions that
 * respond to various onclick events on the game board in the 
 * SnapMap page and on the main and tray menues.  But note that 
 * right click events are not used on snapshot displays.
 *
 * Copyright (c) 2013 Richard E. Price under the The MIT License.
 * A copy of this license can be found in the LICENSE.text file.
 */

/* The registerMainMenu function creates the 
 * main menu on the board18SnapMap page. It uses
 * the jquery context menu plugin.
 */
function registerMainMenu() {
  $.contextMenu({
    selector: "#newmainmenu", 
    trigger: "left",
    className: "bigMenu",
    items: {
      hideshow: {
        name: "Hide/Show",
        callback: function(){
          if (BD18.hideMapItems === false) {
            BD18.hideMapItems = true;
            trayCanvasApp();
            BD18.gameBoard.place();
            BD18.gameBoard.clear2();
          } else {
            BD18.hideMapItems = false;
            trayCanvasApp();
            mainCanvasApp();
            toknCanvasApp();
          }
        }
      },
      stock: {
        name: "Stock Market",
        callback: function(){
          window.location = "board18SnapMark.php?show=" + BD18.snapID;
        }
      },
      snaplist: {
        name: "Return to Snap List",
        callback: function(){
          window.location = "board18SnapList.php?gameid=" + BD18.gameID;
        }
      },     
      main: {
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

/* The makeTrayItems function will use the 
 * BD18.trays array to construct the items
 * to be displayed in the tray menu.
 */
function makeTrayItems() {
  var menuText = '{';
  var lastItem = BD18.trays.length - 1;
  for (var ix = 0; ix < BD18.trays.length; ix++) {
    menuText += '"tray' + ix + '": ';
    menuText += '{"name": "' + BD18.trays[ix].trayName;
    menuText += '"}';
    menuText += (ix === lastItem) ? '}' : ',';
  }
  var menuItems = $.parseJSON(menuText);
  return menuItems;
}

/* The registerTrayMenu function creates the 
 * tray menu on the board18SnapMap page. It uses
 * the jquery context menu plugin and the
 * makeTrayItems function.
 */
function registerTrayMenu() {
  var itemlist = makeTrayItems();
  $.contextMenu({
    selector: "#traymenu", 
    trigger: "left",
    className: "leftMenu",
    zIndex: 10,
    position: function(opt, x, y) {
      opt.$menu.position({
        my: 'left top',
        at: 'left bottom',
        of: opt.$trigger
      });
    },
    callback: function(key, options) {
      /* Remove any uncompleted moves. */
      if (BD18.hexIsSelected === true) {
        mainCanvasApp();
        toknCanvasApp();
        BD18.hexIsSelected = false;
        BD18.tokenIsSelected = false;
        BD18.tileIsSelected = false;
        BD18.curFlip = false;
      }
      $("#botleftofpage").scrollTop(0);
      var ix = parseInt(key.substring(4));
      BD18.trays[ix].place(null);
    },
    items: itemlist
  });
}

/* 
 * This makeMenus function is a stub to make board18SnapMap
 * compatable with board18Map2.php
 */
function makeMenus() { };