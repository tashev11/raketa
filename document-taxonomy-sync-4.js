(function(){
'use strict';
const T=window.RKDocumentTaxonomy;if(!T||!Array.isArray(T.items))return;
const ids=['unpaid-leave','claim-application','consumer-application','car-power','court-power','documents-power','ip-power','shortage-act','handover-act','responsibility-receipt','memo','report-note','vacation-notice','contract-renewal-notice','assignment-notice','debt-demand'];
const set=new Set(ids);
T.items.forEach(function(x){if(set.has(x.id)){x.status='ready';x.statusLabel='Готовая основа';}});
T.ready=T.items.filter(x=>x.status==='ready');T.planned=T.items.filter(x=>x.status!=='ready');T.readyCount=T.ready.length;
})();
