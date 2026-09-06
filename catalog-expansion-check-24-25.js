const fs=require('fs'),vm=require('vm'),assert=require('assert');
const sandbox={window:{},console,Set,Map,Object,Array,String,Number,Math,Date,JSON,encodeURIComponent,decodeURIComponent};vm.createContext(sandbox);
function load(file){const p=String(file).replace(/^\.\//,'').replace(/\?.*$/,'');vm.runInContext(fs.readFileSync(p,'utf8'),sandbox,{filename:p});}
load('catalog-manifest.js');sandbox.window.RK_EXTENSION_SCRIPTS.filter(x=>!/catalog-virtual|catalog-policy|document-search/.test(x)).forEach(load);
const T=sandbox.window.RKDocumentTaxonomy,B=sandbox.window.RKDocumentBase;assert(T&&B);
const ids=new Set((B.templates||[]).map(x=>x.id));
const required=['restaurant-reservation-sheet','food-quality-claim','hotel-housekeeping-checklist','travel-payment-schedule','guide-services-contract','fitness-incident-act','beauty-shift-report','pet-sitting-transfer-act','grooming-service-act','dog-training-plan','home-service-order','master-visit-act','cleaning-acceptance-act-home','moving-damage-act','nanny-instruction','private-driver-order'];
required.forEach(id=>assert(ids.has(id),'Нет основы '+id));
const tax=new Map(T.items.map(x=>[x.id,x]));required.forEach(id=>assert(tax.has(id)&&tax.get(id).status==='ready','Не ready: '+id));
assert(tax.get('will').status==='notary');assert(tax.get('invoice').status==='regulated');
assert.strictEqual(ids.size,(B.templates||[]).length,'Дубли ID в базах документов');
console.log(JSON.stringify({ok:true,checked:required.length,ready:T.items.filter(x=>x.status==='ready').length,totalTypes:T.items.length,bases:ids.size},null,2));
