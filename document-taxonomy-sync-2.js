(function(){
'use strict';
const T=window.RKDocumentTaxonomy,RK=window.RKCatalog;if(!T||!Array.isArray(T.items)||!RK)return;
const defs=[
['assignment-agreement','Соглашение об уступке права требования','agreements'],['debt-transfer','Соглашение о переводе долга','agreements'],['novation','Соглашение о новации','agreements'],['deposit-agreement','Соглашение о задатке','agreements'],
['vehicle-transfer-act','Акт приёма-передачи автомобиля','acts'],['commissioning-act','Акт ввода в эксплуатацию','acts'],['completion-act','Акт завершения работ','acts'],['absence-act','Акт об отсутствии работника на рабочем месте','acts'],['discipline-act','Акт о нарушении трудовой дисциплины','acts'],
['transfer-order','Приказ о переводе работника','hr'],['disciplinary-order','Приказ о дисциплинарном взыскании','hr'],['consent-personal-data-employee','Согласие работника на обработку персональных данных','hr'],
['data-processing-agreement','Соглашение об обработке данных / DPA','web-it'],['security-policy','Политика информационной безопасности','web-it'],['software-assignment','Договор отчуждения исключительных прав на программное обеспечение','web-it']
];
const groupNames={};(T.groups||[]).forEach(g=>groupNames[g.slug]=g.name);const byId=new Map(T.items.map(x=>[x.id,x]));
defs.forEach(d=>{let item=byId.get(d[0]);if(!item){item={id:d[0],title:d[1],group:d[2],groupName:groupNames[d[2]]||'Документы'};T.items.push(item);byId.set(item.id,item);}item.title=d[1];item.group=d[2];item.groupName=groupNames[d[2]]||item.groupName;item.status='ready';item.statusLabel='Готовая основа';});
T.ready=T.items.filter(x=>x.status==='ready');T.planned=T.items.filter(x=>x.status!=='ready');T.readyCount=T.ready.length;
if(typeof RK.install==='function')RK._installBeforeVirtual=RK.install;
})();
