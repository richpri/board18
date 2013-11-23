/* 
 * This file contains scripts that are common to 
 * all board18 web pages.
 *
 * Copyright (c) 2013 Richard E. Price under the The MIT License.
 * A copy of this license can be found in the LICENSE.text file.
 */

/* All board18 global variables are contained in one
 * 'master variable' called BD18.  This isolates 
 * them from global variables in other packages. 
 */
var BD18 = {};
BD18.noteTimeout = null; // Used by doLogNote().
BD18.welcomename = null; // Used by doLogNote().

/* Function setPage() adjusts the height and width
 * of rightofpage and the height of lefttofpage.
 */
function setPage()
{
  var winH = $(window).height();
  var winW = $(window).width();
  $('#rightofpage').css('height', winH-90);
  $('#rightofpage').css('width', winW-135);
  $('#leftofpage').css('height', winH-90);
}

/* Function resize() waits for 200 ms before
 * executing setPage. Multiple window resize  
 * events that occur within this time peroid 
 * will only trigger the setPage function once.
 */  
$(window).resize(function() 
{
  if(this.resizeTO) clearTimeout(this.resizeTO);
  this.resizeTO = setTimeout(function() 
  {
    $(this).trigger('resizeEnd');
  }, 200);
});
$(window).bind('resizeEnd', function() {
  setPage();
});

/* Initial page resizing. */
$(function(){
  setPage();  
});

/* 
 * Utility Functions 
 */


/* The findPos, getScrolled and getOffset functions 
 * calculate the real position of an element on the
 * page adjusted for scrolling. I got them from this 
 * web site: http://help.dottoro.com/ljnvukbb.php
 */
function getOffset (object, offset) {
  if (!object) {return;}
  offset.x += object.offsetLeft;
  offset.y += object.offsetTop;
  getOffset (object.offsetParent, offset);
}

function getScrolled (object, scrolled) {
  if (!object) {return;}
  scrolled.x += object.scrollLeft;
  scrolled.y += object.scrollTop;
  if (object.tagName.toLowerCase () !== "html") {
    getScrolled (object.parentNode, scrolled);
  }
}

function findPos(obj) {
  var offset = {x : 0, y : 0};
  getOffset (obj, offset);
  var scrolled = {x : 0, y : 0};
  getScrolled (obj.parentNode, scrolled);
  var posX = offset.x - scrolled.x;
  var posY = offset.y - scrolled.y;
  return [posX, posY];
}

/* The offsetIn function finds the offset of the
 * cursor [at a click event] from the top/left
 * of the specified containing object. It uses 
 * findPos() to calculate the object's top/left.
 */
function offsetIn(event, obj) {
  var a, b;
// [a, b] = findPos(obj);
  var tArray = findPos(obj);
  a = tArray[0];
  b = tArray[1];
  var x = event.pageX - a;
  var y = event.pageY - b;
  return [x, y];
}

/* Function doLogNote displays a lognote for 30 seconds.
 * A new lognote will replace any previous log note 
 * that has not yet timed out. BD18.noteTimeout is a
 * global variable with an initial value of null.
 */
function doLogNote(note) {
  if(BD18.noteTimeout !== null) {
    clearTimeout(BD18.noteTimeout);
  }
  var msg = BD18.welcomename + ": " + note;
  $('#lognote').text(msg);
  BD18.noteTimeout = setTimeout(function() {
    $('#lognote').text("");
    BD18.noteTimeout = null;
  },"20000");
}