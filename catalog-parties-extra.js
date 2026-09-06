(function(){
'use strict';
const RK=window.RKCatalog;if(!RK||!Array.isArray(RK.parties))return;
const rows=[
 {slug:'sz-ooo',label:'Самозанятый → ООО',tags:['самозанятый','ооо','исполнитель самозанятый','заказчик ооо']},
 {slug:'sz-ip',label:'Самозанятый → ИП',tags:['самозанятый','ип','исполнитель самозанятый','заказчик ип']},
 {slug:'ooo-sz',label:'ООО → Самозанятый',tags:['ооо','самозанятый','исполнитель ооо','заказчик самозанятый']},
 {slug:'ip-sz',label:'ИП → Самозанятый',tags:['ип','самозанятый','исполнитель ип','заказчик самозанятый']},
 {slug:'sz-sz',label:'Самозанятый → Самозанятый',tags:['самозанятый','между самозанятыми']}
];
const seen=new Set(RK.parties.map(x=>x.slug));rows.forEach(x=>{if(!seen.has(x.slug)){seen.add(x.slug);RK.parties.push(x);}});
})();