const fs=require('fs'),vm=require('vm'),assert=require('assert');
const sandbox={window:{},console,Set,Map,Object,Array,String,Number,Math,Date,JSON,encodeURIComponent,decodeURIComponent};vm.createContext(sandbox);
function load(file){const p=String(file).replace(/^\.\//,'').replace(/\?.*$/,'');vm.runInContext(fs.readFileSync(p,'utf8'),sandbox,{filename:p});}
load('catalog-manifest.js');sandbox.window.RK_EXTENSION_SCRIPTS.filter(x=>!/catalog-virtual|catalog-policy|document-search/.test(x)).forEach(load);
const T=sandbox.window.RKDocumentTaxonomy,B=sandbox.window.RKDocumentBase,RK=sandbox.window.RKCatalog;assert(T&&B&&RK);
const ids=new Set((B.templates||[]).map(x=>x.id));
const required=['restaurant-opening-checklist','banquet-order','hotel-reservation-confirmation','hotel-damage-act','travel-booking-request','travel-cancellation-request','fitness-client-questionnaire','fitness-membership-freeze-request','personal-training-plan','beauty-client-card','beauty-cancellation-policy','beauty-master-rent-agreement'];
required.forEach(id=>assert(ids.has(id),'Нет основы '+id));
const tax=new Map(T.items.map(x=>[x.id,x]));required.forEach(id=>assert(tax.has(id)&&tax.get(id).status==='ready','Не ready: '+id));
assert(tax.get('will').status==='notary','Завещание должно оставаться нотариальным');
assert(tax.get('invoice').status==='regulated','Счёт-фактура должна оставаться регулируемой');
assert(RK.parties.length>=9,'Ожидалось не менее 9 сценариев сторон');
console.log(JSON.stringify({ok:true,checked:required.length,ready:T.items.filter(x=>x.status==='ready').length,totalTypes:T.items.length,niches:RK.niches.length,services:RK.services.length,parties:RK.parties.length},null,2));
