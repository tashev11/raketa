(function(){
'use strict';
const T=window.RKDocumentTaxonomy;if(!T||!Array.isArray(T.items))return;
const ready=new Set(['engineering-service-request','engineering-inspection-act','engineering-defect-list','engineering-maintenance-plan','engineering-maintenance-log','engineering-work-order','engineering-service-report','engineering-incident-act','engineering-repair-act','engineering-equipment-transfer','engineering-commissioning-checklist','electric-service-request','electric-inspection-sheet','electric-fault-report','power-outage-notice','power-restoration-report','telecom-installation-request','telecom-installation-act','telecom-equipment-transfer','telecom-service-request','telecom-maintenance-log','telecom-incident-report','telecom-restoration-report','telecom-site-inspection','telecom-upgrade-plan']);
T.items.forEach(x=>{if(ready.has(x.id)){x.status='ready';x.statusLabel='Готовая основа';}});
T.ready=T.items.filter(x=>x.status==='ready');T.planned=T.items.filter(x=>x.status!=='ready');
})();