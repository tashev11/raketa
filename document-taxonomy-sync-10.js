(function(){
'use strict';
const T=window.RKDocumentTaxonomy;if(!T||!Array.isArray(T.items))return;
const ids=new Set(['insurance-claim','insured-event-notice','damage-inspection-act','loss-list','insurance-refusal-objection','insurance-reconciliation','exchange-application','warranty-claim','marketplace-supply-act','seller-policy','delivery-terms','return-policy','promotion-rules','gift-certificate-rules','author-order','content-license','model-release','content-acceptance-act','design-rights-assignment']);
T.items.forEach(function(x){if(ids.has(x.id)){x.status='ready';x.statusLabel='Готовая основа';}});
T.ready=T.items.filter(x=>x.status==='ready');T.planned=T.items.filter(x=>x.status!=='ready');T.readyCount=T.ready.length;
})();
