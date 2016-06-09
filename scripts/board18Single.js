/* 
 * This file contains scripts that are used by BOARD18 web pages 
 * that are NOT split into leftofpage and rightofpage sections. 
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
  var winName = location.pathname.
          substring(location.pathname.lastIndexOf("/") + 1);
  var shortHead = '<h1>BOARD18</h1>';
  if(winName === "index.html") {
    if(winW >= 790) {
      $('#content').show();
    } else {
      $('#content').hide();
    }
  }
    if(winName === "access-denied.html") {
    if(winW >= 840) {
      $('#content').show();
    } else {
      $('#content').hide();
      var shortHead = '<h1 style="color: red">ACCESS DENIED</h1>';
    }
  }
  if(winW >= 840) {
    $('#heading')
      .html('<h1>BOARD18 - Remote Play Tool For 18xx Style Games</h1>');
  } else {
    $('#heading').html(shortHead);
  }
  $('#restofpage').css('height', winH-90);
  $('#restofpage').css('width', winW);
}

