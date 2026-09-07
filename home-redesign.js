(function(){
  'use strict';

  var ORANGE='#F4511E', INK='#171512', MUTED='#77716A', LINE='#EAE5DE', BG='#FCFBF9';

  function icon(name){
    var map={
      doc:'<svg viewBox="0 0 24 24"><path d="M7 3h7l4 4v14H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z"/><path d="M14 3v5h5M9 13h6M9 17h6"/></svg>',
      calc:'<svg viewBox="0 0 24 24"><rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 7h8M8 12h2M14 12h2M8 16h2M14 16h2"/></svg>',
      grid:'<svg viewBox="0 0 24 24"><rect x="4" y="4" width="6" height="6" rx="1"/><rect x="14" y="4" width="6" height="6" rx="1"/><rect x="4" y="14" width="6" height="6" rx="1"/><rect x="14" y="14" width="6" height="6" rx="1"/></svg>',
      tax:'<svg viewBox="0 0 24 24"><path d="M19 5 5 19"/><circle cx="7" cy="7" r="2.3"/><circle cx="17" cy="17" r="2.3"/></svg>',
      money:'<svg viewBox="0 0 24 24"><ellipse cx="12" cy="6" rx="7" ry="3"/><path d="M5 6v5c0 1.7 3.1 3 7 3s7-1.3 7-3V6M5 11v5c0 1.7 3.1 3 7 3s7-1.3 7-3v-5"/></svg>',
      people:'<svg viewBox="0 0 24 24"><circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2.2"/><path d="M3 20c.6-4 2.7-6 6-6s5.4 2 6 6M15 15c3 .1 4.7 1.8 5 5"/></svg>',
      bag:'<svg viewBox="0 0 24 24"><path d="M5 8h14l1 12H4L5 8Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>',
      shield:'<svg viewBox="0 0 24 24"><path d="M12 3 19 6v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3Z"/><path d="m9 12 2 2 4-4"/></svg>',
      arrow:'<svg viewBox="0 0 24 24"><path d="M5 12h14M14 7l5 5-5 5"/></svg>'
    };
    return map[name]||map.grid;
  }

  function addStyles(){
    if(document.getElementById('rk-search-v3-style')) return;
    var s=document.createElement('style');
    s.id='rk-search-v3-style';
    s.textContent='\
      body.rk-search-v3{background:'+BG+'!important;color:'+INK+'}\
      body.rk-search-v3 .rk-flat,body.rk-search-v3 .rk-flat *{border-radius:initial!important;box-shadow:initial!important}\
      .rk-search-v3 #rk-topbar{position:sticky!important;top:0!important;z-index:70!important;background:rgba(252,251,249,.94)!important;backdrop-filter:blur(18px)!important;border-bottom:1px solid rgba(234,229,222,.72)!important;box-shadow:none!important}\
      .rk-search-v3 #rk-topbar>div{max-width:1240px!important;padding:13px 24px!important;min-height:66px!important}\
      .rk-search-v3 #rk-topbar>div>span:first-child{gap:8px!important;font-size:21px!important}\
      .rk-search-v3 #rk-topbar>div>span:first-child>span:first-child{width:33px!important;height:33px!important;border-radius:7px!important;background:'+ORANGE+'!important;box-shadow:none!important}\
      .rk-search-v3 #rk-topword{opacity:1!important;font-family:Unbounded,Onest,sans-serif!important;letter-spacing:-.05em!important}\
      .rk-search-v3 #rk-headsearch,.rk-search-v3 #rk-topbar>div>div:last-child{display:none!important}\
      .rk-search-v3-nav{margin-left:auto;display:flex;align-items:center;gap:4px}\
      .rk-search-v3-nav a{font:600 13px Onest,system-ui,sans-serif;color:#615C56;text-decoration:none;padding:9px 11px;border-radius:10px;transition:.15s}\
      .rk-search-v3-nav a:hover{background:#fff;color:'+ORANGE+'}\
      .rk-search-v3-hero{max-width:1080px!important;min-height:calc(100vh - 66px)!important;margin:0 auto!important;padding:clamp(72px,11vh,126px) 24px 56px!important;text-align:center!important;display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:flex-start!important}\
      .rk-search-v3-logo{display:flex!important;align-items:center!important;justify-content:center!important;gap:14px!important;margin:0 0 21px!important}\
      .rk-search-v3-logo>span:first-child{width:58px!important;height:58px!important;border-radius:12px!important;background:'+ORANGE+'!important;box-shadow:0 8px 24px rgba(244,81,30,.16)!important}\
      .rk-search-v3-logo>span:last-child{font-family:Unbounded,Onest,sans-serif!important;font-size:clamp(39px,6vw,59px)!important;font-weight:800!important;letter-spacing:-.065em!important;color:'+INK+'!important}\
      .rk-search-v3-hero h1{font:700 clamp(23px,2.55vw,31px)/1.2 Onest,system-ui,sans-serif!important;letter-spacing:-.035em!important;margin:0!important;color:'+INK+'!important}\
      .rk-search-v3-sub{font-size:16px;line-height:1.5;color:'+MUTED+';margin:10px 0 31px;max-width:680px}\
      .rk-search-v3 #rk-herosearch{width:100%!important;max-width:1000px!important;margin:0!important;display:flex!important;align-items:center!important;background:#fff!important;border:1px solid #DED9D2!important;border-radius:28px!important;box-shadow:0 13px 42px rgba(47,39,31,.085)!important;overflow:hidden!important;transition:border-color .16s,box-shadow .16s,transform .16s!important}\
      .rk-search-v3 #rk-herosearch:focus-within{border-color:#F2A086!important;box-shadow:0 16px 48px rgba(244,81,30,.12)!important;transform:translateY(-1px)!important}\
      .rk-search-v3 #rk-herosearch>div{flex:1!important;min-width:0!important}\
      .rk-search-v3 #rk-herosearch input{height:84px!important;padding:22px 24px 22px 72px!important;font-size:21px!important;line-height:1!important;background:transparent!important;color:'+INK+'!important}\
      .rk-search-v3 #rk-herosearch input::placeholder{color:#9D9892!important}\
      .rk-search-v3 #rk-herosearch svg{left:26px!important;width:27px!important;height:27px!important;stroke:#85817C!important}\
      .rk-search-v3 #rk-herosearch button{height:68px!important;width:68px!important;min-width:68px!important;margin:8px 9px 8px 0!important;border:0!important;border-radius:50%!important;padding:0!important;background:'+ORANGE+'!important;color:transparent!important;font-size:0!important;position:relative!important}\
      .rk-search-v3 #rk-herosearch button:after{content:"→";position:absolute;inset:0;display:flex;align-items:center;justify-content:center;color:#fff;font-size:25px;font-weight:500}\
      .rk-search-v3 #rk-herosearch button:hover{background:#D94114!important}\
      .rk-search-v3-chips-wrap{margin-top:19px;display:flex;align-items:center;justify-content:center;gap:8px;flex-wrap:wrap}\
      .rk-search-v3-chips-label{font-size:12px;color:#98928B;margin-right:3px}\
      .rk-search-v3-chip{border:1px solid #EAE5DE;background:rgba(255,255,255,.65);color:#625D57;border-radius:999px;padding:8px 12px;font:600 12px Onest,system-ui,sans-serif;cursor:pointer;transition:.15s}\
      .rk-search-v3-chip:hover{background:#fff;border-color:#F1B39C;color:'+ORANGE+'}\
      .rk-search-v3-stats{display:flex;align-items:stretch;justify-content:center;margin-top:42px;color:#88827B}\
      .rk-search-v3-stat{min-width:170px;padding:1px 26px;border-right:1px solid '+LINE+';font-size:12px;line-height:1.35}.rk-search-v3-stat:last-child{border-right:0}.rk-search-v3-stat b{display:block;color:'+INK+';font-size:19px;letter-spacing:-.02em;margin-bottom:3px}.rk-search-v3-stat b em{font-style:normal;color:'+ORANGE+'}\
      .rk-search-v3-scroll{margin-top:auto;padding-top:42px;color:#A09A93;font-size:11px;display:flex;gap:7px;align-items:center}.rk-search-v3-scroll:before{content:"↓";font-size:17px}\
      .rk-search-v3 #rk-tools{max-width:1180px!important;margin:0 auto!important;padding:70px 24px 28px!important}\
      .rk-search-v3 #rk-toollist{max-width:none!important;margin:0!important;display:grid!important;grid-template-columns:repeat(4,minmax(0,1fr))!important;gap:13px!important}\
      .rk-search-v3 #rk-toollist>h2{grid-column:1/-1!important;border:0!important;padding:0!important;margin:0 0 10px!important;font:750 29px/1.16 Onest,system-ui,sans-serif!important;text-transform:none!important;letter-spacing:-.04em!important;color:'+INK+'!important;text-align:left!important}\
      .rk-search-v3 #rk-toollist>.rk-search-v3-dir{display:flex!important;align-items:center!important;gap:14px!important;padding:18px!important;min-height:102px!important;background:#fff!important;border:1px solid #EEE9E3!important;border-radius:18px!important;box-shadow:none!important;transition:.16s!important}\
      .rk-search-v3 #rk-toollist>.rk-search-v3-dir:hover{border-color:#F0B9A5!important;transform:translateY(-2px)!important;background:#fff!important;box-shadow:0 10px 28px rgba(43,34,26,.04)!important}\
      .rk-search-v3 .rk-search-v3-dir>span:first-child{display:none!important}.rk-search-v3 .rk-search-v3-dir>span:nth-child(2){width:43px!important;height:43px!important;border-radius:12px!important;flex:none!important}.rk-search-v3 .rk-search-v3-dir>div{min-width:0!important;text-align:left!important}.rk-search-v3 .rk-search-v3-dir h3{font:700 15px/1.2 Onest,system-ui,sans-serif!important;margin:0!important}.rk-search-v3 .rk-search-v3-dir>div>div{font-size:11.5px!important;line-height:1.4!important;color:#8B857E!important;margin-top:5px!important;display:-webkit-box!important;-webkit-line-clamp:2!important;-webkit-box-orient:vertical!important;overflow:hidden!important}.rk-search-v3 .rk-search-v3-dir>span:last-child{margin-left:auto!important;color:#C3BBB2!important;font-size:17px!important}\
      .rk-search-v3 #rk-all-calculators,.rk-search-v3 #rk-all-services{display:none!important}\
      .rk-search-v3-extra{max-width:1180px;margin:0 auto;padding:48px 24px 0}.rk-search-v3-extra h2{font:750 28px/1.2 Onest,system-ui,sans-serif;letter-spacing:-.04em;margin:0 0 18px}.rk-search-v3-extra p.rk-lead{color:'+MUTED+';font-size:15px;margin:-8px 0 20px}\
      .rk-search-v3-popular{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}.rk-search-v3-tool{border:1px solid #EEE9E3;background:#fff;border-radius:17px;padding:18px;text-align:left;cursor:pointer;min-height:104px;transition:.16s;font-family:Onest,system-ui,sans-serif}.rk-search-v3-tool:hover{transform:translateY(-2px);border-color:#F0B9A5}.rk-search-v3-tool b{display:block;font-size:15px;color:'+INK+';margin-bottom:5px}.rk-search-v3-tool span{font-size:12px;color:#8C867F}.rk-search-v3-tool strong{float:right;color:'+ORANGE+';font-size:18px;font-weight:500}\
      .rk-search-v3-situations{display:flex;flex-wrap:wrap;gap:9px}.rk-search-v3-situation{background:#fff;border:1px solid #EAE5DE;border-radius:999px;padding:11px 15px;color:#5E5953;font:650 13px Onest,system-ui,sans-serif;cursor:pointer;transition:.15s}.rk-search-v3-situation:hover{border-color:#F0AF96;color:'+ORANGE+';background:#FFFDFC}\
      .rk-search-v3-footer-space{height:80px}\
      .rk-search-v3 [style*="max-width:840px"][style*="padding:10px 24px 0"]{max-width:1000px!important;padding:0 24px 18px!important;margin:-28px auto 18px!important;position:relative!important;z-index:5!important}\
      .rk-search-v3 [style*="max-width:840px"][style*="padding:10px 24px 0"] h2{border:0!important;text-transform:none!important;letter-spacing:0!important;font:700 13px Onest,system-ui,sans-serif!important;color:#807A73!important;padding:0 8px 6px!important}\
      .rk-search-v3 [data-template-id],.rk-search-v3 [data-tool-tab]{background:#fff!important;border:1px solid #EEE9E3!important;border-radius:14px!important;margin:7px 0!important;padding:14px 15px!important;box-shadow:none!important}\
      .rk-search-v3 #rk-v2-featured,.rk-search-v3 #rk-home-benefits{display:none!important}\
      @media(max-width:900px){.rk-search-v3 #rk-toollist{grid-template-columns:repeat(2,1fr)!important}.rk-search-v3-popular{grid-template-columns:repeat(2,1fr)}.rk-search-v3-stat{min-width:0;padding:0 18px}}\
      @media(max-width:720px){.rk-search-v3-nav{display:none!important}.rk-search-v3 #rk-topbar>div{padding:11px 14px!important}.rk-search-v3-hero{min-height:auto!important;padding:58px 16px 42px!important}.rk-search-v3-logo{margin-bottom:17px!important}.rk-search-v3-logo>span:first-child{width:48px!important;height:48px!important}.rk-search-v3-sub{font-size:14px;margin-bottom:23px}.rk-search-v3 #rk-herosearch{border-radius:22px!important;flex-direction:row!important}.rk-search-v3 #rk-herosearch input{height:68px!important;font-size:16px!important;padding:17px 10px 17px 52px!important}.rk-search-v3 #rk-herosearch svg{left:19px!important;width:22px!important;height:22px!important}.rk-search-v3 #rk-herosearch button{width:54px!important;min-width:54px!important;height:54px!important;margin:7px 7px 7px 0!important}.rk-search-v3 #rk-herosearch button:after{font-size:21px}.rk-search-v3-chips-wrap{justify-content:flex-start;width:100%}.rk-search-v3-chips-label{width:100%;text-align:left}.rk-search-v3-stats{display:grid;grid-template-columns:1fr 1fr;width:100%;gap:18px;margin-top:30px}.rk-search-v3-stat{border:0!important;padding:0!important}.rk-search-v3-scroll{display:none}.rk-search-v3 #rk-tools{padding:48px 16px 20px!important}.rk-search-v3-extra{padding:42px 16px 0}.rk-search-v3-popular{grid-template-columns:1fr}.rk-search-v3-extra h2,.rk-search-v3 #rk-toollist>h2{font-size:24px!important}}\
      @media(max-width:480px){.rk-search-v3 #rk-toollist{grid-template-columns:1fr!important}.rk-search-v3-hero{padding-top:46px!important}.rk-search-v3-chip:nth-of-type(n+5){display:none}}\
    ';
    document.head.appendChild(s);
  }

  function setQuery(value){
    var input=document.getElementById('rk-herosearch-input');
    if(!input) return;
    input.focus();
    input.value=value;
    input.dispatchEvent(new Event('input',{bubbles:true}));
  }

  function installActions(){
    if(window.__RKSearchV3Actions) return;
    window.__RKSearchV3Actions=true;
    document.addEventListener('click',function(e){
      var q=e.target.closest&&e.target.closest('[data-rk-search-query]');
      if(q){e.preventDefault();setQuery(q.getAttribute('data-rk-search-query')||'');return;}
      var row=e.target.closest&&e.target.closest('[data-rk-row-index]');
      if(row){
        e.preventDefault();
        var list=document.getElementById('rk-toollist');
        var rows=list?Array.prototype.filter.call(list.children,function(el){return el.getAttribute&&el.getAttribute('role')==='link';}).slice(0,7):[];
        var idx=Number(row.getAttribute('data-rk-row-index'));
        if(rows[idx]) rows[idx].click();
      }
    });
  }

  function stats(){
    var d=document.createElement('div');
    d.className='rk-search-v3-stats';
    d.innerHTML='<div class="rk-search-v3-stat"><b><em>200 000+</em></b>шаблонов и вариантов</div><div class="rk-search-v3-stat"><b><em>276</em></b>калькуляторов</div><div class="rk-search-v3-stat"><b><em>468</em></b>бизнес-сервисов</div><div class="rk-search-v3-stat"><b>Бесплатно</b>для предпринимателей</div>';
    return d;
  }

  function chips(){
    var d=document.createElement('div');
    d.className='rk-search-v3-chips-wrap';
    d.innerHTML='<span class="rk-search-v3-chips-label">Популярные запросы:</span>'+
      '<button class="rk-search-v3-chip" data-rk-search-query="Договор аренды">Договор аренды</button>'+
      '<button class="rk-search-v3-chip" data-rk-search-query="Калькулятор НДС">Калькулятор НДС</button>'+
      '<button class="rk-search-v3-chip" data-rk-search-query="Счёт на оплату">Счёт на оплату</button>'+
      '<button class="rk-search-v3-chip" data-rk-search-query="Бизнес-план">Бизнес-план</button>'+
      '<button class="rk-search-v3-chip" data-rk-search-query="Акт выполненных работ">Акт выполненных работ</button>';
    return d;
  }

  function extras(){
    var frag=document.createDocumentFragment();
    var popular=document.createElement('section');
    popular.className='rk-search-v3-extra';
    popular.id='rk-search-v3-popular';
    popular.innerHTML='<h2>Чаще всего ищут</h2><div class="rk-search-v3-popular">'+
      '<button class="rk-search-v3-tool" data-rk-search-query="Счёт на оплату"><strong>→</strong><b>Счёт на оплату</b><span>Создать и заполнить бесплатно</span></button>'+
      '<button class="rk-search-v3-tool" data-rk-search-query="Договор оказания услуг"><strong>→</strong><b>Договор оказания услуг</b><span>Найти подходящий шаблон</span></button>'+
      '<button class="rk-search-v3-tool" data-rk-search-query="Калькулятор НДС"><strong>→</strong><b>Калькулятор НДС</b><span>Начислить или выделить НДС</span></button>'+
      '<button class="rk-search-v3-tool" data-rk-search-query="Акт выполненных работ"><strong>→</strong><b>Акт выполненных работ</b><span>Создать документ онлайн</span></button>'+
      '<button class="rk-search-v3-tool" data-rk-search-query="Точка безубыточности"><strong>→</strong><b>Точка безубыточности</b><span>Рассчитать для бизнеса</span></button>'+
      '<button class="rk-search-v3-tool" data-rk-search-query="Бизнес-план"><strong>→</strong><b>Бизнес-план</b><span>Найти мастер и шаблоны</span></button>'+
      '</div>';
    frag.appendChild(popular);

    var situations=document.createElement('section');
    situations.className='rk-search-v3-extra';
    situations.id='rk-search-v3-situations';
    situations.innerHTML='<h2>Ищите по ситуации</h2><p class="rk-lead">Не обязательно знать название документа или сервиса — напишите задачу своими словами.</p><div class="rk-search-v3-situations">'+
      '<button class="rk-search-v3-situation" data-rk-search-query="Клиент не платит">Клиент не платит</button>'+
      '<button class="rk-search-v3-situation" data-rk-search-query="Хочу открыть ИП">Хочу открыть ИП</button>'+
      '<button class="rk-search-v3-situation" data-rk-search-query="Нанимаю первого сотрудника">Нанимаю первого сотрудника</button>'+
      '<button class="rk-search-v3-situation" data-rk-search-query="Хочу повысить цены">Хочу повысить цены</button>'+
      '<button class="rk-search-v3-situation" data-rk-search-query="Нужно заключить договор">Нужно заключить договор</button>'+
      '<button class="rk-search-v3-situation" data-rk-search-query="Какой налоговый режим выбрать">Какой налоговый режим выбрать</button>'+
      '</div><div class="rk-search-v3-footer-space"></div>';
    frag.appendChild(situations);
    return frag;
  }

  function apply(){
    var search=document.getElementById('rk-herosearch');
    var tools=document.getElementById('rk-tools');
    var topbar=document.getElementById('rk-topbar');
    if(!search||!tools||!topbar) return false;

    document.body.classList.remove('rk-home-v2','rk-search-home');
    document.body.classList.add('rk-search-v3');
    addStyles();
    installActions();

    var landing=topbar.parentElement;
    if(landing&&landing.classList.contains('rk-flat')) landing.classList.remove('rk-flat');

    var topInner=topbar.firstElementChild;
    if(topInner){
      var old=topInner.querySelector('.rk-v2-nav,.rk-search-nav,.rk-search-v3-nav');
      if(old) old.remove();
      var nav=document.createElement('nav');
      nav.className='rk-search-v3-nav';
      nav.innerHTML='<a href="./dokumenty.html">Документы</a><a href="./kalkulyatory.html">Калькуляторы</a><a href="./servisy.html">Сервисы</a><a href="./#tab=taxes">Налоги 2026</a>';
      topInner.appendChild(nav);
    }

    var hero=search.parentElement;
    hero.classList.remove('rk-home-hero','rk-search-hero');
    hero.classList.add('rk-search-v3-hero');

    Array.prototype.forEach.call(hero.querySelectorAll('.rk-v2-visual,.rk-v2-badge,.rk-v2-sub,.rk-search-sub,.rk-search-stats,.rk-search-v3-stats,.rk-search-v3-chips-wrap,.rk-search-v3-scroll'),function(x){x.remove();});

    var originalChips=search.nextElementSibling;
    if(originalChips&&originalChips!==hero.querySelector('h1')) originalChips.style.display='none';
    var originalNote=originalChips&&originalChips.nextElementSibling;
    if(originalNote) originalNote.style.display='none';

    var first=hero.firstElementChild;
    if(first&&first!==hero.querySelector('h1')&&first.id!=='rk-herosearch'){
      first.classList.remove('rk-v2-hide','rk-search-logo');
      first.classList.add('rk-search-v3-logo');
      first.style.display='flex';
    }

    var h1=hero.querySelector('h1');
    if(h1) h1.textContent='Найдётся всё для вашего бизнеса';

    var sub=document.createElement('div');
    sub.className='rk-search-v3-sub';
    sub.textContent='Документы, калькуляторы и сервисы для ежедневных задач предпринимателя.';
    hero.insertBefore(sub,search);

    var input=document.getElementById('rk-herosearch-input');
    if(input) input.placeholder='Например: договор аренды, калькулятор НДС, счёт на оплату...';

    search.insertAdjacentElement('afterend',chips());
    var c=hero.querySelector('.rk-search-v3-chips-wrap');
    c.insertAdjacentElement('afterend',stats());
    var scroll=document.createElement('div');
    scroll.className='rk-search-v3-scroll';
    scroll.textContent='Прокрутите, чтобы выбрать направление';
    hero.appendChild(scroll);

    var list=document.getElementById('rk-toollist');
    if(list){
      var heading=list.querySelector('h2'); if(heading) heading.textContent='Что вы хотите сделать?';
      Array.prototype.filter.call(list.children,function(el){return el.getAttribute&&el.getAttribute('role')==='link';}).slice(0,7).forEach(function(row){row.classList.remove('rk-v2-dir','rk-search-dir');row.classList.add('rk-search-v3-dir');});
    }

    var oldPopular=document.getElementById('rk-search-v3-popular'); if(oldPopular) oldPopular.remove();
    var oldSituations=document.getElementById('rk-search-v3-situations'); if(oldSituations) oldSituations.remove();
    var anchor=tools;
    var ex=extras();
    anchor.parentNode.insertBefore(ex,anchor.nextSibling);
    return true;
  }

  var queued=false;
  function schedule(){if(queued)return;queued=true;requestAnimationFrame(function(){queued=false;apply();});}
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',schedule,{once:true}); else schedule();
  new MutationObserver(schedule).observe(document.documentElement,{childList:true,subtree:true});
})();
