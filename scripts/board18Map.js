/*jshint forin:true, noarg:true, noempty:true, eqeqeq:true, 
bitwise:true, strict:true, globalstrict:true,
undef:true, latedef:true, curly:true, browser:true, 
indent:4, maxerr:50, newcap:true, white:false */

"use strict";
/* All BD18 global variables are contained in one
   'master variable' called BD18.  This isolates 
   them from global variables in other packages. 
*/
var BD18 = {};
BD18.tileIsSelected = false;
BD18.curIndex = null;
BD18.hexIsSelected = false;
BD18.loadCount = 0;
BD18.trayTypes = [];
BD18.tileSheets = [];
BD18.boardTiles = [];

/* All BD18 functions are defined in this file. 
 * 
 * The loadBox function is a callback function for
 * the gameBox.php getJSON function. It does the 
 * initial game box processing including loading 
 * all the game box images.
 */

function loadBox(data) {
  BD18.gameBox = data;
}
 


