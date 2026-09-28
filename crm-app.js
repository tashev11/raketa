(function(){
'use strict';

var KEY='rk_crm_v2';
var VERSION=2;
var OPEN_STAGES=['new','qualified','proposal','negotiation'];
var STAGES=[
 {id:'new',title:'Новая',probability:.10},
 {id:'qualified',title:'Квалификация',probability:.30},
 {id:'proposal',title:'КП отправлено',probability:.55},
 {id:'negotiation',title:'Переговоры',probability:.75},
 {id:'won',title:'Выиграна',probability:1},
 {id:'lost',title:'Проиграна',probability:0}
];
var LEAD_STATUSES=[
 {id:'new',title:'Новый'},{id:'contacted',title:'Связались'},{id:'qualified',title:'Квалифицирован'},
 {id:'disqualified',title:'Не целевой'},{id:'converted',title:'Конвертирован'}
];
var CALL_RESULTS=[
 {id:'answered',title:'Дозвон'},{id:'no_answer',title:'Нет ответа'},{id:'busy',title:'Занято'},
 {id:'callback',title:'Перезвонить'},{id:'qualified',title:'Квалифицирован'},{id:'disqualified',title:'Не целевой'},{id:'dnc',title:'Не звонить'}
];
var ACTIVITY_TYPES=[{id:'call',title:'Звонок'},{id:'meeting',title:'Встреча'},{id:'email',title:'Email'},{id:'message',title:'Сообщение'},{id:'note',title:'Заметка'}];
var state=load();
var currentView='dashboard';

function id(prefix){return prefix+'_'+Date.now().toString(36)+'_'+Math.random().toString(36).slice(2,8)}
function now(){return new Date().toISOString()}
function today(){return new Date().toISOString().slice(0,10)}
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(m){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]})}
function rub(v){return Math.round(Number(v)||0).toLocaleString('ru-RU')+' ₽'}
function pct(v){return (Number(v)||0).toFixed(1)+'%'}
function dateText(v){if(!v)return '—';var d=new Date(v);return isNaN(d)?esc(v):d.toLocaleDateString('ru-RU')}
function dateTimeText(v){if(!v)return '—';var d=new Date(v);return isNaN(d)?esc(v):d.toLocaleString('ru-RU',{day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'})}
function label(list,key){var x=list.find(function(i){return i.id===key});return x?x.title:key||'—'}
function optionList(list,value){return list.map(function(x){return '<option value="'+esc(x.id)+'" '+(x.id===value?'selected':'')+'>'+esc(x.title)+'</option>'}).join('')}
function entityName(type,entityId){
 var arr=type==='lead'?state.leads:type==='customer'?state.customers:type==='deal'?state.deals:[];
 var x=arr.find(function(i){return i.id===entityId});return x?(x.name||x.title||'—'):'—'
}
function emptyState(){
 return {version:VERSION,createdAt:now(),updatedAt:now(),settings:{staleDays:5,currency:'RUB'},leads:[],customers:[],deals:[],tasks:[],activities:[]};
}
function normalize(s){
 s=s&&typeof s==='object'?s:emptyState();
 s.version=VERSION;s.settings=s.settings||{staleDays:5,currency:'RUB'};
 ['leads','customers','deals','tasks','activities'].forEach(function(k){if(!Array.isArray(s[k]))s[k]=[]});
 s.deals.forEach(function(d){if(!Array.isArray(d.stageHistory))d.stageHistory=[{stage:d.stage||'new',at:d.createdAt||now()}]});
 return s;
}
function load(){try{return normalize(JSON.parse(localStorage.getItem(KEY)||'null'))}catch(e){return emptyState()}}
function save(){state.updatedAt=now();localStorage.setItem(KEY,JSON.stringify(state));render();toast('Сохранено')}
function persistSilent(){state.updatedAt=now();localStorage.setItem(KEY,JSON.stringify(state))}
function toast(msg){var t=document.getElementById('crm-toast');t.textContent=msg;t.classList.add('show');setTimeout(function(){t.classList.remove('show')},1600)}
function download(name,content,type){var a=document.createElement('a');a.href=URL.createObjectURL(new Blob([content],{type:type}));a.download=name;a.click();setTimeout(function(){URL.revokeObjectURL(a.href)},1000)}
function csvSafe(v){v=String(v==null?'':v);if(/^[=+\-@]/.test(v))v="'"+v;return '"'+v.replace(/"/g,'""')+'"'}
function median(nums){if(!nums.length)return 0;var a=nums.slice().sort(function(x,y){return x-y});var m=Math.floor(a.length/2);return a.length%2?a[m]:(a[m-1]+a[m])/2}
function daysBetween(a,b){return Math.max(0,(new Date(b)-new Date(a))/86400000)}
function lastActivityFor(type,entityId){
 return state.activities.filter(function(a){return a.entityType===type&&a.entityId===entityId}).sort(function(a,b){return new Date(b.at)-new Date(a.at)})[0]||null;
}
function hasFutureTask(type,entityId){
 var n=Date.now();return state.tasks.some(function(t){return !t.done&&t.entityType===type&&t.entityId===entityId&&new Date(t.dueAt).getTime()>=n});
}
function isStaleLead(l){
 if(l.status==='converted'||l.status==='disqualified')return false;
 var a=lastActivityFor('lead',l.id);var anchor=a?a.at:l.createdAt;var limit=(Number(state.settings.staleDays)||5)*86400000;
 return Date.now()-new Date(anchor).getTime()>limit&&!hasFutureTask('lead',l.id);
}
function openDeals(){return state.deals.filter(function(d){return OPEN_STAGES.indexOf(d.stage)>=0})}
function stageProbability(stage){var s=STAGES.find(function(x){return x.id===stage});return s?s.probability:0}
function metrics(){
 var open=openDeals(),closed=state.deals.filter(function(d){return d.stage==='won'||d.stage==='lost'}),won=state.deals.filter(function(d){return d.stage==='won'});
 var pipeline=open.reduce(function(a,d){return a+(Number(d.amount)||0)},0);
 var weighted=open.reduce(function(a,d){return a+(Number(d.amount)||0)*stageProbability(d.stage)},0);
 var overdue=state.tasks.filter(function(t){return !t.done&&new Date(t.dueAt).getTime()<Date.now()}).length;
 var stale=state.leads.filter(isStaleLead).length;
 var month=today().slice(0,7);
 var wonMonth=won.filter(function(d){return String(d.wonAt||'').slice(0,7)===month}).reduce(function(a,d){return a+(Number(d.amount)||0)},0);
 var winRate=closed.length?won.length/closed.length*100:0;
 return {pipeline:pipeline,weighted:weighted,overdue:overdue,stale:stale,wonMonth:wonMonth,winRate:winRate};
}
function stageConversions(){
 var seq=['new','qualified','proposal','negotiation','won'];
 return seq.slice(0,-1).map(function(stage,i){
   var next=seq[i+1],entered=0,advanced=0;
   state.deals.forEach(function(d){
     var seen=(d.stageHistory||[]).map(function(h){return h.stage});
     if(seen.indexOf(stage)>=0){entered++;if(seen.indexOf(next)>=0)advanced++}
   });
   return {from:stage,to:next,entered:entered,advanced:advanced,rate:entered?advanced/entered*100:0};
 });
}
function callMetrics(){
 var calls=state.activities.filter(function(a){return a.type==='call'}),answered=calls.filter(function(a){return ['answered','qualified'].indexOf(a.result)>=0}),qualified=calls.filter(function(a){return a.result==='qualified'});
 return {attempts:calls.length,answered:answered.length,connect:calls.length?answered.length/calls.length*100:0,qualified:qualified.length,qualification:answered.length?qualified.length/answered.length*100:0};
}
function salesCycle(){
 var vals=state.deals.filter(function(d){return d.stage==='won'&&d.wonAt&&d.createdAt}).map(function(d){return daysBetween(d.createdAt,d.wonAt)});
 return median(vals);
}
function showView(name){
 currentView=name;
 document.querySelectorAll('.view').forEach(function(v){v.classList.toggle('active',v.id==='view-'+name)});
 document.querySelectorAll('#crm-nav [data-view]').forEach(function(b){b.classList.toggle('active',b.dataset.view===name)});
 render();
}
function render(){
 if(currentView==='dashboard')renderDashboard();
 if(currentView==='leads')renderLeads();
 if(currentView==='customers')renderCustomers();
 if(currentView==='deals')renderDeals();
 if(currentView==='tasks')renderTasks();
 if(currentView==='activities')renderActivities();
 if(currentView==='calls')renderCalls();
 if(currentView==='reports')renderReports();
 if(currentView==='settings')renderSettings();
}
function kpi(title,value,sub){return '<div class="kpi"><span>'+esc(title)+'</span><strong>'+esc(value)+'</strong><small>'+esc(sub||'')+'</small></div>'}
function renderDashboard(){
 var m=metrics(),el=document.getElementById('view-dashboard');
 var recent=state.activities.slice().sort(function(a,b){return new Date(b.at)-new Date(a.at)}).slice(0,8);
 var tasks=state.tasks.filter(function(t){return !t.done}).sort(function(a,b){return new Date(a.dueAt)-new Date(b.dueAt)}).slice(0,8);
 el.innerHTML='<div class="grid kpis">'+
 kpi('Открытый pipeline',rub(m.pipeline),'Сумма открытых сделок')+
 kpi('Взвешенный прогноз',rub(m.weighted),'Сумма × вероятность стадии')+
 kpi('Выиграно в месяце',rub(m.wonMonth),'По дате выигрыша')+
 kpi('Win rate',pct(m.winRate),'Won / (Won + Lost)')+
 kpi('Просрочено задач',String(m.overdue),'Открытые задачи после срока')+
 kpi('Лиды без движения',String(m.stale),'Нет активности и будущей задачи')+
 '</div><div class="grid cols"><div class="card"><div class="cardhead"><h2>Ближайшие задачи</h2><button class="btn primary" data-add="task">+ Задача</button></div><div class="cardbody">'+taskTable(tasks,true)+'</div></div>'+
 '<div class="card"><div class="cardhead"><h2>Последние активности</h2><button class="btn" data-add="activity">+ Активность</button></div><div class="cardbody">'+activityList(recent)+'</div></div></div>';
 bindCommon(el);
}
function renderLeads(){
 var el=document.getElementById('view-leads');
 el.innerHTML='<div class="card"><div class="cardhead"><h2>Лиды</h2><div class="toolbar"><button class="btn" data-export="leads">CSV</button><button class="btn primary" data-add="lead">+ Лид</button></div></div><div class="cardbody"><div class="filters"><input id="lead-search" placeholder="Поиск по имени, телефону, email, компании"><select id="lead-status"><option value="">Все статусы</option>'+optionList(LEAD_STATUSES,'')+'</select></div><div id="lead-table"></div></div></div>';
 var draw=function(){
   var q=(document.getElementById('lead-search').value||'').toLowerCase(),st=document.getElementById('lead-status').value;
   var rows=state.leads.filter(function(l){return (!st||l.status===st)&&(!q||[l.name,l.phone,l.email,l.company,l.source].join(' ').toLowerCase().indexOf(q)>=0)});
   document.getElementById('lead-table').innerHTML=leadTable(rows);
   bindRows(document.getElementById('lead-table'));
 };
 el.querySelector('#lead-search').addEventListener('input',draw);el.querySelector('#lead-status').addEventListener('change',draw);draw();bindCommon(el);
}
function leadTable(rows){
 if(!rows.length)return '<div class="empty">Лидов пока нет.</div>';
 return '<div class="tablewrap"><table><thead><tr><th>Лид</th><th>Контакты</th><th>Статус</th><th>Источник</th><th>Последний контакт</th><th></th></tr></thead><tbody>'+
 rows.map(function(l){var a=lastActivityFor('lead',l.id);return '<tr class="clickable" data-edit="lead" data-id="'+esc(l.id)+'"><td><b>'+esc(l.name)+'</b><br><span class="muted">'+esc(l.company||'')+'</span></td><td>'+esc(l.phone||'—')+'<br>'+esc(l.email||'')+'</td><td><span class="pill '+(isStaleLead(l)?'warn':'')+'">'+esc(label(LEAD_STATUSES,l.status))+'</span></td><td>'+esc(l.source||'—')+'</td><td>'+dateTimeText(a&&a.at)+'</td><td><button class="btn" data-convert="'+esc(l.id)+'">Конвертировать</button></td></tr>'}).join('')+
 '</tbody></table></div>';
}
function renderCustomers(){
 var el=document.getElementById('view-customers');
 el.innerHTML='<div class="card"><div class="cardhead"><h2>Клиенты</h2><div class="toolbar"><button class="btn" data-export="customers">CSV</button><button class="btn primary" data-add="customer">+ Клиент</button></div></div><div class="cardbody"><div class="filters"><input id="customer-search" placeholder="Поиск по имени, телефону, email, компании"></div><div id="customer-table"></div></div></div>';
 var draw=function(){var q=(document.getElementById('customer-search').value||'').toLowerCase();var rows=state.customers.filter(function(c){return !q||[c.name,c.phone,c.email,c.company].join(' ').toLowerCase().indexOf(q)>=0});document.getElementById('customer-table').innerHTML=customerTable(rows);bindRows(document.getElementById('customer-table'))};
 el.querySelector('#customer-search').addEventListener('input',draw);draw();bindCommon(el);
}
function customerTable(rows){
 if(!rows.length)return '<div class="empty">Клиентов пока нет.</div>';
 return '<div class="tablewrap"><table><thead><tr><th>Клиент</th><th>Контакты</th><th>Сделок</th><th>Выручка won</th><th>Последняя активность</th></tr></thead><tbody>'+
 rows.map(function(c){var deals=state.deals.filter(function(d){return d.customerId===c.id}),rev=deals.filter(function(d){return d.stage==='won'}).reduce(function(a,d){return a+(Number(d.amount)||0)},0),a=lastActivityFor('customer',c.id);return '<tr class="clickable" data-edit="customer" data-id="'+esc(c.id)+'"><td><b>'+esc(c.name)+'</b><br><span class="muted">'+esc(c.company||'')+'</span></td><td>'+esc(c.phone||'—')+'<br>'+esc(c.email||'')+'</td><td>'+deals.length+'</td><td>'+rub(rev)+'</td><td>'+dateTimeText(a&&a.at)+'</td></tr>'}).join('')+'</tbody></table></div>';
}
function renderDeals(){
 var el=document.getElementById('view-deals');
 el.innerHTML='<div class="card"><div class="cardhead"><h2>Воронка сделок</h2><div class="toolbar"><button class="btn" data-export="deals">CSV</button><button class="btn primary" data-add="deal">+ Сделка</button></div></div><div class="cardbody"><div class="kanban">'+STAGES.filter(function(s){return s.id!=='lost'}).map(function(s){
   var deals=state.deals.filter(function(d){return d.stage===s.id}),sum=deals.reduce(function(a,d){return a+(Number(d.amount)||0)},0);
   return '<div class="stage"><div class="stagehead"><span>'+esc(s.title)+'</span><span>'+deals.length+' · '+rub(sum)+'</span></div>'+deals.map(dealCard).join('')+(deals.length?'':'<div class="empty">Пусто</div>')+'</div>';
 }).join('')+'</div><h3 style="font-family:Unbounded;font-size:14px;margin:18px 0 9px">Проигранные</h3>'+dealTable(state.deals.filter(function(d){return d.stage==='lost'}))+'</div></div>';
 bindCommon(el);bindRows(el);
 el.querySelectorAll('[data-stage]').forEach(function(sel){sel.addEventListener('change',function(e){e.stopPropagation();moveDeal(sel.dataset.stage,sel.value)})});
}
function dealCard(d){
 return '<div class="deal" data-edit="deal" data-id="'+esc(d.id)+'"><strong>'+esc(d.title)+'</strong><span class="sum">'+rub(d.amount)+'</span><small>'+esc(entityName('customer',d.customerId))+' · '+esc(d.owner||'Без ответственного')+'</small><select data-stage="'+esc(d.id)+'" onclick="event.stopPropagation()">'+optionList(STAGES,d.stage)+'</select></div>';
}
function dealTable(rows){
 if(!rows.length)return '<div class="empty">Нет записей.</div>';
 return '<div class="tablewrap"><table><thead><tr><th>Сделка</th><th>Клиент</th><th>Сумма</th><th>Стадия</th><th>Причина</th></tr></thead><tbody>'+rows.map(function(d){return '<tr class="clickable" data-edit="deal" data-id="'+esc(d.id)+'"><td>'+esc(d.title)+'</td><td>'+esc(entityName('customer',d.customerId))+'</td><td>'+rub(d.amount)+'</td><td>'+esc(label(STAGES,d.stage))+'</td><td>'+esc(d.lossReason||'—')+'</td></tr>'}).join('')+'</tbody></table></div>';
}
function renderTasks(){
 var el=document.getElementById('view-tasks'),open=state.tasks.filter(function(t){return !t.done}).sort(function(a,b){return new Date(a.dueAt)-new Date(b.dueAt)}),done=state.tasks.filter(function(t){return t.done}).sort(function(a,b){return new Date(b.completedAt)-new Date(a.completedAt)}).slice(0,30);
 el.innerHTML='<div class="grid cols"><div class="card"><div class="cardhead"><h2>Открытые задачи</h2><button class="btn primary" data-add="task">+ Задача</button></div><div class="cardbody">'+taskTable(open,false)+'</div></div><div class="card"><div class="cardhead"><h2>Выполненные</h2></div><div class="cardbody">'+taskTable(done,false)+'</div></div></div>';
 bindCommon(el);bindRows(el);
}
function taskTable(rows,compact){
 if(!rows.length)return '<div class="empty">Задач нет.</div>';
 return '<div class="tablewrap"><table><thead><tr><th></th><th>Задача</th><th>Срок</th><th>Связь</th>'+(compact?'':'<th>Ответственный</th>')+'</tr></thead><tbody>'+rows.map(function(t){var overdue=!t.done&&new Date(t.dueAt)<new Date();return '<tr class="clickable" data-edit="task" data-id="'+esc(t.id)+'"><td><input type="checkbox" data-done="'+esc(t.id)+'" '+(t.done?'checked':'')+'></td><td><b>'+esc(t.title)+'</b></td><td><span class="pill '+(overdue?'bad':'')+'">'+dateTimeText(t.dueAt)+'</span></td><td>'+esc(entityName(t.entityType,t.entityId))+'</td>'+(compact?'':'<td>'+esc(t.owner||'—')+'</td>')+'</tr>'}).join('')+'</tbody></table></div>';
}
function renderActivities(){
 var el=document.getElementById('view-activities'),rows=state.activities.slice().sort(function(a,b){return new Date(b.at)-new Date(a.at)});
 el.innerHTML='<div class="card"><div class="cardhead"><h2>История активностей</h2><div class="toolbar"><button class="btn" data-export="activities">CSV</button><button class="btn primary" data-add="activity">+ Активность</button></div></div><div class="cardbody">'+activityList(rows)+'</div></div>';
 bindCommon(el);
}
function activityList(rows){
 if(!rows.length)return '<div class="empty">Активностей пока нет.</div>';
 return '<div class="timeline">'+rows.map(function(a){return '<div class="activity '+esc(a.type)+'"><strong>'+esc(label(ACTIVITY_TYPES,a.type))+' · '+esc(entityName(a.entityType,a.entityId))+'</strong><small>'+dateTimeText(a.at)+' · '+esc(a.owner||'Без ответственного')+(a.result?' · '+esc(label(CALL_RESULTS,a.result)):'')+'</small><div style="font-size:11px;margin-top:6px">'+esc(a.note||'—')+'</div></div>'}).join('')+'</div>';
}
function renderCalls(){
 var el=document.getElementById('view-calls'),queue=state.leads.filter(function(l){return ['converted','disqualified'].indexOf(l.status)<0&&!l.doNotCall}).sort(function(a,b){var aa=a.callbackAt?new Date(a.callbackAt).getTime():0,bb=b.callbackAt?new Date(b.callbackAt).getTime():0;return aa-bb});
 var cm=callMetrics();
 el.innerHTML='<div class="grid kpis">'+kpi('Попыток',String(cm.attempts),'Все звонки')+kpi('Дозвонов',String(cm.answered),'Ответили / квалифицированы')+kpi('Connect rate',pct(cm.connect),'Дозвоны / попытки')+kpi('Квалифицировано',String(cm.qualified),'По результатам звонков')+kpi('Qualification rate',pct(cm.qualification),'Квалифицировано / дозвоны')+kpi('В очереди',String(queue.length),'Активные лиды')+'</div>'+
 '<div class="card"><div class="cardhead"><h2>Очередь обзвона</h2><button class="btn primary" data-add="lead">+ Лид</button></div><div class="cardbody"><div class="notice" style="margin-bottom:12px">Телефония не подключена: кнопка фиксирует результат ручного звонка. Для реального dialer, записей разговоров и webhook-событий нужен серверный интеграционный модуль.</div><div class="callqueue">'+
 (queue.length?queue.map(function(l){return '<div class="callitem"><div><strong>'+esc(l.name)+'</strong><small>'+esc(l.phone||'Телефон не указан')+' · '+esc(label(LEAD_STATUSES,l.status))+(l.callbackAt?' · перезвон '+dateTimeText(l.callbackAt):'')+'</small></div><div class="toolbar"><button class="btn" data-edit="lead" data-id="'+esc(l.id)+'">Карточка</button><button class="btn primary" data-call="'+esc(l.id)+'">Результат звонка</button></div></div>'}).join(''):'<div class="empty">Очередь пуста.</div>')+
 '</div></div></div>';
 bindCommon(el);bindRows(el);
 el.querySelectorAll('[data-call]').forEach(function(b){b.addEventListener('click',function(){openCall(b.dataset.call)})});
}
function renderReports(){
 var el=document.getElementById('view-reports'),conv=stageConversions(),cm=callMetrics(),won=state.deals.filter(function(d){return d.stage==='won'}),closed=state.deals.filter(function(d){return d.stage==='won'||d.stage==='lost'}),avg=won.length?won.reduce(function(a,d){return a+(Number(d.amount)||0)},0)/won.length:0,cycle=salesCycle();
 var max=Math.max.apply(null,conv.map(function(x){return x.entered}).concat([1]));
 el.innerHTML='<div class="grid cols"><div class="card"><div class="cardhead"><h2>Конверсия по этапам</h2></div><div class="cardbody">'+conv.map(function(x){return '<div class="barrow"><span>'+esc(label(STAGES,x.from))+' → '+esc(label(STAGES,x.to))+'</span><div class="bar"><i style="width:'+Math.min(100,x.entered/max*100)+'%"></i></div><b>'+pct(x.rate)+'</b></div>'}).join('')+'<div class="footnote">Метрика использует историю стадий: следующий этап / сделки, реально входившие в текущий этап.</div></div></div>'+
 '<div class="card"><div class="cardhead"><h2>Продажи</h2></div><div class="cardbody"><div class="grid" style="grid-template-columns:repeat(2,1fr)">'+kpi('Won',String(won.length),'Выигранные сделки')+kpi('Closed',String(closed.length),'Won + Lost')+kpi('Средний won-чек',rub(avg),'Сумма won / количество won')+kpi('Медианный цикл',cycle.toFixed(1)+' дн.','Создание → выигрыш')+'</div></div></div>'+
 '<div class="card"><div class="cardhead"><h2>Телемаркетинг</h2></div><div class="cardbody"><div class="grid" style="grid-template-columns:repeat(2,1fr)">'+kpi('Попытки',String(cm.attempts),'За всё время')+kpi('Connect rate',pct(cm.connect),'Дозвоны / попытки')+kpi('Квалифицировано',String(cm.qualified),'Результат звонка')+kpi('Qualification',pct(cm.qualification),'Квалифицировано / дозвоны')+'</div></div></div>'+
 '<div class="card"><div class="cardhead"><h2>Причины отказов</h2></div><div class="cardbody">'+lossReasons()+'</div></div></div>';
}
function lossReasons(){
 var lost=state.deals.filter(function(d){return d.stage==='lost'}),map={};lost.forEach(function(d){var r=d.lossReason||'Не указана';map[r]=(map[r]||0)+1});
 var entries=Object.keys(map).map(function(k){return [k,map[k]]}).sort(function(a,b){return b[1]-a[1]});
 if(!entries.length)return '<div class="empty">Проигранных сделок нет.</div>';
 var max=entries[0][1];return entries.map(function(x){return '<div class="barrow"><span>'+esc(x[0])+'</span><div class="bar"><i style="width:'+(x[1]/max*100)+'%"></i></div><b>'+x[1]+'</b></div>'}).join('');
}
function renderSettings(){
 var el=document.getElementById('view-settings');
 el.innerHTML='<div class="grid cols"><div class="card"><div class="cardhead"><h2>Данные</h2></div><div class="cardbody"><label class="field"><span>Лид считается без движения через, дней</span><input id="stale-days" type="number" min="1" max="90" value="'+esc(state.settings.staleDays)+'"></label><div class="toolbar" style="margin-top:12px"><button class="btn primary" id="save-settings">Сохранить</button><button class="btn" id="export-all">Экспорт JSON</button><label class="btn">Импорт JSON<input id="import-all" type="file" accept="application/json" hidden></label></div><div class="dangerbox" style="margin-top:16px"><b>Опасная зона</b><p>Полная очистка удалит локальную CRM из этого браузера.</p><button class="btn danger" id="clear-all">Очистить CRM</button></div></div></div>'+
 '<div class="card"><div class="cardhead"><h2>Интеграции и роли</h2></div><div class="cardbody"><div class="settingsgrid">'+
 integration('Телефония','Не подключена','Для исходящих звонков, записей и webhook-статусов нужен backend и API провайдера.')+
 integration('Email / мессенджеры','Не подключены','Нужны OAuth/API, серверное хранение секретов и журнал доставки.')+
 integration('Формы / webhooks','Не подключены','Нужен серверный endpoint с подписью, идемпотентностью и rate limit.')+
 integration('Командные роли','Недоступны в статике','Без аутентификации нельзя безопасно реализовать Owner / Head / Sales / Telemarketer / Viewer.')+
 '</div></div></div></div>';
 document.getElementById('save-settings').addEventListener('click',function(){state.settings.staleDays=Math.max(1,Number(document.getElementById('stale-days').value)||5);save()});
 document.getElementById('export-all').addEventListener('click',function(){download('raketa-crm-backup-'+today()+'.json',JSON.stringify(state,null,2),'application/json')});
 document.getElementById('import-all').addEventListener('change',importJson);
 document.getElementById('clear-all').addEventListener('click',function(){if(confirm('Удалить ВСЕ данные CRM в этом браузере?')){state=emptyState();save()}});
}
function integration(title,status,text){return '<div class="integration"><strong>'+esc(title)+'</strong><span class="pill warn">'+esc(status)+'</span><p>'+esc(text)+'</p></div>'}
function importJson(e){
 var file=e.target.files&&e.target.files[0];if(!file)return;var reader=new FileReader();
 reader.onload=function(){try{var parsed=JSON.parse(reader.result);if(!parsed||!Array.isArray(parsed.leads)||!Array.isArray(parsed.deals))throw new Error('Неверный формат');state=normalize(parsed);save();toast('Резервная копия импортирована')}catch(err){alert('Не удалось импортировать JSON: '+err.message)}};reader.readAsText(file);
}
function bindCommon(root){
 root.querySelectorAll('[data-add]').forEach(function(b){b.addEventListener('click',function(){openForm(b.dataset.add)})});
 root.querySelectorAll('[data-export]').forEach(function(b){b.addEventListener('click',function(){exportCsv(b.dataset.export)})});
 root.querySelectorAll('[data-done]').forEach(function(b){b.addEventListener('click',function(e){e.stopPropagation();toggleTask(b.dataset.done,b.checked)})});
}
function bindRows(root){
 root.querySelectorAll('[data-edit]').forEach(function(r){r.addEventListener('click',function(e){if(e.target.closest('[data-convert],[data-stage],[data-done]'))return;openForm(r.dataset.edit,r.dataset.id)})});
 root.querySelectorAll('[data-convert]').forEach(function(b){b.addEventListener('click',function(e){e.stopPropagation();convertLead(b.dataset.convert)})});
}
function modal(title,body,foot){
 document.getElementById('modal-title').textContent=title;document.getElementById('modal-body').innerHTML=body;document.getElementById('modal-foot').innerHTML=foot||'<span></span><button class="btn" data-close>Закрыть</button>';document.getElementById('crm-modal').classList.add('open');bindModalClose();
}
function closeModal(){document.getElementById('crm-modal').classList.remove('open')}
function bindModalClose(){document.querySelectorAll('#crm-modal [data-close]').forEach(function(b){b.addEventListener('click',closeModal)})}
function field(name,title,type,value,extra){
 type=type||'text';value=value==null?'':value;extra=extra||'';
 if(type==='textarea')return '<label class="field '+extra+'"><span>'+esc(title)+'</span><textarea name="'+esc(name)+'">'+esc(value)+'</textarea></label>';
 if(type==='select')return '<label class="field '+extra+'"><span>'+esc(title)+'</span><select name="'+esc(name)+'">'+value+'</select></label>';
 return '<label class="field '+extra+'"><span>'+esc(title)+'</span><input name="'+esc(name)+'" type="'+esc(type)+'" value="'+esc(value)+'"></label>';
}
function formData(){return Object.fromEntries(new FormData(document.getElementById('modal-form')).entries())}
function openForm(kind,recordId){
 var arr=kind==='lead'?state.leads:kind==='customer'?state.customers:kind==='deal'?state.deals:kind==='task'?state.tasks:state.activities;
 var x=recordId?arr.find(function(i){return i.id===recordId}):null;var title='',body='';
 if(kind==='lead'){title=x?'Лид':'Новый лид';body=field('name','Имя *','text',x&&x.name)+field('company','Компания','text',x&&x.company)+field('phone','Телефон','tel',x&&x.phone)+field('email','Email','email',x&&x.email)+field('source','Источник','text',x&&x.source)+field('status','Статус','select',optionList(LEAD_STATUSES,x?x.status:'new'))+field('owner','Ответственный','text',x&&x.owner)+field('callbackAt','Перезвонить','datetime-local',toLocalInput(x&&x.callbackAt))+field('note','Комментарий','textarea',x&&x.note,'wide')+field('doNotCall','Не звонить','select','<option value="">Нет</option><option value="1" '+(x&&x.doNotCall?'selected':'')+'>Да</option>')}
 if(kind==='customer'){title=x?'Клиент':'Новый клиент';body=field('name','Имя *','text',x&&x.name)+field('company','Компания','text',x&&x.company)+field('phone','Телефон','tel',x&&x.phone)+field('email','Email','email',x&&x.email)+field('owner','Ответственный','text',x&&x.owner)+field('note','Комментарий','textarea',x&&x.note,'wide')}
 if(kind==='deal'){title=x?'Сделка':'Новая сделка';body=field('title','Название *','text',x&&x.title)+field('amount','Сумма, ₽','number',x&&x.amount)+field('customerId','Клиент','select',customerOptions(x&&x.customerId))+field('stage','Стадия','select',optionList(STAGES,x?x.stage:'new'))+field('owner','Ответственный','text',x&&x.owner)+field('expectedClose','План закрытия','date',x&&x.expectedClose)+field('lossReason','Причина проигрыша','text',x&&x.lossReason)+field('note','Комментарий','textarea',x&&x.note,'wide')}
 if(kind==='task'){title=x?'Задача':'Новая задача';body=field('title','Задача *','text',x&&x.title)+field('dueAt','Срок *','datetime-local',toLocalInput(x&&x.dueAt))+field('owner','Ответственный','text',x&&x.owner)+field('entityType','Тип связи','select',entityTypeOptions(x&&x.entityType))+field('entityId','ID связанной записи','text',x&&x.entityId)+field('note','Комментарий','textarea',x&&x.note,'wide')}
 if(kind==='activity'){title=x?'Активность':'Новая активность';body=field('type','Тип','select',optionList(ACTIVITY_TYPES,x?x.type:'note'))+field('at','Дата и время','datetime-local',toLocalInput(x&&x.at)||toLocalInput(now()))+field('owner','Ответственный','text',x&&x.owner)+field('entityType','Тип связи','select',entityTypeOptions(x&&x.entityType))+field('entityId','ID связанной записи','text',x&&x.entityId)+field('note','Комментарий','textarea',x&&x.note,'wide')}
 modal(title,'<form id="modal-form" class="formgrid">'+body+'</form>',(x?'<button class="btn danger" id="delete-record">Удалить</button>':'<span></span>')+'<div class="toolbar"><button class="btn" data-close>Отмена</button><button class="btn primary" id="save-record">Сохранить</button></div>');
 document.getElementById('save-record').addEventListener('click',function(){saveRecord(kind,recordId)});
 if(x)document.getElementById('delete-record').addEventListener('click',function(){if(confirm('Удалить запись?')){var i=arr.findIndex(function(r){return r.id===recordId});if(i>=0)arr.splice(i,1);closeModal();save()}});
}
function toLocalInput(v){if(!v)return '';var d=new Date(v);if(isNaN(d))return '';var z=new Date(d.getTime()-d.getTimezoneOffset()*60000);return z.toISOString().slice(0,16)}
function customerOptions(value){return '<option value="">Без клиента</option>'+state.customers.map(function(c){return '<option value="'+esc(c.id)+'" '+(c.id===value?'selected':'')+'>'+esc(c.name+(c.company?' · '+c.company:''))+'</option>'}).join('')}
function entityTypeOptions(value){return ['lead','customer','deal'].map(function(k){var t=k==='lead'?'Лид':k==='customer'?'Клиент':'Сделка';return '<option value="'+k+'" '+(k===value?'selected':'')+'>'+t+'</option>'}).join('')}
function saveRecord(kind,recordId){
 var v=formData();if(!v.name&&['lead','customer'].indexOf(kind)>=0){alert('Укажите имя');return}if(kind==='deal'&&!v.title){alert('Укажите название сделки');return}if(kind==='task'&&!v.title){alert('Укажите задачу');return}
 var arr=kind==='lead'?state.leads:kind==='customer'?state.customers:kind==='deal'?state.deals:kind==='task'?state.tasks:state.activities;
 var x=recordId?arr.find(function(i){return i.id===recordId}):null,oldStage=x&&x.stage;
 if(!x){x={id:id(kind),createdAt:now()};arr.unshift(x)}
 Object.keys(v).forEach(function(k){x[k]=v[k]});x.updatedAt=now();
 if(kind==='lead')x.doNotCall=v.doNotCall==='1';
 if(kind==='deal'){x.amount=Number(v.amount)||0;if(!Array.isArray(x.stageHistory))x.stageHistory=[];if(!recordId||oldStage!==x.stage)x.stageHistory.push({stage:x.stage,at:now()});if(x.stage==='won'&&!x.wonAt)x.wonAt=now();if(x.stage==='lost'&&!x.lostAt)x.lostAt=now();if(x.stage!=='won')x.wonAt=null;if(x.stage!=='lost')x.lostAt=null}
 if(kind==='task'){x.dueAt=v.dueAt?new Date(v.dueAt).toISOString():now();x.done=!!x.done}
 if(kind==='activity')x.at=v.at?new Date(v.at).toISOString():now();
 closeModal();save();
}
function moveDeal(dealId,stage){
 var d=state.deals.find(function(x){return x.id===dealId});if(!d||d.stage===stage)return;d.stage=stage;d.updatedAt=now();d.stageHistory=d.stageHistory||[];d.stageHistory.push({stage:stage,at:now()});if(stage==='won')d.wonAt=now();else d.wonAt=null;if(stage==='lost')d.lostAt=now();else d.lostAt=null;save();
}
function toggleTask(taskId,done){var t=state.tasks.find(function(x){return x.id===taskId});if(!t)return;t.done=done;t.completedAt=done?now():null;save()}
function convertLead(leadId){
 var l=state.leads.find(function(x){return x.id===leadId});if(!l||l.status==='converted')return;
 if(!confirm('Создать клиента и сделку из этого лида?'))return;
 var c={id:id('customer'),createdAt:now(),updatedAt:now(),name:l.name,company:l.company||'',phone:l.phone||'',email:l.email||'',owner:l.owner||'',note:'Создан из лида '+l.id};
 state.customers.unshift(c);
 var d={id:id('deal'),createdAt:now(),updatedAt:now(),title:'Сделка — '+l.name,amount:0,customerId:c.id,stage:'qualified',owner:l.owner||'',expectedClose:'',lossReason:'',note:'Создана из лида '+l.id,stageHistory:[{stage:'new',at:l.createdAt||now()},{stage:'qualified',at:now()}]};
 state.deals.unshift(d);l.status='converted';l.convertedAt=now();l.customerId=c.id;l.dealId=d.id;l.updatedAt=now();
 state.activities.unshift({id:id('activity'),createdAt:now(),at:now(),type:'note',entityType:'lead',entityId:l.id,owner:l.owner||'',note:'Лид конвертирован в клиента и сделку'});
 save();
}
function openCall(leadId){
 var l=state.leads.find(function(x){return x.id===leadId});if(!l)return;
 var body=field('result','Результат','select',optionList(CALL_RESULTS,'answered'))+field('owner','Оператор','text',l.owner||'')+field('callbackAt','Перезвонить','datetime-local',toLocalInput(l.callbackAt))+field('note','Комментарий','textarea','','wide');
 modal('Звонок · '+l.name,'<form id="modal-form" class="formgrid">'+body+'</form>','<span></span><div class="toolbar"><button class="btn" data-close>Отмена</button><button class="btn primary" id="save-call">Сохранить результат</button></div>');
 document.getElementById('save-call').addEventListener('click',function(){
   var v=formData(),a={id:id('activity'),createdAt:now(),at:now(),type:'call',entityType:'lead',entityId:l.id,owner:v.owner||l.owner||'',result:v.result,note:v.note||''};state.activities.unshift(a);
   l.lastCallAt=a.at;l.updatedAt=now();
   if(v.result==='qualified')l.status='qualified';else if(v.result==='disqualified'){l.status='disqualified'}else if(v.result==='dnc'){l.doNotCall=true}else if(l.status==='new')l.status='contacted';
   l.callbackAt=v.callbackAt?new Date(v.callbackAt).toISOString():'';
   if(v.callbackAt){state.tasks.unshift({id:id('task'),createdAt:now(),updatedAt:now(),title:'Перезвонить: '+l.name,dueAt:new Date(v.callbackAt).toISOString(),owner:v.owner||l.owner||'',entityType:'lead',entityId:l.id,note:'Создано из результата звонка',done:false})}
   closeModal();save();
 });
}
function exportCsv(kind){
 var rows=state[kind]||[];if(!rows.length){toast('Нет данных для экспорта');return}
 var keys=kind==='leads'?['name','company','phone','email','source','status','owner','createdAt']:kind==='customers'?['name','company','phone','email','owner','createdAt']:kind==='deals'?['title','amount','customerId','stage','owner','expectedClose','lossReason','createdAt']:['type','entityType','entityId','owner','result','note','at'];
 var csv=[keys.join(';')].concat(rows.map(function(r){return keys.map(function(k){return csvSafe(r[k])}).join(';')})).join('\n');
 download('raketa-crm-'+kind+'-'+today()+'.csv','\ufeff'+csv,'text/csv;charset=utf-8');
}
function seedDemo(){
 if(state.leads.length||state.customers.length||state.deals.length)return;
 var c1={id:id('customer'),createdAt:new Date(Date.now()-40*86400000).toISOString(),updatedAt:now(),name:'Анна Волкова',company:'Вектор',phone:'+7 900 111-22-33',email:'anna@example.ru',owner:'Менеджер 1',note:''};
 var c2={id:id('customer'),createdAt:new Date(Date.now()-20*86400000).toISOString(),updatedAt:now(),name:'Илья Соколов',company:'Север',phone:'+7 900 222-33-44',email:'ilya@example.ru',owner:'Менеджер 2',note:''};
 state.customers=[c1,c2];
 state.leads=[
  {id:id('lead'),createdAt:new Date(Date.now()-7*86400000).toISOString(),updatedAt:now(),name:'Мария Орлова',company:'Альфа',phone:'+7 900 333-44-55',email:'',source:'Сайт',status:'new',owner:'Оператор 1',callbackAt:'',note:'',doNotCall:false},
  {id:id('lead'),createdAt:new Date(Date.now()-2*86400000).toISOString(),updatedAt:now(),name:'Денис Миронов',company:'Пульс',phone:'+7 900 444-55-66',email:'',source:'Рекомендация',status:'contacted',owner:'Оператор 1',callbackAt:'',note:'',doNotCall:false}
 ];
 var d1={id:id('deal'),createdAt:new Date(Date.now()-18*86400000).toISOString(),updatedAt:now(),title:'Внедрение',amount:180000,customerId:c1.id,stage:'proposal',owner:'Менеджер 1',expectedClose:'',lossReason:'',note:'',stageHistory:[]};
 d1.stageHistory=[{stage:'new',at:d1.createdAt},{stage:'qualified',at:new Date(Date.now()-15*86400000).toISOString()},{stage:'proposal',at:new Date(Date.now()-8*86400000).toISOString()}];
 var d2={id:id('deal'),createdAt:new Date(Date.now()-12*86400000).toISOString(),updatedAt:now(),title:'Поддержка',amount:90000,customerId:c2.id,stage:'negotiation',owner:'Менеджер 2',expectedClose:'',lossReason:'',note:'',stageHistory:[]};
 d2.stageHistory=[{stage:'new',at:d2.createdAt},{stage:'qualified',at:new Date(Date.now()-10*86400000).toISOString()},{stage:'proposal',at:new Date(Date.now()-7*86400000).toISOString()},{stage:'negotiation',at:new Date(Date.now()-3*86400000).toISOString()}];
 state.deals=[d1,d2];
 state.tasks=[{id:id('task'),createdAt:now(),updatedAt:now(),title:'Уточнить решение по КП',dueAt:new Date(Date.now()+86400000).toISOString(),owner:'Менеджер 1',entityType:'deal',entityId:d1.id,note:'',done:false}];
 persistSilent();
}
function init(){
 document.getElementById('crm-nav').addEventListener('click',function(e){var b=e.target.closest('[data-view]');if(b)showView(b.dataset.view)});
 document.getElementById('crm-modal').addEventListener('click',function(e){if(e.target.id==='crm-modal')closeModal()});
 document.addEventListener('keydown',function(e){if(e.key==='Escape')closeModal()});
 render();
}
init();
})();