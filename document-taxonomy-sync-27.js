(function(){
'use strict';
const T=window.RKDocumentTaxonomy;if(!T||!Array.isArray(T.items))return;
const ready=new Set(['foreign-trade-checklist','import-documents-checklist','export-documents-checklist','supplier-inquiry-foreign','foreign-quotation-request','proforma-invoice','foreign-purchase-order','foreign-order-confirmation','foreign-supply-specification','incoterms-selection-sheet','shipping-instruction','export-packing-list','container-loading-plan','shipping-documents-register','origin-certificate-request','quality-certificate-request','customs-broker-instruction','customs-documents-checklist','foreign-supplier-claim','foreign-payment-schedule','landed-cost-calculation','shipment-status-report','pre-shipment-inspection-report','import-arrival-checklist']);
T.items.forEach(x=>{if(ready.has(x.id)){x.status='ready';x.statusLabel='Готовая основа';}});
T.ready=T.items.filter(x=>x.status==='ready');T.planned=T.items.filter(x=>x.status!=='ready');
})();