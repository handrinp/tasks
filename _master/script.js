'use strict';

var ONE_DAY = 86400000;
var subjects = [__0__];
var jsonUrl = 'https://api.myjson.com/bins/__1__';

function loadTasks() {
  $('#loadingSpinner').css('display', 'block');
  
  getJSON(function(obj, textStatus, jqXHR) {
    var inner = '';

    if (obj.taskList.length == 0) {
      inner += '<div id="cFull" class="tableRow evenRow">No more tasks :)</div>';
    } else {
      obj.taskList.sort(sortFunction);
    }

    for (var i = 0; i < obj.taskList.length; ++i) {
      var task = obj.taskList[i];
      var daysLeft = "";
      var urgency = "";
      
      if (task.due != 0) {
        var numDays = Math.ceil((task.due - new Date().getTime()) / ONE_DAY * 10)/10;
        numDays = Math.max(numDays, 0);
        
        if (numDays < 3) urgency = " urgent";
        
        daysLeft = numDays.toString();
      }
      
      inner +=
          '<div class="tableRow ' + oddOrEven(i) + 'Row">' +
            '<div class="c1' + urgency + '">' + task.subject + '</div>' +
            '<div class="c2' + urgency + '"><span>' + task.task + '</span></div>' +
            '<div class="c3' + urgency + '">' + daysLeft + '</div>' +
            '<div class="c4">' +
              '<button type="button" class="deleteButton" onclick="deleteTask(\'' + task.taskid + '\');">X</button>' +
            '</div>' +
          '</div>';
    }
    
    document.getElementById('tableCells').innerHTML = inner;
    inner = '';
    
    for (var i = 0; i < subjects.length; ++i) {
      inner +=
          '<option value = "' + subjects[i] + '">' + subjects[i] + '</option>';
    }
    
    document.getElementById('subject').value = subjects[0];
    document.getElementById('task').value = '';
    document.getElementById('daysLeft').value = '';
    document.getElementById('subject').innerHTML = inner;
    document.getElementById('lastRow').className = 'tableRow ' + oddOrEven(obj.taskList.length) + 'Row';
    $('#loadingSpinner').css('display', 'none');
  });
}

function addTask() {
  getJSON(function(obj, textStatus, jqXHR) {
    var millis;
    var daysLeft = document.getElementById('daysLeft').value;
    
    if (daysLeft == "") {
      millis = 0;
    } else {
      var days = Number(daysLeft);

      if (!isNaN(days)) {
        millis = new Date().getTime() + days * ONE_DAY;
      } 
    }

    var newObj = {
      subject : document.getElementById('subject').value,
      task : document.getElementById('task').value,
      due : millis,
      taskid : '#' + Math.floor(Math.random() * 16777215).toString(16)
    };
    
    obj.taskList.push(newObj);
    
    setJSON(JSON.stringify(obj), function(data, textStatus, jqXHR) {
      loadTasks();
    });
  });
}

function deleteTask(taskid) {
  getJSON(function(obj, textStatus, jqXHR) {
    var tl = [];

    for (var i = 0; i < obj.taskList.length; i++) {
      if (obj.taskList[i].taskid != taskid) {
        tl.push(obj.taskList[i]);
      }
    }
    
    setJSON(JSON.stringify({taskList : tl}), function(data, textStatus, jqXHR) {
      loadTasks();
    });
  });
}

function getJSON(innerFunc) {
  $.get(jsonUrl, innerFunc);
}

function setJSON(dataString, innerFunc) {
  $.ajax({
    url: jsonUrl,
    type: 'PUT',
    data: dataString,
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success: innerFunc
  });
}

function sortFunction(a, b) {
  if (a.due == 0) {
    return 1;
  }
  
  if (b.due == 0) {
    return -1;
  }
  
  if (a.due > b.due) {
    return 1;
  }
  
  if (a.due < b.due) {
    return -1;
  }
  
  return 0;
}

function oddOrEven(val) {
  return val % 2 == 0 ? 'odd' : 'even';
}

document.getElementById('task').onkeypress = keyPressed;
document.getElementById('daysLeft').onkeypress = keyPressed;

function keyPressed(e) {
  if (!e) e = window.event;
  var keyCode = e.keyCode || e.which;
  if (keyCode == '13') {
    addTask();
  }
}

$('document').ready(function() {
  loadTasks();
});
