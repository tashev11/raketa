(function(){
'use strict';
const T=window.RKDocumentTaxonomy;if(!T||!Array.isArray(T.items))return;
const readyIds=[
'candidate-questionnaire','candidate-pd-consent','resume-consent','job-offer-letter','candidate-rejection','recruitment-request','vacancy-profile','interview-scorecard','candidate-presentation','recruitment-act','replacement-guarantee',
'marketing-services-contract','smm-contract','seo-contract','context-ads-contract','media-plan','content-plan','marketing-brief','creative-brief','campaign-report','marketing-kpi-addendum','influencer-contract','advertising-integration-act','content-production-act',
'service-order','diagnostic-act','repair-act','equipment-receipt-act','equipment-return-act','warranty-repair-act','nonrepairable-act','spare-part-install-act',
'medical-data-consent','patient-questionnaire','medical-intake-form','appointment-cancellation-policy','medical-equipment-act','medical-maintenance-act','medical-repair-act','clinic-claim',
'student-enrollment-form','training-program','curriculum-plan','lesson-schedule','training-act','certificate-template','education-refund-request','parent-consent-event','photo-consent-child','school-excursion-consent'
];
const set=new Set(readyIds);T.items.forEach(x=>{if(set.has(x.id)){x.status='ready';x.statusLabel='Готовая основа';}});T.ready=T.items.filter(x=>x.status==='ready');T.planned=T.items.filter(x=>x.status!=='ready');T.readyCount=T.ready.length;
})();