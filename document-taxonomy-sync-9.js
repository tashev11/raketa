(function(){
'use strict';
const T=window.RKDocumentTaxonomy;if(!T||!Array.isArray(T.items))return;
const ids=new Set(['procurement-specification','tender-offer','tender-guarantee-letter','price-comparison','demurrage-claim','route-sheet','cargo-instruction','car-sale-contract','car-rent-contract','car-rent-driver','auto-repair-act','spare-parts-act','test-drive-act','road-accident-explanation','payment-schedule','interest-calculation','penalty-calculation','mutual-setoff-act','advance-repayment-letter','debt-confirmation-letter','loan-repayment-act']);
T.items.forEach(function(x){if(ids.has(x.id)){x.status='ready';x.statusLabel='Готовая основа';}});
T.ready=T.items.filter(x=>x.status==='ready');T.planned=T.items.filter(x=>x.status!=='ready');T.readyCount=T.ready.length;
})();
