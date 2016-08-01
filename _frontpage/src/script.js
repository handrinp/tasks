"use strict";

function login() {
  var n = document.getElementById("accountId").value;
  var e = window.location.pathname;
  var t = e.substring(0, e.lastIndexOf("/"));
  window.location.href = t + "/" + n;
}

document.getElementById("accountId").onkeypress = function(n) {
  if (!n) n = window.event;
  
  var e = n.keyCode || n.which
  "13" == e && login()
}
