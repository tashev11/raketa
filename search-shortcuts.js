(function(){
'use strict';
function editable(el){if(!el)return false;const t=(el.tagName||'').toLowerCase();return t==='input'||t==='textarea'||t==='select'||el.isContentEditable}
function focusSearch(){const input=document.getElementById('rk-herosearch-input');if(!input)return false;input.focus({preventScroll:false});try{input.select()}catch(e){};return true}
function install(){if(window.__RKSearchShortcuts)return;window.__RKSearchShortcuts=true;document.addEventListener('keydown',e=>{
 if((e.ctrlKey||e.metaKey)&&String(e.key).toLowerCase()==='k'){if(focusSearch())e.preventDefault();return}
 if(e.key==='/'&&!e.ctrlKey&&!e.metaKey&&!e.altKey&&!editable(document.activeElement)){if(focusSearch())e.preventDefault()}
});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else install();
})();
