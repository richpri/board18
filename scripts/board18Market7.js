/* 
 * board18Market7.js contains the function that implements the
 * keyboard shortcut events and the functions that implement
 * the call to the checkForUpdate.php routine.
 *
 * Copyright (c) 2013 Richard E. Price under the The MIT License.
 * A copy of this license can be found in the LICENSE.text file.
 */

/* 
 * The setUpKeys function performs all of the bind 
 * operations for the keyboard shortcut events.
 *   KEY  Action
 *  Enter Accept Move
 *    C   Cancel Move
 *    M   Goto Map Board
 *    F   Flip Token
 *    L   Move Left One Box
 *    R   Move Right One Box
 *    U   Move Up One Box
 *    D   Move Down One Box
 */
function setUpKeys() {
  $(document).keydown(function(e){
	  var keycode = (e.keyCode ? e.keyCode : e.which);
    switch(keycode) {
      case 13: // "Enter" keycode
        acceptMove();
        break;
      case 67: // "C" keycode
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
      case 77: // "M" keycode
        window.location = "board18Map.php?dogame=" + BD18.gameID;
        break;
      case 70: // "F" keycode
        if (BD18.boxIsSelected === true && 
            BD18.tokenIsSelected === true){
          flipToken();
        };
        break; 
      case 76: // "L" keycode
        if (BD18.boxIsSelected === true && 
            BD18.tokenIsSelected === true){
          var subX = parseInt(BD18.stockMarket.xStep);
          BD18.curMktX -= subX;
          BD18.tempToken[5] = null;
          BD18.curStack  = null;
          repositionToken(BD18.curMktX,BD18.curMktY);
        };
        break; 
      case 82: // "R" keycode
        if (BD18.boxIsSelected === true && 
            BD18.tokenIsSelected === true){
          var addX = parseInt(BD18.stockMarket.xStep);
          BD18.curMktX += addX;
          BD18.tempToken[5] = null;
          BD18.curStack  = null;
          repositionToken(BD18.curMktX,BD18.curMktY);
        };
        break; 
      case 85: // "U" keycode
        if (BD18.boxIsSelected === true && 
            BD18.tokenIsSelected === true){
          var subY = parseInt(BD18.stockMarket.yStep);
          BD18.curMktY -= subY;
          BD18.tempToken[5] = null;
          BD18.curStack  = null;
          repositionToken(BD18.curMktX,BD18.curMktY);
        };
        break; 
      case 68: // "D" keycode
        if (BD18.boxIsSelected === true && 
            BD18.tokenIsSelected === true){
          var addY = parseInt(BD18.stockMarket.yStep);
          BD18.curMktY += addY;
          BD18.tempToken[5] = null;
          BD18.curStack  = null;
          repositionToken(BD18.curMktX,BD18.curMktY);
        };
        break;  
      default:
    }
    e.preventDefault();
  });
}

/* 
 * The checkForUpdateCallback function is the callback function
 * for the checkForUpdate function. It acts on the status
 * returned by the checkForUpdate.php AJAX call.
 */
function checkForUpdateCallback(resp) {
  if (resp.indexOf("<!doctype html>") !== -1) { // User has timed out.
    window.location = "access-denied.html";
  } 
  var msg;
  if(resp === 'failure') {
    msg = "The page refresh function failed. This should not happen.";
    msg += "Contact the site administrator about this error.";
    alert(msg);
  }
  else if(resp === 'noupdate') {
    resetCheckForUpdate();
  }
  else if(resp === 'updatefound') {
    document.location.reload(true);
  }
  else {
    msg = "Invalid return code from checkForUpdateCallback(resp). ";
    msg += "Contact the site administrator about this error.";
    alert(msg);
  }
}


/* 
 * The checkForUpdate function does an AJAX post call 
 * for checkForUpdate.php passing the gameid.
 */
function checkForUpdate() {
  var outstring = "gameid=" + BD18.gameID;
  $.post("php/checkForUpdate.php", outstring, checkForUpdateCallback);
}

/* 
 * The delayCheckForUpdate function waits 2 minutes before
 * calling the checkForUpdate function.
 */
function delayCheckForUpdate() {
  BD18.checkForUpdateTimeout = 
    window.setTimeout(checkForUpdate, 120000);
}

/* 
 * The resetCheckForUpdate function stops any current
 * setTimeout for the checkForUpdate function and then
 * calls the delayCheckForUpdate function.
 */
function resetCheckForUpdate() {
  if (BD18.checkForUpdateTimeout) {
    window.clearTimeout(BD18.checkForUpdateTimeout);
  }
  delayCheckForUpdate();
}
