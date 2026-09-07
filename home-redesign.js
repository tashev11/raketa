(function(){
  'use strict';

  var COLORS={orange:'#F4511E',orangeDark:'#D94012',ink:'#171512',muted:'#726A57',line:'#E9E0D3',paper:'#FFFDF9',bg:'#FBF9F5'};

  function icon(type){
    var icons={
      doc:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 3h7l4 4v14H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z"/><path d="M14 3v5h5M9 13h6M9 17h6"/></svg>',
      calc:'<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 7h8M8 12h2M14 12h2M8 16h2M14 16h2"/></svg>',
      percent:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 5 5 19"/><circle cx="7" cy="7" r="2.4"/><circle cx="17" cy="17" r="2.4"/></svg>',
      grid:'<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="4" width="6" height="6" rx="1"/><rect x="14" y="4" width="6" height="6" rx="1"/><rect x="4" y="14" width="6" height="6" rx="1"/><rect x="14" y="14" width="6" height="6" rx="1"/></svg>',
      shield:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 19 6v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3Z"/><path d="m9 12 2 2 4-4"/></svg>',
      chart:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 19V9M10 19V5M15 19v-7M20 19V8"/></svg>',
      user:'<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="3.2"/><path d="M5 20c.8-4 3-6 7-6s6.2 2 7 6"/></svg>',
      lock:'<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="10" width="14" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg>',
      clock:'<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8"/><path d="M12 8v5l3 2"/></svg>',
      people:'<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="9" cy="9" r="3"/><circle cx="17" cy="10" r="2.2"/><path d="M3 20c.7-3.7 2.6-5.6 6-5.6s5.3 1.9 6 5.6M15 15c3.2.1 4.8 1.8 5.3 5"/></svg>',
      arrow:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M14 7l5 5-5 5"/></svg>'
    };
    return icons[type]||icons.grid;
  }

  function addStyle(){
    if(document.getElementById('rk-home-v2-style')) return;
    var st=document.createElement('style');
    st.id='rk-home-v2-style';
    st.textContent='\
      body.rk-home-v2{background:'+COLORS.bg+'!important;color:'+COLORS.ink+'}\
      .rk-home-v2 #rk-topbar{position:sticky!important;top:0!important;background:rgba(251,249,245,.88)!important;border-bottom:1px solid rgba(233,224,211,.8)!important;backdrop-filter:blur(18px)!important;box-shadow:0 1px 0 rgba(24,20,15,.02)!important}\
      .rk-home-v2 #rk-topbar>div{max-width:1240px!important;padding:16px 28px!important}\
      .rk-home-v2 #rk-topbar>div>span:first-child{font-size:25px!important;gap:10px!important}\
      .rk-home-v2 #rk-topbar>div>span:first-child>span:first-child{width:38px!important;height:38px!important;border-radius:0!important;background:'+COLORS.orange+'!important;box-shadow:none!important}\
      .rk-home-v2 #rk-topword{opacity:1!important;font-family:Unbounded,Onest,sans-serif!important;letter-spacing:-.05em!important}\
      .rk-home-v2 #rk-headsearch,.rk-home-v2 #rk-topbar>div>div:last-child{display:none!important}\
      .rk-v2-nav{display:flex;align-items:center;gap:8px;margin-left:auto}\
      .rk-v2-nav a{color:'+COLORS.ink+';text-decoration:none;font-size:14px;font-weight:600;padding:10px 12px;border-radius:12px;transition:.18s}\
      .rk-v2-nav a:hover{background:#fff;color:'+COLORS.orangeDark+'}\
      .rk-v2-nav .rk-v2-nav-cta{background:'+COLORS.ink+';color:#fff;padding:11px 16px}\
      .rk-v2-nav .rk-v2-nav-cta:hover{background:'+COLORS.orange+';color:#fff}\
      .rk-home-hero{max-width:1240px!important;margin:0 auto!important;padding:70px 28px 58px!important;text-align:left!important;display:grid!important;grid-template-columns:minmax(0,1.08fr) minmax(360px,.92fr)!important;column-gap:54px!important;align-items:center!important;position:relative!important}\
      .rk-home-hero>.rk-v2-hide{display:none!important}\
      .rk-home-hero>.rk-v2-badge,.rk-home-hero>h1,.rk-home-hero>.rk-v2-sub,.rk-home-hero>#rk-herosearch,.rk-home-hero>.rk-v2-chips,.rk-home-hero>.rk-v2-note{grid-column:1!important}\
      .rk-v2-badge{display:inline-flex;align-items:center;gap:8px;width:max-content;background:#FFF1EA;color:#6E5F52;border:1px solid #FFE3D7;border-radius:999px;padding:8px 13px;font-size:13px;font-weight:600;margin-bottom:22px}\
      .rk-v2-badge b{color:'+COLORS.orange+';font-size:16px}\
      .rk-home-hero h1{font-family:Unbounded,Onest,sans-serif!important;font-size:clamp(37px,4.25vw,62px)!important;line-height:1.07!important;letter-spacing:-.055em!important;margin:0!important;max-width:760px!important;color:'+COLORS.ink+'!important;text-transform:none!important}\
      .rk-home-hero h1 .rk-accent{color:'+COLORS.orange+'}\
      .rk-v2-sub{font-size:18px;line-height:1.55;color:#6F6A64;max-width:660px;margin:22px 0 26px}\
      .rk-home-v2 #rk-herosearch{margin:0!important;width:100%!important;max-width:720px!important;display:flex!important;background:#fff!important;border:1px solid #E8E0D6!important;border-radius:18px!important;box-shadow:0 16px 44px rgba(69,48,31,.08)!important;overflow:hidden!important;transition:.18s!important}\
      .rk-home-v2 #rk-herosearch:focus-within{border-color:#F0A78D!important;box-shadow:0 18px 50px rgba(244,81,30,.12)!important}\
      .rk-home-v2 #rk-herosearch input{height:70px!important;padding:20px 20px 20px 58px!important;font-size:20px!important}\
      .rk-home-v2 #rk-herosearch svg{width:23px!important;height:23px!important;left:22px!important;color:#8E8A84!important}\
      .rk-home-v2 #rk-herosearch button{border:0!important;border-radius:13px!important;margin:6px!important;padding:0 34px!important;background:'+COLORS.orange+'!important;font-size:17px!important;min-width:132px!important}\
      .rk-home-v2 #rk-herosearch button:hover{background:'+COLORS.orangeDark+'!important}\
      .rk-v2-chips{display:flex!important;gap:9px!important;justify-content:flex-start!important;flex-wrap:wrap!important;margin-top:14px!important}\
      .rk-v2-chips button{background:#fff!important;border:1px solid #E7DED2!important;border-radius:999px!important;padding:9px 14px!important;font-family:inherit!important;font-size:13px!important;font-weight:600!important;color:'+COLORS.ink+'!important;cursor:pointer!important;transition:.16s!important}\
      .rk-v2-chips button:hover{border-color:#F2A88D!important;color:'+COLORS.orangeDark+'!important;transform:translateY(-1px)}\
      .rk-v2-note{font-size:12px!important;color:#898178!important;margin-top:14px!important}\
      .rk-v2-visual{grid-column:2!important;grid-row:1 / span 6!important;position:relative!important;min-height:470px!important;display:block!important}\
      .rk-v2-orbit{position:absolute;inset:28px 12px 28px 12px;border-radius:50%;background:radial-gradient(circle at 48% 48%,#FFF1E6 0,#FFF5ED 38%,rgba(255,247,241,0) 70%)}\
      .rk-v2-orbit:after{content:"";position:absolute;left:6%;right:2%;top:53%;height:110px;border:2px solid '+COLORS.orange+';border-left-color:transparent;border-right-color:transparent;border-radius:50%;transform:rotate(-9deg);opacity:.8}\
      .rk-v2-paper{position:absolute;background:#fff;border:1px solid #EEE6DD;border-radius:20px;box-shadow:0 24px 60px rgba(75,54,39,.13);padding:24px;overflow:hidden}\
      .rk-v2-paper b{display:block;font-family:Unbounded,Onest,sans-serif;font-size:15px;margin-bottom:18px}\
      .rk-v2-paper i{display:block;height:7px;background:#ECEAE7;border-radius:8px;margin:9px 0}\
      .rk-v2-paper i:nth-of-type(2){width:82%}.rk-v2-paper i:nth-of-type(3){width:65%}\
      .rk-v2-p1{width:240px;height:310px;left:14%;top:80px;transform:rotate(-7deg);z-index:3}\
      .rk-v2-p2{width:230px;height:190px;right:4%;top:55px;transform:rotate(6deg);z-index:2}\
      .rk-v2-p3{width:245px;height:170px;right:0;bottom:45px;transform:rotate(7deg);z-index:4}\
      .rk-v2-chart{display:flex;align-items:end;gap:8px;height:72px;margin-top:16px}.rk-v2-chart span{width:18px;background:#FFB28F;border-radius:4px 4px 0 0}.rk-v2-chart span:nth-child(1){height:25%}.rk-v2-chart span:nth-child(2){height:48%}.rk-v2-chart span:nth-child(3){height:74%}.rk-v2-chart span:nth-child(4){height:100%;background:'+COLORS.orange+'}\
      .rk-v2-stamp{position:absolute;right:0;bottom:10px;z-index:6;background:'+COLORS.orange+';color:#fff;border-radius:18px;padding:15px 19px;font-weight:700;font-size:14px;transform:rotate(-5deg);box-shadow:0 16px 34px rgba(244,81,30,.28)}\
      .rk-home-v2 #rk-tools{max-width:1240px!important;padding:32px 28px 0!important;margin:0 auto!important}\
      .rk-home-v2 #rk-toollist{max-width:none!important;margin:0!important;display:grid!important;grid-template-columns:repeat(7,minmax(0,1fr))!important;gap:14px!important}\
      .rk-home-v2 #rk-toollist>h2{grid-column:1/-1!important;border:0!important;padding:0!important;margin:0 0 6px!important;font-family:Unbounded,Onest,sans-serif!important;text-transform:none!important;letter-spacing:-.035em!important;color:'+COLORS.ink+'!important;font-size:28px!important}\
      .rk-home-v2 #rk-toollist>.rk-v2-dir{display:flex!important;flex-direction:column!important;align-items:flex-start!important;gap:12px!important;min-height:190px!important;padding:18px!important;background:#fff!important;border:1px solid #EEE7DF!important;border-radius:18px!important;box-shadow:0 8px 24px rgba(57,44,31,.035)!important;transition:.18s!important;position:relative!important;overflow:hidden!important}\
      .rk-home-v2 #rk-toollist>.rk-v2-dir:hover{transform:translateY(-3px)!important;border-color:#F2C4B3!important;box-shadow:0 14px 32px rgba(57,44,31,.07)!important;background:#fff!important}\
      .rk-home-v2 .rk-v2-dir>span:first-child{display:none!important}\
      .rk-home-v2 .rk-v2-dir>span:nth-child(2){width:48px!important;height:48px!important;border-radius:14px!important;margin:0!important}\
      .rk-home-v2 .rk-v2-dir>div{width:100%!important}.rk-home-v2 .rk-v2-dir h3{font-family:Onest,system-ui,sans-serif!important;font-size:16px!important;letter-spacing:-.015em!important;margin:0!important}.rk-home-v2 .rk-v2-dir>div>div{font-size:12px!important;line-height:1.45!important;margin-top:5px!important;color:#8A837B!important}.rk-home-v2 .rk-v2-dir>span:last-child{position:absolute!important;right:16px!important;bottom:14px!important;color:'+COLORS.orange+'!important;font-size:18px!important}\
      .rk-home-v2 #rk-all-calculators,.rk-home-v2 #rk-all-services{display:none!important}\
      .rk-v2-section{max-width:1240px;margin:0 auto;padding:50px 28px 0}\
      .rk-v2-section-head{display:flex;justify-content:space-between;align-items:end;gap:20px;margin-bottom:18px}.rk-v2-section-head h2{font-family:Unbounded,Onest,sans-serif;font-size:28px;line-height:1.15;letter-spacing:-.04em;margin:0}.rk-v2-section-head a{color:'+COLORS.orange+';text-decoration:none;font-weight:700;font-size:14px}\
      .rk-v2-feature-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:14px}.rk-v2-feature{background:#fff;border:1px solid #EEE7DF;border-radius:20px;padding:20px;min-height:205px;display:flex;flex-direction:column;cursor:pointer;transition:.18s;text-decoration:none;color:inherit}.rk-v2-feature:hover{transform:translateY(-3px);border-color:#F1C0AE;box-shadow:0 14px 32px rgba(57,44,31,.06)}.rk-v2-feature-icon{width:46px;height:46px;border-radius:14px;background:#FFF0E9;color:'+COLORS.orange+';display:flex;align-items:center;justify-content:center;margin-bottom:22px}.rk-v2-feature-icon svg,.rk-v2-benefit-icon svg{width:22px;height:22px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}.rk-v2-feature h3{font-size:17px;margin:0 0 8px}.rk-v2-feature p{font-size:13px;color:#827B72;line-height:1.5;margin:0}.rk-v2-feature-arrow{width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:#FFF0E9;color:'+COLORS.orange+';margin-top:auto;margin-left:auto}.rk-v2-feature-arrow svg{width:16px;height:16px;fill:none;stroke:currentColor;stroke-width:1.8}\
      #rk-home-benefits{max-width:1240px;margin:50px auto 70px;padding:0 28px}.rk-v2-benefit-wrap{background:linear-gradient(120deg,#FFF7F0,#FFFDF9);border:1px solid #F3E8DC;border-radius:26px;padding:30px}.rk-v2-benefit-wrap>h2{font-family:Unbounded,Onest,sans-serif;font-size:26px;letter-spacing:-.04em;margin:0 0 26px}.rk-v2-benefits{display:grid;grid-template-columns:repeat(4,1fr)}.rk-v2-benefit{display:grid;grid-template-columns:46px 1fr;gap:12px;padding:5px 20px;border-left:1px solid #EADFD3}.rk-v2-benefit:first-child{border-left:0;padding-left:0}.rk-v2-benefit-icon{width:46px;height:46px;border-radius:50%;background:#FFECE2;color:'+COLORS.orange+';display:flex;align-items:center;justify-content:center}.rk-v2-benefit b{display:block;font-size:14px;line-height:1.25;margin-bottom:5px}.rk-v2-benefit span{display:block;color:#8A837B;font-size:12px;line-height:1.4}\
      @media(max-width:1080px){.rk-home-hero{grid-template-columns:1fr!important}.rk-v2-visual{display:none!important}.rk-home-v2 #rk-toollist{grid-template-columns:repeat(4,1fr)!important}.rk-v2-feature-grid{grid-template-columns:repeat(2,1fr)}.rk-v2-benefits{grid-template-columns:repeat(2,1fr);gap:24px}.rk-v2-benefit:nth-child(3){border-left:0;padding-left:0}}\
      @media(max-width:760px){.rk-home-v2 #rk-topbar>div{padding:13px 16px!important}.rk-v2-nav a:not(.rk-v2-nav-cta){display:none}.rk-v2-nav .rk-v2-nav-cta{font-size:12px;padding:9px 12px}.rk-home-hero{padding:44px 16px 34px!important}.rk-home-hero h1{font-size:clamp(32px,10vw,46px)!important}.rk-v2-sub{font-size:16px}.rk-home-v2 #rk-herosearch{border-radius:15px!important}.rk-home-v2 #rk-herosearch input{height:62px!important;font-size:16px!important;padding-left:50px!important}.rk-home-v2 #rk-herosearch svg{left:17px!important}.rk-home-v2 #rk-herosearch button{min-width:92px!important;padding:0 18px!important;font-size:14px!important}.rk-home-v2 #rk-tools{padding:28px 16px 0!important}.rk-home-v2 #rk-toollist{grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:10px!important}.rk-home-v2 #rk-toollist>h2{font-size:23px!important}.rk-home-v2 #rk-toollist>.rk-v2-dir{min-height:170px!important;padding:15px!important}.rk-v2-section{padding:40px 16px 0}.rk-v2-section-head h2{font-size:23px}.rk-v2-feature-grid{grid-template-columns:1fr}.rk-v2-feature{min-height:170px}.rk-v2-benefits{grid-template-columns:1fr}.rk-v2-benefit,.rk-v2-benefit:nth-child(3){border-left:0;border-top:1px solid #EADFD3;padding:18px 0 0}.rk-v2-benefit:first-child{border-top:0;padding-top:0}#rk-home-benefits{margin:40px auto 50px;padding:0 16px}.rk-v2-benefit-wrap{padding:24px 20px}}\
    ';
    document.head.appendChild(st);
  }

  function setSearch(value){
    var input=document.getElementById('rk-herosearch-input');
    if(!input) return;
    input.focus();
    input.value=value;
    input.dispatchEvent(new Event('input',{bubbles:true}));
    var btn=document.querySelector('#rk-herosearch button');
    if(btn) setTimeout(function(){btn.click();},30);
  }

  function buildVisual(){
    var v=document.createElement('div');
    v.className='rk-v2-visual';
    v.setAttribute('aria-hidden','true');
    v.innerHTML='<div class="rk-v2-orbit"></div>'+
      '<div class="rk-v2-paper rk-v2-p2"><b>Расчёт НДС</b><div class="rk-v2-chart"><span></span><span></span><span></span><span></span></div></div>'+
      '<div class="rk-v2-paper rk-v2-p1"><b>Договор</b><i></i><i></i><i></i><i style="width:72%;margin-top:28px"></i><i style="width:55%"></i><div style="font-family:cursive;font-size:31px;margin-top:30px;text-align:right">✓</div></div>'+
      '<div class="rk-v2-paper rk-v2-p3"><b>Счёт на оплату</b><i></i><i></i><i></i></div>'+
      '<div class="rk-v2-stamp">✦ &nbsp; Быстро. Удобно. Надёжно.</div>';
    return v;
  }

  function makeFeature(title,desc,kind,action,href){
    var el=document.createElement(href?'a':'button');
    el.className='rk-v2-feature';
    if(href) el.href=href; else el.type='button';
    if(!href){el.style.border='1px solid #EEE7DF';el.style.fontFamily='inherit';el.style.textAlign='left';}
    el.innerHTML='<span class="rk-v2-feature-icon">'+icon(kind)+'</span><h3>'+title+'</h3><p>'+desc+'</p><span class="rk-v2-feature-arrow">'+icon('arrow')+'</span>';
    if(action) el.addEventListener('click',function(e){if(!href)e.preventDefault();action();});
    return el;
  }

  function buildFeatured(rows){
    var section=document.createElement('section');
    section.className='rk-v2-section';
    section.id='rk-v2-featured';
    section.innerHTML='<div class="rk-v2-section-head"><h2>Популярные инструменты</h2><a href="./servisy.html">Все инструменты →</a></div><div class="rk-v2-feature-grid"></div>';
    var grid=section.querySelector('.rk-v2-feature-grid');
    grid.appendChild(makeFeature('Документы за минуту','Договоры, акты, счета, заявления и другие документы — без регистрации.','doc',function(){if(rows[0])rows[0].click();}));
    grid.appendChild(makeFeature('Калькулятор НДС','Начислить или выделить НДС и быстро проверить сумму по ставкам 2026.','percent',function(){if(rows[2])rows[2].click();}));
    grid.appendChild(makeFeature('Возврат НДФЛ','Рассчитайте вычет за жильё, лечение, обучение, ипотеку и ИИС.','user',function(){if(rows[5])rows[5].click();}));
    grid.appendChild(makeFeature('276 калькуляторов','Финансы, продажи, сотрудники, реклама, маркетплейсы и производство.','calc',null,'./kalkulyatory.html'));
    return section;
  }

  function buildBenefits(){
    var section=document.createElement('section');
    section.id='rk-home-benefits';
    section.innerHTML='<div class="rk-v2-benefit-wrap"><h2>Почему выбирают Ракету</h2><div class="rk-v2-benefits">'+
      '<div class="rk-v2-benefit"><span class="rk-v2-benefit-icon">'+icon('grid')+'</span><div><b>Без регистрации</b><span>Сразу используйте документы, расчёты и сервисы.</span></div></div>'+
      '<div class="rk-v2-benefit"><span class="rk-v2-benefit-icon">'+icon('lock')+'</span><div><b>Данные остаются в браузере</b><span>Черновики не отправляются на наш сервер.</span></div></div>'+
      '<div class="rk-v2-benefit"><span class="rk-v2-benefit-icon">'+icon('clock')+'</span><div><b>Быстрый запуск</b><span>Нужный инструмент открывается за пару кликов.</span></div></div>'+
      '<div class="rk-v2-benefit"><span class="rk-v2-benefit-icon">'+icon('people')+'</span><div><b>Для ИП и ООО</b><span>Инструменты для ежедневных задач малого бизнеса.</span></div></div>'+
      '</div></div>';
    return section;
  }

  function apply(){
    var search=document.getElementById('rk-herosearch');
    var tools=document.getElementById('rk-tools');
    var topbar=document.getElementById('rk-topbar');
    if(!search||!tools||!topbar) return false;

    document.body.classList.add('rk-home-v2');
    addStyle();

    var landing=topbar.parentElement;
    if(landing&&landing.classList.contains('rk-flat')) landing.classList.remove('rk-flat');

    var topInner=topbar.firstElementChild;
    if(topInner&&!topInner.querySelector('.rk-v2-nav')){
      var nav=document.createElement('nav');
      nav.className='rk-v2-nav';
      nav.setAttribute('aria-label','Основная навигация');
      nav.innerHTML='<a href="./dokumenty.html">Документы</a><a href="./kalkulyatory.html">Калькуляторы</a><a href="./#tab=taxes">Налоги 2026</a><a href="./servisy.html">Сервисы</a><a href="#rk-home-benefits">О проекте</a><a class="rk-v2-nav-cta" href="./servisy.html">Все сервисы</a>';
      topInner.appendChild(nav);
    }

    var hero=search.parentElement;
    hero.classList.add('rk-home-hero');
    var logo=hero.firstElementChild;
    if(logo&&logo!==hero.querySelector('h1')&&logo.id!=='rk-herosearch') logo.classList.add('rk-v2-hide');

    if(!hero.querySelector('.rk-v2-badge')){
      var badge=document.createElement('div');
      badge.className='rk-v2-badge';
      badge.innerHTML='<b>✦</b> Ваш надёжный помощник в бизнесе';
      hero.insertBefore(badge,hero.querySelector('h1'));
    }

    var h1=hero.querySelector('h1');
    if(h1&&!h1.dataset.rkV2){
      h1.dataset.rkV2='1';
      h1.innerHTML='<span class="rk-accent">200 000+</span> шаблонов,<br><span class="rk-accent">276</span> калькуляторов и<br><span class="rk-accent">468</span> сервисов для бизнеса';
    }

    if(!hero.querySelector('.rk-v2-sub')){
      var sub=document.createElement('p');
      sub.className='rk-v2-sub';
      sub.textContent='Готовые документы, расчёты и полезные сервисы. Всё работает прямо в браузере — без регистрации.';
      hero.insertBefore(sub,search);
    }

    var chips=search.nextElementSibling;
    if(chips&&!chips.classList.contains('rk-v2-chips')) chips.classList.add('rk-v2-chips');
    if(chips&&!chips.querySelector('[data-rk-chip="dogovor"]')){
      [['Договор','Договор','dogovor'],['Акт','Акт','akt']].forEach(function(x){
        var b=document.createElement('button');b.type='button';b.textContent=x[0];b.dataset.rkChip=x[2];b.addEventListener('click',function(){setSearch(x[1]);});chips.appendChild(b);
      });
    }
    var note=chips&&chips.nextElementSibling;
    if(note){note.classList.add('rk-v2-note');note.textContent='Все направления и заполнение документов доступны без регистрации. Данные остаются в вашем браузере.';}

    if(!hero.querySelector('.rk-v2-visual')) hero.appendChild(buildVisual());

    var list=document.getElementById('rk-toollist');
    if(list){
      var heading=list.querySelector('h2');
      if(heading) heading.textContent='Популярные направления';
      var rows=Array.prototype.filter.call(list.children,function(el){return el.getAttribute&&el.getAttribute('role')==='link';}).slice(0,7);
      rows.forEach(function(row){row.classList.add('rk-v2-dir');});
      if(!document.getElementById('rk-v2-featured')) tools.insertAdjacentElement('afterend',buildFeatured(rows));
      if(!document.getElementById('rk-home-benefits')){
        var featured=document.getElementById('rk-v2-featured');
        (featured||tools).insertAdjacentElement('afterend',buildBenefits());
      }
    }
    return true;
  }

  var scheduled=false;
  function schedule(){
    if(scheduled) return;
    scheduled=true;
    requestAnimationFrame(function(){scheduled=false;apply();});
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',schedule,{once:true}); else schedule();
  var observer=new MutationObserver(schedule);
  observer.observe(document.documentElement,{childList:true,subtree:true});
})();
