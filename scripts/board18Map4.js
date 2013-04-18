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

/* The dropToken function places a token at a specified 
 * location on the map board.  It calls the BoardToken
 * constructor function and then updates some global
 * variables to keep track of the new token. Note that
 * this new token has not yet been permanently added to
 * the list of placed tokens in BD18.gm.brdTks. It is 
 * tracked instead in the BD18.tempToken array.
 */
function dropToken(x,y,xI,yI) {
  BD18.tempToken = [BD18.curTrayNumb,BD18.curIndex,false,xI,yI];
  var sn = BD18.tempToken[0];
  var ix = BD18.tempToken[1];
  var flip = BD18.tempToken[2];
  var bx = BD18.tempToken[3];
  var by = BD18.tempToken[4];
  var temp=new BoardToken(sn,ix,flip,bx,by);
  temp.place(0.5); // Semi-transparent
  BD18.curRot = 0;
  BD18.curFlip = false;
  BD18.curHexX = x;
  BD18.curHexY = y;
  BD18.curMapX = xI;
  BD18.curMapY = yI;
  BD18.hexIsSelected = true;
  var messg = "Select 'Menu-Actions-Accept Move' to make ";
  messg += "token placement permanent."
  doLogNote(messg);
}

/* The repositionToken function moves the current token  
 * to a specified new location on the selected tile.  
 * It calls the BoardToken constructor function. 
 * Note that this new token has not yet been
 * permanently added to the list of placed tokens in
 * BD18.gm.brdTks. It is tracked instead in the 
 * BD18.tempToken array.
 */
function repositionToken(xI,yI) {
  BD18.tempToken[3] = xI;
  BD18.tempToken[4] = yI;
  BD18.curMapX = xI;
  BD18.curMapY = yI;
  var sn = BD18.tempToken[0];
  var ix = BD18.tempToken[1];
  var flip = BD18.tempToken[2];
  var bx = BD18.tempToken[3];
  var by = BD18.tempToken[4];
  toknCanvasApp();
  var temp = new BoardToken(sn,ix,flip,xI,yI);
  temp.place(0.5); // Semi-transparent
  var messg = "Select 'Menu-Actions-Accept Move' to make ";
  messg += "token placement permanent."
  doLogNote(messg);
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

/* This function responds to mousedown events on the map canvas.
 * It uses event.witch to determine which mouse button was
 * pressed. If the left or center button was pressed then it
 * calls the hexSelect functon. Otherwise it assumes that the
 * right button was pressed and displays a popup menu.
 */
function mapMouseEvent(event) {
  if (event.which === 0 || event.which === 1) { // Left or Center
      hexSelect(event)
  } else { // Right
  // code popup menu here
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