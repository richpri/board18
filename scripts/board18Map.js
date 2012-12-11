/*jshint forin:true, noarg:true, noempty:true, eqeqeq:true, 
bitwise:true, strict:true, globalstrict:true,
undef:true, latedef:true, curly:true, browser:true, 
indent:4, maxerr:50, white:false */

"use strict";
/* All BD18 global variables are contained in one
 * 'master variable' called BD18.  This isolates 
 * them from global variables in other packages. 
 */
var BD18 = {};
BD18.loadCount = 0;
BD18.doneWithLoad = false;
BD18.boxID = null;
BD18.boardTiles = [];
BD18.trays = [];
BD18.curTrayNumb = null;
BD18.curIndex = null;
BD18.curRot = 0;
BD18.curFlip = false;
BD18.curHexX = null;
BD18.curHexY = null;
BD18.tileIsSelected = false;
BD18.hexIsSelected = false;

/*  
 * Constructor functions.
 */

/* 
 * GameBoard is a constructor function which creates a gameBoard object.
 * This object fully describes a game board and its use.   
 * The Start and Step attributes are used to locate the hexes on the
 * board for placement of tiles and tokens.
 */
function GameBoard(image,board) {
  this.image=image;
  this.height=parseInt(board.imgHght,10);
  this.width=parseInt(board.imgWdth,10);
  this.xStart=parseInt(board.xStart,10);
  this.xStep=parseInt(board.xStep,10);
  this.yStart=parseInt(board.yStart,10);
  this.yStep=parseInt(board.yStep,10);
  var that = this;
  this.place=function place() {
    BD18.context1.drawImage(image,0,0);
    BD18.hexIsSelected = false;
    BD18.gameBoard = that;
  };
}
  
/* TileSheet is a constructor function which creates tileSheet objects.
 * These objects fully describe a tile sheet and its contents.   
 * The Start, Size and Step attributes are used to locate tiles on the
 * tile sheet.
 *  */
function TileSheet(image,sheet) {
  this.sheetType=sheet.type;
  this.trayName=sheet.tName;
  this.image=image;
  this.xStart=parseInt(sheet.xStart,10);
  this.xSize=parseInt(sheet.xSize,10);
  this.xStep=parseInt(sheet.xStep,10);
  this.yStart=parseInt(sheet.yStart,10);
  this.ySize=parseInt(sheet.ySize,10);
  this.yStep=parseInt(sheet.yStep,10);
  this.tilesOnSheet=sheet.tile.length;
  this.tileDups=[];
  this.tileRots=[];
  for(var i=0;i<this.tilesOnSheet;i++) {
    this.tileDups[i]=parseInt(sheet.tile[i].dups,10);
    this.tileRots[i]=parseInt(sheet.tile[i].rots,10);
  }
  this.place=function place(high) {
    var a = 10;  // This is the tray's Top Margin.
    var b = 120; // This is the tray's Y Step Value.
    var img = this.image;
    var sx;
    var sy = this.yStart;
    var szx = this.xSize;
    var szy = this.ySize;
    BD18.curTrayNumb = this.trayNumb;
    BD18.tileIsSelected = false;
    BD18.canvas0.height = a+(this.tilesOnSheet*b); 
    for (var i=0;i<this.tilesOnSheet;i++)
    {
      sx = this.xStart+i*this.xStep;
      if (high === i) {
        BD18.context0.fillStyle = "red";
        BD18.context0.fillRect(a,b*i,100,116);
        BD18.context0.fillStyle = "black";
      }
      BD18.context0.drawImage(img,sx,sy,szx,szy,a,b*i,100,116);
      BD18.context0.font = "18pt Arial";
      BD18.context0.textBaseline = "top";
      BD18.context0.textAlign = "left";
      BD18.context0.fillText(this.tileDups[i],a,b*i);
      if (this.tileDups[i] === 0) {  
        BD18.context0.fillStyle = "rgba(255,255,255,0.7)";
        BD18.context0.fillRect(a,b*i,100,116);
        BD18.context0.fillStyle = "black";
      }      
    }
  };
}

