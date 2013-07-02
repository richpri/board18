"use strict";

/* All BD18 global variables are contained in one
 * 'master' object called BD18.  This isolates 
 * them from global variables in other packages. 
 */
BD18.loadCount = 0;
BD18.doneWithLoad = false;
BD18.boxID = null;
BD18.marketTokens = [];
BD18.trays = [];
BD18.curTrayNumb = null;
BD18.curIndex = null;
BD18.curFlip = false;
BD18.curBoxX = null;     
BD18.curBoxY = null;     
BD18.curMktX = null;     
BD18.curMktY = null;     
BD18.tokenIsSelected = false;
BD18.boxIsSelected = false;
BD18.tknMenu = {};
BD18.tknMenu.timeoutID = 0;
BD18.hexList = {};

/*  
 * Constructor functions.
 */

/* 
 * StockMarket is a constructor function which creates a stockMarket
 * object. This object fully describes the stock market and its use.   
 * The Start and Step attributes are used to locate the squares on the
 * market for placement of tokens.
 */
function StockMarket(image,market) {
  this.image=image;
  this.height=parseInt(market.imgHght,10);
  this.width=parseInt(market.imgWdth,10);
  this.xStart=parseInt(market.xStart,10);
  this.xStep=parseInt(market.xStep,10);
  this.yStart=parseInt(market.yStart,10);
  this.yStep=parseInt(market.yStep,10);
  var that = this;
  /*
   * The place function places the stock market on canvas1.
   */
  this.place=function place() {
    BD18.context1.drawImage(image,0,0);
    BD18.hexIsSelected = false;
    BD18.stockMarket = that;
  };
  /*
   * The clear2 function clears all tokens from canvas2.
   * The default value for keepHexSelect is false;
   */
  this.clear2=function clear2(keepHexSelect) {
    BD18.context2.clearRect(0, 0, this.width, this.height);
    BD18.hexIsSelected = (keepHexSelect) ? true : false;
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
    }
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
 // [this.hx, this.hy] = BD18.gameBoard.hexCoord(bx, by);
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
  
/* 
 * OnHex is a constructor function which creates an object 
 * listing all items [tile and tokens] on the hex with the  
 * supplied coordinates. 
 */
function OnHex(hexX, hexY) {
  this.hexX = parseInt(hexX);
  this.hexY = parseInt(hexY);
  this.tile = {};
  this.tokens = [];
  this.isTile = false;
  var item, i;
  if (BD18.boardTiles.length !== 0) {
    for (i=0;i<BD18.boardTiles.length;i++) {
      if (!(i in BD18.boardTiles)) continue ;
      item = BD18.boardTiles[i];
      if (item.bx === hexX && item.by === hexY) {
        this.tile = item;
        this.tile.btindex = i;
        this.isTile = true;
        break;
      }
    }  
  }
  if (BD18.boardTokens.length !== 0) {
    for (i=0;i<BD18.boardTokens.length;i++) {
      if (!(i in BD18.boardTokens)) continue ;
      item = BD18.boardTokens[i];
      if (item.hx === hexX && item.hy === hexY) {
        this.tokens.push(item);
        this.tokens[this.tokens.length-1].btindex = i;
      }
    }
  }
  this.noToken = (this.tokens.length === 0);
  this.oneToken = (this.tokens.length === 1);
  this.manyTokens = (this.tokens.length > 1);
  this.manyItems = (this.manyTokens || 
    (this.isTile && this.oneToken));
}
