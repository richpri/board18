/* 
 * The board18Market3 file contains token manipulation functions. 
 * These functions manipulate tokens on the stock market chart.
 */

/* Function logoutOK is the callback function for the ajax
 * lgout call. 
 */
function logoutOK(resp) {
  if (resp === 'success') {
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
  if (resp.indexOf("<!doctype html>") !== -1) { // User has timed out.
    window.location = "access-denied.html";
  }
  var msg;
  if (resp === 'success') {
    msg = BD18.welcomename + ": ";
    msg += "Your move has been successfully updated ";
    msg += "to the server database.";
    $('#lognote').text(msg);
  }
  else if (resp === 'failure') {
    msg = "Your move did not make it to the server database. ";
    msg += "Contact the site administrator about this error.";
    alert(msg);
  }
  else if (resp.substr(0, 9) === 'collision') {
    msg = BD18.welcomename + ": ";
    msg += "Your move has been backed out because ";
    msg += resp.substr(10);
    msg += " updated the database after you read it.";
    $('#lognote').text(msg);
    trayCanvasApp();
    mainCanvasApp();
    tokenCanvasApp();
  }
  else {
    msg = "Invalid return code from updateGame [" + resp + "]. ";
    msg += "Contact the site administrator about this error.";
    alert(msg);
  }
}

/* The dropToken function places a token at a specified 
 * location on the stock market.  It calls the MarketToken
 * constructor function and then updates some global
 * variables to keep track of the new token. Note that
 * this new token has not yet been permanently added to
 * the list of placed tokens in BD18.gm.mktTks. It is 
 * tracked instead in the BD18.tempToken array.
 */
function dropToken(x, y, xI, yI) {
  BD18.tempToken = [BD18.curTrayNumb, BD18.curIndex, false, xI, yI];
  var sn = BD18.tempToken[0];
  var ix = BD18.tempToken[1];
  var flip = BD18.tempToken[2];
  var bx = BD18.tempToken[3];
  var by = BD18.tempToken[4];
  var temp = new MarketToken(sn, ix, flip, bx, by);
  temp.place(0.5); // Semi-transparent
  BD18.curFlip = false;
  BD18.curBoxX = x;
  BD18.curBoxY = y;
  BD18.curMktX = xI;
  BD18.curMktY = yI;
  BD18.boxIsSelected = true;
  var messg = "Select 'Menu-Accept Move' to make ";
  messg += "token placement permanent.";
  doLogNote(messg);
}

/* The repositionToken function moves the current token  
 * to a specified new location on the selected price box.  
 * It calls the MarketToken constructor function. 
 * Note that this new token has not yet been
 * permanently added to the list of placed tokens in
 * BD18.gm.mktTks. It is tracked instead in the 
 * BD18.tempToken array.
 */
function repositionToken(xI, yI) {
  BD18.tempToken[3] = xI;
  BD18.tempToken[4] = yI;
  BD18.curMktX = xI;
  BD18.curMktY = yI;
  var sn = BD18.tempToken[0];
  var ix = BD18.tempToken[1];
  var flip = BD18.tempToken[2];
  var bx = BD18.tempToken[3];
  var by = BD18.tempToken[4];
  toknCanvasApp(true);
  var temp = new MarketToken(sn, ix, flip, xI, yI);
  BD18.curBoxX = temp.hx;
  BD18.curBoxY = temp.hy;
  temp.place(0.5); // Semi-transparent
  var messg = "Select 'Menu-Accept Move' to make ";
  messg += "token placement permanent.";
  doLogNote(messg);
}

/* The flipToken function flips the current token.
 * If flip is disallowed, it does nothing and returns. 
 * Else it calls the MarketToken constructor function. 
 * Note that this flipped token has not yet been
 * permanently added to the list of placed tokens
 * in BD18.gm.mktTks. It is tracked instead in the 
 * BD18.tempToken array.
 */
function flipToken() {
  if (BD18.bx.tray[BD18.curTrayNumb].token[BD18.curIndex].flip === false)
    return;
  BD18.curFlip = !BD18.tempToken[2];
  BD18.tempToken[2] = BD18.curFlip;
  var sn = BD18.tempToken[0];
  var ix = BD18.tempToken[1];
  var flip = BD18.tempToken[2];
  var bx = BD18.tempToken[3];
  var by = BD18.tempToken[4];
  toknCanvasApp();
  var temp = new MarketToken(sn, ix, flip, xI, yI);
  temp.place(0.5); // Semi-transparent
  var messg = "Select 'Menu-Accept Move' to make ";
  messg += "token placement permanent.";
  doLogNote(messg);
}

/* 
 * The deleteToken function deletes a market token object 
 * from the BD18.marketTokens array. The ix parameter is
 * the index of the tile to be deleted. This function
 * returns false if no token is deleted and true otherwise.
 */
function deleteToken(ix) {
  if (BD18.marketTokens.length === 0)
    return false;
  var tix = BD18.marketTokens[ix];
  if (!tix)
    return false;
  delete BD18.marketTokens[ix];
  return true;
}

/* This function uses the contents of the 
 * the BD18.marketTokens array and the
 * MarketToken.togm method to update the
 * BD18.gm.mktTks array.
 */
function updateMarketTokens() {
  BD18.gm.mktTks = [];
  for (var i = 0; i < BD18.marketTokens.length; i++) {
    if (BD18.marketTokens[i]) {
      BD18.gm.mktTks.push(BD18.marketTokens[i].togm());
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


/* This function calls the addToken function if 
 * the market price box is selected and the
 * token is selected. Otherwise it does nothing.
 */
function acceptMove() {
  if (BD18.boxIsSelected === true &&
          BD18.tokenIsSelected === true) {
    addToken();
  }
}

/* This function adds the current board token object 
 * to the BD18.boardTokens array.  
 */
function addToken() {
  var s = BD18.curTrayNumb;
  var n = BD18.curIndex;
  var f = BD18.curFlip;
  var x = BD18.curMktX;
  var y = BD18.curMktY;
  var token = new MarketToken(s, n, f, x, y);
  BD18.marketTokens.push(token);
  BD18.curIndex = null;
  toknCanvasApp();
  trayCanvasApp();
  BD18.boxIsSelected = false;
  BD18.tokenIsSelected = false;
  updateMarketTokens();
  updateDatabase();
}
