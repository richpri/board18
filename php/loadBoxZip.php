<?php
/*
 * loadBoxZip.php is the server side code for the AJAX loadBoxZip call.
 * 
 * It validates an input zip file, unzips it and uses its contents
 * to create a game box or to mosify an existing game box. 
 * It returns an initial status after the validation and sends an 
 * email to the author with the status of the game box creation.
 * 
 * Input is: zip file containing game box.
 * 
 * Output is the following stringified JSON data structure. 
 *   {
 *     "stat":"success"||"fail"||"nofile"||"toobig"||"email",
 *     "rpttext":
 *     [
 *       "textline"
 *       "textline"
 *       "textline"
 *        . . . . .
 *     ]
 *   }
 *
 * Copyright (c) 2015 Richard E. Price under the The MIT License.
 * A copy of this license can be found in the LICENSE.text file.
 * 
 */
 
class Response
{
  public $stat;
  public $rpttext;
}

// set up fail return object.
$errorResp = new Response();
$errorResp->stat = "fail";
$errResp = json_encode($errorResp);
/*
require_once('auth.php');
if ($playerlevel != 'admin' && $playerlevel != 'author') {
  error_log("gameGet: Not an admin or author level player");
  echo $errResp;
  exit;
}
 */
require_once('config.php');
require_once('rm_r.php');

$link = @mysqli_connect(DB_HOST, DB_USER, 
        DB_PASSWORD, DB_DATABASE);
if (mysqli_connect_error()) {
  $logMessage = 'MySQL Error 1: ' . mysqli_connect_error();
  error_log($logMessage);
  echo $errResp;
  exit;
}
mysqli_set_charset($link, "utf-8");

// get uploaded file information.
$zfileName = $_FILES["zfile"]["name"]; // The file name
$zfileTmpLoc = $_FILES["zfile"]["tmp_name"];
$zfileType = $_FILES["zfile"]["type"];
$zfileSize = $_FILES["zfile"]["size"];
$zfileErrorMsg = $_FILES["zfile"]["error"];
if (!$zfileTmpLoc) {
  $fileResp = new Response();
  if (!$zfileName) {
    $fileResp->stat = "nofile"; // no zip file [shouldn't happen]
  } else {
    $fileResp->stat = "toobig"; // zip file is too big.
  }
  $fr = json_encode($fileResp);
  echo "$fr";
  exit;
}
$report = new Response();
$report->stat = "success";
$report->rpttext = [];
$report->rpttext[] = "ZIP file was uploaded successfully.";
$report->rpttext[] = "  file name = " . $zfileName;
$report->rpttext[] = "  file type = " . $zfileType;
$report->rpttext[] = "  file size = " . $zfileSize;
$report->rpttext[] = "  file temp = " . $zfileTmpLoc;
$report->rpttext[] = "  ";

// Get file name and test for valid extension [.zip].
$dirAlength = strpos($zfileName,'.zip');
if ($dirAlength) {
  $dirAname = substr($zfileName,0,$dirAlength);
} else { // process error and return
  $report->rpttext[] = "Invalid extension on uploaded file.";
  $report->rpttext[] = "Game box not created.";
  $report->stat = "email";
  $fr = json_encode($report);
  echo "$fr";
  exit;
}

// Unzip the uploaded Zip file.
$zipfile = new ZipArchive;
if (($zipfile->open($zfileTmpLoc . '/' . $zfileName)) &&
    ($zipfile->extractTo('~/uploads/')) &&
    ($zipfile->close())) {
  $report->rpttext[] = "Unzip of uploaded file was successful.";
  $report->rpttext[] = "  Directory structure:";
  $files1 = scandir('~/uploads/');
  foreach ($files1 as $line1) {
    $report->rpttext[] = "    " . $line1;
  }
} else {
  $report->rpttext[] = "Unzip of uploaded file failed.";
  $report->rpttext[] = "Game box not created.";
  $report->stat = "email";
  $fr = json_encode($report);
  echo "$fr";
  exit;
}
  
// Locate control [.json] file and images directory.
$control = '~/uploads/' . $dirAname . '/' . substr($dirAname,8) . '.json';
$images = '~/uploads/' . $dirAname . '/' . substr($dirAname,8);
if ((substr($dirAname,0,6) !== 'BOARD18') || (!file_exists ($control)) || 
    (!file_exists ($images))) {
  $report->rpttext[] = "Unziped file does not have a valid directory structure.";
  $report->rpttext[] = "  control = " . $control;
  $report->rpttext[] = "  images = " . $images;
  $report->rpttext[] = "Game box not created.";
  $report->stat = "email";
  $fr = json_encode($report);
  echo "$fr";
  exit;
}

