/*
 * The board18Map6.js file contains all the functions that
 * respond to various onclick events on the game board in the 
 * Map page and on the main and tray menues.  But right click 
 * events that cause a context menu to be displayed are handled
 * by functions in the board18Map5.js file.
 *
 * Copyright (c) 2013 Richard E. Price under the The MIT License.
 * A copy of this license can be found in the LICENSE.text file.
 */

/* The registerMainMenu function creates the 
 * main menu on the board18Map page. It uses
 * the jquery context menu plugin.
 */
function registerMainMenu() {
  $.contextMenu({
    selector: "#newmainmenu", 
    trigger: "left",
    className: "bigMenu",
    items: {
      accept: {
        name: "Accept Move",
        callback: function(){
          acceptMove();
        }
      },
      reset: {
        name: "Cancel Move",
        callback: function(){
          trayCanvasApp();
          mainCanvasApp();
          toknCanvasApp();
        }
      },
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
          window.location = "board18Market.php?dogame=" + BD18.gameID;
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
 * tray menu on the board18Map page. It uses
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

/* This function calculates the board coordinates of a map
 * tile given the raw coordinates of a mouse click event.
 */
function tilePos(event) {
  var xPix, yPix, xIndex, yIndex;
// [xPix, yPix] = offsetIn(event, BD18.canvas1);
  var tArray = offsetIn(event, BD18.canvas1);
  xPix = tArray[0];
  yPix = tArray[1];
// [xIndex, yIndex] = BD18.gameBoard.hexCoord(xPix, yPix);
  tArray = BD18.gameBoard.hexCoord(xPix, yPix);
  xIndex = tArray[0];
  yIndex = tArray[1];
  return [xIndex, yIndex];
}

/* This function responds to onclick events in the trays canvas.
 * It selects a item from those currently displayed and highlites
 * the selected item.
 */
function traySelect(event) {
  if (BD18.hexIsSelected === true) return;
  var tray = BD18.trays[BD18.curTrayNumb];
  var a, b, c, x, y;
  if(tray.sheetType==="tile") {
    a = 10;  // This is the tray Top Margin.
    b = 120; // This is the tray Y Step Value.
    c = tray.tilesOnSheet;
  } else if(tray.sheetType==="btok") {
    a = 0;  // This is the tray Top Margin.
    b = 40;  // This is the tray Y Step Value.
    c = tray.tokensOnSheet;
  } else {
    return; // Invalid sheet type!!
  }
// [x, y] = offsetIn(event, BD18.canvas0);
  var tArray = offsetIn(event, BD18.canvas0);
  x = tArray[0];
  y = tArray[1];
  var ind = (y-a)/b;
  var inde = (ind>=c)?c-1:ind; 
  var index = Math.floor((inde<0)?0:inde);
  if (BD18.gm.trayCounts[BD18.curTrayNumb][index] === 0) return;
  BD18.curIndex = index;
  BD18.curRot = 0; // Eliminate any previous rotation.
  BD18.curFlip = false; // Eliminate any previous flip.
  tray.place(index); // Set highlight.
  if(tray.sheetType==="tile") {BD18.tileIsSelected = true;}
  if(tray.sheetType==="btok") {BD18.tokenIsSelected = true;}
}

/* This function responds to left mousedown events in the  
 * map canvas. It checks various conditions and executes 
 * the appropriate function based on them. If it can find 
 * no relevant condition then it merely returns.
 */
function hexSelect(event) {
      var x, y, xPix, yPix;
//     [x, y] = tilePos(event);
      var tArray = tilePos(event);
      x = tArray[0];
      y = tArray[1];
//     [xPix, yPix] = offsetIn(event, BD18.canvas1);
      tArray = offsetIn(event, BD18.canvas1);
      xPix = tArray[0];
      yPix = tArray[1];
  if (BD18.hexIsSelected === true) {
    if (x !== BD18.curHexX) { return; }
    if (y !== BD18.curHexY) { return; }
    if (BD18.tileIsSelected === true) {
      rotateTile("cw");       
    }
    if (BD18.tokenIsSelected === true) {
      repositionToken(xPix,yPix);
    }
  } else { // BD18.hexIsSelected === false
    if (BD18.tileIsSelected === true) {
      dropTile(x,y); 
    }
    if (BD18.tokenIsSelected === true) {
      dropToken(x,y,xPix,yPix); 
    }   
  }
}

/* This function responds to mousedown events on the map canvas.
 * It uses event.witch to determine which mouse button was pressed.
 * If the left or center button was pressed then it calls the
 * hexSelect functon. Otherwise it assumes that the right button
 * was pressed and does nothing. Right mose events are handled
 * by the jquery.contextMenu library [see the makeMenus function].
 */
function mapMouseEvent(event) {
  if (event.which === 0 || event.which === 1) { // Left or Center
    hexSelect(event);
  } 
}

/* This function is called via onclick events coded into the
 * main menu on the board18Map page. the passed parameter 
 * indicates the menue choice to be acted upon.
 */
function doit(mm) { // mm is the onclick action to be taken.
  switch(mm)
  {
    case "cw":
      rotateTile("cw");
      break;
    case "ccw":
      rotateTile("ccw");
      break;
    case "add":
      acceptMove();
      break;
    case "reset":
      trayCanvasApp();
      mainCanvasApp();
      toknCanvasApp();
      break;
    default:
      alert("Button pressed. " + mm);
  }   
}
