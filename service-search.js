(function(){
'use strict';
const RK=window.RKCatalog,SC=window.RKBusinessServices;if(!RK||!SC)return;
const prev=typeof RK.install==='function'?RK.install:null;
RK.install=function(Component){
 if(prev)prev(Component);
 if(!Component||!Component.prototype||Component.prototype.__rkServiceSearchInstalled)return;
 const proto=Component.prototype;proto.__rkServiceSearchInstalled=true;
 const old=proto.renderVals;
 proto.renderVals=function(){
  const vals=old.call(this),q=String(vals.searchQuery||this.state?.searchQuery||'').trim().toLowerCase();
  if(!q)return vals;
  const words=q.split(/\s+/).filter(Boolean);
  const matches=SC.services.map(s=>{
   const cat=SC.categories.find(c=>c.id===s.category);const hay=(s.title+' '+(cat?.title||'')+' '+s.description+' '+(SC.types[s.type]||'')).toLowerCase();
   let score=0;if(s.title.toLowerCase()===q)score+=100;if(s.title.toLowerCase().includes(q))score+=50;words.forEach(w=>{if(s.title.toLowerCase().includes(w))score+=15;else if(hay.includes(w))score+=5});return{s,cat,score};
  }).filter(x=>x.score>0).sort((a,b)=>b.score-a.score).slice(0,8);
  if(!matches.length)return vals;
  const extra=matches.map(x=>({kind:'Сервис',title:x.s.title,desc:x.s.description,meta:(x.cat?.title||'Сервисы')+' · '+(SC.types[x.s.type]||''),href:'./servisy.html',templateId:'',toolTab:''}));
  const existing=Array.isArray(vals.searchResults)?vals.searchResults.slice():[];
  vals.searchResults=existing.concat(extra).slice(0,16);
  vals.hasSearchResults=vals.searchResults.length>0;
  vals.searchNoResults=!vals.hasSearchResults;
  vals.searchSummaryText=vals.searchResults.length+' результатов';
  return vals;
 };
};
})();