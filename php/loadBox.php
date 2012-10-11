<?php
/*
This is a utility to load a row in the MySQL box table.
Input is game box fields.
Output is row in box table of board18 database.
** NOTE: This is a stub program which has no MYSQL DB access yet.
*/

$gameBox = file_get_contents ("../data/testBox.json");
echo $gameBox;
?>