/* TokenSheet is a constructor function which creates tokenSheet
 * objects. These objects fully describe a token sheet and its    
 * contents. The Start, Size and Step attributes are used to 
 * locate tokens on the token sheet.
 */
function TokenSheet(image,sheet) {
  this.sheetType=sheet.type;
  this.trayName=sheet.tName;
  this.image=image;
  this.xStart=parseInt(sheet.xStart,10);
  this.xSize=parseInt(sheet.xSize,10);
  this.xStep=parseInt(sheet.xStep,10);
  this.yStart=parseInt(sheet.yStart,10);
  this.ySize=parseInt(sheet.ySize,10);
  this.yStep=parseInt(sheet.yStep,10);
  this.tokensOnSheet=sheet.token.length;
  this.tokenDups=[];
  this.tokenFlip=[];
  for(var i=0;i<this.tokensOnSheet;i++) {
    this.tokenDups[i]=parseInt(sheet.token[i].dups,10);
    this.tokenFlip[i]=sheet.token[i].flip;
  }
  this.place=function place(high) {
    var a = 10; // This is the tray's Top Margin.
    var b = 40; // This is the tray's Y Step Value.
    var c = 20; // This is the token padding value.
    var img = this.image;
    var sx = this.xStart;
    var sy;
    var szx = this.xSize;
    var szy = this.ySize;
    BD18.curTrayNumb = this.trayNumb;
    BD18.tileIsSelected = false;
    BD18.canvas0.height = a+(this.tokensOnSheet*b); 
    for (var i=0;i<this.tokensOnSheet;i++)
    {
      sy = this.yStart+i*this.yStep;
      if (high === i) {
        BD18.context0.fillStyle = "red";
        BD18.context0.fillRect(a,b*i,100,116);
        BD18.context0.fillStyle = "black";
      }
      BD18.context0.drawImage(img,sx,sy,szx,szy,a+c,b*i,30,30);
      BD18.context0.font = "18pt Arial";
      BD18.context0.textBaseline = "top";
      BD18.context0.textAlign = "left";
      BD18.context0.fillText(this.tokenDups[i],a,b*i);
      if (this.tokenDups[i] === 0) {  
        BD18.context0.fillStyle = "rgba(255,255,255,0.7)";
        BD18.context0.fillRect(a,b*i,100,116);
        BD18.context0.fillStyle = "black";
      }      
    }
  };
}

/* BoardTile is a constructor function which creates boardTile objects.
 * These objects are used to list the tiles that have been placed on a
 * board. The sheet index and rotation attributes describe the tile.   
 * The bx and by parameters are used to locate the tile on the game 
 * board.
 * */
function BoardTile(snumb,index,rotation,bx,by) {
  this.sheet=BD18.trays[snumb];
  this.index=index;
  this.rotation=rotation;
  this.bx=bx;
  this.by=by;
  this.place=function place() {
    var image = this.sheet.image;
    var sx = this.sheet.xStart+index*this.sheet.xStep;
    var sy = this.sheet.yStart+rotation*this.sheet.yStep;
    var dx = BD18.gameBoard.xStart+BD18.gameBoard.xStep*bx;
    var dy = BD18.gameBoard.yStart+BD18.gameBoard.yStep*by;
    var dxf = dx.toFixed();
    var dyf = dy.toFixed();
    var szx = this.sheet.xSize;
    var szy = this.sheet.ySize;
    BD18.context1.drawImage(image,sx,sy,szx,szy,dxf,dyf,100,116);
  };
}
  
/* Startup functions */

/* Function makeTrays() initializes all of the tray objects.
 * It calls the TileSheet constructor for each tile sheet.  
 * It calls the TokenSheet constructor for each token sheet.   
 * It also adds the trayNumb to each new tray object.
 * Finally it initializes BD18.curTrayNumb to 0 and 
 * BD18.trayCount to the number of tray objects.
 */
