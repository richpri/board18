<?php
/*
This is the server side code for the AJAX gameBox call.
Input is game box name.
Output is JSON game box.
** NOTE: This is a stub program which has no MYSQL DB access.
** NOTE: It ignores the input and always returns the same box.
*/

$gameBox = file_get_contents ("data/testBox.json");
echo $gameBox;
?>

