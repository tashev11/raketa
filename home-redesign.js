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
    if(window.__RKSearchV5Actions) return;
    window.__RKSearchV5Actions=true;
    document.addEventListener('click',function(e){
      var q=e.target.closest&&e.target.closest('[data-rk-query]');
      if(q){e.preventDefault();setQuery(q.getAttribute('data-rk-query')||'');return;}
      var scroll=e.target.closest&&e.target.closest('[data-rk-scroll]');
      if(scroll){
        e.preventDefault();
        var target=document.querySelector(scroll.getAttribute('data-rk-scroll'));
        if(target) target.scrollIntoView({behavior:'smooth',block:'start'});
      }
    });
  }

  function icon(name){
    var map={
      doc:'<path d="M7 3h7l4 4v14H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z"/><path d="M14 3v5h5M9 13h6M9 17h6"/>',
      calc:'<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 7h8M8 12h2M14 12h2M8 16h2M14 16h2"/>',
      cube:'<path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z"/><path d="m4 7.5 8 4.5 8-4.5M12 12v9"/>',
      tax:'<path d="M19 5 5 19"/><circle cx="7" cy="7" r="2.3"/><circle cx="17" cy="17" r="2.3"/>',
      money:'<circle cx="12" cy="12" r="8"/><path d="M9 9.5h4a2 2 0 1 1 0 4H11a2 2 0 1 0 0 4h4M12 6.5v11"/>',
      sales:'<path d="M4 18 10 12l4 3 6-8"/><path d="M15 7h5v5"/>',
      hr:'<circle cx="9" cy="9" r="3"/><circle cx="17" cy="10" r="2.2"/><path d="M3 20c.7-3.7 2.6-5.6 6-5.6s5.3 1.9 6 5.6M15 15c3 .1 4.7 1.8 5.2 5"/>'
    };
    return '<svg viewBox="0 0 24 24" aria-hidden="true">'+(map[name]||map.doc)+'</svg>';
  }

  function addStyles(){
    if(document.getElementById('rk-search-v5-style')) return;
    var s=document.createElement('style');
    s.id='rk-search-v5-style';
    s.textContent=`
      body.rk-search-v5{background:#fcfbf9!important;color:#171512!important}
      body.rk-search-v5 .rk-flat,body.rk-search-v5 .rk-flat *{border-radius:initial!important;box-shadow:initial!important}

      .rk-search-v5 #rk-topbar{position:sticky!important;top:0!important;z-index:80!important;background:rgba(252,251,249,.92)!important;backdrop-filter:blur(18px)!important;border-bottom:1px solid rgba(234,229,222,.72)!important;box-shadow:none!important}
      .rk-search-v5 #rk-topbar>div{max-width:1240px!important;min-height:66px!important;padding:12px 24px!important}
      .rk-search-v5 #rk-topbar>div>span:first-child{gap:8px!important;font-size:21px!important}
      .rk-search-v5 #rk-topbar>div>span:first-child>span:first-child{width:34px!important;height:34px!important;border-radius:8px!important;background:#f4511e!important;box-shadow:none!important}
      .rk-search-v5 #rk-topword{opacity:1!important;font-family:Unbounded,Onest,sans-serif!important;letter-spacing:-.055em!important}
      .rk-search-v5 #rk-headsearch,.rk-search-v5 #rk-topbar>div>div:last-child{display:none!important}
      .rk-search-v5-nav{margin-left:auto;display:flex;align-items:center;gap:3px}
      .rk-search-v5-nav a{font:600 13px Onest,system-ui,sans-serif;color:#615c56;text-decoration:none;padding:9px 11px;border-radius:10px;transition:.15s}
      .rk-search-v5-nav a:hover{background:#fff;color:#f4511e}
      .rk-search-v5-nav .rk-search-v5-all{margin-left:5px;border:1px solid #e9e3dc;background:#fff;color:#171512;padding-inline:14px}

      .rk-search-v5-hero{max-width:1120px!important;min-height:calc(100vh - 66px)!important;margin:0 auto!important;padding:clamp(62px,9vh,104px) 24px 32px!important;text-align:center!important;display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:flex-start!important}
      .rk-search-v5-logo{display:flex!important;align-items:center!important;justify-content:center!important;gap:14px!important;margin:0 0 18px!important}
      .rk-search-v5-logo>span:first-child{width:60px!important;height:60px!important;border-radius:13px!important;background:#f4511e!important;box-shadow:0 9px 26px rgba(244,81,30,.14)!important}
      .rk-search-v5-logo>span:last-child{font-family:Unbounded,Onest,sans-serif!important;font-size:clamp(42px,6vw,61px)!important;font-weight:800!important;letter-spacing:-.07em!important;color:#171512!important}
      .rk-search-v5-hero h1{font:650 clamp(24px,2.55vw,32px)/1.2 Onest,system-ui,sans-serif!important;letter-spacing:-.035em!important;margin:0!important;color:#171512!important}
      .rk-search-v5-sub{font-size:16px;line-height:1.5;color:#77716a;margin:10px 0 30px;max-width:720px}

      .rk-search-v5 #rk-herosearch{width:100%!important;max-width:1040px!important;margin:0!important;display:flex!important;align-items:center!important;background:#fff!important;border:1px solid #ded9d2!important;border-radius:30px!important;box-shadow:0 10px 34px rgba(47,39,31,.075),0 1px 3px rgba(47,39,31,.035)!important;overflow:hidden!important;transition:border-color .16s,box-shadow .16s,transform .16s!important}
      .rk-search-v5 #rk-herosearch:focus-within{border-color:#f0a58b!important;box-shadow:0 15px 46px rgba(244,81,30,.11)!important;transform:translateY(-1px)!important}
      .rk-search-v5 #rk-herosearch>div{flex:1!important;min-width:0!important}
      .rk-search-v5 #rk-herosearch input{height:84px!important;padding:22px 22px 22px 72px!important;font-size:20px!important;line-height:1!important;background:transparent!important;color:#171512!important}
      .rk-search-v5 #rk-herosearch input::placeholder{color:#9b9690!important}
      .rk-search-v5 #rk-herosearch>div>svg{left:27px!important;width:27px!important;height:27px!important;stroke:#807b75!important}
      .rk-search-v5 #rk-herosearch button{height:66px!important;width:66px!important;min-width:66px!important;margin:9px 10px 9px 0!important;border:0!important;border-radius:50%!important;padding:0!important;background:#f4511e!important;color:#fff!important;font-size:0!important;display:flex!important;align-items:center!important;justify-content:center!important;transition:.15s!important}
      .rk-search-v5 #rk-herosearch button:hover{background:#d94114!important;transform:scale(1.02)!important}
      .rk-search-v5 #rk-herosearch button svg{position:static!important;transform:none!important;width:25px!important;height:25px!important;stroke:#fff!important;pointer-events:none!important}

      .rk-search-v5-chips{margin-top:18px;display:flex;align-items:center;justify-content:center;gap:8px;flex-wrap:wrap;max-width:980px}
      .rk-search-v5-chips-label{font-size:12px;color:#98928b;margin-right:2px}
      .rk-search-v5-chip{border:1px solid #eae5de;background:rgba(255,255,255,.74);color:#625d57;border-radius:999px;padding:8px 12px;font:600 12px Onest,system-ui,sans-serif;cursor:pointer;transition:.15s}
      .rk-search-v5-chip:hover{background:#fff;border-color:#efb19a;color:#f4511e}

      .rk-search-v5-results{width:100%!important;max-width:1040px!important;padding:14px 0 0!important;margin:0!important;text-align:left!important}
      .rk-search-v5-results h2{border:0!important;text-transform:none!important;letter-spacing:0!important;font:700 13px Onest,system-ui,sans-serif!important;color:#807a73!important;padding:5px 8px!important;margin:0!important}
      .rk-search-v5-results [data-template-id],.rk-search-v5-results [data-tool-tab]{background:#fff!important;border:1px solid #eee9e3!important;border-radius:14px!important;margin:7px 0!important;padding:14px 15px!important;box-shadow:none!important}
      .rk-search-v5-results [data-template-id]:hover,.rk-search-v5-results [data-tool-tab]:hover{border-color:#efb39d!important}

      .rk-search-v5-stats{display:flex;align-items:stretch;justify-content:center;margin-top:43px;color:#88827b}
      .rk-search-v5-stat{min-width:180px;padding:1px 29px;border-right:1px solid #eae5de;font-size:12px;line-height:1.35}
      .rk-search-v5-stat:last-child{border-right:0}
      .rk-search-v5-stat b{display:block;color:#171512;font-size:20px;letter-spacing:-.025em;margin-bottom:3px}
      .rk-search-v5-stat b em{font-style:normal;color:#f4511e}

      .rk-search-v5-quick{width:100%;display:grid;grid-template-columns:repeat(7,1fr);gap:8px;margin-top:auto;padding-top:36px}
      .rk-search-v5-quick a,.rk-search-v5-quick button{border:0;background:transparent;color:#68625c;text-decoration:none;font:600 12px Onest,system-ui,sans-serif;display:flex;flex-direction:column;align-items:center;gap:7px;cursor:pointer;padding:8px 5px;border-radius:12px;transition:.15s}
      .rk-search-v5-quick a:hover,.rk-search-v5-quick button:hover{background:#fff;color:#f4511e}
      .rk-search-v5-quick svg{width:22px;height:22px;fill:none;stroke:currentColor;stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round}
      .rk-search-v5-scroll{padding-top:10px;color:#a19b94;font-size:11px}
      .rk-search-v5-scroll:before{content:'↓';font-size:16px;margin-right:7px}

      .rk-search-v5-has-results .rk-search-v5-hero{min-height:auto!important;padding-top:28px!important;padding-bottom:32px!important}
      .rk-search-v5-has-results .rk-search-v5-logo{margin-bottom:10px!important;transform:scale(.82);transform-origin:center}
      .rk-search-v5-has-results .rk-search-v5-sub,.rk-search-v5-has-results .rk-search-v5-stats,.rk-search-v5-has-results .rk-search-v5-quick,.rk-search-v5-has-results .rk-search-v5-scroll{display:none!important}
      .rk-search-v5-has-results .rk-search-v5-hero h1{font-size:20px!important;margin-bottom:18px!important}

      .rk-search-v5 #rk-tools{display:none!important}
      .rk-search-v5-below{max-width:1180px;margin:0 auto;padding:70px 24px 84px}
      .rk-search-v5-section{padding:0 0 64px}
      .rk-search-v5-section-head{display:flex;align-items:flex-end;justify-content:space-between;gap:20px;margin-bottom:18px}
      .rk-search-v5-section h2{font:750 29px/1.15 Onest,system-ui,sans-serif;letter-spacing:-.04em;margin:0;color:#171512}
      .rk-search-v5-section-head a{font:700 13px Onest,system-ui,sans-serif;color:#f4511e;text-decoration:none}
      .rk-search-v5-popular{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}
      .rk-search-v5-tool{border:1px solid #eee9e3;background:#fff;border-radius:17px;padding:18px;text-align:left;cursor:pointer;min-height:105px;transition:.16s;font-family:Onest,system-ui,sans-serif}
      .rk-search-v5-tool:hover{transform:translateY(-2px);border-color:#efb39c;box-shadow:0 8px 24px rgba(43,34,26,.035)}
      .rk-search-v5-tool b{display:block;font-size:15px;color:#171512;margin-bottom:5px}
      .rk-search-v5-tool span{font-size:12px;color:#8c867f}
      .rk-search-v5-tool strong{float:right;color:#f4511e;font-size:18px;font-weight:500}

      .rk-search-v5-catalog{display:grid;grid-template-columns:repeat(2,1fr);gap:12px}
      .rk-search-v5-category{display:flex;align-items:center;gap:16px;padding:21px;background:#fff;border:1px solid #eee9e3;border-radius:18px;color:#171512;text-decoration:none;transition:.16s}
      .rk-search-v5-category:hover{border-color:#efb39c;transform:translateY(-2px)}
      .rk-search-v5-category-icon{width:45px;height:45px;display:flex;align-items:center;justify-content:center;border-radius:13px;background:#fff2ec;color:#f4511e;flex:none}
      .rk-search-v5-category-icon svg{width:23px;height:23px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
      .rk-search-v5-category div{min-width:0}
      .rk-search-v5-category b{display:block;font-size:16px;margin-bottom:4px}
      .rk-search-v5-category span{display:block;font-size:12px;color:#88827b;line-height:1.45}
      .rk-search-v5-category i{margin-left:auto;color:#f4511e;font-style:normal;font-size:20px}

      @media(max-width:900px){
        .rk-search-v5-stat{min-width:0;padding:0 18px}
        .rk-search-v5-popular{grid-template-columns:repeat(2,1fr)}
        .rk-search-v5-quick{grid-template-columns:repeat(4,1fr)}
      }
      @media(max-width:720px){
        .rk-search-v5-nav{display:none!important}
        .rk-search-v5 #rk-topbar>div{padding:11px 14px!important}
        .rk-search-v5-hero{min-height:auto!important;padding:50px 16px 40px!important}
        .rk-search-v5-logo{margin-bottom:16px!important}
        .rk-search-v5-logo>span:first-child{width:48px!important;height:48px!important}
        .rk-search-v5-sub{font-size:14px;margin-bottom:23px}
        .rk-search-v5 #rk-herosearch{border-radius:22px!important;flex-direction:row!important}
        .rk-search-v5 #rk-herosearch input{height:68px!important;font-size:16px!important;padding:17px 10px 17px 52px!important}
        .rk-search-v5 #rk-herosearch>div>svg{left:19px!important;width:22px!important;height:22px!important}
        .rk-search-v5 #rk-herosearch button{width:54px!important;min-width:54px!important;height:54px!important;margin:7px 7px 7px 0!important}
        .rk-search-v5 #rk-herosearch button svg{width:21px!important;height:21px!important}
        .rk-search-v5-chips{justify-content:flex-start;width:100%}
        .rk-search-v5-chips-label{width:100%;text-align:left}
        .rk-search-v5-stats{display:grid;grid-template-columns:1fr 1fr;width:100%;gap:20px;margin-top:30px}
        .rk-search-v5-stat{border:0!important;padding:0!important}
        .rk-search-v5-quick{grid-template-columns:repeat(4,1fr);margin-top:28px;padding-top:0}
        .rk-search-v5-scroll{display:none}
        .rk-search-v5-below{padding:50px 16px 64px}
        .rk-search-v5-section{padding-bottom:50px}
        .rk-search-v5-section h2{font-size:25px}
        .rk-search-v5-popular,.rk-search-v5-catalog{grid-template-columns:1fr}
      }
      @media(max-width:480px){
        .rk-search-v5-chip:nth-of-type(n+5){display:none}
        .rk-search-v5-quick{grid-template-columns:repeat(3,1fr)}
        .rk-search-v5-quick>*:nth-child(n+7){display:none}
      }
    `;
    document.head.appendChild(s);
  }

  function createChips(){
    var d=document.createElement('div');
    d.className='rk-search-v5-chips';
    d.innerHTML='<span class="rk-search-v5-chips-label">Популярные запросы:</span>'+ 
      '<button class="rk-search-v5-chip" data-rk-query="Договор аренды">Договор аренды</button>'+ 
      '<button class="rk-search-v5-chip" data-rk-query="Калькулятор НДС">Калькулятор НДС</button>'+ 
      '<button class="rk-search-v5-chip" data-rk-query="Счёт на оплату">Счёт на оплату</button>'+ 
      '<button class="rk-search-v5-chip" data-rk-query="Бизнес-план">Бизнес-план</button>'+ 
      '<button class="rk-search-v5-chip" data-rk-query="Акт выполненных работ">Акт выполненных работ</button>';
    return d;
  }

  function createStats(){
    var d=document.createElement('div');
    d.className='rk-search-v5-stats';
    d.innerHTML='<div class="rk-search-v5-stat"><b><em>200 000+</em></b>шаблонов и вариантов</div>'+ 
      '<div class="rk-search-v5-stat"><b><em>276</em></b>калькуляторов</div>'+ 
      '<div class="rk-search-v5-stat"><b><em>468</em></b>сервисов</div>'+ 
      '<div class="rk-search-v5-stat"><b>Бесплатно</b>для бизнеса</div>';
    return d;
  }

  function createQuick(){
    var d=document.createElement('div');
    d.className='rk-search-v5-quick';
    d.innerHTML=
      '<a href="./dokumenty.html">'+icon('doc')+'<span>Документы</span></a>'+ 
      '<a href="./kalkulyatory.html">'+icon('calc')+'<span>Калькуляторы</span></a>'+ 
      '<a href="./servisy.html">'+icon('cube')+'<span>Сервисы</span></a>'+ 
      '<a href="./#tab=taxes">'+icon('tax')+'<span>Налоги 2026</span></a>'+ 
      '<button data-rk-query="Финансы">'+icon('money')+'<span>Финансы</span></button>'+ 
      '<button data-rk-query="Продажи">'+icon('sales')+'<span>Продажи</span></button>'+ 
      '<button data-rk-query="Кадры">'+icon('hr')+'<span>Кадры</span></button>';
    return d;
  }

  function createBelow(){
    var wrap=document.createElement('div');
    wrap.id='rk-search-v5-below';
    wrap.className='rk-search-v5-below';
    wrap.innerHTML=
      '<section class="rk-search-v5-section" id="rk-v5-popular">'+
        '<div class="rk-search-v5-section-head"><h2>Популярные инструменты</h2><a href="./servisy.html">Все инструменты →</a></div>'+ 
        '<div class="rk-search-v5-popular">'+
          '<button class="rk-search-v5-tool" data-rk-query="Договор оказания услуг"><strong>→</strong><b>Договор оказания услуг</b><span>Найти готовый документ</span></button>'+ 
          '<button class="rk-search-v5-tool" data-rk-query="Счёт на оплату"><strong>→</strong><b>Счёт на оплату</b><span>Создать онлайн</span></button>'+ 
          '<button class="rk-search-v5-tool" data-rk-query="Калькулятор НДС"><strong>→</strong><b>Калькулятор НДС</b><span>Расчёт по ставкам 2026</span></button>'+ 
          '<button class="rk-search-v5-tool" data-rk-query="Стоимость сотрудника"><strong>→</strong><b>Стоимость сотрудника</b><span>Полная нагрузка работодателя</span></button>'+ 
          '<button class="rk-search-v5-tool" data-rk-query="Бизнес-план"><strong>→</strong><b>Бизнес-план</b><span>Шаблоны и инструменты</span></button>'+ 
          '<button class="rk-search-v5-tool" data-rk-query="Проверка контрагента"><strong>→</strong><b>Проверка контрагента</b><span>Инструменты для бизнеса</span></button>'+ 
        '</div>'+ 
      '</section>'+ 
      '<section class="rk-search-v5-section">'+
        '<div class="rk-search-v5-section-head"><h2>Всё для бизнеса</h2></div>'+ 
        '<div class="rk-search-v5-catalog">'+
          '<a class="rk-search-v5-category" href="./dokumenty.html"><span class="rk-search-v5-category-icon">'+icon('doc')+'</span><div><b>Документы</b><span>200 000+ шаблонов и отраслевых вариантов: договоры, акты, счета, заявления и другое.</span></div><i>→</i></a>'+ 
          '<a class="rk-search-v5-category" href="./kalkulyatory.html"><span class="rk-search-v5-category-icon">'+icon('calc')+'</span><div><b>Калькуляторы</b><span>276 бизнес-калькуляторов в 21 направлении.</span></div><i>→</i></a>'+ 
          '<a class="rk-search-v5-category" href="./servisy.html"><span class="rk-search-v5-category-icon">'+icon('cube')+'</span><div><b>Сервисы</b><span>468 рабочих сервисов в 28 направлениях.</span></div><i>→</i></a>'+ 
          '<a class="rk-search-v5-category" href="./#tab=taxes"><span class="rk-search-v5-category-icon">'+icon('tax')+'</span><div><b>Налоги 2026</b><span>УСН, НДС, патент, НПД, АУСН, НДФЛ, взносы ИП, ЕНС и пени.</span></div><i>→</i></a>'+ 
        '</div>'+ 
      '</section>';
    return wrap;
  }

  function ensureNav(topbar){
    var inner=topbar.firstElementChild;
    if(!inner) return;
    Array.prototype.forEach.call(inner.querySelectorAll('.rk-v2-nav,.rk-search-nav,.rk-search-v3-nav,.rk-search-v4-nav'),function(n){n.remove();});
    if(inner.querySelector('.rk-search-v5-nav')) return;
    var nav=document.createElement('nav');
    nav.className='rk-search-v5-nav';
    nav.innerHTML='<a href="./dokumenty.html">Документы</a><a href="./kalkulyatory.html">Калькуляторы</a><a href="./servisy.html">Сервисы</a><a href="./#tab=taxes">Налоги 2026</a><a class="rk-search-v5-all" href="#rk-v5-popular" data-rk-scroll="#rk-v5-popular">Все инструменты</a>';
    inner.appendChild(nav);
  }

  function findResults(hero,tools){
    var inside=hero.querySelector('.rk-search-v5-results');
    if(inside) return inside;
    var node=hero.nextElementSibling;
    while(node&&node!==tools){
      var h=node.querySelector&&node.querySelector('h2');
      if(h&&h.textContent.indexOf('Результаты поиска')!==-1) return node;
      node=node.nextElementSibling;
    }
    return null;
  }

  function cleanLegacy(hero){
    Array.prototype.forEach.call(hero.querySelectorAll('.rk-v2-visual,.rk-v2-badge,.rk-v2-sub,.rk-search-sub,.rk-search-stats,.rk-search-v3-stats,.rk-search-v3-chips-wrap,.rk-search-v3-scroll,.rk-search-v4-chips,.rk-search-v4-stats,.rk-search-v4-scroll'),function(el){el.remove();});
    Array.prototype.forEach.call(document.querySelectorAll('#rk-search-v4-popular,#rk-search-v4-situations,#rk-v2-featured,#rk-home-benefits'),function(el){el.remove();});
  }

  function ensureHero(search,tools){
    var hero=search.parentElement;
    if(!hero) return;
    hero.classList.remove('rk-home-hero','rk-search-hero','rk-search-v3-hero','rk-search-v4-hero');
    hero.classList.add('rk-search-v5-hero');
    cleanLegacy(hero);

    var first=hero.firstElementChild;
    if(first&&first!==hero.querySelector('h1')&&first.id!=='rk-herosearch'){
      first.classList.remove('rk-v2-hide','rk-search-logo','rk-search-v3-logo','rk-search-v4-logo');
      first.classList.add('rk-search-v5-logo');
      first.style.display='flex';
    }

    var h1=hero.querySelector('h1');
    if(h1&&h1.textContent!=='Найдётся любой инструмент для вашего бизнеса') h1.textContent='Найдётся любой инструмент для вашего бизнеса';

    var sub=hero.querySelector('.rk-search-v5-sub');
    if(!sub){
      sub=document.createElement('div');
      sub.className='rk-search-v5-sub';
      sub.textContent='Документы, калькуляторы, сервисы, шаблоны и инструкции — всё в одном месте.';
      hero.insertBefore(sub,search);
    }

    var input=document.getElementById('rk-herosearch-input');
    if(input) input.placeholder='Например: договор аренды, калькулятор НДС, счёт на оплату...';
    var button=search.querySelector('button');
    if(button&&!button.querySelector('svg')) button.innerHTML='<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="11" cy="11" r="6.7"/><path d="m16 16 4.3 4.3"/></svg><span style="position:absolute;width:1px;height:1px;overflow:hidden">Найти</span>';

    var original=search.nextElementSibling;
    if(original&&!original.classList.contains('rk-search-v5-chips')){
      if(original.style.display!=='none') original.style.display='none';
      var originalNote=original.nextElementSibling;
      if(originalNote&&!originalNote.classList.contains('rk-search-v5-chips')&&originalNote.style.display!=='none') originalNote.style.display='none';
    }

    var chips=hero.querySelector('.rk-search-v5-chips');
    if(!chips){
      chips=createChips();
      search.insertAdjacentElement('afterend',chips);
    }

    var results=findResults(hero,tools);
    if(results){
      results.classList.add('rk-search-v5-results');
      if(results.parentElement!==hero||results.previousElementSibling!==chips) chips.insertAdjacentElement('afterend',results);
    }
    document.body.classList.toggle('rk-search-v5-has-results',!!results);

    var stats=hero.querySelector('.rk-search-v5-stats');
    if(!stats){
      stats=createStats();
      (results||chips).insertAdjacentElement('afterend',stats);
    }else if(results&&stats.previousElementSibling!==results){
      results.insertAdjacentElement('afterend',stats);
    }

    var quick=hero.querySelector('.rk-search-v5-quick');
    if(!quick){
      quick=createQuick();
      stats.insertAdjacentElement('afterend',quick);
    }

    var scroll=hero.querySelector('.rk-search-v5-scroll');
    if(!scroll){
      scroll=document.createElement('div');
      scroll.className='rk-search-v5-scroll';
      scroll.textContent='Прокрутите, чтобы узнать больше';
      quick.insertAdjacentElement('afterend',scroll);
    }
  }

  function ensureBelow(tools){
    if(!document.getElementById('rk-search-v5-below')) tools.insertAdjacentElement('afterend',createBelow());
  }

  function apply(){
    var search=document.getElementById('rk-herosearch');
    var tools=document.getElementById('rk-tools');
    var topbar=document.getElementById('rk-topbar');
    if(!search||!tools||!topbar) return false;

    document.body.classList.remove('rk-home-v2','rk-search-home','rk-search-v3','rk-search-v4');
    document.body.classList.add('rk-search-v5');
    addStyles();
    installActions();

    var landing=topbar.parentElement;
    if(landing&&landing.classList.contains('rk-flat')) landing.classList.remove('rk-flat');

    ensureNav(topbar);
    ensureHero(search,tools);
    ensureBelow(tools);
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