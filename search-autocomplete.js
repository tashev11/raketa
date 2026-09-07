(function(){
'use strict';

const TOOLS=[
  {tab:'vat',title:'Калькулятор НДС',desc:'Выделить или начислить НДС',tags:'ндс налог ставка начислить выделить'},
  {tab:'taxes',title:'Налоги 2026',desc:'УСН, патент, НПД и календарь сроков',tags:'налоги усн патент нпд календарь сроки'},
  {tab:'contrib',title:'Взносы ИП',desc:'Фиксированная часть и 1% свыше 300 000 ₽',tags:'взносы ип фиксированные страховые за себя'},
  {tab:'regime',title:'Какой режим выгоднее',desc:'Сравнение УСН, патента и НПД',tags:'режим налогообложения усн патент нпд сравнение выгода'},
  {tab:'deduct',title:'Возврат НДФЛ',desc:'Вычеты за жильё, лечение и обучение',tags:'ндфл вычет возврат налога жилье ипотека лечение обучение иис'},
  {tab:'check',title:'Проверка реквизитов',desc:'ИНН, ОГРН, БИК и счёт по контрольным суммам',tags:'проверка реквизитов инн огрн бик расчетный счет контрольная сумма'},
  {tab:'docs',title:'Документы',desc:'Счёт, КП, акт и договор услуг',tags:'документы счет счёт акт коммерческое предложение договор услуги'}
];

const FALLBACK_INTENTS=[
  {re:/клиент.*не плат|не платит|долг|задолженн|просроч.*оплат/i,words:['претенз','задолж','долг','сверк','пени','дебитор','просроч','оплат']},
  {re:/откры(ть|ваю).*ип|регистрац.*ип|стать.*ип/i,words:['регистрац','ип','налог','режим','усн','патент','заявлен']},
  {re:/нанима.*сотруд|перв.*сотруд|прием.*работ|принять.*работ/i,words:['трудов','прием','сотруд','кадр','зарплат','фот','nda','ответствен']},
  {re:/повыс(ить|ить).*цен|поднят.*цен|измен.*цен/i,words:['цен','прайс','марж','нацен','уведом','стоимост']},
  {re:/налог.*режим|какой.*режим|выбрать.*налог|усн.*патент|патент.*усн/i,words:['режим','усн','патент','нпд','аусн','налог']},
  {re:/кассов.*разрыв|не хватает.*денег|закончат.*деньг/i,words:['кассов','разрыв','денеж','платеж','ддс','остаток']},
  {re:/бизнес.?план|откры(ть|ваю).*бизнес|запуск.*бизнес/i,words:['бизнес-план','запуск','окупаем','безубыточ','бюджет']},
  {re:/провер.*контраг|надежн.*компан|провер.*инн/i,words:['контрагент','инн','реквизит','провер','риск']},
  {re:/самозанят|подрядчик|фрилансер/i,words:['самозанят','подряд','фриланс','нпд','акт','договор']}
];

let active=-1,items=[],closeTimer=0;

function norm(v){return String(v||'').toLowerCase().replace(/ё/g,'е').replace(/[^a-zа-я0-9]+/gi,' ').replace(/\s+/g,' ').trim()}
function tokens(q){return norm(q).split(' ').filter(Boolean)}
function escapeHtml(v){return String(v||'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]))}

function intentWords(q){
  const rk=window.RKCatalog;
  const list=(rk&&rk.intentSearch&&Array.isArray(rk.intentSearch.intents))?rk.intentSearch.intents:FALLBACK_INTENTS;
  const hit=list.find(x=>x&&x.re&&x.re.test(q));
  return hit&&Array.isArray(hit.words)?hit.words.map(norm).filter(Boolean):[];
}

function score(text,title,q,extraWords){
  const h=norm(text),t=norm(title),nq=norm(q),ts=tokens(q);
  if(!nq||nq.length<2)return 0;
  let s=0;
  if(t===nq)s+=220;
  if(t.startsWith(nq))s+=130;
  if(t.includes(nq))s+=85;
  ts.forEach(w=>{if(t===w)s+=70;else if(t.startsWith(w))s+=42;else if(t.includes(w))s+=28;else if(h.includes(w))s+=12});
  extraWords.forEach((w,i)=>{if(h.includes(w))s+=Math.max(15-i,4)});
  return s;
}

function collect(q){
  const intent=intentWords(q),groups=[];
  const taxonomy=window.RKDocumentTaxonomy;
  if(taxonomy&&Array.isArray(taxonomy.items)){
    const docs=taxonomy.items.map(x=>({x,score:score((x.title||'')+' '+(x.groupName||'')+' '+(x.statusLabel||''),x.title||'',q,intent)}))
      .filter(v=>v.score>0).sort((a,b)=>b.score-a.score||String(a.x.title).localeCompare(String(b.x.title),'ru')).slice(0,4).map(v=>{
        const x=v.x,ready=x.status==='ready';
        return {type:'doc',title:x.title,meta:(x.groupName||'Документ')+(ready?' · готов к заполнению':' · '+(x.statusLabel||'каталог')),href:ready?'#template='+encodeURIComponent(x.id):'./documents.html#doc-'+encodeURIComponent(x.id)};
      });
    if(docs.length)groups.push({name:'Документы',items:docs});
  }

  const tools=TOOLS.map(x=>({x,score:score(x.title+' '+x.desc+' '+x.tags,x.title,q,intent)})).filter(v=>v.score>0).sort((a,b)=>b.score-a.score).slice(0,4).map(v=>({type:'tool',title:v.x.title,meta:v.x.desc,href:'#tab='+encodeURIComponent(v.x.tab)}));
  if(tools.length)groups.push({name:'Калькуляторы и инструменты',items:tools});

  const sc=window.RKBusinessServices;
  if(sc&&Array.isArray(sc.services)){
    const services=sc.services.map((x,i)=>{
      const cat=Array.isArray(sc.categories)?sc.categories.find(c=>c.id===x.category):null;
      const type=sc.types&&sc.types[x.type]||'';
      return {x,i,cat,type,score:score((x.title||'')+' '+(x.description||'')+' '+(cat&&cat.title||'')+' '+type,x.title||'',q,intent)};
    }).filter(v=>v.score>0).sort((a,b)=>b.score-a.score).slice(0,4).map(v=>({type:'service',title:v.x.title,meta:(v.cat&&v.cat.title?v.cat.title+' · ':'')+(v.x.description||v.type||'Сервис для бизнеса'),href:'./servisy/service-'+(v.i+1)+'/'}));
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
    .rk-sg-head{padding:7px 18px 5px;font:700 11px/1.2 Onest,system-ui,sans-serif;letter-spacing:.06em;text-transform:uppercase;color:#938c84}
    .rk-sg-item{display:flex;align-items:center;gap:12px;width:100%;border:0;background:#fff;padding:11px 18px;text-align:left;font-family:Onest,system-ui,sans-serif;cursor:pointer;color:#171512}
    .rk-sg-item:hover,.rk-sg-item.is-active{background:#fff5f1}
    .rk-sg-icon{width:34px;height:34px;border-radius:10px;background:#f7f3ee;display:flex;align-items:center;justify-content:center;flex:none;color:#f4511e;font-size:15px;font-weight:800}
    .rk-sg-copy{min-width:0;flex:1}.rk-sg-title{display:block;font-size:14px;font-weight:750;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.rk-sg-meta{display:block;margin-top:2px;font-size:11.5px;color:#89827a;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    .rk-sg-enter{padding:9px 18px 11px;border-top:1px solid #eeeae4;font-size:11px;color:#9a938b;display:flex;justify-content:space-between;gap:16px}.rk-sg-enter b{color:#6e675f;font-weight:650}
    body.rk-autocomplete-open .rk-search-v4-results{display:none!important}
    @media(max-width:720px){#rk-search-suggest{border-radius:16px;margin-top:7px}.rk-sg-item{padding:10px 13px}.rk-sg-head{padding-left:13px}.rk-sg-enter{padding-left:13px;padding-right:13px}.rk-sg-meta{font-size:11px}}
  `;
  document.head.appendChild(s);
}

function ensureBox(){
  const search=document.getElementById('rk-herosearch');
  if(!search)return null;
  let box=document.getElementById('rk-search-suggest');
  if(box&&box.previousElementSibling!==search){box.remove();box=null}
  if(!box){
    box=document.createElement('div');
    box.id='rk-search-suggest';box.setAttribute('role','listbox');box.setAttribute('aria-label','Подсказки поиска');box.hidden=true;
    search.insertAdjacentElement('afterend',box);
  }
  const input=document.getElementById('rk-herosearch-input');
  if(input){input.setAttribute('autocomplete','off');input.setAttribute('aria-autocomplete','list');input.setAttribute('aria-controls','rk-search-suggest');input.setAttribute('aria-expanded',box.hidden?'false':'true')}
  return box;
}

function iconFor(type){return type==='doc'?'Д':type==='tool'?'∑':'С'}

function render(q){
  clearTimeout(closeTimer);
  const box=ensureBox(),input=document.getElementById('rk-herosearch-input');
  if(!box||!input)return;
  const nq=norm(q);
  if(nq.length<2||document.activeElement!==input){close();return}
  const groups=collect(q);items=[];active=-1;
  if(!groups.length){
    box.innerHTML='<div class="rk-sg-enter"><span>Ничего точного не найдено</span><b>Enter — искать по всему каталогу</b></div>';
  }else{
    let html='';
    groups.forEach(g=>{
      html+='<div class="rk-sg-group"><div class="rk-sg-head">'+escapeHtml(g.name)+'</div>';
      g.items.forEach(item=>{
        const idx=items.length;items.push(item);
        html+='<button type="button" class="rk-sg-item" role="option" aria-selected="false" data-rk-sg="'+idx+'"><span class="rk-sg-icon">'+iconFor(item.type)+'</span><span class="rk-sg-copy"><span class="rk-sg-title">'+escapeHtml(item.title)+'</span><span class="rk-sg-meta">'+escapeHtml(item.meta||'')+'</span></span><span aria-hidden="true">→</span></button>';
      });
      html+='</div>';
    });
    html+='<div class="rk-sg-enter"><span>↑ ↓ — выбор · Esc — закрыть</span><b>Enter — открыть</b></div>';
    box.innerHTML=html;
  }
  box.hidden=false;input.setAttribute('aria-expanded','true');document.body.classList.add('rk-autocomplete-open');
}

function close(){
  const box=document.getElementById('rk-search-suggest'),input=document.getElementById('rk-herosearch-input');
  if(box)box.hidden=true;
  if(input){input.setAttribute('aria-expanded','false');input.removeAttribute('aria-activedescendant')}
  document.body.classList.remove('rk-autocomplete-open');active=-1;
}

function updateActive(next){
  const box=document.getElementById('rk-search-suggest'),input=document.getElementById('rk-herosearch-input');
  if(!box||!items.length)return;
  active=(next+items.length)%items.length;
  box.querySelectorAll('[data-rk-sg]').forEach((el,i)=>{
    const on=i===active;el.classList.toggle('is-active',on);el.setAttribute('aria-selected',on?'true':'false');
    if(on){el.id='rk-sg-active';el.scrollIntoView({block:'nearest'})}else if(el.id==='rk-sg-active')el.removeAttribute('id');
  });
  if(input)input.setAttribute('aria-activedescendant','rk-sg-active');
}

function choose(item){
  if(!item)return;
  close();
  const input=document.getElementById('rk-herosearch-input');
  if(input){input.value=item.title;input.dispatchEvent(new Event('input',{bubbles:true}))}
  setTimeout(()=>{window.location.href=item.href},0);
}

function submitAll(){
  close();
  const btn=document.querySelector('#rk-herosearch button');
  if(btn)btn.click();
}

function install(){
  addStyles();ensureBox();
  if(window.__RKAutocompleteInstalled)return;
  window.__RKAutocompleteInstalled=true;
  document.addEventListener('input',e=>{if(e.target&&e.target.id==='rk-herosearch-input')requestAnimationFrame(()=>render(e.target.value))},true);
  document.addEventListener('focusin',e=>{if(e.target&&e.target.id==='rk-herosearch-input')requestAnimationFrame(()=>render(e.target.value))});
  document.addEventListener('focusout',e=>{if(e.target&&e.target.id==='rk-herosearch-input')closeTimer=setTimeout(close,140)});
  document.addEventListener('mousedown',e=>{if(e.target.closest&&e.target.closest('#rk-search-suggest'))clearTimeout(closeTimer)});
  document.addEventListener('click',e=>{
    const row=e.target.closest&&e.target.closest('[data-rk-sg]');
    if(row){e.preventDefault();choose(items[Number(row.getAttribute('data-rk-sg'))]);return}
    if(!e.target.closest||(!e.target.closest('#rk-search-suggest')&&!e.target.closest('#rk-herosearch')))close();
  });
  document.addEventListener('keydown',e=>{
    if(!e.target||e.target.id!=='rk-herosearch-input')return;
    const box=document.getElementById('rk-search-suggest'),open=box&&!box.hidden;
    if(e.key==='ArrowDown'&&open&&items.length){e.preventDefault();updateActive(active+1)}
    else if(e.key==='ArrowUp'&&open&&items.length){e.preventDefault();updateActive(active<0?items.length-1:active-1)}
    else if(e.key==='Escape'&&open){e.preventDefault();close()}
    else if(e.key==='Enter'){
      if(open&&active>=0){e.preventDefault();choose(items[active])}
      else if(norm(e.target.value).length>=2){e.preventDefault();submitAll()}
    }
  });
}

let scheduled=false;
function schedule(){if(scheduled)return;scheduled=true;requestAnimationFrame(()=>{scheduled=false;install()})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});else schedule();
new MutationObserver(schedule).observe(document.documentElement,{childList:true,subtree:true});
})();
