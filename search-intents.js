(function(){
'use strict';
const RK=window.RKCatalog,T=window.RKDocumentTaxonomy,SC=window.RKBusinessServices;
if(!RK||typeof RK.install!=='function')return;

const intents=[
 {re:/клиент.*не плат|не платит|долг|задолженн|просроч.*оплат/i, words:['претенз','задолж','долг','сверк','пени','дебитор','просроч','оплат']},
 {re:/откры(ть|ваю).*ип|регистрац.*ип|стать.*ип/i, words:['регистрац','ип','налог','режим','усн','патент','заявлен']},
 {re:/нанима.*сотруд|перв.*сотруд|прием.*работ|принять.*работ/i, words:['трудов','прием','сотруд','кадр','зарплат','фот','nda','ответствен']},
 {re:/повыс(ить|ить).*цен|поднят.*цен|измен.*цен/i, words:['цен','прайс','марж','нацен','уведом','стоимост']},
 {re:/заключ.*договор|нужен.*договор|состав.*договор/i, words:['договор','контрагент','реквизит','услов','соглашен']},
 {re:/налог.*режим|какой.*режим|выбрать.*налог|усн.*патент|патент.*усн/i, words:['режим','усн','патент','нпд','аусн','налог']},
 {re:/кассов.*разрыв|не хватает.*денег|закончат.*деньг/i, words:['кассов','разрыв','денеж','платеж','ддс','остаток']},
 {re:/бизнес.?план|откры(ть|ваю).*бизнес|запуск.*бизнес/i, words:['бизнес-план','запуск','окупаем','безубыточ','бюджет']},
 {re:/провер.*контраг|надежн.*компан|провер.*инн/i, words:['контрагент','инн','реквизит','провер','риск']},
 {re:/самозанят|подрядчик|фрилансер/i, words:['самозанят','подряд','фриланс','нпд','акт','договор']}
];

function norm(v){return String(v||'').toLowerCase().replace(/ё/g,'е')}
function intentFor(q){return intents.find(x=>x.re.test(q))}
function scoreText(text,words){
 const h=norm(text);let s=0;
 words.forEach((w,i)=>{if(h.includes(norm(w)))s+=Math.max(12-i,3)});
 return s;
}

function documentResults(words){
 if(!T||!Array.isArray(T.items))return[];
 return T.items.map(x=>({x,score:scoreText((x.title||'')+' '+(x.groupName||'')+' '+(x.statusLabel||''),words)}))
  .filter(v=>v.score>0).sort((a,b)=>b.score-a.score).slice(0,5).map(v=>{
   const x=v.x,ready=x.status==='ready';
   return {
    kind:'Документ',title:x.title,
    desc:ready?'Готовый документ — можно открыть и заполнить.':(x.statusLabel||'Тип документа'),
    meta:(x.groupName||'Документы')+' · '+(x.statusLabel||''),
    href:ready?'#template='+encodeURIComponent(x.id):'./documents.html#doc-'+encodeURIComponent(x.id),
    templateId:ready?x.id:'',toolTab:''
   };
  });
}

function serviceResults(words){
 if(!SC||!Array.isArray(SC.services))return[];
 return SC.services.map((s,i)=>{
   const cat=SC.categories&&SC.categories.find(c=>c.id===s.category);
   const text=(s.title||'')+' '+(s.description||'')+' '+(cat?.title||'')+' '+(SC.types?.[s.type]||'');
   return {s,i,cat,score:scoreText(text,words)};
  }).filter(v=>v.score>0).sort((a,b)=>b.score-a.score).slice(0,5).map(v=>({
    kind:'Сервис',title:v.s.title,desc:v.s.description||'Инструмент для предпринимателя',
    meta:(v.cat?.title||'Сервисы')+' · '+(SC.types?.[v.s.type]||''),
    href:'./servisy/service-'+(v.i+1)+'/',templateId:'',toolTab:''
  }));
}

const prev=RK.install;
RK.install=function(Component){
 prev(Component);
 const proto=Component&&Component.prototype;
 if(!proto||proto.__rkIntentSearchInstalled)return;
 proto.__rkIntentSearchInstalled=true;
 const old=proto.renderVals;
 proto.renderVals=function(){
   const vals=old.call(this);
   const q=norm(vals.searchQuery||this.state?.searchQuery||'').trim();
   const intent=intentFor(q);
   if(!intent)return vals;
   const current=Array.isArray(vals.searchResults)?vals.searchResults:[];
   const extra=documentResults(intent.words).concat(serviceResults(intent.words));
   const seen=new Set();
   vals.searchResults=extra.concat(current).filter(r=>{
     const key=norm((r.kind||'')+'|'+(r.title||'')+'|'+(r.href||''));
     if(seen.has(key))return false;seen.add(key);return true;
   }).slice(0,18);
   vals.hasSearchResults=vals.searchResults.length>0;
   vals.searchNoResults=!vals.hasSearchResults;
   vals.searchSummaryText=vals.searchResults.length+' результатов';
   return vals;
 };
};
RK.intentSearch={intents};
})();