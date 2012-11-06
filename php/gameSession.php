<?php
/*
This is the server side code for the AJAX gameSession call.
Input is the game_id.
Output is JSON game session data.
*/

$gameSession = file_get_contents ("../data/testSession.json");
echo $gameSession;
?>
