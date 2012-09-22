<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>BOARD18 - Remote Play Tool For 18xx Style Games
    </title>
    <link rel="shortcut icon" href="images/favicon.ico" >
    <link rel="stylesheet" href="style/board18com.css" />
    <link rel="stylesheet" href="style/board18board.css" />
    <script type="text/javascript" src="scripts/jquery.js">
    </script> 
    <script type="text/javascript" src="scripts/board18Map.js">
    </script> 
    <script type="text/javascript">
      $(function(){
        $.getJSON("gameBox.php", "18xx", loadBox)
        .error(function() { 
          var msg = "Error loading game box file. \n";
          msg = msg + "This is probably due to a game box format error.";
          alert(msg); 
        });
        setPage();
        $(window).resize(function() {
          if(this.resizeTO) clearTimeout(this.resizeTO);
          this.resizeTO = setTimeout(function() {
            $(this).trigger('resizeEnd');
          }, 200);
        });
        $(window).bind('resizeEnd', function() { setPage(); });
      })
      
    </script>    
  </head>

  <body>
    <div id="topofpage">
      <div id="logo">
        <img src="images/logo.png" alt="Logo"/> 
      </div>

      <div id="heading">
        <h1>BOARD18 - Remote Play Tool For 18xx Style Games</h1>
      </div>

      <div id="menu">
        <input type="submit" value="Submit"
               onclick="doit('submit')" />
        <input type="submit" value="Reset"
               onclick="doit('reset')"/>
        <input type="submit" value="Add"
               onclick="doit('add')"/>
        <input type="submit" value="CW"
               onclick="doit('cw')"/>
        <input type="submit" value="CCW" 
               onclick="doit('ccw')"/>
        <span id="statusline">  </span>
      </div>
    </div>

    <div id="leftofpage">
      <div id="sidebar">

        <div id="trays">
          <b>Trays</b><br />

          <a href="javascript:;" onclick="BD18.tileSheets[0].place()">
            Yellow #1</a><br />
          <a href="javascript:;" onclick="BD18.tileSheets[1].place()">
            Green #1</a><br />
          <a href="javascript:;" onclick="BD18.tileSheets[2].place()">
            Green #2</a><br />
          <a href="javascript:;" onclick="BD18.tileSheets[3].place()">
            Brown #1</a><br />
          <a href="javascript:;" onclick="BD18.tileSheets[4].place()">
            Grey #1</a><br />
        </div>

        <div id="tiles" onclick="traySelect(event)">
          <canvas id="canvas0" width="120">
            Your browser does not support the HTML 5 Canvas. 
          </canvas>
        </div> 

      </div>
    </div>
    <div id="rightofpage">
      <div id="content" onclick="hexSelect(event)">
        <canvas id="canvas1">
          Your browser does not support the HTML 5 Canvas. 
        </canvas>
        <canvas id="canvas2">
        </canvas>
        <footer>
          This is a nonfunctional mockup.
        </footer>
      </div>        
    </div>
  </div>
</body>
</html>