// Read control file.
$jsonstring = file_get_contents($control);
if (!$jsonstring) {
  $report->rpttext[] = "Open failed on file " . $control . ".";
  $report->rpttext[] = "Game box not created.";
  $report->stat = "email";
  $fr = json_encode($report);
  echo "$fr";
  exit;
}
$decoded = json_decode($jsonstring,TRUE);
$bname = $decoded["bname"];
$ver = $decoded["version"];
$auth = $decoded["author"];
$report->rpttext[] = "Control [.json] file was read successfully.";
$report->rpttext[] = "  box name = " . $bname;
$report->rpttext[] = "  box version = " . $ver;
$report->rpttext[] = "  auther = " . $auth;
$report->rpttext[] = "  ";

// Move image directory.
$imageback = '~/uploads/' . substr($dirAname,7);
$imagedest = $_SERVER['DOCUMENT_ROOT'] . '/image/' . substr($dirAname,7);
if ((file_exists ($imagedest)) && (!copy($imagedest,$imageback)) || 
    (!rename($images,$imagedest))) {
  $report->rpttext[] = "Image directory move failed.";
  $report->rpttext[] = "Game box not created.";
  $report->stat = "email";
  $fr = json_encode($report);
  echo "$fr";
  exit;
}

// Look for box table in database.
$qry1 = "SELECT box_id FROM box 
         WHERE bname = '$bname' AND version = '$ver';"; 
$result1 = mysqli_query($link, $qry1);
if (!$result1) {
  $logMessage = 'MySQL Error 2: ' . mysqli_error($link);
  error_log($logMessage);
  rename($imageback,$imagedest); // Backout image change.
  echo $errResp;
  exit;
}
if (mysqli_num_rows($result1) === 1) { // Game box exists - do update.
  $arr1 = mysqli_fetch_array($result1);
  $boxid = $arr1[0]; // box_id
  $report->rpttext[] = "Game box exists - do update.";
  $report->rpttext[] = "  game box id = " . $boxid;
  $report->rpttext[] = "  ";
  $qry2 = "UPDATE box SET json_text = '$jsonstring' 
     WHERE box_id = '$boxid';";
  $result2 = mysqli_query($link, $qry2);
  if (!$result2) {   // If query failed
    $logMessage = 'MySQL Error 3: ' . mysqli_error($link);
    error_log($logMessage);
    rename($imageback,$imagedest); // Backout image directory change.
    echo $errResp;
    exit;
  }  
  $report->rpttext[] = "Game box successfully updated.";
} else { // Game box does not exists - do insert.
  $report->rpttext[] = "Game box does not exists - do insert.";
  $report->rpttext[] = "  ";
  $qry3 = "INSERT INTO box SET bname = '$bname',version = '$ver',
           author = '$auth',json_text = '$jsonstring';";
  $result3 = mysqli_query($link, $qry3);
  if (!$result3) {   // If query failed
    $logMessage = 'MySQL Error 4: ' . mysqli_error($link);
    error_log($logMessage);
    unlink ($imagedest); // Backout image directory change.
    echo $errResp;
    exit;
  }   
  $qry4 = "UPDATE box SET create_date = activity_date 
           WHERE box_id = LAST_INSERT_ID();";
  $result4 = mysqli_query($link, $qry4);
  if (!$result4) {   // If query failed
    $logMessage = 'MySQL Error 5: ' . mysqli_error($link);
    error_log($logMessage);
    unlink ($imagedest); // Backout image directory change.
    echo $errResp;
    exit;
  }
  $qry5 = "SELECT LAST_INSERT_ID();";
  $result5 = mysqli_query($link, $qry5);
  if (!$result5 || (mysqli_num_rows($result5) !== 1)) {
    $logMessage = 'MySQL Error 6: ' . mysqli_error($link);
    error_log($logMessage);
    unlink ($imagedest); // Backout image directory change.
    echo $errResp;
    exit;
  }
  $arr5 = mysqli_fetch_array($result5);
  $boxid = $arr5[0]; // box_id
  $report->rpttext[] = "Game box successfully created.";
  $report->rpttext[] = "  game box id = " . $boxid;
}
$fr = json_encode($report);
echo "$fr";
rm_r ('~/uploads/' . $dirAname); // Clear out game box directory.
?>