/**
 * jqueryContextMenu - displays a custom context menue when right 
 * clicking an element.  It is dependent on jquery. 
 * 
 * This is a rewrite of version 1.7 of jquery.contextMenu by
 * Jonas Arnklint, http://github.com/arnklint/jquery-contextMenu
 * which was released into the public domain on Jan 14, 2011.
 * 
 * I have removed the code that fixes an IE mouse button bug
 * [BOARD18 is not IE compatable anyway]. I have also removed
 * some other unused options.  I have added code to selectively
 * suppress some menu items based on the return from setMenu.
 *
*/
// Making a local '$' alias of jQuery to support jQuery.noConflict
(function($) {
  jQuery.fn.contextMenu = function ( name, actions, options ) {
    var me = this,
    win = $(window),
    menu = $('<ul id="'+name+'" class="context-menu"></ul>').hide().appendTo('body'),
    activeElement = null, // last clicked element that responds with contextMenu
    hideMenu = function() {
      $('.context-menu:visible').each(function() {
        $(this).trigger("closed");
        $(this).hide();
        $('body').unbind('click', hideMenu);
      });
    },
    default_options = {
      disable_native_context_menu: false, 
// true disables the native contextmenu everywhere you click
      leftClick: false // show menu on left mouse click instead of right
    },
    options = $.extend(default_options, options);

    $(document).bind('contextmenu', function(e) {
      if (options.disable_native_context_menu) {
        e.preventDefault();
      }
      hideMenu();
    });
    
    var menuType = 0; 
    if (options.setMenu) {
      menuType = options.setMenu.call(menu, activeElement);
    }   

    $.each(actions, function(me, itemOptions) {
      if (!itemOptions.typeCode || 
        itemOptions.typeCode.contains(menuType)) {
        var link = '<a href="#">'+me+'</a>';
        if (itemOptions.link) {
          link = itemOptions.link;
        }
        var menuItem = $('<li>' + link + '</li>');
        if (itemOptions.klass) {
          menuItem.attr("class", itemOptions.klass);
        }
        menuItem.appendTo(menu).bind('click', function(e) {
          itemOptions.click(activeElement);
          e.preventDefault();
        });
      }
    });

    var mouseEvent = 'contextmenu click';
    var mouseEventFunc = function(e){
      hideMenu(); // Hide any existing context menus
      
      if (e.button == 2) {
        activeElement = $(this); // set clicked element
        if (options.showMenu) {
          options.showMenu.call(menu, activeElement);
        }
// Bind to the closed event if there is a hideMenu handler specified
        if (options.hideMenu) {
          menu.bind("closed", function() {
            options.hideMenu.call(menu, activeElement);
          });
        }
        menu.css({
          visibility: 'hidden',
          position: 'absolute',
          zIndex: 1000
        });
// include margin so it can be used to offset from page border.
        var mWidth = menu.outerWidth(true),
          mHeight = menu.outerHeight(true),
          xPos = ((e.pageX - win.scrollLeft()) + 
            mWidth < win.width()) ? e.pageX : e.pageX - mWidth,
          yPos = ((e.pageY - win.scrollTop()) + 
            mHeight < win.height()) ? e.pageY : e.pageY - mHeight;
        menu.show(0, function() {
          $('body').bind('click', hideMenu);
        }).css({
          visibility: 'visible',
          top: yPos + 'px',
          left: xPos + 'px',
          zIndex: 1000
        });
        return false;
      }
    }

    if (options.delegateEventTo) {
      return me.on(mouseEvent, options.delegateEventTo, mouseEventFunc)
    } else {
      return me.bind(mouseEvent, mouseEventFunc);
    }
  }
})(jQuery);




