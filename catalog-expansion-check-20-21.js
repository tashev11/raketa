const fs=require('fs'),vm=require('vm'),assert=require('assert');
const sandbox={window:{},console,Set,Map,Object,Array,String,Number,Math,Date,JSON,encodeURIComponent,decodeURIComponent};vm.createContext(sandbox);
function load(file){const p=String(file).replace(/^\.\//,'').replace(/\?.*$/,'');vm.runInContext(fs.readFileSync(p,'utf8'),sandbox,{filename:p});}
load('catalog-manifest.js');sandbox.window.RK_EXTENSION_SCRIPTS.forEach(load);
const T=sandbox.window.RKDocumentTaxonomy,B=sandbox.window.RKDocumentBase,RK=sandbox.window.RKCatalog;
assert(T&&B&&RK,'каталог должен загрузиться');
const required=[
'payment-request','payment-calendar','cash-flow-forecast','management-pnl','plan-fact-report','receivables-register','payables-register','debt-aging-report','unit-economics-sheet','pricing-calculation','investment-budget',
'employee-onboarding-plan','probation-plan','performance-review','employee-training-request','employee-equipment-issue-act','employee-access-sheet','employee-handover-act','employee-offboarding-checklist','exit-interview-form','remote-work-checklist','bonus-calculation-sheet'
];
const ids=new Set((B.templates||[]).map(x=>x.id));required.forEach(id=>assert(ids.has(id),'нет основы: '+id));
const tax=new Map(T.items.map(x=>[x.id,x]));required.forEach(id=>assert(tax.has(id)&&tax.get(id).status==='ready','не ready: '+id));
['employment-conditions-change-notice','overtime-consent','weekend-work-consent','business-trip-order','shift-schedule'].forEach(id=>assert(tax.has(id)&&tax.get(id).status==='regulated','кадровая регулируемая форма повреждена: '+id));
assert(RK.parties.length>=9,'сценарии с самозанятыми должны сохраняться');
console.log(JSON.stringify({ok:true,checked:required.length,bases:ids.size,ready:T.items.filter(x=>x.status==='ready').length,totalTypes:T.items.length,niches:RK.niches.length,services:RK.services.length,parties:RK.parties.length},null,2));
