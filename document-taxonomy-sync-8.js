(function(){
'use strict';
const T=window.RKDocumentTaxonomy;if(!T||!Array.isArray(T.items))return;
const ids=new Set(['purchase-request','request-for-quotation','supplier-questionnaire','supplier-selection-protocol','purchase-order','supply-specification','transport-request','cargo-acceptance-act','cargo-damage-act','cargo-shortage-act','cargo-claim','vehicle-inspection-act','repair-order','goods-return-act','goods-return-application','debt-recognition-act','repayment-schedule','payment-deferral-request','photo-release','rights-transfer-act']);
T.items.forEach(function(x){if(ids.has(x.id)){x.status='ready';x.statusLabel='Готовая основа';}});
T.ready=T.items.filter(x=>x.status==='ready');T.planned=T.items.filter(x=>x.status!=='ready');T.readyCount=T.ready.length;
})();