function makeTrays() {
  var sheets = BD18.bx.tray;
  var i;
  var images = BD18.tsImages;
  for (i=0;i<sheets.length;i++) {
    if(sheets[i].type === 'tile') {
      BD18.trays[i] = new TileSheet(images[i],sheets[i]);
      BD18.trays[i].trayNumb = i;
    } else if(sheets[i].type === 'btok') {
      BD18.trays[i] = new TokenSheet(images[i],sheets[i]);
      BD18.trays[i].trayNumb = i;
    }
  }
  BD18.curTrayNumb = 0;
  BD18.trayCount = i;
}

/* This function initializes the BD18.boardTiles array.
 * It calls the BoardTile constructor for each tile in 
 * BD18.gm.brdTls array and adds the new object to the
 * BD18.boardTiles array.
 */
function makeBdTileList(){
  if (BD18.gm.brdTls.length === 0) return;
  var tile,sn,ix,rot,bx,by;
  for(var i=0;i<BD18.gm.brdTls.length;i++) {
    sn = BD18.gm.brdTls[i].sheetNumber;
    ix = BD18.gm.brdTls[i].tileNumber;
    rot = BD18.gm.brdTls[i].rotate;
    bx = BD18.gm.brdTls[i].xCoord;
    by = BD18.gm.brdTls[i].yCoord;
    tile = new BoardTile(sn,ix,rot,bx,by);
    BD18.boardTiles.push(tile);
  }
}

/*
 * Function trayCanvasApp dynamically updates 
 * the links for all trays in the "traylist" div. 
 * It then calls the trays.place() method for 
 * the current tile/token sheet object. This sets  
 * up the tray Canvas. If there is a currently 
 * selected item, that item will be highlited.
 */

function trayCanvasApp() {
  for (var i=0;i<BD18.trays.length;i++) {
    $('#traylist p').eq(1+i)
    .text(BD18.trays[i].trayName).addClass("acttray");
  }
  BD18.trays[BD18.curTrayNumb].place(null);
}

/* Function mainCanvasApp calls the gameBoard.place() method.
 * This sets up the main Canvas.  It then places all existing
 * tiles on the game board using the BD18.boardTiles array.
 */
function mainCanvasApp(){
  BD18.gameBoard.place();
  if (BD18.boardTiles.length === 0) {
    return;
  }
  var tile;
  for(var i=0;i<BD18.boardTiles.length;i++) {
    if (!(i in BD18.boardTiles)) {
      continue;
    }
    tile = BD18.boardTiles[i];
    tile.place();
  }
}

/* Function CanvasApp initializes all canvases.
 * It then calls trayCanvasApp and mainCanvasApp.
 */
function canvasApp()
{
  var hh = parseInt(BD18.gameBoard.height, 10);
  var ww = parseInt(BD18.gameBoard.width, 10);
  $('#content').css('height', hh+20); 
  $('#content').css('width', ww);     
  $('#canvas1').attr('height', hh); 
  $('#canvas1').attr('width', ww); 
  $('#canvas2').attr('height', hh); 
  $('#canvas2').attr('width', ww); 
  BD18.canvas0 = document.getElementById('canvas0');
  if (!BD18.canvas0 || !BD18.canvas0.getContext) {
    return;
  }
  BD18.context0 = BD18.canvas0.getContext('2d');
  if (!BD18.context0) {
    return;
  }
  BD18.canvas1 = document.getElementById('canvas1');
  if (!BD18.canvas1 || !BD18.canvas1.getContext) {
    return;
  }
  BD18.context1 = BD18.canvas1.getContext('2d');
  if (!BD18.context1) {
    return;
  }
  trayCanvasApp();
  mainCanvasApp();
}
  
/* Startup Event Handler and Callback Functions.  */

/* This function is an event handler for the game box images.
 * It calls makeTrays, makeBdTileList and canvasApp after all 
 * itemLoaded events have occured.
 */
