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

/* The updateMenu function will update the menu 
 * move specific actions
 */
function updateMenu(menuType){
  $('.move').hide();
  $('.'+menuType+'.move').show();
}

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
        updateMenu('no');
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
  updateMenu('active');
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
    if (x !== BD18.curBoxX) { onMapMenu(event);return; }
    if (y !== BD18.curBoxY) { onMapMenu(event);return; }
    if (BD18.tokenIsSelected === true) {
      repositionToken(xPix,yPix);
    }
  } else { // BD18.boxIsSelected === false
    if (BD18.tokenIsSelected === true) {
      dropToken(x,y,xPix,yPix);
    }else{
      onMapMenu(event)
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
  event.stopPropagation();
  event.preventDefault();
  $('.menu').hide();
  if (event.which === 0 || event.which === 1) { // Left or Center
    boxSelect(event);
  } else {
    onMapMenu(event)
  }
}

/* This function uses makeMenuItems to create an onMapMenu
 */
function onMapMenu(event) {
  var items = makeMenuItems(event);
  if( items == 0 ) return;
  var menuList = '';
  for(var key in items) {
    menuList += "<li class='contextMenu' data-action='"+key+"'>"+items[key].name+"</li>";
  }
  $('#onMapMenu ul').html(menuList);
  $('#onMapMenu li').click(function(e){doit(this.getAttribute("data-action"),e);});
  $('#onMapMenu').css({"left":event.clientX+10,"top":event.clientY+10});
  $('#onMapMenu').show();
}

/* This function is called via onclick events coded into the
 * main menu on the board18Map page. the passed parameter 
 * indicates the menu choice to be acted upon.
 */
function doit(mm,e) { // mm is the onclick action to be taken.
  switch(mm)
  {
    case "flip":
      flipToken();
      break;
    case "up":
      var subY = parseInt(BD18.stockMarket.yStep);
      BD18.curMktY -= subY;
      BD18.tempToken[5] = null;
      BD18.curStack  = null;
      repositionToken(BD18.curMktX,BD18.curMktY);
      break;
    case "right":
      var addX = parseInt(BD18.stockMarket.xStep);
      BD18.curMktX += addX;
      BD18.tempToken[5] = null;
      BD18.curStack  = null;
      repositionToken(BD18.curMktX,BD18.curMktY);
      break;
    case "down":
      var addY = parseInt(BD18.stockMarket.yStep);
      BD18.curMktY += addY;
      BD18.tempToken[5] = null;
      BD18.curStack  = null;
      repositionToken(BD18.curMktX,BD18.curMktY);
      break;
    case "left":
      var subX = parseInt(BD18.stockMarket.xStep);
      BD18.curMktX -= subX;
      BD18.tempToken[5] = null;
      BD18.curStack  = null;
      repositionToken(BD18.curMktX,BD18.curMktY);
      break;
    case "accept":
      acceptMove();
      break;
    case "reset":
      if (BD18.deletedMarketToken) {
        BD18.curTrayNumb = BD18.deletedMarketToken.snumb;
        BD18.curIndex = BD18.deletedMarketToken.index;
        BD18.curFlip = BD18.deletedMarketToken.flip;
        BD18.curStack = BD18.deletedMarketToken.stack;
        BD18.curMktX = BD18.deletedMarketToken.bx;
        BD18.curMktY = BD18.deletedMarketToken.by;
        BD18.curBoxX = BD18.deletedMarketToken.hx;
        BD18.curBoxY = BD18.deletedMarketToken.hy;
        addToken();
      }
      trayCanvasApp();
      mainCanvasApp();
      toknCanvasApp();
      BD18.boxIsSelected = false;
      BD18.tokenIsSelected = false;
      break;
    case "tflip":
      var ix = BD18.onBoxList.tokens[0].mtindex;
      var smtok = BD18.marketTokens[ix];
      if (BD18.trays[smtok.snumb].tokenFlip[smtok.index] === true) 
      { 
        moveSetup(smtok);
        deleteToken(ix);
        flipToken();
      }
      break;
    case "tmove":
      var ix = BD18.onBoxList.tokens[0].mtindex;
      var smtok = BD18.marketTokens[ix];
      moveSetup(smtok);
      BD18.curMktX = smtok.bx;
      BD18.curMktY = smtok.by;
      deleteToken(ix);
      repositionToken(BD18.curMktX,BD18.curMktY);
      break;
    case "tup":
      var ix = BD18.onBoxList.tokens[0].mtindex;
      var addY = parseInt(BD18.stockMarket.yStep);
      var smtok = BD18.marketTokens[ix];
      smtok.stack = null;
      moveSetup(smtok);
      BD18.curMktX = smtok.bx;
      BD18.curMktY = smtok.by-addY;
      deleteToken(ix);
      repositionToken(BD18.curMktX,BD18.curMktY);
      break;
    case "tright":
      var ix = BD18.onBoxList.tokens[0].mtindex;
      var addX = parseInt(BD18.stockMarket.xStep);
      var smtok = BD18.marketTokens[ix];
      smtok.stack = null;
      moveSetup(smtok);
      BD18.curMktX = smtok.bx+addX;
      BD18.curMktY = smtok.by;
      deleteToken(ix);
      repositionToken(BD18.curMktX,BD18.curMktY);
      break;
    case "tdown":
      var ix = BD18.onBoxList.tokens[0].mtindex;
      var addY = parseInt(BD18.stockMarket.yStep);
      var smtok = BD18.marketTokens[ix];
      smtok.stack = null;
      moveSetup(smtok);
      BD18.curMktX = smtok.bx;
      BD18.curMktY = smtok.by+addY;
      deleteToken(ix);
      repositionToken(BD18.curMktX,BD18.curMktY);
      break;
    case "tleft":
      var ix = BD18.onBoxList.tokens[0].mtindex;
      var addX = parseInt(BD18.stockMarket.xStep);
      var smtok = BD18.marketTokens[ix];
      smtok.stack = null;
      moveSetup(smtok);
      BD18.curMktX = smtok.bx-addX;
      BD18.curMktY = smtok.by;
      deleteToken(ix);
      repositionToken(BD18.curMktX,BD18.curMktY);
      break;
    case "tdelete":
	  deleteToken(BD18.onBoxList.tokens[0].mtindex);
	  updateMarketTokens();
	  toknCanvasApp();
	  trayCanvasApp();
	  updateDatabase();
	  BD18.boxIsSelected = false;
	  BD18.tokenIsSelected = false;
      break;
    case "stflip":
      BD18.tknMenu.funct = 'flip';
      selectToken(e);
      break;
    case "stmove":
      BD18.tknMenu.funct = 'adjust';
      selectToken(e);
      break;
    case "stup":
      BD18.tknMenu.funct = 'up';
      selectToken(e);
      break;
    case "stright":
      BD18.tknMenu.funct = 'right';
      selectToken(e);
      break;
    case "stdown":
      BD18.tknMenu.funct = 'down';
      selectToken(e);
      break;
    case "stleft":
      BD18.tknMenu.funct = 'left';
      selectToken(e);
      break;
    case "sttop":
      BD18.tknMenu.funct = 'top';
      selectToken(e);
      break;
    case "stbottom":
      BD18.tknMenu.funct = 'bottom';
      selectToken(e);
      break;
    case "straise":
      BD18.tknMenu.funct = 'raise';
      selectToken(e);
      break;
    case "stlower":
      BD18.tknMenu.funct = 'lower';
      selectToken(e);
      break;
    case "stdelete":
      BD18.tknMenu.funct = 'delete';
      selectToken(e);
      break;
    default:
      alert("Button pressed. " + mm);
  }   
}

