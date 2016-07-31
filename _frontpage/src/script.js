'use strict';

function login() {
  var accountId = document.getElementById('accountId').value;
  var loc = window.location.pathname;
  var dir = loc.substring(0, loc.lastIndexOf('/'));
  window.location.href = dir + "/" + accountId;
}

document.getElementById('accountId').onkeypress = function(e) {
  if (!e) e = window.event;
  var keyCode = e.keyCode || e.which;
  if (keyCode == '13') {
    login();
  }
}
