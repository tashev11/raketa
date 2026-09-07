(function(){
  'use strict';

  function setQuery(value){
    var input=document.getElementById('rk-herosearch-input');
    if(!input) return;
    input.focus();
    input.value=value;
    input.dispatchEvent(new Event('input',{bubbles:true}));
  }

  function installActions(){
    if(window.__RKSearchV4Actions) return;
    window.__RKSearchV4Actions=true;
    document.addEventListener('click',function(e){
      var q=e.target.closest&&e.target.closest('[data-rk-search-query]');
      if(q){
        e.preventDefault();
        setQuery(q.getAttribute('data-rk-search-query')||'');
      }
    });
  }

  function addStyles(){
    if(document.getElementById('rk-search-v4-style')) return;
    var s=document.createElement('style');
    s.id='rk-search-v4-style';
    s.textContent=`
      body.rk-search-v4{background:#fcfbf9!important;color:#171512}
      body.rk-search-v4 .rk-flat,body.rk-search-v4 .rk-flat *{border-radius:initial!important;box-shadow:initial!important}

      .rk-search-v4 #rk-topbar{position:sticky!important;top:0!important;z-index:70!important;background:rgba(252,251,249,.95)!important;backdrop-filter:blur(18px)!important;border-bottom:1px solid rgba(234,229,222,.72)!important;box-shadow:none!important}
      .rk-search-v4 #rk-topbar>div{max-width:1240px!important;padding:13px 24px!important;min-height:66px!important}
      .rk-search-v4 #rk-topbar>div>span:first-child{gap:8px!important;font-size:21px!important}
      .rk-search-v4 #rk-topbar>div>span:first-child>span:first-child{width:33px!important;height:33px!important;border-radius:7px!important;background:#f4511e!important;box-shadow:none!important}
      .rk-search-v4 #rk-topword{opacity:1!important;font-family:Unbounded,Onest,sans-serif!important;letter-spacing:-.05em!important}
      .rk-search-v4 #rk-headsearch,.rk-search-v4 #rk-topbar>div>div:last-child{display:none!important}
      .rk-search-v4-nav{margin-left:auto;display:flex;align-items:center;gap:4px}
      .rk-search-v4-nav a{font:600 13px Onest,system-ui,sans-serif;color:#615c56;text-decoration:none;padding:9px 11px;border-radius:10px;transition:.15s}
      .rk-search-v4-nav a:hover{background:#fff;color:#f4511e}

      .rk-search-v4-hero{max-width:1080px!important;min-height:calc(100vh - 66px)!important;margin:0 auto!important;padding:clamp(68px,10vh,116px) 24px 48px!important;text-align:center!important;display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:flex-start!important}
      .rk-search-v4-logo{display:flex!important;align-items:center!important;justify-content:center!important;gap:14px!important;margin:0 0 20px!important}
      .rk-search-v4-logo>span:first-child{width:58px!important;height:58px!important;border-radius:12px!important;background:#f4511e!important;box-shadow:0 8px 24px rgba(244,81,30,.16)!important}
      .rk-search-v4-logo>span:last-child{font-family:Unbounded,Onest,sans-serif!important;font-size:clamp(39px,6vw,59px)!important;font-weight:800!important;letter-spacing:-.065em!important;color:#171512!important}
      .rk-search-v4-hero h1{font:700 clamp(23px,2.55vw,31px)/1.2 Onest,system-ui,sans-serif!important;letter-spacing:-.035em!important;margin:0!important;color:#171512!important}
      .rk-search-v4-sub{font-size:16px;line-height:1.5;color:#77716a;margin:10px 0 31px;max-width:680px}

      .rk-search-v4 #rk-herosearch{width:100%!important;max-width:1000px!important;margin:0!important;display:flex!important;align-items:center!important;background:#fff!important;border:1px solid #ded9d2!important;border-radius:28px!important;box-shadow:0 13px 42px rgba(47,39,31,.085)!important;overflow:hidden!important;transition:border-color .16s,box-shadow .16s,transform .16s!important}
      .rk-search-v4 #rk-herosearch:focus-within{border-color:#f2a086!important;box-shadow:0 16px 48px rgba(244,81,30,.12)!important;transform:translateY(-1px)!important}
      .rk-search-v4 #rk-herosearch>div{flex:1!important;min-width:0!important}
      .rk-search-v4 #rk-herosearch input{height:84px!important;padding:22px 24px 22px 72px!important;font-size:21px!important;line-height:1!important;background:transparent!important;color:#171512!important}
      .rk-search-v4 #rk-herosearch input::placeholder{color:#9d9892!important}
      .rk-search-v4 #rk-herosearch svg{left:26px!important;width:27px!important;height:27px!important;stroke:#85817c!important}
      .rk-search-v4 #rk-herosearch button{height:68px!important;width:68px!important;min-width:68px!important;margin:8px 9px 8px 0!important;border:0!important;border-radius:50%!important;padding:0!important;background:#f4511e!important;color:transparent!important;font-size:0!important;position:relative!important}
      .rk-search-v4 #rk-herosearch button:after{content:"→";position:absolute;inset:0;display:flex;align-items:center;justify-content:center;color:#fff;font-size:25px;font-weight:500}
      .rk-search-v4 #rk-herosearch button:hover{background:#d94114!important}

      .rk-search-v4-chips{margin-top:19px;display:flex;align-items:center;justify-content:center;gap:8px;flex-wrap:wrap}
      .rk-search-v4-chips-label{font-size:12px;color:#98928b;margin-right:3px}
      .rk-search-v4-chip{border:1px solid #eae5de;background:rgba(255,255,255,.68);color:#625d57;border-radius:999px;padding:8px 12px;font:600 12px Onest,system-ui,sans-serif;cursor:pointer;transition:.15s}
      .rk-search-v4-chip:hover{background:#fff;border-color:#f1b39c;color:#f4511e}

      .rk-search-v4-stats{display:flex;align-items:stretch;justify-content:center;margin-top:42px;color:#88827b}
      .rk-search-v4-stat{min-width:170px;padding:1px 26px;border-right:1px solid #eae5de;font-size:12px;line-height:1.35}
      .rk-search-v4-stat:last-child{border-right:0}
      .rk-search-v4-stat b{display:block;color:#171512;font-size:19px;letter-spacing:-.02em;margin-bottom:3px}
      .rk-search-v4-stat b em{font-style:normal;color:#f4511e}
      .rk-search-v4-scroll{margin-top:auto;padding-top:38px;color:#a09a93;font-size:11px;display:flex;gap:7px;align-items:center}
      .rk-search-v4-scroll:before{content:"↓";font-size:17px}

      .rk-search-v4-results{width:100%!important;max-width:1000px!important;padding:13px 0 0!important;margin:0!important;text-align:left!important}
      .rk-search-v4-results h2{border:0!important;text-transform:none!important;letter-spacing:0!important;font:700 13px Onest,system-ui,sans-serif!important;color:#807a73!important;padding:5px 8px!important;margin:0!important}
      .rk-search-v4-results [data-template-id],.rk-search-v4-results [data-tool-tab]{background:#fff!important;border:1px solid #eee9e3!important;border-radius:14px!important;margin:7px 0!important;padding:14px 15px!important;box-shadow:none!important}
      .rk-search-v4-results [data-template-id]:hover,.rk-search-v4-results [data-tool-tab]:hover{border-color:#efb39d!important}

      .rk-search-v4 #rk-tools{max-width:1180px!important;margin:0 auto!important;padding:70px 24px 28px!important}
      .rk-search-v4 #rk-toollist{max-width:none!important;margin:0!important;display:grid!important;grid-template-columns:repeat(4,minmax(0,1fr))!important;gap:13px!important}
      .rk-search-v4 #rk-toollist>h2{grid-column:1/-1!important;border:0!important;padding:0!important;margin:0 0 10px!important;font:750 29px/1.16 Onest,system-ui,sans-serif!important;text-transform:none!important;letter-spacing:-.04em!important;color:#171512!important;text-align:left!important}
      .rk-search-v4 #rk-toollist>.rk-search-v4-dir{display:flex!important;align-items:center!important;gap:14px!important;padding:18px!important;min-height:102px!important;background:#fff!important;border:1px solid #eee9e3!important;border-radius:18px!important;box-shadow:none!important;transition:.16s!important}
      .rk-search-v4 #rk-toollist>.rk-search-v4-dir:hover{border-color:#f0b9a5!important;transform:translateY(-2px)!important;background:#fff!important;box-shadow:0 10px 28px rgba(43,34,26,.04)!important}
      .rk-search-v4 .rk-search-v4-dir>span:first-child{display:none!important}
      .rk-search-v4 .rk-search-v4-dir>span:nth-child(2){width:43px!important;height:43px!important;border-radius:12px!important;flex:none!important}
      .rk-search-v4 .rk-search-v4-dir>div{min-width:0!important;text-align:left!important}
      .rk-search-v4 .rk-search-v4-dir h3{font:700 15px/1.2 Onest,system-ui,sans-serif!important;margin:0!important}
      .rk-search-v4 .rk-search-v4-dir>div>div{font-size:11.5px!important;line-height:1.4!important;color:#8b857e!important;margin-top:5px!important;display:-webkit-box!important;-webkit-line-clamp:2!important;-webkit-box-orient:vertical!important;overflow:hidden!important}
      .rk-search-v4 .rk-search-v4-dir>span:last-child{margin-left:auto!important;color:#c3bbb2!important;font-size:17px!important}
      .rk-search-v4 #rk-all-calculators,.rk-search-v4 #rk-all-services{display:none!important}

      .rk-search-v4-extra{max-width:1180px;margin:0 auto;padding:48px 24px 0}
      .rk-search-v4-extra h2{font:750 28px/1.2 Onest,system-ui,sans-serif;letter-spacing:-.04em;margin:0 0 18px}
      .rk-search-v4-extra p{color:#77716a;font-size:15px;margin:-8px 0 20px}
      .rk-search-v4-popular{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}
      .rk-search-v4-tool{border:1px solid #eee9e3;background:#fff;border-radius:17px;padding:18px;text-align:left;cursor:pointer;min-height:104px;transition:.16s;font-family:Onest,system-ui,sans-serif}
      .rk-search-v4-tool:hover{transform:translateY(-2px);border-color:#f0b9a5}
      .rk-search-v4-tool b{display:block;font-size:15px;color:#171512;margin-bottom:5px}
      .rk-search-v4-tool span{font-size:12px;color:#8c867f}
      .rk-search-v4-tool strong{float:right;color:#f4511e;font-size:18px;font-weight:500}
      .rk-search-v4-situations{display:flex;flex-wrap:wrap;gap:9px}
      .rk-search-v4-situation{background:#fff;border:1px solid #eae5de;border-radius:999px;padding:11px 15px;color:#5e5953;font:650 13px Onest,system-ui,sans-serif;cursor:pointer;transition:.15s}
      .rk-search-v4-situation:hover{border-color:#f0af96;color:#f4511e;background:#fffdfc}
      .rk-search-v4-space{height:80px}
      .rk-search-v4 #rk-v2-featured,.rk-search-v4 #rk-home-benefits{display:none!important}

      @media(max-width:900px){
        .rk-search-v4 #rk-toollist{grid-template-columns:repeat(2,1fr)!important}
        .rk-search-v4-popular{grid-template-columns:repeat(2,1fr)}
        .rk-search-v4-stat{min-width:0;padding:0 18px}
      }
      @media(max-width:720px){
        .rk-search-v4-nav{display:none!important}
        .rk-search-v4 #rk-topbar>div{padding:11px 14px!important}
        .rk-search-v4-hero{min-height:auto!important;padding:54px 16px 42px!important}
        .rk-search-v4-logo{margin-bottom:17px!important}
        .rk-search-v4-logo>span:first-child{width:48px!important;height:48px!important}
        .rk-search-v4-sub{font-size:14px;margin-bottom:23px}
        .rk-search-v4 #rk-herosearch{border-radius:22px!important;flex-direction:row!important}
        .rk-search-v4 #rk-herosearch input{height:68px!important;font-size:16px!important;padding:17px 10px 17px 52px!important}
        .rk-search-v4 #rk-herosearch svg{left:19px!important;width:22px!important;height:22px!important}
        .rk-search-v4 #rk-herosearch button{width:54px!important;min-width:54px!important;height:54px!important;margin:7px 7px 7px 0!important}
        .rk-search-v4 #rk-herosearch button:after{font-size:21px}
        .rk-search-v4-chips{justify-content:flex-start;width:100%}
        .rk-search-v4-chips-label{width:100%;text-align:left}
        .rk-search-v4-stats{display:grid;grid-template-columns:1fr 1fr;width:100%;gap:18px;margin-top:30px}
        .rk-search-v4-stat{border:0!important;padding:0!important}
        .rk-search-v4-scroll{display:none}
        .rk-search-v4 #rk-tools{padding:48px 16px 20px!important}
        .rk-search-v4-extra{padding:42px 16px 0}
        .rk-search-v4-popular{grid-template-columns:1fr}
        .rk-search-v4-extra h2,.rk-search-v4 #rk-toollist>h2{font-size:24px!important}
      }
      @media(max-width:480px){
        .rk-search-v4 #rk-toollist{grid-template-columns:1fr!important}
        .rk-search-v4-hero{padding-top:44px!important}
        .rk-search-v4-chip:nth-of-type(n+5){display:none}
      }
    `;
    document.head.appendChild(s);
  }

  function createChips(){
    var d=document.createElement('div');
    d.className='rk-search-v4-chips';
    d.innerHTML='<span class="rk-search-v4-chips-label">Популярные запросы:</span>'+ 
      '<button class="rk-search-v4-chip" data-rk-search-query="Договор аренды">Договор аренды</button>'+ 
      '<button class="rk-search-v4-chip" data-rk-search-query="Калькулятор НДС">Калькулятор НДС</button>'+ 
      '<button class="rk-search-v4-chip" data-rk-search-query="Счёт на оплату">Счёт на оплату</button>'+ 
      '<button class="rk-search-v4-chip" data-rk-search-query="Бизнес-план">Бизнес-план</button>'+ 
      '<button class="rk-search-v4-chip" data-rk-search-query="Акт выполненных работ">Акт выполненных работ</button>';
    return d;
  }

  function createStats(){
    var d=document.createElement('div');
    d.className='rk-search-v4-stats';
    d.innerHTML='<div class="rk-search-v4-stat"><b><em>200 000+</em></b>шаблонов и вариантов</div>'+ 
      '<div class="rk-search-v4-stat"><b><em>276</em></b>калькуляторов</div>'+ 
      '<div class="rk-search-v4-stat"><b><em>468</em></b>бизнес-сервисов</div>'+ 
      '<div class="rk-search-v4-stat"><b>Бесплатно</b>для предпринимателей</div>';
    return d;
  }

  function createPopular(){
    var s=document.createElement('section');
    s.id='rk-search-v4-popular';
    s.className='rk-search-v4-extra';
    s.innerHTML='<h2>Чаще всего ищут</h2><div class="rk-search-v4-popular">'+
      '<button class="rk-search-v4-tool" data-rk-search-query="Счёт на оплату"><strong>→</strong><b>Счёт на оплату</b><span>Создать и заполнить бесплатно</span></button>'+ 
      '<button class="rk-search-v4-tool" data-rk-search-query="Договор оказания услуг"><strong>→</strong><b>Договор оказания услуг</b><span>Найти подходящий шаблон</span></button>'+ 
      '<button class="rk-search-v4-tool" data-rk-search-query="Калькулятор НДС"><strong>→</strong><b>Калькулятор НДС</b><span>Начислить или выделить НДС</span></button>'+ 
      '<button class="rk-search-v4-tool" data-rk-search-query="Акт выполненных работ"><strong>→</strong><b>Акт выполненных работ</b><span>Создать документ онлайн</span></button>'+ 
      '<button class="rk-search-v4-tool" data-rk-search-query="Точка безубыточности"><strong>→</strong><b>Точка безубыточности</b><span>Рассчитать для бизнеса</span></button>'+ 
      '<button class="rk-search-v4-tool" data-rk-search-query="Бизнес-план"><strong>→</strong><b>Бизнес-план</b><span>Найти мастер и шаблоны</span></button>'+ 
      '</div>';
    return s;
  }

  function createSituations(){
    var s=document.createElement('section');
    s.id='rk-search-v4-situations';
    s.className='rk-search-v4-extra';
    s.innerHTML='<h2>Ищите по ситуации</h2><p>Не обязательно знать название документа или сервиса — напишите задачу своими словами.</p>'+ 
      '<div class="rk-search-v4-situations">'+
      '<button class="rk-search-v4-situation" data-rk-search-query="Клиент не платит">Клиент не платит</button>'+ 
      '<button class="rk-search-v4-situation" data-rk-search-query="Хочу открыть ИП">Хочу открыть ИП</button>'+ 
      '<button class="rk-search-v4-situation" data-rk-search-query="Нанимаю первого сотрудника">Нанимаю первого сотрудника</button>'+ 
      '<button class="rk-search-v4-situation" data-rk-search-query="Хочу повысить цены">Хочу повысить цены</button>'+ 
      '<button class="rk-search-v4-situation" data-rk-search-query="Нужно заключить договор">Нужно заключить договор</button>'+ 
      '<button class="rk-search-v4-situation" data-rk-search-query="Какой налоговый режим выбрать">Какой налоговый режим выбрать</button>'+ 
      '</div><div class="rk-search-v4-space"></div>';
    return s;
  }

  function ensureNav(topbar){
    var inner=topbar.firstElementChild;
    if(!inner) return;
    var legacy=inner.querySelector('.rk-v2-nav,.rk-search-nav,.rk-search-v3-nav');
    if(legacy) legacy.remove();
    if(inner.querySelector('.rk-search-v4-nav')) return;
    var nav=document.createElement('nav');
    nav.className='rk-search-v4-nav';
    nav.innerHTML='<a href="./dokumenty.html">Документы</a><a href="./kalkulyatory.html">Калькуляторы</a><a href="./servisy.html">Сервисы</a><a href="./#tab=taxes">Налоги 2026</a>';
    inner.appendChild(nav);
  }

  function findResults(hero,tools){
    var node=hero.nextElementSibling;
    while(node&&node!==tools){
      var h=node.querySelector&&node.querySelector('h2');
      if(h&&h.textContent.indexOf('Результаты поиска')!==-1) return node;
      node=node.nextElementSibling;
    }
    return null;
  }

  function ensureHero(search,tools){
    var hero=search.parentElement;
    if(!hero) return;

    hero.classList.remove('rk-home-hero','rk-search-hero','rk-search-v3-hero');
    hero.classList.add('rk-search-v4-hero');

    Array.prototype.forEach.call(hero.querySelectorAll('.rk-v2-visual,.rk-v2-badge,.rk-v2-sub,.rk-search-sub,.rk-search-stats,.rk-search-v3-stats,.rk-search-v3-chips-wrap,.rk-search-v3-scroll'),function(el){
      el.remove();
    });

    var first=hero.firstElementChild;
    if(first&&first!==hero.querySelector('h1')&&first.id!=='rk-herosearch'){
      first.classList.remove('rk-v2-hide','rk-search-logo','rk-search-v3-logo');
      first.classList.add('rk-search-v4-logo');
      if(first.style.display==='none') first.style.display='flex';
    }

    var h1=hero.querySelector('h1');
    if(h1&&h1.textContent!=='Найдётся всё для вашего бизнеса') h1.textContent='Найдётся всё для вашего бизнеса';

    var sub=hero.querySelector('.rk-search-v4-sub');
    if(!sub){
      sub=document.createElement('div');
      sub.className='rk-search-v4-sub';
      sub.textContent='Документы, калькуляторы и сервисы для ежедневных задач предпринимателя.';
      hero.insertBefore(sub,search);
    }

    var input=document.getElementById('rk-herosearch-input');
    var placeholder='Например: договор аренды, калькулятор НДС, счёт на оплату...';
    if(input&&input.placeholder!==placeholder) input.placeholder=placeholder;

    var original=search.nextElementSibling;
    if(original&&!original.classList.contains('rk-search-v4-chips')&&original.style.display!=='none') original.style.display='none';
    var originalNote=original&&original.nextElementSibling;
    if(originalNote&&!originalNote.classList.contains('rk-search-v4-stats')&&originalNote.style.display!=='none') originalNote.style.display='none';

    var chips=hero.querySelector('.rk-search-v4-chips');
    if(!chips){
      chips=createChips();
      search.insertAdjacentElement('afterend',chips);
    }

    var results=findResults(hero,tools);
    if(results){
      results.classList.add('rk-search-v4-results');
      if(results.parentElement!==hero||results.previousElementSibling!==chips){
        chips.insertAdjacentElement('afterend',results);
      }
    }

    var stats=hero.querySelector('.rk-search-v4-stats');
    if(!stats){
      stats=createStats();
      if(results&&results.parentElement===hero) results.insertAdjacentElement('afterend',stats);
      else chips.insertAdjacentElement('afterend',stats);
    }else if(results&&results.parentElement===hero&&stats.previousElementSibling!==results){
      results.insertAdjacentElement('afterend',stats);
    }

    if(!hero.querySelector('.rk-search-v4-scroll')){
      var scroll=document.createElement('div');
      scroll.className='rk-search-v4-scroll';
      scroll.textContent='Прокрутите, чтобы выбрать направление';
      hero.appendChild(scroll);
    }
  }

  function ensureTools(tools){
    var list=document.getElementById('rk-toollist');
    if(!list) return;
    var h=list.querySelector('h2');
    if(h&&h.textContent!=='Что вы хотите сделать?') h.textContent='Что вы хотите сделать?';
    var rows=Array.prototype.filter.call(list.children,function(el){
      return el.getAttribute&&el.getAttribute('role')==='link';
    }).slice(0,7);
    rows.forEach(function(row){
      row.classList.remove('rk-v2-dir','rk-search-dir','rk-search-v3-dir');
      row.classList.add('rk-search-v4-dir');
    });

    if(!document.getElementById('rk-search-v4-popular')){
      tools.insertAdjacentElement('afterend',createPopular());
    }
    var popular=document.getElementById('rk-search-v4-popular');
    if(!document.getElementById('rk-search-v4-situations')){
      popular.insertAdjacentElement('afterend',createSituations());
    }
  }

  function apply(){
    var search=document.getElementById('rk-herosearch');
    var tools=document.getElementById('rk-tools');
    var topbar=document.getElementById('rk-topbar');
    if(!search||!tools||!topbar) return false;

    document.body.classList.remove('rk-home-v2','rk-search-home','rk-search-v3');
    document.body.classList.add('rk-search-v4');
    addStyles();
    installActions();

    var landing=topbar.parentElement;
    if(landing&&landing.classList.contains('rk-flat')) landing.classList.remove('rk-flat');

    ensureNav(topbar);
    ensureHero(search,tools);
    ensureTools(tools);
    return true;
  }

  var queued=false;
  function schedule(){
    if(queued) return;
    queued=true;
    requestAnimationFrame(function(){
      queued=false;
      apply();
    });
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',schedule,{once:true});
  else schedule();

  new MutationObserver(schedule).observe(document.documentElement,{childList:true,subtree:true});
})();
