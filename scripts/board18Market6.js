/*
 * The board18Market6.js file contains all the functions that
 * respond to various onclick events on the stock chart in the 
 * Market page and on the main and tray menues.  But right click 
 * events that cause a context menu to be displayed are handled
 * by functions in the board18Market5.js file.
 */

/* The registerMainMenu function creates the main menu on the 
 * board18Market page. It uses the jquery context menu plugin.
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
      map: {
        name: "Map Board",
        callback: function(){
          window.location = "board18Map.php?dogame=" + BD18.gameID;
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
 * tray menu on the board18Market page. It uses
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
      var ix = parseInt(key.substring(4));
      BD18.trays[ix].place(null);
    },
    items: itemlist
  });
}

/* This function calculates the board coordinates of a stock price
 * box given the raw coordinates of a mouse click event.
 */
function boxPos(event) {
  var xPix, yPix, xIndex, yIndex;
// [xPix, yPix] = offsetIn(event, BD18.canvas1);
  var tArray = offsetIn(event, BD18.canvas1);
  xPix = tArray[0];
  yPix = tArray[1];
// [xIndex, yIndex] = BD18.stockMarket.chartCoord(xPix, yPix);
  var tArray = BD18.stockMarket.chartCoord(xPix, yPix);
  xIndex = tArray[0];
  yIndex = tArray[1];
  return [xIndex, yIndex];
}

/* This function responds to onclick events in the trays canvas.
 * It selects a item from those currently displayed and highlites
 * the selected item.
 */
function traySelect(event) {
  if (BD18.boxIsSelected === true) return;
  var tray = BD18.trays[BD18.curTrayNumb];
  var a, b, c, x, y;
  if(tray.sheetType==="mtok") {
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
  BD18.curIndex = index;
  BD18.curFlip = false; // Eliminate any previous flip.
  tray.place(index); // Set highlight.
  BD18.tokenIsSelected = true;
}

/* This function responds to left mousedown events in the  
 * map canvas. It checks various conditions and executes 
 * the appropriate function based on them. If it can find 
 * no relevant condition then it merely returns.
 */
function boxSelect(event) {
  var x, y, xPix, yPix;
// [x, y] = boxPos(event);
  var tArray = boxPos(event);
  x = tArray[0];
  y = tArray[1];
// [xPix, yPix] = offsetIn(event, BD18.canvas1);
  var tArray = offsetIn(event, BD18.canvas1);
  xPix = tArray[0];
  yPix = tArray[1];
  if (BD18.boxIsSelected === true) {
    if (x !== BD18.curBoxX) { return; }
    if (y !== BD18.curBoxY) { return; }
    if (BD18.tokenIsSelected === true) {
      repositionToken(xPix,yPix);
    }
  } else { // BD18.boxIsSelected === false
    if (BD18.tokenIsSelected === true) {
      dropToken(x,y,xPix,yPix); 
    }   
  }
}

/* This function responds to mousedown events on the map canvas.
 * It uses event.witch to determine which mouse button was pressed.
 * If the left or center button was pressed then it calls the
 * boxSelect functon. Otherwise it assumes that the right button
 * was pressed and does nothing. Right mose events are handled
 * by the jquery.contextMenu library [see the makeMenus function].
 */
function mapMouseEvent(event) {
  if (event.which === 0 || event.which === 1) { // Left or Center
    boxSelect(event);
  } 
}
