const fs=require('fs'),vm=require('vm'),assert=require('assert');
const sandbox={window:{},console,Set,Map,Object,Array,String,Number,Math,Date,JSON,encodeURIComponent,decodeURIComponent};vm.createContext(sandbox);
function load(file){const p=String(file).replace(/^\.\//,'').replace(/\?.*$/,'');vm.runInContext(fs.readFileSync(p,'utf8'),sandbox,{filename:p});}
load('catalog-manifest.js');sandbox.window.RK_EXTENSION_SCRIPTS.forEach(load);
const RK=sandbox.window.RKCatalog,T=sandbox.window.RKDocumentTaxonomy,B=sandbox.window.RKDocumentBase;
assert(RK&&T&&B,'каталог, таксономия и основы должны загрузиться');
const required=[
'purchase-request','request-for-quotation','supplier-questionnaire','supplier-selection-protocol','procurement-specification','tender-offer','purchase-order','supply-specification',
'car-sale-contract','car-rent-contract','vehicle-inspection-act','repair-order','auto-repair-act','test-drive-act','road-accident-explanation',
'insurance-claim','insured-event-notice','damage-inspection-act','loss-list','insurance-refusal-objection','subrogation-demand','insurance-reconciliation',
'site-handover-act','equipment-installation-act','pressure-test-act','commissioning-certificate','defect-list','estimate','technical-report','supervision-log',
'outsourcing','security-services','installation-contract','author-supervision','freight-charter','paid-education-basic'
];
const baseIds=new Set((B.templates||[]).map(x=>x.id));required.forEach(id=>assert(baseIds.has(id),'нет новой основы: '+id));
const tax=new Map(T.items.map(x=>[x.id,x]));required.forEach(id=>assert(tax.has(id)&&tax.get(id).status==='ready','статус не ready: '+id));
['invoice','universal-transfer','ks2','ks3','construction-log','driver-trip-sheet','medical-services-consent','clinic-service-contract'].forEach(id=>assert(tax.has(id)&&tax.get(id).status==='regulated','регулируемый статус повреждён: '+id));
['will','joint-will','inheritance-contract','marriage-contract','alimony'].forEach(id=>assert(tax.has(id)&&tax.get(id).status==='notary','нотариальный статус повреждён: '+id));
const nicheSlugs=new Set(RK.niches.map(x=>x.slug)),serviceSlugs=new Set(RK.services.map(x=>x.slug));
['fleet-management','claims-adjuster','procurement-outsourcing','general-contractor','ndt-lab','wms-integrator','compliance-consulting','restaurant-chain'].forEach(id=>assert(nicheSlugs.has(id),'нет ниши 6-го слоя: '+id));
['fleet-maintenance','insurance-claim-support','supplier-audit-service','general-contracting','ndt-service','wms-implementation','compliance-audit','franchise-launch-support'].forEach(id=>assert(serviceSlugs.has(id),'нет услуги 6-го слоя: '+id));
assert(RK.niches.length>=520,'ожидалось не менее 520 ниш после шестого слоя');
assert(RK.services.length>=470,'ожидалось не менее 470 услуг после шестого слоя');
console.log(JSON.stringify({ok:true,checkedDocuments:required.length,niches:RK.niches.length,services:RK.services.length,documentBases:baseIds.size,ready:T.items.filter(x=>x.status==='ready').length,totalTypes:T.items.length},null,2));
