(function(){
'use strict';
const T=window.RKDocumentTaxonomy;if(!T||!Array.isArray(T.items))return;
const ready=new Set([
'incoming-mail-register','outgoing-mail-register','document-transfer-register','document-issue-receipt','originals-transfer-act','archive-transfer-act','file-inventory','meeting-minutes-internal','meeting-action-list','equipment-issue-act-office','equipment-return-act-office','tenant-request','maintenance-request-property','property-inspection-act','property-defect-act','keys-access-transfer-property','property-emergency-act','move-in-checklist',
'client-brief-general','client-request-form','client-requirements-sheet','client-acceptance-checklist','client-feedback-form','client-complaint-register','complaint-resolution-report','service-recovery-plan','supplier-registration-form','supplier-onboarding-checklist','supplier-document-register','supplier-audit-checklist','supplier-corrective-action','supplier-price-request','supplier-sample-request','sample-transfer-act','pilot-order','trial-service-act','supplier-performance-report','supplier-scorecard',
'bank-details-notice','bank-details-change-notice','payment-purpose-letter','payment-return-request','payment-confirmation-letter','cashflow-payment-plan','payment-register','payment-approval-sheet','invoice-register','receivables-register','payables-register','collection-letter','refund-confirmation'
]);
T.items.forEach(x=>{if(ready.has(x.id)){x.status='ready';x.statusLabel='Готовая основа';}});
T.ready=T.items.filter(x=>x.status==='ready');T.planned=T.items.filter(x=>x.status!=='ready');
})();