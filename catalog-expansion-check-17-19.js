const fs=require('fs'),vm=require('vm'),assert=require('assert');
const sandbox={window:{},console,Set,Map,Object,Array,String,Number,Math,Date,JSON,encodeURIComponent,decodeURIComponent};vm.createContext(sandbox);
function load(file){const p=String(file).replace(/^\.\//,'').replace(/\?.*$/,'');vm.runInContext(fs.readFileSync(p,'utf8'),sandbox,{filename:p});}
load('catalog-manifest.js');sandbox.window.RK_EXTENSION_SCRIPTS.forEach(load);
const RK=sandbox.window.RKCatalog,T=sandbox.window.RKDocumentTaxonomy,B=sandbox.window.RKDocumentBase;
assert(RK&&T&&B,'каталог должен загрузиться');
const required=[
'capital-increase','capital-decrease','power-director','major-transaction-approval','signature-authority-order','participant-notice-meeting','corporate-authority-matrix',
'apartment-inventory','rent-payment-receipt','rent-arrears-demand','realestate-agency-contract','property-management-contract','event-services-contract','photographer-contract','event-technical-rider','event-sponsor-agreement',
'client-questionnaire','order-confirmation','client-meeting-minutes','customer-complaint-register','project-kickoff-minutes','project-charter','change-request','project-risk-register','project-handover-checklist','project-closure-report','support-handover','client-offboarding-checklist'
];
const ids=new Set((B.templates||[]).map(x=>x.id));required.forEach(id=>assert(ids.has(id),'нет основы: '+id));
const tax=new Map(T.items.map(x=>[x.id,x]));required.forEach(id=>assert(tax.has(id)&&tax.get(id).status==='ready','не ready: '+id));
const partySlugs=new Set(RK.parties.map(x=>x.slug));['sz-ooo','sz-ip','ooo-sz','ip-sz','sz-sz'].forEach(id=>assert(partySlugs.has(id),'нет сценария сторон: '+id));
assert(RK.parties.length>=9,'ожидалось минимум 9 сценариев сторон');
['will','joint-will','inheritance-contract','marriage-contract'].forEach(id=>assert(tax.has(id)&&tax.get(id).status==='notary','нотариальный статус повреждён: '+id));
['invoice','universal-transfer','ks2','ks3','driver-trip-sheet','medical-services-consent'].forEach(id=>assert(tax.has(id)&&tax.get(id).status==='regulated','регулируемый статус повреждён: '+id));
console.log(JSON.stringify({ok:true,checked:required.length,parties:RK.parties.length,niches:RK.niches.length,services:RK.services.length,bases:ids.size,ready:T.items.filter(x=>x.status==='ready').length,totalTypes:T.items.length},null,2));
