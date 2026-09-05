(function(){
'use strict';
const T=window.RKDocumentTaxonomy;if(!T||!Array.isArray(T.items))return;
const defs=[
['settlement-agreement','Соглашение об урегулировании спора','agreements'],
['child-residence','Соглашение о месте жительства ребёнка','family-inheritance'],['child-contact','Соглашение о порядке общения с ребёнком','family-inheritance'],['gift-relative','Договор дарения имущества родственнику','family-inheritance'],
['preliminary-sale','Предварительный договор купли-продажи','realestate'],['deposit-realestate','Соглашение о задатке за недвижимость','realestate'],['rent-transfer','Акт приёма-передачи помещения в аренду','realestate'],['property-inspection','Акт осмотра недвижимости','realestate'],['tenant-notice','Уведомление арендатору','realestate'],['landlord-notice','Уведомление арендодателю','realestate'],
['unpaid-leave','Заявление на отпуск без сохранения заработной платы','applications'],['vacation-notice','Уведомление работника об отпуске','claims'],
['car-power','Доверенность на автомобиль','powers'],['documents-power','Доверенность на получение документов','powers'],['ip-power','Доверенность от ИП','powers'],
['shortage-act','Акт о недостаче','acts'],['handover-act','Акт сдачи-приёмки','acts'],
['information-letter','Информационное письмо','business-letters'],['request-letter','Письмо-запрос','business-letters'],['response-letter','Письмо-ответ','business-letters'],['payment-letter','Письмо об оплате','business-letters'],['debt-letter','Письмо о задолженности','business-letters'],['reconciliation-letter','Письмо о сверке расчётов','business-letters'],['price-change-letter','Письмо об изменении цен','business-letters'],['bank-details-letter','Письмо об изменении банковских реквизитов','business-letters'],['cooperation-letter','Письмо о сотрудничестве','business-letters'],['recommendation-letter','Рекомендательное письмо','business-letters'],['consent-letter','Письмо-согласие','business-letters'],['refusal-letter','Письмо-отказ','business-letters']
];
const names={};(T.groups||[]).forEach(g=>names[g.slug]=g.name);const byId=new Map(T.items.map(x=>[x.id,x]));
defs.forEach(d=>{let x=byId.get(d[0]);if(!x){x={id:d[0],title:d[1],group:d[2],groupName:names[d[2]]||'Документы'};T.items.push(x);byId.set(x.id,x);}x.title=d[1];x.group=d[2];x.groupName=names[d[2]]||x.groupName;x.status='ready';x.statusLabel='Готовая основа';});
T.ready=T.items.filter(x=>x.status==='ready');T.planned=T.items.filter(x=>x.status!=='ready');T.readyCount=T.ready.length;
})();
