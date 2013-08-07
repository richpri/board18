/*
 * The board18Market5.js file contains all the right-click logic.
 * A right click event on the stock chart in the Market page can 
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
 * "1" - Current box selected and token selected
 * "3" - Current unselected box has only one token 
 * "4" - Current unselected box has mutiple tokens 
 */
function getMenuType(event) {
  var type = "0";
  if (BD18.boxIsSelected === true) { 
    if (BD18.tokenIsSelected === true) type = "1";
  } else { 
    var boxX, boxY;
//   [boxX, boxY] = boxPos(event);
    var tArray = boxPos(event);
    boxX = tArray[0];
    boxY = tArray[1];
    BD18.onBoxList = new OnBox(boxX, boxY);
    BD18.onBoxList.stackNorm();
    if (BD18.onBoxList.oneToken) type = "3";
    if (BD18.onBoxList.manyTokens) type = "4";
  }
  return type;
}

/* 
 * The makeMenuItems function will use the getMenuType
 * function to determine which menu items it will
 * include in the currently displayed menu.  Menu type:
 * "0" - Suppress the menue display entirely.
 * "1" - Current box selected and token selected
 * "3" - Current unselected box has only one token 
 * "4" - Current unselected box has mutiple tokens 
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
            BD18.boxIsSelected = false;
            BD18.tokenIsSelected = false;
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
            deleteToken(BD18.onBoxList.tokens[0].mtindex);
            updateMarketTokens();
            toknCanvasApp();
            trayCanvasApp();
            updateDatabase();
            BD18.boxIsSelected = false;
            BD18.tokenIsSelected = false;
          }
        },
        adjtoken: {
          name: 'Adjust Token in Box',
          callback: function(){
            var ix = BD18.onBoxList.tokens[0].mtindex;
            var smtok = BD18.marketTokens[ix];
            moveSetup(smtok);
            BD18.curMktX = smtok.bx;
            BD18.curMktY = smtok.by;
            deleteToken(ix);
            repositionToken(BD18.curMktX,BD18.curMktY);
          }
        },
        mutoken: {
          name: 'Move Token Up',
          callback: function(){
            var ix = BD18.onBoxList.tokens[0].mtindex;
            var addY = parseInt(BD18.stockMarket.yStep);
            var smtok = BD18.marketTokens[ix];
            smtok.stack = null;
            moveSetup(smtok);
            BD18.curMktX = smtok.bx;
            BD18.curMktY = smtok.by-addY;
            deleteToken(ix);
            repositionToken(BD18.curMktX,BD18.curMktY);
          }
        },
        mltoken: {
          name: 'Move Token Left',
          callback: function(){
            var ix = BD18.onBoxList.tokens[0].mtindex;
            var addX = parseInt(BD18.stockMarket.xStep);
            var smtok = BD18.marketTokens[ix];
            smtok.stack = null;
            moveSetup(smtok);
            BD18.curMktX = smtok.bx-addX;
            BD18.curMktY = smtok.by;
            deleteToken(ix);
            repositionToken(BD18.curMktX,BD18.curMktY);
          }
        },
        mdtoken: {
          name: 'Move Token Down',
          callback: function(){
            var ix = BD18.onBoxList.tokens[0].mtindex;
            var addY = parseInt(BD18.stockMarket.yStep);
            var smtok = BD18.marketTokens[ix];
            smtok.stack = null;
            moveSetup(smtok);
            BD18.curMktX = smtok.bx;
            BD18.curMktY = smtok.by+addY;
            deleteToken(ix);
            repositionToken(BD18.curMktX,BD18.curMktY);
          }
        },
        mrtoken: {
          name: 'Move Token Right',
          callback: function(){
            var ix = BD18.onBoxList.tokens[0].mtindex;
            var addX = parseInt(BD18.stockMarket.xStep);
            var smtok = BD18.marketTokens[ix];
            smtok.stack = null;
            moveSetup(smtok);
            BD18.curMktX = smtok.bx+addX;
            BD18.curMktY = smtok.by;
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
          name: 'Select Token to Adjust in Box',
          callback: function(){
            BD18.tknMenu.funct = 'adjust';
            selectToken(e);
          }
        },
        stoken3: {
          name: 'Select Token to Move Up',
          callback: function(){
            BD18.tknMenu.funct = 'up';
            selectToken(e);
          }
        },
        stoken4: {
          name: 'Select Token to Move Right',
          callback: function(){
            BD18.tknMenu.funct = 'right';
            selectToken(e);
          }
        },
        stoken5: {
          name: 'Select Token to Move Down',
          callback: function(){
            BD18.tknMenu.funct = 'down';
            selectToken(e);
          }
        },
        stoken6: {
          name: 'Select Token to Move Left',
          callback: function(){
            BD18.tknMenu.funct = 'left';
            selectToken(e);
          }
        }, 
        stoken7: {
          name: 'Select Token to Put on Top',
          callback: function(){
            BD18.tknMenu.funct = 'top';
            selectToken(e);
          }
        }, 
        stoken8: {
          name: 'Select Token to Put on Bottom',
          callback: function(){
            BD18.tknMenu.funct = 'bottom';
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
