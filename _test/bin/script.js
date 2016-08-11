"use strict"
function loadTasks(){$("#loadingSpinner").css("display","block"),getJSON(function(e,t,s){var n=""
0==e.taskList.length?n+='<div id="cFull" class="tableRow evenRow">No more tasks :)</div>':e.taskList.sort(sortFunction)
for(var a=0;a<e.taskList.length;++a){var o=e.taskList[a],d="",i=""
if(0!=o.due){var u=o.due-(new Date).getTime()
if(u>0){u<2*ONE_DAY&&(i=" urgent")
var c=Math.floor(u/ONE_WEEK)
c>0&&(d+=c+"w ",u-=c*ONE_WEEK)
var l=Math.floor(u/ONE_DAY)
l>0&&(d+=l+"d ",u-=l*ONE_DAY)
var r=Math.floor(u/ONE_HOUR)
r>0?d+=r+"h ":d="<1h"}else i=" urgent",d="LATE"}n+='<div class="tableRow '+oddOrEven(a)+'Row"><div class="c1'+i+'">'+o.subject+'</div><div class="c2'+i+'"><span>'+o.task+'</span></div><div class="c3'+i+'"><span>'+d.trim()+'</span></div><div class="c4"><button type="button" class="deleteButton" onclick="deleteTask(\''+o.taskid+"');\">X</button></div></div>"}document.getElementById("tableCells").innerHTML=n,n=""
for(var a=0;a<subjects.length;++a)n+='<option value = "'+subjects[a]+'">'+subjects[a]+"</option>"
document.getElementById("subject").value=subjects[0],document.getElementById("task").value="",document.getElementById("daysLeft").value="",document.getElementById("subject").innerHTML=n,document.getElementById("lastRow").className="tableRow "+oddOrEven(e.taskList.length)+"Row",$("#loadingSpinner").css("display","none")})}function addTask(){getJSON(function(e,t,s){var n,a=document.getElementById("daysLeft").value
if(""==a)n=0
else{var o=Number(a)
isNaN(o)||(n=(new Date).getTime()+o*ONE_DAY)}var d={subject:document.getElementById("subject").value,task:document.getElementById("task").value,due:n,taskid:"#"+Math.floor(16777215*Math.random()).toString(16)}
e.taskList.push(d),setJSON(JSON.stringify(e),function(e,t,s){loadTasks()})})}function deleteTask(e){getJSON(function(t,s,n){for(var a=[],o=0;o<t.taskList.length;o++)t.taskList[o].taskid!=e&&a.push(t.taskList[o])
setJSON(JSON.stringify({taskList:a}),function(e,t,s){loadTasks()})})}function getJSON(e){$.get(jsonUrl,e)}function setJSON(e,t){$.ajax({url:jsonUrl,type:"PUT",data:e,contentType:"application/json; charset=utf-8",dataType:"json",success:t})}function sortFunction(e,t){return e.subject<t.subject?-1:e.subject>t.subject?1:0==e.due?1:0==t.due?-1:e.due>t.due?1:e.due<t.due?-1:0}function oddOrEven(e){return e%2==0?"odd":"even"}function keyPressed(e){e||(e=window.event)
var t=e.keyCode||e.which
"13"==t&&addTask()}var ONE_WEEK=6048e5,ONE_DAY=864e5,ONE_HOUR=36e5,ONE_MINUTE=6e4,subjects=["Misc","School","Social","Work"],jsonUrl="https://api.myjson.com/bins/3cpmp"
document.getElementById("task").onkeypress=keyPressed,document.getElementById("daysLeft").onkeypress=keyPressed,$("document").ready(function(){loadTasks()})
