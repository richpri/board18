/* 
 * This file contains scripts that are common to 
 * all board18 web pages.
 */

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

/* 
 * The findPos function finds the real position of an
 *  element on the page. I got it from this web site:
 *  http://www.quirksmode.org/js/findpos.html
 */
function findPos(obj) {
  var curLeft = 0;
  var curTop = 0;
  do {
    curLeft += obj.offsetLeft;
    curTop += obj.offsetTop;
  } while (obj = obj.offsetParent);
  return [curLeft, curTop];
}

/* 
 * The offsetIn function finds the offset of the
 * cursor [at a click event] from the top/left 
 * of the specified containing object.
 */
function offsetIn(event, obj) {
  var a, b;
  [a, b] = findPos(obj);
  var x = event.pageX - a;
  var y = event.pageY - b;
  return [x, y];
}