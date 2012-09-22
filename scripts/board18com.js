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