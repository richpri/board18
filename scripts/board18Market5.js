/*
 * The board18Map5.js file contains all the right-click logic.
 * A right click event on the game board in the Map page can 
 * cause a context menu to be displayed. Whether this menu is 
 * displayed at all and the selection of items in this menu 
 * are both dependant on the context of the event. 
 */

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
        mtoken: {
          name: 'Move Token',
          callback: function(){
            var ix = BD18.hexList.tokens[0].btindex;
            var bdtok = BD18.boardTokens[ix];
            BD18.tempToken = [bdtok.snumb,bdtok.index,
            bdtok.flip,bdtok.bx,bdtok.by];
            BD18.hexIsSelected = true;
            BD18.tokenIsSelected = true;
            BD18.curTrayNumb = bdtok.snumb;
            BD18.curIndex = bdtok.index;
            BD18.curRot = 0;
            BD18.curFlip = bdtok.flip;
            BD18.curBoxX = bdtok.hx;
            BD18.curBoxY = bdtok.hy;
            BD18.curMktX = bdtok.bx;
            BD18.curMktY = bdtok.by;
            deleteToken(ix);
            repositionToken(BD18.curMktX,BD18.curMktY);
          }
        },
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
        stoken2: {
          name: 'Select Token to Move',
          callback: function(){
            BD18.tknMenu.funct = 'move';
            selectToken(e);
          }
        },
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
        mtoken: {
          name: 'Move Token',
          callback: function(){
            var ix = BD18.hexList.tokens[0].btindex;
            var bdtok = BD18.boardTokens[ix];
            BD18.tempToken = [bdtok.snumb,bdtok.index,
            bdtok.flip,bdtok.bx,bdtok.by];
            BD18.hexIsSelected = true;
            BD18.tokenIsSelected = true;
            BD18.curTrayNumb = bdtok.snumb
            BD18.curIndex = bdtok.index
            BD18.curRot = 0;
            BD18.curFlip = bdtok.flip;
            BD18.curBoxX = bdtok.hx;
            BD18.curBoxY = bdtok.hy;
            BD18.curMktX = bdtok.bx;
            BD18.curMktY = bdtok.by;
            deleteToken(ix);
            repositionToken(BD18.curMktX,BD18.curMktY);
          }
        },
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
        stoken2: {
          name: 'Select Token to Move',
          callback: function(){
            BD18.tknMenu.funct = 'move';
            selectToken(e);
          }
        },
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
            my: "right",
            at: "left",
            of: this,
            collision: "flip"
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
