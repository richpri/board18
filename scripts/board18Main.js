/* Function logoutOK is the callback function for the ajax
 * lgout call. 
 */
function logoutOK(resp) {
  if(resp == 'success') {
    window.location = "index.html"
  }
  else {
    alert("Logout failed! This should never happen.") 
  } 
}
