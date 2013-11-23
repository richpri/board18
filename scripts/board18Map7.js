/* 
 * board18Map7.js contains all the functions that
 * implement the keyboard shortcut events.
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
 *    M   Goto Stock Chart
 *    F   Flip Token
 *    R   Rotate Tile Clockwise
 *    E   Rotate Tile Counterclockwise
 */
function setUpKeys() {
  $(document).keydown(function(e){
	  var keycode = (e.keyCode ? e.keyCode : e.which);
    switch(keycode) {
      case 13: // "Enter" keycode
        acceptMove();
        break;
      case 67: // "C" keycode
        trayCanvasApp();
        mainCanvasApp();
        toknCanvasApp();
        break;    
      case 77: // "M" keycode
        window.location = "board18Market.php?dogame=" + BD18.gameID;
        break;
      case 70: // "F" keycode
        if (BD18.hexIsSelected === true && 
            BD18.tokenIsSelected === true){
          flipToken();
        };
        break; 
      case 82: // "R" keycode
        if (BD18.hexIsSelected === true && 
            BD18.tileIsSelected === true){
          rotateTile("cw");
        };
        break; 
      case 69: // "E" keycode
        if (BD18.hexIsSelected === true && 
            BD18.tileIsSelected === true){
          rotateTile("ccw");
        };
        break; 
      default:
    }
    e.preventDefault();
  });
}
