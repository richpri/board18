/*jshint forin:true, noarg:true, noempty:true, eqeqeq:true, 
bitwise:true, strict:true, globalstrict:true,
undef:true, latedef:true, curly:true, browser:true, 
indent:4, maxerr:50, newcap:true, white:false */

"use strict";
/* All BD18 global variables are contained in one
 * 'master variable' called BD18.  This isolates 
 * them from global variables in other packages. 
 */
var BD18 = {};
BD18.loadCount = 0;
BD18.doneWithLoad = false;
BD18.trays = [];
BD18.curIndex = null;
BD18.tileIsSelected = false;

/* currently unused BD18 global variables.
BD18.hexIsSelected = false;
BD18.boardTiles = [];
*/

/* All BD18 functions are defined in this file. 
 * 
 * Constructor functions.
 * 
 * GameBoard is a constructor function which creates gameBoard objects.
 * These objects fully describe a game board and its use.   
 * The Start and Step attributes are used to locate the hexes on the
 * board for placement of tiles and tokens.
 *  */
function GameBoard(image,board) {
  this.image=image;
  this.height=parseInt(board.imageHeight,10);
  this.width=parseInt(board.imageWidth,10);
  this.xStart=parseInt(board.xStart,10);
  this.xStep=parseInt(board.xStep,10);
  this.yStart=parseInt(board.yStart,10);
  this.yStep=parseInt(board.yStep,10);
  var that = this;
  this.place=function place() {
    BD18.context1.drawImage(image,0,0,height,width); 
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
  this.sheetType="tile";
  this.image=image;
  this.xStart=parseInt(sheet.xStart,10);
  this.xSize=parseInt(sheet.xSize,10);
  this.xStep=parseInt(sheet.xStep,10);
  this.yStart=parseInt(sheet.yStart,10);
  this.ySize=parseInt(sheet.ySize,10);
  this.yStep=parseInt(sheet.yStep,10);
  this.tilesOnSheet=sheet.tiles.length
  this.tileDups=new Array;
  this.tileRots=new Array;
  for(var i=0;i<this.tilesOnSheet;i++) {
    this.tileDups[i]=parseInt(sheet.tiles[i].dups,10);
    this.tileRots[i]=parseInt(sheet.tiles[i].rots,10);
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
    BD18.canvas0.height = a+(this.tilesOnSheet*b); // ???
    for (var i=0;i<this.tilesOnSheet;i++)
      {
      sx = this.xStart+i*this.xStep;
      if (high == i) {
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
  
/* Startup functions */

/* Function makeTrays() initializes all of the tray objects.
 * It calls the TileSheet constructor for each tile sheet.  
 * It calls the TokenSheet constructor for each token sheet.   
 * It also adds the trayNumb to each new tray object.
 * Finally it initializes BD18.curTrayNumb to 0.
 */
function makeTrays() {
  var sheets = new Array;
  var i;
  for (i=0;i<BD18.gameBox.tileSheets.length;i++) {
    sheets[i] = BD18.gameBox.tileSheets[i];
  }
  var images = BD18.tsImages;
  for (i=0;i<sheets.length;i++) {
    BD18.trays[i] = new TileSheet(images[i],sheets[i]);
    BD18.trays[i].trayNumb = i;
    }
  BD18.curTrayNumb = 0;
  }

/*
 * Function tileCanvasApp calls the tileSheet.place() method for the
 * current tile sheet object. This sets up the tile Canvas. If there 
 * is a currently selected tile then that tile will be highlited.
 */

function trayCanvasApp() {
  BD18.trays[BD18.curTrayNumb].place(BD18.curIndex);
}

/* dummy function */
function mainCanvasApp() {
  alert("mainCanvasApp called");
}

/* Function CanvasApp initializes all canvases.
 * It then calls tileCanvasApp and mainCanvasApp.
 */
function canvasApp()
  {
	BD18.canvas0 = document.getElementById('canvas0');
  if (!BD18.canvas0 || !BD18.canvas0.getContext) { return; }
  BD18.context0 = BD18.canvas0.getContext('2d');
  if (!BD18.context0) { return; }
  BD18.canvas1 = document.getElementById('canvas1');
  if (!BD18.canvas1 || !BD18.canvas1.getContext) { return; }
  BD18.context1 = BD18.canvas1.getContext('2d');
  if (!BD18.context1) { return; }
  trayCanvasApp();
  mainCanvasApp();
  }

/* This function is an event handler for the game box images.
 * It calls canvasApp after all itemLoaded events have occured.
 */
function itemLoaded(event) {
  BD18.loadCount--;
  if (BD18.doneWithLoad == true && BD18.loadCount <= 0) {
    makeTrays();
    canvasApp();
  }
}

/* The loadBox function is a callback function for
 * the gameBox.php getJSON function. It loads 
 * all the game box images.
 */

function loadBox(box) {
  BD18.gameBox = null;
  BD18.gameBox = box;
  var board = BD18.gameBox.board;
  var sheets = BD18.gameBox.tileSheets;
  BD18.bdImage = new Image(board.imageWidth,board.imageHeight);
  BD18.bdImage.src = board.imageLocation;
  BD18.bdImage.onload = itemLoaded; 
  BD18.loadCount++ ;
  BD18.tsImages = new Array();
  var ttt = sheets.length;
  for(var i=0; i<ttt; i++) {
    BD18.tsImages[i] = new Image();
    BD18.tsImages[i].src = sheets[i].imageLocation;
    BD18.tsImages[i].onload = itemLoaded;
    BD18.loadCount++;
  }
  BD18.doneWithLoad = true;
}
 


