/* 
 * This file contains a BOARD18 setPage script that haas been 
 * customized for the index.html page.
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
  var shortHead = '<h1>BOARD18</h1>';
  var longHead = '<h1>BOARD18 - Remote Play Tool For 18xx Style Games</h1>';
  if(devW >= 790) {
    $('#content').show();
  } else {
    $('#content').hide();
  }
  if(devW >= 840) {
    $('#heading').html(longHead);
  } else {
    $('#heading').html(shortHead);
  }
  $('#restofpage').css('height', winH-90);
  $('#restofpage').css('width', winW);
}

