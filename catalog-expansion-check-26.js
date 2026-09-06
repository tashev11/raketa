const fs=require('fs'),vm=require('vm'),assert=require('assert');
const sandbox={window:{},console,Set,Map,Object,Array,String,Number,Math,Date,JSON,encodeURIComponent,decodeURIComponent};vm.createContext(sandbox);
function load(file){const p=String(file).replace(/^\.\//,'').replace(/\?.*$/,'');vm.runInContext(fs.readFileSync(p,'utf8'),sandbox,{filename:p});}
load('catalog-manifest.js');sandbox.window.RK_EXTENSION_SCRIPTS.filter(x=>!/catalog-virtual|catalog-policy|document-search/.test(x)).forEach(load);
const T=sandbox.window.RKDocumentTaxonomy,B=sandbox.window.RKDocumentBase;assert(T&&B);
const ids=new Set((B.templates||[]).map(x=>x.id));
const required=['personal-item-sale','personal-rent-item','personal-storage-agreement','personal-installment-agreement','personal-no-claims','personal-deposit-receipt','apartment-property-inventory','apartment-meter-readings-act','personal-work-acceptance','personal-consumer-claim','personal-document-receipt','personal-full-settlement-receipt'];
required.forEach(id=>assert(ids.has(id),'Нет основы '+id));
const tax=new Map(T.items.map(x=>[x.id,x]));required.forEach(id=>assert(tax.has(id)&&tax.get(id).status==='ready','Не ready: '+id));
assert(tax.get('will').status==='notary','Завещание должно оставаться нотариальным');
assert(tax.get('inheritance-contract').status==='notary','Наследственный договор должен оставаться нотариальным');
assert.strictEqual(ids.size,(B.templates||[]).length,'Дубли ID');
console.log(JSON.stringify({ok:true,checked:required.length,totalTypes:T.items.length,ready:T.items.filter(x=>x.status==='ready').length,bases:ids.size},null,2));
