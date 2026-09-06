(function(){
'use strict';
const T=window.RKDocumentTaxonomy,B=window.RKDocumentIndustry23;if(!T||!Array.isArray(T.items)||!Array.isArray(B))return;
const ready=new Set(B.map(x=>x.id));
T.items.forEach(x=>{if(ready.has(x.id)){x.status='ready';x.statusLabel='Готовая основа';}});
T.ready=T.items.filter(x=>x.status==='ready');T.planned=T.items.filter(x=>x.status!=='ready');T.readyCount=T.ready.length;
})();