function itemLoaded(event) {
  BD18.loadCount--;
  if (BD18.doneWithLoad === true && BD18.loadCount <= 0) {
    BD18.gameBoard = new GameBoard(BD18.bdImage,BD18.bx.board);
    makeTrays();
    makeBdTileList();
    canvasApp();
  }
}

/* The loadBox function is a callback function for
 * the gameBox.php getJSON function. It loads 
 * all the game box images. It also initializes
 * the BD18.gm.trayCounts array if it is undefined.
 */
function loadBox(box) {
  BD18.bx = null;
  BD18.bx = box;
  var board = BD18.bx.board;
  var sheets = BD18.bx.tray;
  var boardWidth = parseInt(board.imgWdth,10);
  var boardHeight = parseInt(board.imgHght,10);
  BD18.bdImage = new Image(boardWidth,boardHeight);
  BD18.bdImage.src = board.imgLoc;
  BD18.bdImage.onload = itemLoaded; 
  BD18.loadCount++ ;
  BD18.tsImages = [];
  var ttt = sheets.length;
  for(var i=0; i<ttt; i++) {
    BD18.tsImages[i] = new Image();
    BD18.tsImages[i].src = sheets[i].imgLoc;
    BD18.tsImages[i].onload = itemLoaded;
    BD18.loadCount++;
  }
  if(typeof BD18.gm.trayCounts === 'undefined') { // initialize array
    var ii, jj;
    for(ii=0; ii<ttt; ii++) {
      if(sheets[ii].type === 'tile') {
        for(jj=0; jj<sheets[ii].tile.length; jj++) {
          BD18.gm.trayCounts[ii][jj] = sheets[ii].tile[jj].dups;
        }
      } else if(sheets[ii].type === 'btok') { 
        for(jj=0; jj<sheets[ii].token.length; jj++) {
          BD18.gm.trayCounts[ii][jj] = sheets[ii].token[jj].dups;
        }
      }
    }
  }
  BD18.doneWithLoad = true;
  itemLoaded(); // Just in case onloads are very fast.
}

/* The loadSession function is a callback function for
 * the gameSession.php getJSON function. It finds and
 * loads the game box file.
 */
function loadSession(session) {
  BD18.gm = null;
  BD18.gm = session;
  var boxstring = 'box=';
  boxstring = boxstring + BD18.gm.boxID;
  $.getJSON("php/gameBox.php", boxstring, loadBox)
  .error(function() { 
    var msg = "Error loading game box file. \n";
    msg = msg + "This is probably due to a game box format error.";
    alert(msg); 
  });
}

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
}

/* Tile manipulation functions.
 * These functions manipulate obects on the map board.
 */ 

/* The dropTile function places a tile at a specified 
 * location on the map board.  It calls the BoardTile
 * constructor function and then updates some global
 * variables to keep tract of the new tile. Note that
 * this new tile has not yet been permanently added to
 * the list of placed tiles in BD18.gm.brdTls. It is 
 * tracked instead in the BD18.tempTile array.
 */
function dropTile(xI,yI) {
  mainCanvasApp();
  BD18.tempTile = [BD18.curTrayNumb,BD18.curIndex,0,xI,yI];
  var sn = BD18.tempTile[0];
  var ix = BD18.tempTile[1];
  var rot = BD18.tempTile[2];
  var bx = BD18.tempTile[3];
  var by = BD18.tempTile[4];
  var temp=new BoardTile(sn,ix,rot,bx,by);
  temp.place();
  BD18.curRot = 0;
  BD18.curHexX = xI;
  BD18.curHexY = yI;
  BD18.hexIsSelected = true;
}

/* The rotateTile function replaces the tile at a specified 
 * location on the map board with a rotated version of that
 * tile. The tile it modifies is the one pointed to by 
 * BD18.tempTile.  
 * 
 * This function calls the BoardTile constructor function
 * after modifying the rotation counter in BD18.curRot. 
 */
