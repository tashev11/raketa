(function(){
'use strict';

const RECENT_KEY='rk_search_recent_v1';
const MAX_RECENT=6;

const CORE_TOOLS=[
  {tab:'vat',title:'Калькулятор НДС',desc:'Выделить или начислить НДС',tags:'ндс налог ставка начислить выделить'},
  {tab:'taxes',title:'Налоги 2026',desc:'УСН, патент, НПД и календарь сроков',tags:'налоги усн патент нпд календарь сроки'},
  {tab:'contrib',title:'Взносы ИП',desc:'Фиксированная часть и 1% свыше 300 000 ₽',tags:'взносы ип фиксированные страховые за себя'},
  {tab:'regime',title:'Какой режим выгоднее',desc:'Сравнение УСН, патента и НПД',tags:'режим налогообложения усн патент нпд сравнение выгода'},
  {tab:'deduct',title:'Возврат НДФЛ',desc:'Вычеты за жильё, лечение и обучение',tags:'ндфл вычет возврат налога жилье ипотека лечение обучение иис'},
  {tab:'check',title:'Проверка реквизитов',desc:'ИНН, ОГРН, БИК и счёт по контрольным суммам',tags:'проверка реквизитов инн огрн бик расчетный счет контрольная сумма'},
  {tab:'docs',title:'Документы',desc:'Счёт, КП, акт и договор услуг',tags:'документы счет акт коммерческое предложение договор услуги'}
];

const FALLBACK_INTENTS=[
  {re:/клиент.*не плат|не платит|долг|задолженн|просроч.*оплат/i,words:['претенз','задолж','долг','сверк','пени','дебитор','просроч','оплат']},
  {re:/откры(ть|ваю).*ип|регистрац.*ип|стать.*ип/i,words:['регистрац','ип','налог','режим','усн','патент','заявлен']},
  {re:/нанима.*сотруд|перв.*сотруд|прием.*работ|принять.*работ/i,words:['трудов','прием','сотруд','кадр','зарплат','фот','nda','ответствен']},
  {re:/повыс(ить|ить).*цен|поднят.*цен|измен.*цен/i,words:['цен','прайс','марж','нацен','уведом','стоимост']},
  {re:/заключ.*договор|нужен.*договор|состав.*договор/i,words:['договор','контрагент','реквизит','услов','соглашен']},
  {re:/налог.*режим|какой.*режим|выбрать.*налог|усн.*патент|патент.*усн/i,words:['режим','усн','патент','нпд','аусн','налог']},
  {re:/кассов.*разрыв|не хватает.*денег|закончат.*деньг/i,words:['кассов','разрыв','денеж','платеж','ддс','остаток']},
  {re:/бизнес.?план|откры(ть|ваю).*бизнес|запуск.*бизнес/i,words:['бизнес план','запуск','окупаем','безубыточ','бюджет']},
  {re:/провер.*контраг|надежн.*компан|провер.*инн/i,words:['контрагент','инн','реквизит','провер','риск']},
  {re:/самозанят|подрядчик|фрилансер/i,words:['самозанят','подряд','фриланс','нпд','акт','договор']}
];

const SYNONYMS=[
  ['счет','счёт','invoice','оплата','выставить счет','выставить счёт'],
  ['акт','закрывающий документ','выполненные работы','оказанные услуги','приемка','приёмка'],
  ['договор','контракт','соглашение','сделка'],
  ['аренда','снять помещение','сдача помещения','офис','помещение','недвижимость'],
  ['зарплата','зп','оклад','сотрудник','работник','фот','фонд оплаты труда'],
  ['выручка','оборот','продажи','доход бизнеса'],
  ['прибыль','заработок','маржа','рентабельность'],
  ['ндс','налог на добавленную стоимость','vat'],
  ['налог','налоги','фнс','енс','усн','патент','нпд','аусн'],
  ['самозанятый','самозанят','нпд','фрилансер','подрядчик'],
  ['контрагент','партнер','партнёр','поставщик','клиент','инн','огрн'],
  ['долг','задолженность','дебиторка','не платит','просрочка','пени'],
  ['маркетплейс','wildberries','wb','вайлдберриз','ozon','озон','яндекс маркет'],
  ['реклама','маркетинг','лид','лиды','клиент','cpl','cac','romi','roas'],
  ['бизнес план','бизнес-план','план бизнеса','запуск бизнеса','открыть бизнес'],
  ['ип','индивидуальный предприниматель','предприниматель'],
  ['ооо','общество с ограниченной ответственностью','компания'],
  ['кассовый разрыв','не хватает денег','закончились деньги','ддс','денежный поток'],
  ['цена','стоимость','прайс','тариф','расценка'],
  ['скидка','дисконт','акция','снижение цены'],
  ['кредит','заем','заём','финансирование','долг'],
  ['лизинг','аренда с выкупом','авто в лизинг','оборудование в лизинг']
];

const POPULAR_BOOST=[
  [/договор оказания услуг/i,34],[/счет на оплату|счёт на оплату/i,34],[/акт выполненных работ/i,32],
  [/калькулятор ндс|ндс: начислить|ндс: выделить/i,30],[/усн/i,22],[/стоимость сотрудника/i,20],
  [/точка безубыточности/i,20],[/бизнес.?план/i,18],[/проверка реквизитов/i,16],[/кассовый разрыв/i,16]
];

let active=-1,items=[],closeTimer=0,lastRendered='';

function norm(v){return String(v||'').toLowerCase().replace(/ё/g,'е').replace(/[^a-zа-я0-9]+/gi,' ').replace(/\s+/g,' ').trim()}
function tokens(q){return norm(q).split(' ').filter(Boolean)}
function words(v){return norm(v).split(' ').filter(Boolean)}
function escapeHtml(v){return String(v||'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]))}

function readRecent(){
  try{const v=JSON.parse(localStorage.getItem(RECENT_KEY)||'[]');return Array.isArray(v)?v.filter(Boolean).slice(0,MAX_RECENT):[]}catch(e){return[]}
}
function saveRecent(q){
  q=String(q||'').trim();if(q.length<2)return;
  try{const n=norm(q),next=[q].concat(readRecent().filter(x=>norm(x)!==n)).slice(0,MAX_RECENT);localStorage.setItem(RECENT_KEY,JSON.stringify(next))}catch(e){}
}
function clearRecent(){try{localStorage.removeItem(RECENT_KEY)}catch(e){};render('')}

function expandSynonyms(q){
  const nq=norm(q),out=new Set(tokens(q));
  SYNONYMS.forEach(group=>{
    const ng=group.map(norm);
    if(ng.some(x=>nq.includes(x)||tokens(q).some(t=>x.includes(t)&&t.length>=3))){ng.forEach(x=>words(x).forEach(w=>out.add(w)))}
  });
  return Array.from(out);
}

function intentWords(q){
  const rk=window.RKCatalog;
  const list=(rk&&rk.intentSearch&&Array.isArray(rk.intentSearch.intents))?rk.intentSearch.intents:FALLBACK_INTENTS;
  const hit=list.find(x=>x&&x.re&&x.re.test(q));
  return hit&&Array.isArray(hit.words)?hit.words.map(norm).filter(Boolean):[];
}

function editDistance(a,b,limit){
  a=norm(a);b=norm(b);if(a===b)return 0;
  if(!a||!b)return Math.max(a.length,b.length);
  const cap=limit||3;
  if(Math.abs(a.length-b.length)>cap)return cap+1;
  let prev=Array.from({length:b.length+1},(_,i)=>i);
  for(let i=1;i<=a.length;i++){
    const cur=new Array(b.length+1);cur[0]=i;let rowMin=cur[0];
    for(let j=1;j<=b.length;j++){
      const cost=a[i-1]===b[j-1]?0:1;
      cur[j]=Math.min(cur[j-1]+1,prev[j]+1,prev[j-1]+cost);
      rowMin=Math.min(rowMin,cur[j]);
    }
    if(rowMin>cap)return cap+1;
    prev=cur;
  }
  return prev[b.length];
}

function typoScore(queryTokens,titleTokens){
  let s=0;
  queryTokens.forEach(q=>{
    if(q.length<4)return;
    let best=99;
    for(const t of titleTokens){
      if(Math.abs(t.length-q.length)>2)continue;
      const d=editDistance(q,t,2);if(d<best)best=d;if(best===0)break;
    }
    if(best===1)s+=24;else if(best===2&&q.length>=6)s+=12;
  });
  return s;
}

function popularity(title){let s=0;POPULAR_BOOST.forEach(([re,v])=>{if(re.test(title))s+=v});return s}

function score(text,title,q,extraWords,ready){
  const h=norm(text),t=norm(title),nq=norm(q),baseTokens=tokens(q),expanded=expandSynonyms(q),titleTokens=words(title);
  if(!nq||nq.length<2)return 0;
  let s=ready?8:0;
  if(t===nq)s+=260;
  if(t.startsWith(nq))s+=150;
  if(t.includes(nq))s+=95;
  baseTokens.forEach(w=>{if(t===w)s+=80;else if(t.startsWith(w))s+=48;else if(t.includes(w))s+=31;else if(h.includes(w))s+=14});
  expanded.forEach(w=>{if(!baseTokens.includes(w)&&h.includes(w))s+=9});
  extraWords.forEach((w,i)=>{if(h.includes(w))s+=Math.max(16-i,4)});
  s+=typoScore(baseTokens,titleTokens);
  s+=popularity(title);
  return s;
}

function collect(q){
  const intent=intentWords(q),groups=[];
  const taxonomy=window.RKDocumentTaxonomy;
  if(taxonomy&&Array.isArray(taxonomy.items)){
    const docs=taxonomy.items.map(x=>({x,score:score((x.title||'')+' '+(x.groupName||'')+' '+(x.statusLabel||''),x.title||'',q,intent,x.status==='ready')}))
      .filter(v=>v.score>0).sort((a,b)=>b.score-a.score||String(a.x.title).localeCompare(String(b.x.title),'ru')).slice(0,5).map(v=>{
        const x=v.x,ready=x.status==='ready';
        return {type:'doc',title:x.title,meta:(x.groupName||'Документ')+(ready?' · готов к заполнению':' · '+(x.statusLabel||'каталог')),href:ready?'#template='+encodeURIComponent(x.id):'./documents.html#doc-'+encodeURIComponent(x.id),query:q};
      });
    if(docs.length)groups.push({name:'Документы',items:docs});
  }

  const calcCatalog=window.RKBusinessCalculatorCatalog;
  let calculators=[];
  if(calcCatalog&&Array.isArray(calcCatalog.items)){
    calculators=calcCatalog.items.map((x,i)=>({x,i,score:score((x.title||'')+' '+(x.category||''),x.title||'',q,intent,true)}))
      .filter(v=>v.score>0).sort((a,b)=>b.score-a.score).slice(0,5).map(v=>({type:'calc',title:v.x.title,meta:v.x.category||'Бизнес-калькулятор',href:'./kalkulyatory/'+v.x.id+'/',query:q}));
  }
  const core=CORE_TOOLS.map(x=>({x,score:score(x.title+' '+x.desc+' '+x.tags,x.title,q,intent,true)})).filter(v=>v.score>0).sort((a,b)=>b.score-a.score).slice(0,3).map(v=>({type:'tool',title:v.x.title,meta:v.x.desc,href:'#tab='+encodeURIComponent(v.x.tab),query:q}));
  const calcSeen=new Set();
  const calcItems=core.concat(calculators).filter(x=>{const k=norm(x.title);if(calcSeen.has(k))return false;calcSeen.add(k);return true}).slice(0,5);
  if(calcItems.length)groups.push({name:'Калькуляторы и инструменты',items:calcItems});

  const sc=window.RKBusinessServices;
  if(sc&&Array.isArray(sc.services)){
    const services=sc.services.map((x,i)=>{
      const cat=Array.isArray(sc.categories)?sc.categories.find(c=>c.id===x.category):null;
      const type=sc.types&&sc.types[x.type]||'';
      return {x,i,cat,type,score:score((x.title||'')+' '+(x.description||'')+' '+(cat&&cat.title||'')+' '+type,x.title||'',q,intent,true)};
    }).filter(v=>v.score>0).sort((a,b)=>b.score-a.score).slice(0,5).map(v=>({type:'service',title:v.x.title,meta:(v.cat&&v.cat.title?v.cat.title+' · ':'')+(v.x.description||v.type||'Сервис для бизнеса'),href:'./servisy/service-'+(v.i+1)+'/',query:q}));
    if(services.length)groups.push({name:'Сервисы',items:services});
  }
  return groups;
}

function addStyles(){
  if(document.getElementById('rk-autocomplete-style'))return;
  const s=document.createElement('style');
  s.id='rk-autocomplete-style';
  s.textContent=`
    #rk-search-suggest{width:100%;max-width:1000px;margin:9px 0 0;background:#fff;border:1px solid #e8e3dc;border-radius:20px;box-shadow:0 18px 50px rgba(38,31,24,.12);overflow:hidden;text-align:left;position:relative;z-index:65}
    #rk-search-suggest[hidden]{display:none!important}
    .rk-sg-group{padding:8px 0}.rk-sg-group+.rk-sg-group{border-top:1px solid #eeeae4}
    .rk-sg-head{padding:7px 18px 5px;font:700 11px/1.2 Onest,system-ui,sans-serif;letter-spacing:.06em;text-transform:uppercase;color:#938c84;display:flex;align-items:center;justify-content:space-between;gap:10px}
    .rk-sg-clear{border:0;background:transparent;color:#aaa29a;font:600 11px Onest,system-ui,sans-serif;cursor:pointer;padding:2px 0;text-transform:none;letter-spacing:0}.rk-sg-clear:hover{color:#f4511e}
    .rk-sg-item{display:flex;align-items:center;gap:12px;width:100%;border:0;background:#fff;padding:11px 18px;text-align:left;font-family:Onest,system-ui,sans-serif;cursor:pointer;color:#171512}
    .rk-sg-item:hover,.rk-sg-item.is-active{background:#fff5f1}
    .rk-sg-icon{width:34px;height:34px;border-radius:10px;background:#f7f3ee;display:flex;align-items:center;justify-content:center;flex:none;color:#f4511e;font-size:14px;font-weight:800}
    .rk-sg-copy{min-width:0;flex:1}.rk-sg-title{display:block;font-size:14px;font-weight:750;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.rk-sg-meta{display:block;margin-top:2px;font-size:11.5px;color:#89827a;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    .rk-sg-enter{padding:9px 18px 11px;border-top:1px solid #eeeae4;font-size:11px;color:#9a938b;display:flex;justify-content:space-between;gap:16px}.rk-sg-enter b{color:#6e675f;font-weight:650}
    body.rk-autocomplete-open .rk-search-v4-results{display:none!important}
    @media(max-width:720px){#rk-search-suggest{border-radius:16px;margin-top:7px}.rk-sg-item{padding:10px 13px}.rk-sg-head{padding-left:13px;padding-right:13px}.rk-sg-enter{padding-left:13px;padding-right:13px}.rk-sg-meta{font-size:11px}}
  `;
  document.head.appendChild(s);
}

function ensureBox(){
  const search=document.getElementById('rk-herosearch');
  if(!search)return null;
  let box=document.getElementById('rk-search-suggest');
  if(box&&box.previousElementSibling!==search){box.remove();box=null}
  if(!box){box=document.createElement('div');box.id='rk-search-suggest';box.setAttribute('role','listbox');box.setAttribute('aria-label','Подсказки поиска');box.hidden=true;search.insertAdjacentElement('afterend',box)}
  const input=document.getElementById('rk-herosearch-input');
  if(input){input.setAttribute('autocomplete','off');input.setAttribute('aria-autocomplete','list');input.setAttribute('aria-controls','rk-search-suggest');input.setAttribute('aria-expanded',box.hidden?'false':'true')}
  return box;
}

function iconFor(type){return type==='doc'?'Д':type==='service'?'С':type==='recent'?'↺':'∑'}

function renderRecent(box,input){
  const recent=readRecent();items=[];active=-1;
  if(!recent.length){close();return}
  let html='<div class="rk-sg-group"><div class="rk-sg-head"><span>Недавние запросы</span><button type="button" class="rk-sg-clear" data-rk-clear-recent>Очистить</button></div>';
  recent.forEach(q=>{const idx=items.length;items.push({type:'recent',title:q,meta:'Искать снова',query:q});html+='<button type="button" class="rk-sg-item" role="option" aria-selected="false" data-rk-sg="'+idx+'"><span class="rk-sg-icon">↺</span><span class="rk-sg-copy"><span class="rk-sg-title">'+escapeHtml(q)+'</span><span class="rk-sg-meta">Искать снова</span></span><span aria-hidden="true">→</span></button>'});
  html+='</div>';
  box.innerHTML=html;box.hidden=false;input.setAttribute('aria-expanded','true');document.body.classList.add('rk-autocomplete-open');
}

function render(q){
  clearTimeout(closeTimer);
  const box=ensureBox(),input=document.getElementById('rk-herosearch-input');
  if(!box||!input)return;
  const nq=norm(q);
  if(document.activeElement!==input){close();return}
  if(!nq){renderRecent(box,input);lastRendered='';return}
  if(nq.length<2){close();return}
  if(nq===lastRendered&&box&&!box.hidden)return;
  lastRendered=nq;
  const groups=collect(q);items=[];active=-1;
  if(!groups.length){box.innerHTML='<div class="rk-sg-enter"><span>Точного совпадения нет</span><b>Enter — искать по всему каталогу</b></div>'}
  else{
    let html='';
    groups.forEach(g=>{
      html+='<div class="rk-sg-group"><div class="rk-sg-head"><span>'+escapeHtml(g.name)+'</span></div>';
      g.items.forEach(item=>{const idx=items.length;items.push(item);html+='<button type="button" class="rk-sg-item" role="option" aria-selected="false" data-rk-sg="'+idx+'"><span class="rk-sg-icon">'+iconFor(item.type)+'</span><span class="rk-sg-copy"><span class="rk-sg-title">'+escapeHtml(item.title)+'</span><span class="rk-sg-meta">'+escapeHtml(item.meta||'')+'</span></span><span aria-hidden="true">→</span></button>'});
      html+='</div>';
    });
    html+='<div class="rk-sg-enter"><span>↑ ↓ — выбор · Esc — закрыть</span><b>Enter — искать</b></div>';
    box.innerHTML=html;
  }
  box.hidden=false;input.setAttribute('aria-expanded','true');document.body.classList.add('rk-autocomplete-open');
}

function close(){
  const box=document.getElementById('rk-search-suggest'),input=document.getElementById('rk-herosearch-input');
  if(box)box.hidden=true;
  if(input){input.setAttribute('aria-expanded','false');input.removeAttribute('aria-activedescendant')}
  document.body.classList.remove('rk-autocomplete-open');active=-1;lastRendered='';
}

function updateActive(next){
  const box=document.getElementById('rk-search-suggest'),input=document.getElementById('rk-herosearch-input');
  if(!box||!items.length)return;
  active=(next+items.length)%items.length;
  box.querySelectorAll('[data-rk-sg]').forEach((el,i)=>{const on=i===active;el.classList.toggle('is-active',on);el.setAttribute('aria-selected',on?'true':'false');if(on){el.id='rk-sg-active';el.scrollIntoView({block:'nearest'})}else if(el.id==='rk-sg-active')el.removeAttribute('id')});
  if(input)input.setAttribute('aria-activedescendant','rk-sg-active');
}

function setQuery(q){
  const input=document.getElementById('rk-herosearch-input');if(!input)return;
  input.focus();input.value=q;input.dispatchEvent(new Event('input',{bubbles:true}));
}

function choose(item){
  if(!item)return;
  if(item.type==='recent'){setQuery(item.query||item.title);return}
  saveRecent(item.query||item.title);close();
  const input=document.getElementById('rk-herosearch-input');if(input)input.value=item.title;
  setTimeout(()=>{window.location.href=item.href},0);
}

function submitAll(){
  const input=document.getElementById('rk-herosearch-input');if(input)saveRecent(input.value);
  close();const btn=document.querySelector('#rk-herosearch button');if(btn)btn.click();
}

function install(){
  addStyles();ensureBox();
  if(window.__RKAutocompleteV2Installed)return;
  window.__RKAutocompleteV2Installed=true;
  document.addEventListener('input',e=>{if(e.target&&e.target.id==='rk-herosearch-input')requestAnimationFrame(()=>render(e.target.value))},true);
  document.addEventListener('focusin',e=>{if(e.target&&e.target.id==='rk-herosearch-input')requestAnimationFrame(()=>render(e.target.value))});
  document.addEventListener('focusout',e=>{if(e.target&&e.target.id==='rk-herosearch-input')closeTimer=setTimeout(close,150)});
  document.addEventListener('mousedown',e=>{if(e.target.closest&&e.target.closest('#rk-search-suggest'))clearTimeout(closeTimer)});
  document.addEventListener('click',e=>{
    const clear=e.target.closest&&e.target.closest('[data-rk-clear-recent]');if(clear){e.preventDefault();clearRecent();return}
    const row=e.target.closest&&e.target.closest('[data-rk-sg]');if(row){e.preventDefault();choose(items[Number(row.getAttribute('data-rk-sg'))]);return}
    if(!e.target.closest||(!e.target.closest('#rk-search-suggest')&&!e.target.closest('#rk-herosearch')))close();
  });
  document.addEventListener('keydown',e=>{
    if(!e.target||e.target.id!=='rk-herosearch-input')return;
    const box=document.getElementById('rk-search-suggest'),open=box&&!box.hidden;
    if(e.key==='ArrowDown'&&open&&items.length){e.preventDefault();updateActive(active<0?0:active+1)}
    else if(e.key==='ArrowUp'&&open&&items.length){e.preventDefault();updateActive(active<0?items.length-1:active-1)}
    else if(e.key==='Escape'&&open){e.preventDefault();close()}
    else if(e.key==='Enter'){
      if(open&&active>=0&&items[active]){e.preventDefault();choose(items[active])}
      else{e.preventDefault();submitAll()}
    }
  },true);
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else install();
setTimeout(install,0);setTimeout(install,500);
window.RKSearchAutocomplete={collect,expandSynonyms,editDistance,readRecent,saveRecent};
})();
