const assert=require('assert');
const fs=require('fs');

const html=fs.readFileSync('./crm.html','utf8');
const js=fs.readFileSync('./crm-app.js','utf8');
const services=fs.readFileSync('./business-services-app.js','utf8');

assert.doesNotThrow(()=>new Function(js),'crm-app.js должен компилироваться без синтаксических ошибок');
[
  'view-dashboard','view-leads','view-customers','view-deals','view-tasks',
  'view-activities','view-calls','view-reports','view-settings'
].forEach(id=>assert(html.includes('id="'+id+'"'),'Нет CRM-раздела: '+id));

[
  "var KEY='rk_crm_v2'",
  "stageHistory",
  "weighted",
  "won.length/closed.length*100",
  "advanced/entered*100",
  "openCall",
  "convertLead",
  "exportCsv",
  "importJson"
].forEach(marker=>assert(js.includes(marker),'Нет обязательной CRM-логики: '+marker));

assert(!js.includes('seedDemo();render();'),'CRM не должна автоматически создавать демонстрационные данные');
assert(services.includes('href="./crm.html"'),'Каталог сервисов должен вести в отдельную CRM');
assert(services.includes("storage.set(s.id,{items:st,note:"),'Комментарий чек-листа должен сохраняться как часть объекта');
assert(services.includes("/^[=+\\-@]/"),'CSV-экспорт должен нейтрализовать формулы');

console.log(JSON.stringify({
  crm:true,
  views:9,
  storage:'rk_crm_v2',
  checks:'syntax, navigation, analytics markers, no demo seed, CRM routing, checklist persistence, CSV hardening'
}));