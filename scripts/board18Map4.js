/*
 * These are functions that respond to various onclick events.
 */

/* This function calculates the board coordinates of a map
 * tile given the raw coordinates of a mouse click event.
 */
function tilePos(event) {
  var xPix, yPix, xIndex, yIndex;
  [xPix, yPix] = offsetIn(event, BD18.canvas1);
  [xIndex, yIndex] = BD18.gameBoard.hexCoord(xPix, yPix);
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
  [x, y] = offsetIn(event, BD18.canvas0);
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
      [x, y] = tilePos(event);
      [xPix, yPix] = offsetIn(event, BD18.canvas1);
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

/*
 * The getMenuType() function returns a character
 * from the list below to specify what type of
 * menu to display.
 *
 * "0" - Suppress the menue display entirely.
 * "1" - Current hex selected and token selected
 * "2" - Current hex selected and tile selected
 * "3" - Current unselected hex has only one token [no tile]
 * "4" - Current unselected hex has mutiple tokens [no tile]
 * "5" - Current unselected hex has only a tile [no token] 
 * "6" - Current unselected hex has a tile and one token
 * "7" - Current unselected hex has a tile and mutiple tokens
 */
function getMenuType(event) {
  if (BD18.tknMenu.on) return "0";
  var type = "0";
  if (BD18.hexIsSelected === true) { 
    if (BD18.tokenIsSelected === true) type = "1";
    if (BD18.tileIsSelected === true) type = "2";
  } else { 
    var hexX, hexY;
    [hexX, hexY] = tilePos(event);
    BD18.hexList = new OnHex(hexX, hexY);
    if (!BD18.hexList.isTile) {
      if (BD18.hexList.oneToken) type = "3";
      if (BD18.hexList.manyTokens) type = "4";
    } else {
      if (BD18.hexList.noToken) type = "5";
      if (BD18.hexList.oneToken) type = "6";
      if (BD18.hexList.manyTokens) type = "7";
    }
  }
  return type;
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
  
/* 
 * The makeMenuItems function will use the getMenuType
 * function to determine which menu items it will
 * include in the currently displayed menu.  Menu type:
 * "0" - Suppress the menue display entirely.
 * "1" - Current hex selected and token selected
 * "2" - Current hex selected and tile selected
 * "3" - Current unselected hex has only one token [no tile]
 * "4" - Current unselected hex has mutiple tokens [no tile]
 * "5" - Current unselected hex has only a tile [no token] 
 * "6" - Current unselected hex has a tile and one token
 * "7" - Current unselected hex has a tile and mutiple tokens
 */
function makeMenuItems(e) {
  var menuType = getMenuType(e);
  var menuText;
  switch(menuType)
    {
    case "0":
      menuText = "0";
      break;
    case "1":
      menuText = {
        flip: {
          name: 'Flip Token',
          callback: function(){
            flipToken();
          }
        },
        accept: {
          name: 'Accept Move',
          callback: function(){
            acceptMove();
          }
        },
        reset: {
          name: 'Cancel Move',
          callback: function(){
            trayCanvasApp();
            mainCanvasApp();
            toknCanvasApp();
          }
        },
        close: {
          name: 'Close Menu',
          callback: function(){}
        }
      };
      break;
    case "2":
      menuText = {
        rcw: {
          name: 'Rotate CW',
          callback: function(){
            doit("cw");
          }
        },
        rccw: {
          name: 'Rotate CCW',
          callback: function(){
            doit("ccw");
          }
        },
        accept: {
          name: 'Accept Move',
          callback: function(){
            acceptMove();
          }
        },
        reset: {
          name: 'Cancel Move',
          callback: function(){
            trayCanvasApp();
            mainCanvasApp();
            toknCanvasApp();
          }
        },
        close: {
          name: 'Close Menu',
          callback: function(){}
        }
      };
      break;
    case "3":
      menuText = {
        dtoken: {
          name: 'Delete Token',
          callback: function(){
            deleteToken(BD18.hexList.tokens[0].btindex);
            toknCanvasApp();
            trayCanvasApp();
            updateGmBrdTokens();
            updateDatabase();
          }
        },
//      mtoken: {
//        name: 'Move Token',
//        callback: function(){
//          deleteToken(BD18.hexList.tokens[0].btindex);
//    **** Insert other logic to set up move
//          toknCanvasApp();
//          trayCanvasApp();
//          updateGmBrdTokens();
//          updateDatabase();
//        }
//      },
        close: {
          name: 'Close Menu',
          callback: function(){}
        }
      };
      break;
    case "4":
      menuText = {
        stoken1: {
          name: 'Select Token to Delete',
          callback: function(){
            BD18.tknMenu.funct = 'delete';
            selectToken(e);
          }
        },
//      stoken2: {
//        name: 'Select Token to Move',
//        callback: function(){
//          BD18.tknMenu.funct = 'move';
//          selectToken(e);
//        }
//      },
        close: {
          name: 'Close Menu',
          callback: function(){}
        }
      };
      break;
    case "5":
      menuText = {
        dtile: {
          name: 'Delete Tile',
          callback: function(){
            deleteTile(BD18.hexList.tile.btindex);
            mainCanvasApp();
            trayCanvasApp();
            updateGmBrdTiles();
            updateDatabase();
          }
        },
        close: {
          name: 'Close Menu',
          callback: function(){}
        }
      };
      break;
    case "6":
      menuText = {
        dtile: {
          name: 'Delete Tile',
          callback: function(){
            deleteTile(BD18.hexList.tile.btindex);
            mainCanvasApp();
            trayCanvasApp();
            updateGmBrdTiles();
            updateDatabase();
          }
        },
        dtoken: {
          name: 'Delete Token',
          callback: function(){
            deleteToken(BD18.hexList.tokens[0].btindex);
            toknCanvasApp();
            trayCanvasApp();
            updateGmBrdTokens();
            updateDatabase();
          }
        },
//      mtoken: {
//        name: 'Move Token',
//        callback: function(){
//          deleteToken(BD18.hexList.tokens[0].btindex);
//    **** Insert other logic to set up move
//          toknCanvasApp();
//          trayCanvasApp();
//          updateGmBrdTokens();
//          updateDatabase();
//        }
//      },
        close: {
          name: 'Close Menu',
          callback: function(){}
        }
      };
      break;
    case "7":
      menuText = {
        dtile: {
          name: 'Delete Tile',
          callback: function(){
            deleteTile(BD18.hexList.tile.btindex);
            mainCanvasApp();
            trayCanvasApp();
            updateGmBrdTiles();
            updateDatabase();
          }
        },
        stoken1: {
          name: 'Select Token to Delete',
          callback: function(){
            BD18.tknMenu.funct = 'delete';
            selectToken(e);
          }
        },
//      stoken2: {
//        name: 'Select Token to Move',
//        callback: function(){
//          BD18.tknMenu.funct = 'move';
//          selectToken(e);
//        }
//      },
        close: {
          name: 'Close Menu',
          callback: function(){}
        }
      };
      break;
    default:
      menuText = "0";
      alert("Invalid Menu Type" + mm + ".");
    } 
  return menuText;
}

/* 
 * The makeMenus function registers a dynamic context menu which
 * will be rebuilt every time the menu is to be shown. It will
 * use the makeMenuItems function to include the correct menu 
 * items in the menu to be displayed for a particular event.
 */
function makeMenus() {
  $.contextMenu({
    selector: '#content', 
    trigger: "right",
    build: function($trigger, e) {
      // this callback is executed every time the menu is shown.
      // its results are destroyed every time the menu is hidden.
      // e is the original contextmenu event, 
      // containing e.pageX and e.pageY (amongst other data)
      var items = makeMenuItems(e);
      if (items === "0") return false;
      var opts = {
        determinePosition: function($menu) {
          // .position() is provided as a jQuery UI utility
          // (...and it won't work on hidden elements)
          $menu.css('display', 'block').position({
            my: "right top",
            at: "left bottom",
            of: this,
            offset: "0 5",
            collision: "fit"
          }).css('display', 'none');
        },
        callback: function(key, options) {
          var m = "clicked on " + key + " on element ";
          m =  m + options.$trigger.attr("id");
          alert(m); 
        },
        zIndex: 10,
        reposition: false
      };
      opts.items = items;
      return opts;
    }
  });
}

/* 
 * The hideTknMenu function resets the canvas3 token menu.
 */
function hideTknMenu() {
  var numbtok = BD18.hexList.tokens.length;
  BD18.context3.clearRect(0, 0, numbtok*40, 40);
  $('#canvas3').css({
    opacity: '0',
    top: '-200'
  });
  BD18.tknMenu.timeoutID = 0;
  $('#canvas3').off({
    "click": doTknMenu,
    "mouseout": delayHideTknMenu,
    "mousein": killHideTknMenu,
  });
}

/* 
 * The delayHideTknMenu function waits 2 seconds before
 * calling the hideTknMenu function.
 */
function delayHideTknMenu() {
  BD18.tknMenu.timeoutID = window.setTimeout(hideTknMenu, 2000);
}

/* 
 * The killHideTknMenu function stops any delayed
 * calling of the hideTknMenu function.
 */
function killHideTknMenu() {
  if (BD18.tknMenu.timeoutID) {
    window.clearTimeout(BD18.tknMenu.timeoutID);
  }
}

/* 
 * The doTknMenu function processes a click on canvas3
 * This canvas is used to select one of multiple tokens
 * on the same hex. The requested function is performed
 * for the selected token.
 */
function doTknMenu(event) {
  // find token that was clicked
  var xPix, yPix, index;
  [xPix, yPix] = offsetIn(event, BD18.canvas3); 
  index = Math.floor(xPix/40);
  // do requested function to that token.
  switch(BD18.tknMenu.funct) {
    case "delete":
      deleteToken(BD18.hexList.tokens[index].btindex);
      toknCanvasApp();
      trayCanvasApp();
      updateGmBrdTokens();
      updateDatabase();
      break;
    case "move":
      break;
  }
  hideTknMenu();
}