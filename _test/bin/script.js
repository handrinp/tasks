"use strict"
function loadTasks(){$("#loadingSpinner").css("display","block"),getJSON(function(e,t,s){var n=""
0==e.taskList.length?n+='<div id="cFull" class="tableRow evenRow">No more tasks :)</div>':e.taskList.sort(sortFunction)
for(var a=0;a<e.taskList.length;++a){var o=e.taskList[a],d="",i=""
if(0!=o.due){var u=new Date(o.due),c=new Date,l=new Date(u.getTime()-c.getTime()),r=l.getTime()
if(r/ONE_DAY<2&&(i=" urgent"),r<0)d="LATE"
else if(r/ONE_HOUR<1)d="<1h"
else var d=getTimeString(r)}n+='<div class="tableRow '+oddOrEven(a)+'Row"><div class="c1'+i+'">'+o.subject+'</div><div class="c2'+i+'"><span>'+o.task+'</span></div><div class="c3'+i+'"><span>'+d+'</span></div><div class="c4"><button type="button" class="deleteButton" onclick="deleteTask(\''+o.taskid+"');\">X</button></div></div>"}document.getElementById("tableCells").innerHTML=n,n=""
for(var a=0;a<subjects.length;++a)n+='<option value = "'+subjects[a]+'">'+subjects[a]+"</option>"
document.getElementById("subject").value=subjects[0],document.getElementById("task").value="",document.getElementById("due").value="",document.getElementById("subject").innerHTML=n,document.getElementById("lastRow").className="tableRow "+oddOrEven(e.taskList.length)+"Row",$("#loadingSpinner").css("display","none")})}function addTask(){getJSON(function(e,t,s){var n,a=document.getElementById("due").value
if(""==a)n=0
else{var o=Number(a)
isNaN(o)||(n=(new Date).getTime()+o*ONE_DAY)}var d={subject:document.getElementById("subject").value,task:document.getElementById("task").value,due:n,taskid:"#"+Math.floor(16777215*Math.random()).toString(16)}
e.taskList.push(d),setJSON(JSON.stringify(e),function(e,t,s){loadTasks()})})}function deleteTask(e){getJSON(function(t,s,n){for(var a=[],o=0;o<t.taskList.length;o++)t.taskList[o].taskid!=e&&a.push(t.taskList[o])
setJSON(JSON.stringify({taskList:a}),function(e,t,s){loadTasks()})})}function getJSON(e){$.get(jsonUrl,e)}function setJSON(e,t){$.ajax({url:jsonUrl,type:"PUT",data:e,contentType:"application/json; charset=utf-8",dataType:"json",success:t})}function getTimeString(e){var t="",s=Math.floor(e/ONE_HOUR)%24,n=Math.floor(e/ONE_DAY)%7,a=Math.floor(e/ONE_WEEK)
return a>0&&(t+=a+"w "),n>0&&(t+=n+"d "),s>0&&(t+=s+"h"),t.trim()}function sortFunction(e,t){return e.subject<t.subject?-1:e.subject>t.subject?1:0==e.due?1:0==t.due?-1:e.due>t.due?1:e.due<t.due?-1:0}function oddOrEven(e){return e%2==0?"odd":"even"}function keyPressed(e){e||(e=window.event)
var t=e.keyCode||e.which
"13"==t&&addTask()}var ONE_HOUR=36e5,ONE_DAY=864e5,ONE_WEEK=6048e5,subjects=["Misc","School","Social","Work"],jsonUrl="https://api.myjson.com/bins/3cpmp"
$("document").ready(function(){document.getElementById("task").onkeypress=keyPressed,document.getElementById("due").onkeypress=keyPressed,loadTasks()})
