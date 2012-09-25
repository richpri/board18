<?php
/*
This is the server side code for the AJAX gameSession call.
Input is game session serial number.
Output is JSON game session data.
** NOTE: This is a stub program which has no MYSQL DB access.
** NOTE: It ignores the input and always returns the same data.
*/

$gameSession = file_get_contents ("data/testSession.json");
echo $gameSession;
?>
