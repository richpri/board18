/*
 * The board18SnapMrk.js file contains all the functions that
 * respond to various onclick events on the stock market in the 
 * SnapMrk page and on the main and tray menues.  But note that 
 * right click events are not used on snapshot displays.
 *
 * Copyright (c) 2015 Richard E. Price under the The MIT License.
 * A copy of this license can be found in the LICENSE.text file.
 */

/* The makeTrayItems function will use the 
 * BD18.trays array to construct the items
 * to be displayed in the tray menu.
 */
function makeTrayItems() {
  var menuText = '<ul class="leftMenu">';
  var lastItem = BD18.trays.length - 1;
  for (var ix = 0; ix < BD18.trays.length; ix++) {
    menuText += '<li onclick="leftMenuEvent(\'tray' + ix + '\');">';
    menuText += BD18.trays[ix].trayName;
    menuText += '</li>';
    menuText += (ix === lastItem) ? '</ul>' : '';
  }
  //var menuItems = $.parseJSON(menuText);
  return menuText;
}

/* The registerTrayMenu function creates the 
 * tray menu on the board18Map page. It uses
 * the jquery context menu plugin and the
 * makeTrayItems function.
 */
function registerTrayMenu() {
  var itemlist = makeTrayItems();
  $('#traymenu').html(itemlist);
}

/* This function handles the selection of the leftMenu(Tray)
 * and displays the proper BD18.tray.
 */
function leftMenuEvent(key) {
      /* Remove any uncompleted moves. */
      if (BD18.hexIsSelected === true) {
        mainCanvasApp();
        toknCanvasApp();
        BD18.hexIsSelected = false;
        BD18.tokenIsSelected = false;
        BD18.tileIsSelected = false;
        BD18.curFlip = false;
      }
      $("#botleftofpage").scrollTop(0);
      var ix = parseInt(key.substring(4));
      BD18.trays[ix].place(null);
      $('.menu').hide();
}

/* 
 * This makeMenus function is a stub to make board18SnapMrk
 * compatable with board18Market2.php
 */
function makeMenus() { };

/* 
 * This delayCheckForUpdate function is a stub to make 
 * board18SnapMrk compatable with board18Market2.php
 */
function delayCheckForUpdate() { };
