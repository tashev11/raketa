(function(){
'use strict';
const RK=window.RKCatalog,C=window.RKBusinessCalculatorCatalog;
if(!RK||!C||!Array.isArray(C.items)||typeof RK.install!=='function')return;

const aliases={
  'зп':'зарплата','сотрудник':'зарплата','работник':'зарплата','оборот':'выручка','дебиторка':'дебиторская задолженность',
  'вайлдберриз':'wildberries','вб':'wildberries','озон':'ozon','маркетплейс':'маркетплейс','ддс':'денежный поток',
  'налоги':'налог','счёт':'счет','заём':'заем','прайс':'цена','стоимость':'цена'
};
function norm(v){return String(v||'').toLowerCase().replace(/ё/g,'е').replace(/[^a-zа-я0-9]+/gi,' ').replace(/\s+/g,' ').trim()}
function terms(q){return norm(q).split(' ').filter(Boolean).map(x=>aliases[x]||x)}
function dist(a,b){
 if(a===b)return 0;if(Math.abs(a.length-b.length)>2)return 3;
 let prev=Array.from({length:b.length+1},(_,i)=>i);
 for(let i=1;i<=a.length;i++){const cur=[i];for(let j=1;j<=b.length;j++)cur[j]=Math.min(cur[j-1]+1,prev[j]+1,prev[j-1]+(a[i-1]===b[j-1]?0:1));prev=cur;}return prev[b.length];
}
function score(item,q){
 const nq=norm(q),title=norm(item.title),hay=norm(item.title+' '+item.category),qs=terms(q),tw=title.split(' ');let s=0;
 if(title===nq)s+=200;if(title.startsWith(nq))s+=110;if(title.includes(nq))s+=70;
 qs.forEach(w=>{if(title.includes(w))s+=26;else if(hay.includes(w))s+=11;else if(w.length>=5&&tw.some(t=>dist(w,t)<=1))s+=13;});
 return s;
}
const prev=RK.install;
RK.install=function(Component){
 prev(Component);
 const proto=Component&&Component.prototype;if(!proto||proto.__rkCalculatorSearchInstalled)return;proto.__rkCalculatorSearchInstalled=true;
 const old=proto.renderVals;
 proto.renderVals=function(){
  const vals=old.call(this),q=String(vals.searchQuery||this.state?.searchQuery||'').trim();if(q.length<2)return vals;
  const matches=C.items.map(x=>({x,s:score(x,q)})).filter(v=>v.s>0).sort((a,b)=>b.s-a.s).slice(0,8);
  if(!matches.length)return vals;
  const extra=matches.map(v=>({kind:'Калькулятор',title:v.x.title,desc:'Бизнес-калькулятор: '+v.x.category,meta:v.x.category+' · работает в браузере',href:'./kalkulyatory/'+v.x.id+'/',templateId:'',toolTab:''}));
  const existing=Array.isArray(vals.searchResults)?vals.searchResults.slice():[],seen=new Set();
  vals.searchResults=existing.concat(extra).filter(r=>{const k=norm((r.kind||'')+'|'+(r.title||'')+'|'+(r.href||''));if(seen.has(k))return false;seen.add(k);return true;}).slice(0,24);
  vals.hasSearchResults=vals.searchResults.length>0;vals.searchNoResults=!vals.hasSearchResults;vals.searchSummaryText=vals.searchResults.length+' результатов';
  return vals;
 };
};
})();
