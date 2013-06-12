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
  BD18.boardTiles = [];
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
  BD18.boardTokens = [];
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
 * 
 */
function toknCanvasApp(keepHexSelect){
  BD18.gameBoard.clear2(keepHexSelect);
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
 * Finally it calls the makeMenues function.
 */
function loadBox(box) {
  if (typeof response === "string") { // User has timed out.
    window.location = "access-denied.html";
  } 
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
  makeMenus();    // Register Context Menus
  BD18.doneWithLoad = true;
  itemLoaded(); // Just in case onloads are very fast.
  
}

/* The loadSession function is a callback function for
 * the gameSession.php getJSON function. It finds and
 * loads the game box file.
 */
function loadSession(session) {
  if (typeof response === "string")  { // User has timed out.
    window.location = "access-denied.html";
  } 
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