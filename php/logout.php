<?php
/*
 * Copyright (c) 2013 Richard E. Price under the The MIT License.
 * A copy of this license can be found in the LICENSE.text file.
 */

// Initialize the session.
session_start();

// Unset all of the session variables.
$_SESSION = array();

// Delete the session cookie.
if (ini_get("session.use_cookies")) {
    $params = session_get_cookie_params();
    setcookie(session_name(), '', time() - 42000,
        $params["path"], $params["domain"],
        $params["secure"], $params["httponly"]
    );
}

// And finally, destroy the session.
session_destroy();

echo "success";
?>
