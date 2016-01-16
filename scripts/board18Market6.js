/*
 * The board18Market6.js file contains all the functions that
 * respond to various onclick events on the stock chart in the 
 * Market page and on the main and tray menues.  But right click 
 * events that cause a context menu to be displayed are handled
 * by functions in the board18Market5.js file.
 *
 * Copyright (c) 2013 Richard E. Price under the The MIT License.
 * A copy of this license can be found in the LICENSE.text file.
 */

/* The makeTrayItems function will use the 
 * BD18.trays array to construct the items
 * to be displayed in the tray menu.
 */
function makeTrayItems() {
  var menuText = '<ul class="leftMenu">';
  var lastItem = BD18.trays.length - 1;
  for (var ix = 0; ix < BD18.trays.length; ix++) {
    menuText += '<li onclick="leftMenuEvent(\'tray' + ix + '\');">';
    menuText += BD18.trays[ix].trayName;
    menuText += '</li>';
    menuText += (ix === lastItem) ? '</ul>' : '';
  }
  //var menuItems = $.parseJSON(menuText);
  return menuText;
}

/* The registerTrayMenu function creates the 
 * tray menu on the board18Map page. It uses
 * the jquery context menu plugin and the
 * makeTrayItems function.
 */
function registerTrayMenu() {
  if( BD18.trayCount > 1 ) {
    var itemlist = makeTrayItems();
    $('#traymenu').html(itemlist);
  } else {
    $('#botleftofpage').css('top',90);
    setPage();
  }
}

/* This function handles the selection of the leftMenu(Tray)
 * and displays the proper BD18.tray.
 */
function leftMenuEvent(key) {
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
      $('.menu').hide();
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
    b = BD18.curTrayStep;  // This is the tray Y Step Value.
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
  BD18.deletedMarketToken = 0; // Eliminate any backout of token delete.
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
    if (x !== BD18.curBoxX) { $('#content').contextMenu({x:event.clientX,y:event.clientY});return; }
    if (y !== BD18.curBoxY) { $('#content').contextMenu({x:event.clientX,y:event.clientY});return; }
    if (BD18.tokenIsSelected === true) {
      repositionToken(xPix,yPix);
    }
  } else { // BD18.boxIsSelected === false
    if (BD18.tokenIsSelected === true) {
      dropToken(x,y,xPix,yPix);
    }else{
      $('#content').contextMenu({x:event.clientX,y:event.clientY});
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