function rotateTile(dir) {
  var maxrot = BD18.tileSheets[BD18.curTrayNumb]
  .maxrot[BD18.curIndex];
  if (BD18.hexIsSelected === false) return; 
  if(dir === "cw") {
    BD18.curRot += 1;
    if (BD18.curRot >= maxrot) {
      BD18.curRot = 0;
    }
  } else {
    BD18.curRot -= 1;
    if (BD18.curRot < 0) {
      BD18.curRot = maxrot-1;
    }
  }
  mainCanvasApp();
  BD18.tempTile.splice(2,1,BD18.curRot);
  var sn = BD18.tempTile[0];
  var ix = BD18.tempTile[1];
  var rot = BD18.tempTile[2];
  var bx = BD18.tempTile[3];
  var by = BD18.tempTile[4];
  var temp=new BoardTile(sn,ix,rot,bx,by);
  temp.place();
  BD18.hexIsSelected = true;
}

/* This function reduces the available count for  
 * a specific tile or token [item]. These counts 
 * are stored in the BD18.gm.trayCounts array 
 * which is indexed by the sheet number and the 
 * item index. These are the input parameters.
 * This function returns false if no item is
 * available and true otherwise.
 */
function reduceCount(sheet,ind) {
  if (BD18.gm.trayCounts[sheet][ind] === 0) 
    return false;
  BD18.gm.trayCounts[sheet][ind] -= 1;
  return true;
}

/* This function increases the available count for 
 * a specific tile or token [item]. These counts 
 * are stored in the BD18.gm.trayCounts array 
 * which is indexed by the sheet number and the 
 * item index. These are the input parameters.
 */
function increaseCount(sheet,ind) {
  BD18.gm.trayCounts[sheet][ind] += 1;  
}

/* This function deletes the board tile object 
 * from the BD18.boardTiles array.
 * This function returns false if no tile is
 * deleted and true otherwise.
 */
function clearHex(x,y) {
  if (BD18.boardTiles.length === 0) return false;
  var tile;
  for (var i=0;i<BD18.boardTiles.length;i++) {
    if (!(i in BD18.boardTiles)) continue ;
    tile = BD18.boardTiles[i];
    if (tile.bx === x && tile.by === y) {
      increaseCount(tile.sheet.trayNumb,tile.index);
      delete BD18.boardTiles[i];
      return true;
    }
  }
  return false;
}
  
/* This function adds the current board tile object 
 * to the BD18.boardTiles array.  If an object is 
 * already in the hex in question then that existing 
 * object is deleted via the clearHex function.
 * If the tile count for the tile is already 0 then
 * an error has occured.  This should never happen.
 */
function addTile() {
  if (BD18.hexIsSelected === false) return;
  var s=BD18.curTrayNumb;
  var n=BD18.curIndex;
  var r=BD18.curRot;
  var x=BD18.curHexX;
  var y=BD18.curHexY;
  var tile = new BoardTile(s,n,r,x,y);
  var stat = reduceCount(tile.sheet.trayNumb,tile.index);
  if (stat) {
    clearHex(x,y);
    BD18.boardTiles.push(tile);
    BD18.curIndex = null;
    mainCanvasApp();
    tileCanvasApp();
    BD18.hexIsSelected = false;
    BD18.tileIsSelected = false;
  } else {
    alert("ERROR: Tile not available.");
  }
}
  
/*
 * These are functions that respond to various onclick events.
 */

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
    a = 10;  // This is the tray Top Margin.
    b = 35;  // This is the tray Y Step Value.
    c = tray.tokensOnSheet;
  } else {
    return; // Invalid sheet type!!
  }
  [x, y] = offsetIn(event, BD18.canvas0);
  var ind = (y-a)/b;
  var inde = (ind>=c)?c-1:ind; 
  var index = Math.floor((inde<0)?0:inde);
  if (BD18.gm.trayCounts[tray.trayNumb][index] === 0) return;
  BD18.curIndex = index;
  BD18.curRot = 0; // Eliminate any previous rotation.
  BD18.curFlip = false; // Eliminate any previous flip.
  tray.place(index); // Set highlight.
  BD18.tileIsSelected = true;
}