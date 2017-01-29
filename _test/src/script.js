'use strict';

/***************************
 * GLOBAL VARS
 ***************************/

var ONE_HOUR = 3600000;
var ONE_DAY  = 86400000;
var ONE_WEEK = 604800000;
var subjects = ['Misc', 'School', 'Social', 'Work'];
var currentDueValue;
var jsonUrl  = 'https://api.myjson.com/bins/3cpmp';

/***************************
 * INIT FUNCTION
 ***************************/

$('document').ready(function() {
  document.getElementById('task').onkeypress = keyPressed;
  loadTasks();
});

/***************************
 * GUI FUNCTIONS
 ***************************/

function showPopUp() {
  $('#popUnder').css('display', 'block');
  $('#popUp').css('display', 'block');

}

function closePopUp() {
  $('#popUnder').css('display', 'none');
  $('#popUp').css('display', 'none');
}

function submitPopUp() {
  var validated = true;

  validated &= validate('formMonth');
  validated &= validate('formDay');
  validated &= validate('formTime');

  if (validated) {
    var dateString =
        document.getElementById('formMonth').value + " " +
        document.getElementById('formDay').value + ", " +
        document.getElementById('formYear').value + " " +
        document.getElementById('formTime').value;

    var dateObj = new Date(dateString);
    var numDays = (dateObj.getTime() - new Date().getTime()) / ONE_DAY;
    currentDueValue = numDays;
    closePopUp();
  }
}

function validate(formId) {
  var dom = document.getElementById(formId);
  if (dom.value == 0) {
    dom.style.border = '1px solid #f00';
    return false;
  }
  dom.style.border = '';
  return true;
}

/***************************
 * TASK FUNCTIONS
 ***************************/

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
      var timeString = '';
      var urgency = '';

      if (task.due != 0) {
        var dateDue = new Date(task.due);
        var dateNow = new Date();
        var dateDif = new Date(dateDue.getTime() - dateNow.getTime());
        var diff = dateDif.getTime();
        if (diff / ONE_DAY < 2) urgency = ' urgent';

        if (diff < 0) {
          timeString = 'LATE';
        } else if (diff / ONE_HOUR < 1) {
          timeString = '<1h';
        } else {
          var timeString = getTimeString(diff);
        }
      }

      inner +=
          '<div class="tableRow ' + oddOrEven(i) + 'Row">' +
            '<div class="c1' + urgency + '">' + task.subject + '</div>' +
            '<div class="c2' + urgency + '"><span>' + task.task + '</span></div>' +
            '<div class="c3' + urgency + '"><span>' + timeString + '</span></div>' +
            '<div class="c4">' +
              '<button type="button" class="deleteButton" onclick="deleteTask(\'' + task.taskid + '\');">&#x2717;</button>' +
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
    currentDueValue = '';
    document.getElementById('subject').innerHTML = inner;
    document.getElementById('lastRow').className = 'tableRow ' + oddOrEven(obj.taskList.length) + 'Row';
    $('#loadingSpinner').css('display', 'none');
    clearForms();
  });
}

function addTask() {
  getJSON(function(obj, textStatus, jqXHR) {
    var millis;
    var dueValue = currentDueValue;

    if (dueValue == "") {
      millis = 0;
    } else {
      var days = Number(dueValue);

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

/***************************
 * AJAX FUNCTIONS
 ***************************/

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

/***************************
 * HELPER FUNCTIONS
 ***************************/

function clearForms() {
  document.getElementById('formYear').selectedIndex = 0;
  document.getElementById('formMonth').selectedIndex = 0;
  document.getElementById('formDay').selectedIndex = 0;
  document.getElementById('formTime').selectedIndex = 0;
  document.getElementById('subject').selectedIndex = 0;
  document.getElementById('task').value = '';
  currentDueValue = '';
}

function getTimeString(diff) {
  // calculate the hours, days, weeks
  var diffHours = Math.floor(diff / ONE_HOUR) % 24;
  var diffDays  = Math.floor(diff / ONE_DAY) % 7;
  var diffWeeks = Math.floor(diff / ONE_WEEK);

  // build the time string
  var timeString = "";
  if (diffWeeks > 0) timeString += diffWeeks + 'w ';
  if (diffDays > 0) timeString += diffDays + 'd ';
  if (diffHours > 0) timeString += diffHours + 'h';

  // put line breaks in between time units
  return timeString.trim().replace(/ /g, '<br>');
}

function sortFunction(a, b) {
  // different subjects
  if (a.subject < b.subject) return -1;
  if (a.subject > b.subject) return 1;

  // same subject, but low priority
  if (a.due == 0) return 1;
  if (b.due == 0) return -1;

  // same subject, different due dates
  if (a.due > b.due) return 1;
  if (a.due < b.due) return -1;

  // they're pretty much equal
  return 0;
}

function oddOrEven(val) {
  return val % 2 == 0 ? 'odd' : 'even';
}

function keyPressed(e) {
  if (!e) e = window.event;
  var keyCode = e.keyCode || e.which;
  if (keyCode == '13') {
    addTask();
  }
}
