(function(){
'use strict';
const T=window.RKDocumentTaxonomy;if(!T||!Array.isArray(T.items))return;
const ready=new Set(['employee-onboarding-plan','employee-onboarding-checklist','first-day-checklist','probation-plan','probation-review','employee-goals-sheet','performance-review-form','one-on-one-template','employee-development-plan','training-request-employee','training-plan-employee','training-completion-report','mentor-assignment-sheet','mentor-feedback-form','remote-work-checklist','remote-equipment-act','work-access-register','access-request-employee','access-revoke-checklist','employee-transfer-checklist','role-handover-plan','handover-checklist-employee','employee-exit-interview','employee-offboarding-checklist','company-property-return-checklist','knowledge-transfer-plan']);
T.items.forEach(x=>{if(ready.has(x.id)){x.status='ready';x.statusLabel='Готовая основа';}});
T.ready=T.items.filter(x=>x.status==='ready');T.planned=T.items.filter(x=>x.status!=='ready');
})();