"use strict"
function showPopUp(){$("#popUnder").css("display","block"),$("#popUp").css("display","block")}function closePopUp(){$("#popUnder").css("display","none"),$("#popUp").css("display","none")}function submitPopUp(){var e=!0
if(e&=validate("formMonth"),e&=validate("formDay"),e&=validate("formTime")){var t=document.getElementById("formMonth").value+" "+document.getElementById("formDay").value+", "+document.getElementById("formYear").value+" "+document.getElementById("formTime").value,n=new Date(t),s=(n.getTime()-(new Date).getTime())/ONE_DAY
currentDueValue=s,closePopUp()}}function validate(e){var t=document.getElementById(e)
return 0==t.value?(t.style.border="1px solid #f00",!1):(t.style.border="",!0)}function loadTasks(){$("#loadingSpinner").css("display","block"),getJSON(function(e,t,n){var s=""
0==e.taskList.length?s+='<div id="cFull" class="tableRow evenRow">No more tasks :)</div>':e.taskList.sort(sortFunction)
for(var o=0;o<e.taskList.length;++o){var a=e.taskList[o],d="",u=""
if(0!=a.due){var c=new Date(a.due),l=new Date,i=new Date(c.getTime()-l.getTime()),r=i.getTime()
if(r/ONE_DAY<2&&(u=" urgent"),r<0)d="LATE"
else if(r/ONE_HOUR<1)d="<1h"
else var d=getTimeString(r)}s+='<div class="tableRow '+oddOrEven(o)+'Row"><div class="c1'+u+'">'+a.subject+'</div><div class="c2'+u+'"><span>'+a.task+'</span></div><div class="c3'+u+'"><span>'+d+'</span></div><div class="c4"><button type="button" class="deleteButton" onclick="deleteTask(\''+a.taskid+"');\">&#x2717;</button></div></div>"}document.getElementById("tableCells").innerHTML=s,s=""
for(var o=0;o<subjects.length;++o)s+='<option value = "'+subjects[o]+'">'+subjects[o]+"</option>"
document.getElementById("subject").value=subjects[0],document.getElementById("task").value="",currentDueValue="",document.getElementById("subject").innerHTML=s,document.getElementById("lastRow").className="tableRow "+oddOrEven(e.taskList.length)+"Row",$("#loadingSpinner").css("display","none"),clearForms()})}function addTask(){getJSON(function(e,t,n){var s,o=currentDueValue
if(""==o)s=0
else{var a=Number(o)
isNaN(a)||(s=(new Date).getTime()+a*ONE_DAY)}var d={subject:document.getElementById("subject").value,task:document.getElementById("task").value,due:s,taskid:"#"+Math.floor(16777215*Math.random()).toString(16)}
e.taskList.push(d),setJSON(JSON.stringify(e),function(e,t,n){loadTasks()})})}function deleteTask(e){getJSON(function(t,n,s){for(var o=[],a=0;a<t.taskList.length;a++)t.taskList[a].taskid!=e&&o.push(t.taskList[a])
setJSON(JSON.stringify({taskList:o}),function(e,t,n){loadTasks()})})}function getJSON(e){$.get(jsonUrl,e)}function setJSON(e,t){$.ajax({url:jsonUrl,type:"PUT",data:e,contentType:"application/json; charset=utf-8",dataType:"json",success:t})}function clearForms(){document.getElementById("formYear").selectedIndex=0,document.getElementById("formMonth").selectedIndex=0,document.getElementById("formDay").selectedIndex=0,document.getElementById("formTime").selectedIndex=0,document.getElementById("subject").selectedIndex=0,document.getElementById("task").value="",currentDueValue=""}function getTimeString(e){var t=Math.floor(e/ONE_HOUR)%24,n=Math.floor(e/ONE_DAY)%7,s=Math.floor(e/ONE_WEEK),o=""
return s>0&&(o+=s+"w "),n>0&&(o+=n+"d "),t>0&&(o+=t+"h"),o.trim().replace(/ /g,"<br>")}function sortFunction(e,t){return e.subject<t.subject?-1:e.subject>t.subject?1:0==e.due?1:0==t.due?-1:e.due>t.due?1:e.due<t.due?-1:0}function oddOrEven(e){return e%2==0?"odd":"even"}function keyPressed(e){e||(e=window.event)
var t=e.keyCode||e.which
"13"==t&&addTask()}var ONE_HOUR=36e5,ONE_DAY=864e5,ONE_WEEK=6048e5,subjects=["Misc","School","Social","Work"],currentDueValue,jsonUrl="https://api.myjson.com/bins/3cpmp"
$("document").ready(function(){document.getElementById("task").onkeypress=keyPressed,loadTasks()})
