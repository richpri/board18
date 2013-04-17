/*jshint forin:true, noarg:true, noempty:true, eqeqeq:true, 
bitwise:true, strict:true, globalstrict:true,
undef:true, latedef:true, curly:true, browser:true, 
indent:4, maxerr:50, white:false */

"use strict";

BD18.loadCount = 0;
BD18.doneWithLoad = false;
BD18.boxID = null;
BD18.boardTiles = [];
BD18.boardTokens = [];
BD18.trays = [];
BD18.curTrayNumb = null;
BD18.curIndex = null;
BD18.curRot = 0;
BD18.curFlip = false;
BD18.curHexX = null;
BD18.curHexY = null;
BD18.curMapX = null;
BD18.curMapY = null;
BD18.tileIsSelected = false;
BD18.tokenIsSelected = false;
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
  /*
   * The place function places the game board on canvas1.
   */
  this.place=function place() {
    BD18.context1.drawImage(image,0,0);
    BD18.hexIsSelected = false;
    BD18.gameBoard = that;
  };
  /*
   * The clear2 function clears all tokens from canvas2.
   */
  this.clear2=function clear2() {
    BD18.context2.clearRect(0, 0, this.width, this.height);
    BD18.hexIsSelected = false;
  };
  /* This function calculates the board coordinates of the containing
   * map hex given an exact position in pixels on the game board.
   */
  this.hexCoord = function hexCoord(xPix, yPix) {
    var yCent = this.yStart + this.yStep*2/3;
    var yIndex = Math.round(((yPix-yCent)/this.yStep));
    var xCent = this.xStart + this.xStep;
    var xIndex, xCentOdd;
    if (yIndex%2===0) { //if yIndex is even.
      xIndex = Math.round(((xPix-xCent)/this.xStep));
    } else {
      xCentOdd = xCent + this.xStep;
      xIndex = Math.round(((xPix-xCentOdd)/this.xStep))+1;
    }
    var xDiff = xPix-xIndex*this.xStep-xCent;
    if ((xIndex+yIndex)%2===1) { //if not both even or odd.
      if (xDiff>0) {xIndex = xIndex + 1; }
      else { xIndex = xIndex - 1; }
    }
    return [xIndex, yIndex];
  }
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
    BD18.tokenIsSelected = false;
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
      BD18.context0.fillText(BD18.gm.trayCounts[this.trayNumb][i],a,b*i);
      if (BD18.gm.trayCounts[this.trayNumb][i] === 0) {  
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
    BD18.tokenIsSelected = false;
    BD18.canvas0.height = a+(this.tokensOnSheet*b); 
    for (var i=0;i<this.tokensOnSheet;i++)
    {
      sy = this.yStart+i*this.yStep;
      if (high === i) {
        BD18.context0.fillStyle = "red";
        BD18.context0.fillRect(a,b*i,60,30);
        BD18.context0.fillStyle = "black";
      }
      BD18.context0.drawImage(img,sx,sy,szx,szy,a+c,b*i,30,30);
      BD18.context0.font = "18pt Arial";
      BD18.context0.textBaseline = "top";
      BD18.context0.textAlign = "left";
      BD18.context0.fillText(BD18.gm.trayCounts[this.trayNumb][i],a,b*i);
      if (BD18.gm.trayCounts[this.trayNumb][i] === 0) {  
        BD18.context0.fillStyle = "rgba(255,255,255,0.7)";
        BD18.context0.fillRect(a,b*i,60,30);
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
  this.snumb=snumb;
  this.sheet=BD18.trays[snumb];
  this.index=index;
  this.rotation=rotation;
  this.bx=bx;
  this.by=by;
  /*
   * The place function places the tile on the board.
   * The optional tmp parameter should be true if this tile
   * has not been added to the BD18.boardTiles array.
   */  
  this.place=function place(tmp) {
    var temp = typeof tmp !== 'undefined' ? tmp : false;
    var image = this.sheet.image;
    var sx = this.sheet.xStart+index*this.sheet.xStep;
    var sy = this.sheet.yStart+rotation*this.sheet.yStep;
    var dx = BD18.gameBoard.xStart+BD18.gameBoard.xStep*bx;
    var dy = BD18.gameBoard.yStart+BD18.gameBoard.yStep*by;
    var dxf = dx.toFixed();
    var dyf = dy.toFixed();
    var szx = this.sheet.xSize;
    var szy = this.sheet.ySize;
    if (temp) {BD18.context1.globalAlpha = 0.5;}
    BD18.context1.drawImage(image,sx,sy,szx,szy,dxf,dyf,100,116);
    BD18.context1.globalAlpha = 1;
  };
  /*
   * The togm function exports the boardTile as a JSON string.
   */
  this.togm=function togm() {
    var brdTile = {};
    brdTile.sheetNumber = this.snumb;
    brdTile.tileNumber = this.index;
    brdTile.xCoord = this.bx;
    brdTile.yCoord = this.by;
    brdTile.rotate = this.rotation;
    return brdTile;
  };
}

/* BoardToken is a constructor function which creates boardToken
 * objects. These objects are used to list the tokens that have 
 * been placed on the map board. The snumb, sheet, index and flip 
 * parameters describe the token. The bx and by parameters are 
 * used to specify the exact position of the token on the game
 * board. And the hx and hy calculated parameters identify the 
 * game board hex that contains the token.
 * */
function BoardToken(snumb,index,flip,bx,by) {
  this.snumb=snumb;
  this.sheet=BD18.trays[snumb];
  this.index=index;
  this.flip=flip;
  this.bx=bx;
  this.by=by;
  [this.hx, this.hy] = BD18.gameBoard.hexCoord(bx, by);
  /*
   * The place function places the token on the board.
   * The optional alpha parameter should be 1 [if this is
   * a permanent token] or 0.5 [if this is not a permanent 
   * token].  Default is 1.
   */
  this.place=function place(alpha) {
    var ga = typeof alpha !== 'undefined' ? alpha : 1;
    var image = this.sheet.image;
    var sx = this.sheet.xStart + (this.flip?this.sheet.xStep:0);
    var sy = this.sheet.yStart + index*this.sheet.yStep;
    var szx = this.sheet.xSize;
    var szy = this.sheet.ySize;
    var midx = this.bx - 15; // Adjust to center of token.
    var midy = this.by - 15; // Adjust to center of token.
    BD18.context2.globalAlpha = ga;
    BD18.context2.drawImage(image,sx,sy,szx,szy,midx,midy,30,30);
    BD18.context2.globalAlpha = 1;
  };
  /*
   * The togm function exports the boardToken as a JSON string.
   */
  this.togm=function togm() {
    var brdToken = {};
    brdToken.sheetNumber = this.snumb;
    brdToken.tokenNumber = this.index;
    brdToken.xCoord = this.bx;
    brdToken.yCoord = this.by;
    brdToken.flip = this.flip;
    return brdToken;
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

/* This function initializes the BD18.boardTokens array.
 * It calls the BoardToken constructor for each token in 
 * BD18.gm.brdTks array and adds the new object to the
 * BD18.boardTokens array.
 */
function makeBdTokenList(){
  if (BD18.gm.brdTks.length === 0) return;
  var token,sn,ix,flip,bx,by;
  for(var i=0;i<BD18.gm.brdTks.length;i++) {
    sn = BD18.gm.brdTks[i].sheetNumber;
    ix = BD18.gm.brdTks[i].tokenNumber;
    flip = BD18.gm.brdTks[i].flip;
    bx = BD18.gm.brdTks[i].xCoord;
    by = BD18.gm.brdTks[i].yCoord;
    token = new BoardToken(sn,ix,flip,bx,by);
    BD18.boardTokens.push(token);
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

/* Function toknCanvasApp places all existing tokens 
 * on the game board using the BD18.boardTokens array.
 */
function toknCanvasApp(){
  BD18.gameBoard.clear2();
  if (BD18.boardTokens.length === 0) {
    return;
  }
  var token;
  for(var i=0;i<BD18.boardTokens.length;i++) {
    if (!(i in BD18.boardTokens)) {
      continue;
    }
    token = BD18.boardTokens[i];
    token.place();
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
  BD18.canvas2 = document.getElementById('canvas2');
  if (!BD18.canvas2 || !BD18.canvas2.getContext) {
    return;
  }
  BD18.context2 = BD18.canvas2.getContext('2d');
  if (!BD18.context2) {
    return;
  }
  trayCanvasApp();
  mainCanvasApp();
  toknCanvasApp();
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
    makeBdTokenList();
    canvasApp();
  }
}

/* The loadBox function is a callback function for
 * the gameBox.php getJSON function. It loads all
 * the game box images. 
 * It also initializes the BD18.gm.trayCounts  array
 * if it is undefined or empty.
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
  if((typeof BD18.gm.trayCounts === 'undefined') || 
      (BD18.gm.trayCounts.length === 0)) { // initialize array
    var ii, jj;
    BD18.gm.trayCounts = [];
    for(ii=0; ii<ttt; ii++) {
      if(sheets[ii].type === 'tile') {
        BD18.gm.trayCounts[ii] = [];
        for(jj=0; jj<sheets[ii].tile.length; jj++) {
          BD18.gm.trayCounts[ii][jj] = sheets[ii].tile[jj].dups;
        }
      } else if(sheets[ii].type === 'btok') { 
        BD18.gm.trayCounts[ii] = [];
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

/* The fromUpdateGm function is a callback function for
 * the updateGame.php function. It reports on the status
 * returned by the updateGame.php AJAX call.
 */
function fromUpdateGm(resp) {
  var msg;
  if(resp === 'success') {
    msg = BD18.welcomename + ": ";
    msg += "Your move has been successfully updated ";
    msg += "to the server database.";
    $('#lognote').text(msg);
  }
  else if(resp === 'failure') {
    msg = "Your move did not make it to the server database. ";
    msg += "Contact the site administrator about this error.";
    alert(msg);
  }
  else if(resp.substr(0,9) === 'collision') {
    msg = BD18.welcomename + ": ";
    msg += "Your move has been backed out because ";
    msg += resp.substr(10);
    msg += " updated the database after you read it.";
    $('#lognote').text(msg);
    msg = "Your move will be backed out when ";
    msg += "you respond to this alert box.";
    trayCanvasApp();
    mainCanvasApp();
  }
  else {
    msg = "Invalid return code from updateGame ["+resp+"]. ";
    msg += "Contact the site administrator about this error.";
    alert(msg);
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
  temp.place(true);
  BD18.curRot = 0;
  BD18.curHexX = xI;
  BD18.curHexY = yI;
  BD18.hexIsSelected = true;
  var messg = "Select 'Menu-Actions-Accept Move' to make ";
  messg += "tile placement permanent."
  doLogNote(messg);
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
  var maxrot = BD18.bx.tray[BD18.curTrayNumb].
               tile[BD18.curIndex].rots;
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
  temp.place(true);
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

/* This function uses the contents of the 
 * the BD18.boardTiles array and the
 * BoardTile.togm method to update the
 * BD18.gm.brdTls array.
 */
function updateGmBrdTiles() {
  BD18.gm.brdTls = [];
  for (var i=0;i<BD18.boardTiles.length;i++) {
    if (BD18.boardTiles[i]) {
      BD18.gm.brdTls.push(BD18.boardTiles[i].togm());
    }
  }
}

/* This function uses the contents of the 
 * the BD18.boardTokens array and the
 * BoardToken.togm method to update the
 * BD18.gm.brdTks array.
 */
function updateGmBrdTokens() {
  BD18.gm.brdTks = [];
  for (var i=0;i<BD18.boardTokens.length;i++) {
    if (BD18.boardTokens[i]) {
      BD18.gm.brdTks.push(BD18.boardTokens[i].togm());
    }
  }
}

/* This function sends the stringified BD18.gm object
 * to the updateGame.php function via an AJAX call.
 */
function updateDatabase() {
  var jstring = JSON.stringify(BD18.gm);
  var outstring = "json=" + jstring + "&gameid=" + BD18.gameID;
  $.post("php/updateGame.php", outstring, fromUpdateGm);
}
  

/* This function calls the addTile function if the hex
 * is selected and the tile is selected. It calls the
 * addToken function if the hex is selected and the
 * token is selected. Otherwise it does nothing.
 */
function acceptMove() {
  if (BD18.hexIsSelected === false) return;
  if (BD18.tileIsSelected === true) {
    addTile();
    return;
  }
  if (BD18.tokenIsSelected === true) {
    addToken();
    return;
  }
  return;
}

/* This function adds the current board tile object 
 * to the BD18.boardTiles array.  If a tile is 
 * already in the hex in question then that existing 
 * tile is deleted via the clearHex function.
 * If the tile count for the tile is already 0 then
 * an error has occured. This should never happen.
 */
function addTile() {
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
    trayCanvasApp();
    BD18.hexIsSelected = false;
    BD18.tokenIsSelected = false;
    BD18.tileIsSelected = false;
    updateGmBrdTiles();
    updateDatabase();
  } else {
    alert("ERROR: Tile not available.");
  }
}

/* This function adds the current board token object 
 * to the BD18.boardTokens array.  
 * If the token count for the token is already 0 then
 * an error has occured. This should never happen.
 */
function addToken() {
  var s=BD18.curTrayNumb;
  var n=BD18.curIndex;
  var f=BD18.curFlip;
  var x=BD18.curMapX;
  var y=BD18.curMapY;
  var token = new BoardToken(s,n,f,x,y);
  var stat = reduceCount(token.sheet.trayNumb,token.index);
  if (stat) {
    BD18.boardTokens.push(token);
    BD18.curIndex = null;
    toknCanvasApp();
    trayCanvasApp();
    BD18.hexIsSelected = false;
    BD18.tokenIsSelected = false;
    BD18.tileIsSelected = false;
    updateGmBrdTokens();
    updateDatabase();
  } else {
    alert("ERROR: Token not available.");
  }
}

/* This function calculates the board coordinates of a map
 * tile given the raw coordinates of a mouse click event.
 */
function tilePos(event) {
  var xPix, yPix, xIndex, yIndex;
  [xPix, yPix] = offsetIn(event, BD18.canvas1);
  [xIndex, yIndex] = BD18.gameBoard.hexCoord(xPix, yPix);
  return [xIndex, yIndex];
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