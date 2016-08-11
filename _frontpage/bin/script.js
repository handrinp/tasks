"use strict"
function login(){var n=document.getElementById("accountId").value,t=window.location.pathname,e=t.substring(0,t.lastIndexOf("/"))
window.location.href=e+"/"+n}try{"undefined"!=typeof document.getElementById("accountId")&&(document.getElementById("accountId").onkeypress=function(n){n||(n=window.event)
var t=n.keyCode||n.which
"13"==t&&login()})}catch(n){}try{}catch(n){}