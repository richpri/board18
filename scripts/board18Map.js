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

/* currently unused BD18 global variables.
BD18.tileIsSelected = false;
BD18.curIndex = null;
BD18.hexIsSelected = false;
BD18.trayTypes = [];
BD18.tileSheets = [];
BD18.boardTiles = [];
*/

/* All BD18 functions are defined in this file. 
 */

/* dummy function */
function canvasApp() {
  alert("canvasApp called");
}

/* This function is an event handler for the game box images.
 * It calls canvasApp after all itemLoaded events have occured.
 */
function itemLoaded(event) {
  BD18.loadCount--;
  if (BD18.doneWithLoad == true && BD18.loadCount <= 0) {
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
  BD18.tsImage = new Array();
  var ttt = sheets.length;
  for(var i=0; i<ttt; i++) {
    BD18.tsImage[i] = new Image();
    BD18.tsImage[i].src = sheets[i].imageLocation;
    BD18.tsImage[i].onload = itemLoaded;
    BD18.loadCount++;
  }
  BD18.doneWithLoad = true;
}
 


