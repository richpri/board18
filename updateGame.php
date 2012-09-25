<?php
/*
This is the server side code for the AJAX updateGame call.
Input is game session data.
Output should be "success".
** NOTE: This is a stub program which has no MYSQL DB access.
** NOTE: It always updates the same file.
*/

$gameSession = $_POST['json'];
if(isset($gameSession)){
 $x = file_put_contents("working/testSession.json", $gameSession);
 
}
?>
