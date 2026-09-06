(function(){
'use strict';
const T=window.RKDocumentTaxonomy,pack=window.RKDocumentCorporate17;
if(!T||!Array.isArray(T.items)||!Array.isArray(pack))return;
const ids=new Set(pack.map(x=>x.id));
T.items.forEach(x=>{if(ids.has(x.id)){x.status='ready';x.statusLabel='Готовая основа';}});
T.ready=T.items.filter(x=>x.status==='ready');
T.planned=T.items.filter(x=>x.status!=='ready');
T.readyCount=T.ready.length;
})();