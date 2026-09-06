(function(){
'use strict';
const T=window.RKDocumentTaxonomy,pack=window.RKDocumentContracts5;
if(!T||!Array.isArray(T.items)||!Array.isArray(pack))return;
const groupNames={};(T.groups||[]).forEach(g=>groupNames[g.slug]=g.name);
const byId=new Map(T.items.map(x=>[x.id,x]));
pack.forEach(t=>{
  let item=byId.get(t.id);
  if(!item){
    const group=t.id==='paid-education-basic'?'education-docs':'contracts';
    item={id:t.id,title:t.title,group,groupName:groupNames[group]||t.category||'Договоры'};
    T.items.push(item);byId.set(t.id,item);
  }
  item.status='ready';item.statusLabel='Готовая основа';
});
T.ready=T.items.filter(x=>x.status==='ready');
T.planned=T.items.filter(x=>x.status!=='ready');
T.readyCount=T.ready.length;
})();