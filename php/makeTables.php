<?php
/* 
 * The makeTables.php file is included via "require_once()" into
 * various board18 PHP pages.  It supplies a number of functions
 * for creating the HTML to display various tables on the page.
 * These tables must be displayed on initial creation of these 
 * pages. They cannot be updated later by these functions without
 * reloading the entire page. This file contains these functions:
 * 
 * showBoxes($conn) - create a table of all game boxes in database.
 * showPlayers($conn) - create a table of all players in database.
 * 
 * 
 * The makeTables.php file initializes these variables:
 *
 * $theLink - value returned by mysqli_connect function.
 * $open - set to '' if the database connect succeeded.
 *       - set to 'fail' if the database connect failed.
 * 
 * Copyright (c) 2013 Richard E. Price under the The MIT License.
 * A copy of this license can be found in the LICENSE.text file.
 */

require_once('php/auth.php');
require_once('php/config.php');

$theLink = mysqli_connect(DB_HOST, DB_USER, DB_PASSWORD, DB_DATABASE);
$open = '';
if (!$theLink) {
  error_log('Failed to connect to server: ' . mysqli_connect_error());
  $open = 'fail';
  exit;
}

function showBoxes($conn) {
  global $open;
  $qry = "SELECT box_id, bname, version, author, create_date FROM box";
  $result = mysqli_query($conn, $qry);
  if ($result) {
    if (mysqli_num_rows($result) !== 0) {
      echo "<table border='1'> <tr>
        <th>ID</th> <th>Box Name</th> <th>Version</th>
        <th>Author</th> <th>Date</th> </tr>";
      while ($row = mysqli_fetch_array($result)) {
        echo "<tr class='gbrow'> <td class='gbid'>$row[0]</td> 
          <td>$row[1]</td> <td>$row[2]</td>
          <td>$row[3]</td> <td>$row[4]</td> </tr>";
      }
      echo "</table>";
    } else {
      echo "<p style='color: red'>";
      echo "There are no game boxes in the database</p>";
    }
  } else {
    error_log('Show boxes: select call failed.');
    $open = 'fail';
    exit;
  }
}

function showPlayers($conn) {
  global $open;
  $qry = "SELECT login, firstname, lastname, player_id FROM players";
  $result = mysqli_query($conn, $qry);
  if ($result) {
    if (mysqli_num_rows($result) !== 0) {
      echo "<h3 style='text-indent: 15px'>Players<br></h3>";
      while ($row = mysqli_fetch_array($result)) {
        echo "<p class='plall'><span class='plid'>$row[0]</span>
        <br><span class='plnm'>$row[1] $row[2]</span></p>";
      }
    } else {
      echo "<p style='color: red'>";
      echo "There are no players in the database.</p>";
    }
  } else {
    error_log('Show players: select call failed.');
    $open = 'fail';
    exit;
  }
}
?>
