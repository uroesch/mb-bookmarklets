javascript:(()=>{const a={"Audio track":"number","Musical work title":"name",Position:"number",Musikwerktitel:"name","Traccia audio":"number","Titolo dell'opera musicale":"name","Plage audio":"number","Titre de l'oeuvre musicale":"name",Pusiziun:"number","Titel da l'ovra musicala":"name"};function t(){var e;let t=[],n=null;for(i of document.getElementsByClassName("tbl-detail-tdlft"))if(content=i.parentNode.getElementsByTagName("td"),label=(e=content[0].innerText,a[e]??null),text=content[1].innerText,label)switch(label){case"number":n=null==n?0:n+1,t[n]={number:text};break;case"name":t[n].name=text}return t}{let e=[];switch(window.location.hostname.replace(/.*\.(.*\..*)$/,"$1")){case"cede.ch":e=function(){let e=[];var t;for(t of document.getElementById("player").getElementsByClassName("track"))number=t.getElementsByClassName("tracknumber")[0].textContent,duration=t.getElementsByClassName("duration")[0].textContent,name=t.getElementsByClassName("trackname")[0].firstChild.textContent.replace(/.*-\s+\d+\.\s+/,""),e.push({number:number,name:name,duration:duration});return e}();break;case"exlibris.ch":e=function(){let e=[];for(disc of document.getElementsByClassName("o-tracks")[0].getElementsByTagName("table"))for(var t of disc.getElementsByTagName("tr"))elements=t.getElementsByTagName("td"),first_cell=elements.length-3,number=elements[first_cell].textContent,name=elements[first_cell+1].textContent.replace(/.*-\s+\d+\.\s+/,""),duration=elements[first_cell+2].textContent,e.push({number:number,name:name,duration:duration});return e}();break;case"fonoteca.ch":e=t()}var n=function(e){let t="";return e.forEach(e=>{t+=e.number.trim().replace(/\.$/,"")+". ",t+=e.name.trim()+" ",t+=e.duration||"??:??",t+="\n"}),t}(e);console.log(n);{if(""===n)return;let e=document.createElement("textarea");e.value=n,e.style.top="0",e.style.left="0",e.style.position="fixed",document.body.appendChild(e),e.focus(),e.select()}}})();