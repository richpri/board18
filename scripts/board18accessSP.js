/* 
 * This file contains a BOARD18 setPage script that haas been 
 * customized for the access-denied.html page.
 *
 * Copyright (c) 2016 Richard E. Price under the The MIT License.
 * A copy of this license can be found in the LICENSE.text file.
 */

/* Function setPage() adjusts the height and width of the
 * restofpage division and modifies the page based on its width.
 */
function setPage()
{
  var winH = $(window).height();
  var winW = $(window).width();
  var devW = winW / window.devicePixelRatio; 
  var shortHead = '<h1 style="color: red">ACCESS DENIED</h1>';
  var longHead = '<h1>BOARD18 - Remote Play Tool For 18xx Style Games</h1>';
  if(devW >= 840) {
    $('#content').show();
    $('#heading').html(longHead);
  } else {
    $('#content').hide();
    $('#heading').html(shortHead);
  }
  $('#restofpage').css('height', winH-90);
  $('#restofpage').css('width', winW);
}

