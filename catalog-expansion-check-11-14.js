const fs=require('fs'),vm=require('vm'),assert=require('assert');
const sandbox={window:{},console,Set,Map,Object,Array,String,Number,Math,Date,JSON,encodeURIComponent,decodeURIComponent};vm.createContext(sandbox);
function load(file){const p=String(file).replace(/^\.\//,'').replace(/\?.*$/,'');vm.runInContext(fs.readFileSync(p,'utf8'),sandbox,{filename:p});}
load('catalog-manifest.js');sandbox.window.RK_EXTENSION_SCRIPTS.forEach(load);
const RK=sandbox.window.RKCatalog,T=sandbox.window.RKDocumentTaxonomy,B=sandbox.window.RKDocumentBase;
assert(RK&&T&&B,'ядро каталога и документов должно загрузиться');
const required=[
'candidate-questionnaire','job-offer-letter','recruitment-act','marketing-services-contract','seo-contract','media-plan','influencer-contract','service-order','diagnostic-act','repair-act',
'medical-data-consent','patient-questionnaire','medical-equipment-act','student-enrollment-form','training-program','training-act','photo-consent-child',
'franchise-application','franchise-audit-act','royalty-report','facility-maintenance-contract','emergency-act','keys-transfer-act','agro-supply-contract','field-work-act','grain-storage-act',
'transport-request','cargo-damage-act','cargo-claim','goods-return-act','seller-offer','return-policy','debt-recognition-act','repayment-schedule','penalty-calculation','author-order','content-license','model-release','rights-transfer-act'
];
const baseIds=new Set((B.templates||[]).map(x=>x.id));required.forEach(id=>assert(baseIds.has(id),'нет основы: '+id));
const tax=new Map(T.items.map(x=>[x.id,x]));required.forEach(id=>assert(tax.has(id)&&tax.get(id).status==='ready','не синхронизирован ready: '+id));
['will','joint-will','marriage-contract','inheritance-contract'].forEach(id=>assert(tax.has(id)&&tax.get(id).status==='notary','нотариальный статус должен сохраниться: '+id));
['invoice','universal-transfer','driver-trip-sheet','ks2','medical-services-consent'].forEach(id=>assert(tax.has(id)&&tax.get(id).status==='regulated','регулируемый статус должен сохраниться: '+id));
assert.strictEqual(baseIds.size,(B.templates||[]).length,'в RKDocumentBase.templates есть дубли ID');
console.log(JSON.stringify({ok:true,checked:required.length,documentBases:baseIds.size,ready:T.items.filter(x=>x.status==='ready').length,totalTypes:T.items.length},null,2));
