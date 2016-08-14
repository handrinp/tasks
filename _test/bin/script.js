"use strict"
function showPopUp(){$("#popUnder").css("display","block"),$("#popUp").css("display","block")}function closePopUp(){$("#popUnder").css("display","none"),$("#popUp").css("display","none")}function loadTasks(){$("#loadingSpinner").css("display","block"),getJSON(function(e,t,s){var n=""
0==e.taskList.length?n+='<div id="cFull" class="tableRow evenRow">No more tasks :)</div>':e.taskList.sort(sortFunction)
for(var o=0;o<e.taskList.length;++o){var a=e.taskList[o],d="",i=""
if(0!=a.due){var c=new Date(a.due),u=new Date,l=new Date(c.getTime()-u.getTime()),r=l.getTime()
if(r/ONE_DAY<2&&(i=" urgent"),r<0)d="LATE"
else if(r/ONE_HOUR<1)d="<1h"
else var d=getTimeString(r)}n+='<div class="tableRow '+oddOrEven(o)+'Row"><div class="c1'+i+'">'+a.subject+'</div><div class="c2'+i+'"><span>'+a.task+'</span></div><div class="c3'+i+'"><span>'+d+'</span></div><div class="c4"><button type="button" class="deleteButton" onclick="deleteTask(\''+a.taskid+"');\">X</button></div></div>"}document.getElementById("tableCells").innerHTML=n,n=""
for(var o=0;o<subjects.length;++o)n+='<option value = "'+subjects[o]+'">'+subjects[o]+"</option>"
document.getElementById("subject").value=subjects[0],document.getElementById("task").value="",document.getElementById("due").value="",document.getElementById("subject").innerHTML=n,document.getElementById("lastRow").className="tableRow "+oddOrEven(e.taskList.length)+"Row",$("#loadingSpinner").css("display","none")})}function addTask(){getJSON(function(e,t,s){var n,o=document.getElementById("due").value
if(""==o)n=0
else{var a=Number(o)
isNaN(a)||(n=(new Date).getTime()+a*ONE_DAY)}var d={subject:document.getElementById("subject").value,task:document.getElementById("task").value,due:n,taskid:"#"+Math.floor(16777215*Math.random()).toString(16)}
e.taskList.push(d),setJSON(JSON.stringify(e),function(e,t,s){loadTasks()})})}function deleteTask(e){getJSON(function(t,s,n){for(var o=[],a=0;a<t.taskList.length;a++)t.taskList[a].taskid!=e&&o.push(t.taskList[a])
setJSON(JSON.stringify({taskList:o}),function(e,t,s){loadTasks()})})}function getJSON(e){$.get(jsonUrl,e)}function setJSON(e,t){$.ajax({url:jsonUrl,type:"PUT",data:e,contentType:"application/json; charset=utf-8",dataType:"json",success:t})}function getTimeString(e){var t="",s=Math.floor(e/ONE_HOUR)%24,n=Math.floor(e/ONE_DAY)%7,o=Math.floor(e/ONE_WEEK)
return o>0&&(t+=o+"w "),n>0&&(t+=n+"d "),s>0&&(t+=s+"h"),t.trim().replace(/ /g,"<br>")}function sortFunction(e,t){return e.subject<t.subject?-1:e.subject>t.subject?1:0==e.due?1:0==t.due?-1:e.due>t.due?1:e.due<t.due?-1:0}function oddOrEven(e){return e%2==0?"odd":"even"}function keyPressed(e){e||(e=window.event)
var t=e.keyCode||e.which
"13"==t&&addTask()}var ONE_HOUR=36e5,ONE_DAY=864e5,ONE_WEEK=6048e5,subjects=["Misc","School","Social","Work"],jsonUrl="https://api.myjson.com/bins/3cpmp"
$("document").ready(function(){document.getElementById("task").onkeypress=keyPressed,document.getElementById("due").onkeypress=keyPressed,loadTasks()})
