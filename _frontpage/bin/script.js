"use strict"
function login(){var n=document.getElementById("accountId").value,e=window.location.pathname,t=e.substring(0,e.lastIndexOf("/"))
window.location.href=t+"/"+n}document.getElementById("accountId").onkeypress=function(n){n||(n=window.event)
var e=n.keyCode||n.which
"13"==e&&login()}
