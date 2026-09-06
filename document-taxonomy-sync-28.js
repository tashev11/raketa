(function(){
'use strict';
const T=window.RKDocumentTaxonomy;if(!T||!Array.isArray(T.items))return;
const ready=new Set(['lead-qualification-card','sales-call-report','sales-meeting-agenda','sales-meeting-summary','client-needs-sheet','deal-qualification-sheet','deal-stage-checklist','deal-approval-sheet','discount-approval-request','special-price-request','commercial-offer-cover-letter','proposal-followup-letter','client-objection-register','deal-risk-register','deal-lost-report','deal-win-report','sales-handoff-act','customer-onboarding-plan','customer-onboarding-checklist','account-plan','client-renewal-notice','renewal-proposal','upsell-proposal','service-cancellation-request','customer-offboarding-checklist']);
T.items.forEach(x=>{if(ready.has(x.id)){x.status='ready';x.statusLabel='Готовая основа';}});
T.ready=T.items.filter(x=>x.status==='ready');T.planned=T.items.filter(x=>x.status!=='ready');
})();