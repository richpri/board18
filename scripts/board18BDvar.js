/* 
 * This file initializes the BD18 global variable. 
 * All board18 global variables are contained in
 * this 'master variable'.  This isolates them 
 * from all global variables in other packages.
 * 
 * This file must be the first included board18xxx.js page.
 * BD18.version must be updated for each new release.
 *
 * Copyright (c) 2016 Richard E. Price under the The MIT License.
 * A copy of this license can be found in the LICENSE.text file.
 */

var BD18 = {};
BD18.noteTimeout = null; // Used by doLogNote().
BD18.welcomename = null; // Used by doLogNote().
BD18.help = "http://wiki.board18.org/w/Player%27s_Guide_V2.0";
BD18.version = "2.1.1";