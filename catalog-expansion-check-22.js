const fs=require('fs'),vm=require('vm'),assert=require('assert');
const sandbox={window:{},console,Set,Map,Object,Array,String,Number,Math,Date,JSON,encodeURIComponent,decodeURIComponent};vm.createContext(sandbox);
function load(file){const p=String(file).replace(/^\.\//,'').replace(/\?.*$/,'');vm.runInContext(fs.readFileSync(p,'utf8'),sandbox,{filename:p});}
load('catalog-manifest.js');sandbox.window.RK_EXTENSION_SCRIPTS.forEach(load);
const T=sandbox.window.RKDocumentTaxonomy,B=sandbox.window.RKDocumentBase,RK=sandbox.window.RKCatalog;
assert(T&&B&&RK,'каталог должен загрузиться');
const required=[
'production-order','production-batch-sheet','production-route-card','bill-of-materials','production-plan','shift-production-report','incoming-quality-check','quality-inspection-report','nonconformity-report','corrective-action-plan','supplier-nonconformity-claim','rework-order','scrap-report','production-acceptance-act','product-quality-passport','batch-release-sheet','quality-checklist','equipment-maintenance-log-production','calibration-register','tool-issue-register','downtime-report','production-incident-act','root-cause-analysis','process-change-request','process-change-approval',
'warehouse-receiving-sheet','warehouse-picking-list','warehouse-packing-list','stock-transfer-act','material-issue-sheet','material-return-sheet','warehouse-discrepancy-report','stock-damage-act','stock-quarantine-sheet','inventory-count-sheet-management','warehouse-location-register','warehouse-access-register','shipment-checklist','loading-act','unloading-act','pallet-transfer-act','returnable-packaging-register','warehouse-kpi-report','warehouse-daily-report','warehouse-loss-register'
];
const ids=new Set((B.templates||[]).map(x=>x.id));required.forEach(id=>assert(ids.has(id),'нет основы: '+id));
const tax=new Map(T.items.map(x=>[x.id,x]));required.forEach(id=>assert(tax.has(id)&&tax.get(id).status==='ready','не ready: '+id));
assert.strictEqual(ids.size,(B.templates||[]).length,'дубли ID в RKDocumentBase.templates');
['invoice','universal-transfer','ks2','ks3','driver-trip-sheet'].forEach(id=>assert(tax.has(id)&&tax.get(id).status==='regulated','регулируемый статус повреждён: '+id));
console.log(JSON.stringify({ok:true,checked:required.length,bases:ids.size,ready:T.items.filter(x=>x.status==='ready').length,totalTypes:T.items.length,niches:RK.niches.length,services:RK.services.length,parties:RK.parties.length},null,2));
