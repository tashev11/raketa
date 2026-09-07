(function(){
  'use strict';

  var ORANGE='#F4511E', INK='#181512', MUTED='#746E67', LINE='#E8E2DA', BG='#FBFAF7';

  function addStyles(){
    if(document.getElementById('rk-search-home-style')) return;
    var s=document.createElement('style');
    s.id='rk-search-home-style';
    s.textContent='\
      body.rk-search-home{background:'+BG+'!important;color:'+INK+'}\
      body.rk-search-home .rk-flat,body.rk-search-home .rk-flat *{border-radius:initial!important;box-shadow:initial!important}\
      .rk-search-home #rk-topbar{position:sticky!important;top:0!important;z-index:60!important;background:rgba(251,250,247,.92)!important;backdrop-filter:blur(16px)!important;border-bottom:1px solid rgba(232,226,218,.75)!important;box-shadow:none!important}\
      .rk-search-home #rk-topbar>div{max-width:1240px!important;padding:13px 24px!important}\
      .rk-search-home #rk-topbar>div>span:first-child{gap:9px!important;font-size:22px!important}\
      .rk-search-home #rk-topbar>div>span:first-child>span:first-child{width:34px!important;height:34px!important;border-radius:8px!important;box-shadow:none!important;background:'+ORANGE+'!important}\
      .rk-search-home #rk-topword{opacity:1!important;font-family:Unbounded,Onest,sans-serif!important;letter-spacing:-.045em!important}\
      .rk-search-home #rk-headsearch,.rk-search-home #rk-topbar>div>div:last-child{display:none!important}\
      .rk-search-nav{margin-left:auto;display:flex;align-items:center;gap:4px}\
      .rk-search-nav a{font:600 13px Onest,system-ui,sans-serif;color:#5F5A54;text-decoration:none;padding:9px 11px;border-radius:10px;transition:.15s}\
      .rk-search-nav a:hover{background:#fff;color:'+INK+'}\
      .rk-search-hero{max-width:1040px!important;margin:0 auto!important;padding:clamp(70px,10vh,118px) 24px 42px!important;text-align:center!important;display:flex!important;flex-direction:column!important;align-items:center!important}\
      .rk-search-hero>.rk-search-logo{display:flex!important;align-items:center!important;justify-content:center!important;gap:14px!important;margin:0 0 22px!important}\
      .rk-search-hero>.rk-search-logo>span:first-child{width:58px!important;height:58px!important;border-radius:14px!important;background:'+ORANGE+'!important;box-shadow:0 10px 28px rgba(244,81,30,.18)!important}\
      .rk-search-hero>.rk-search-logo>span:last-child{font-family:Unbounded,Onest,sans-serif!important;font-size:clamp(38px,6vw,58px)!important;font-weight:800!important;letter-spacing:-.06em!important;color:'+INK+'!important}\
      .rk-search-hero h1{font-family:Onest,system-ui,sans-serif!important;font-size:clamp(21px,2.3vw,28px)!important;line-height:1.25!important;font-weight:700!important;letter-spacing:-.025em!important;margin:0!important;color:'+INK+'!important}\
      .rk-search-sub{font-size:15px;color:'+MUTED+';margin:10px 0 30px;line-height:1.5}\
      .rk-search-home #rk-herosearch{width:100%!important;max-width:940px!important;margin:0!important;display:flex!important;align-items:center!important;background:#fff!important;border:1px solid #DED8D0!important;border-radius:26px!important;box-shadow:0 12px 36px rgba(49,41,34,.09)!important;overflow:hidden!important;transition:border-color .16s,box-shadow .16s!important}\
      .rk-search-home #rk-herosearch:focus-within{border-color:#F4A083!important;box-shadow:0 15px 42px rgba(244,81,30,.12)!important}\
      .rk-search-home #rk-herosearch>div{flex:1!important}\
      .rk-search-home #rk-herosearch input{height:86px!important;padding:23px 24px 23px 72px!important;font-size:22px!important;line-height:1!important;background:transparent!important;color:'+INK+'!important}\
      .rk-search-home #rk-herosearch input::placeholder{color:#9B9690!important}\
      .rk-search-home #rk-herosearch svg{left:26px!important;width:27px!important;height:27px!important;stroke:#8B8782!important}\
      .rk-search-home #rk-herosearch button{height:70px!important;margin:8px!important;border:0!important;border-radius:20px!important;padding:0 36px!important;background:'+ORANGE+'!important;color:#fff!important;font-size:17px!important;font-weight:700!important;min-width:132px!important}\
      .rk-search-home #rk-herosearch button:hover{background:#DA4115!important}\
      .rk-search-chips{display:flex!important;justify-content:center!important;gap:8px!important;flex-wrap:wrap!important;margin-top:16px!important}\
      .rk-search-chips:before{content:"Популярное:";font-size:12px;color:#99938C;display:flex;align-items:center;margin-right:2px}\
      .rk-search-chips button{background:transparent!important;border:0!important;border-radius:9px!important;padding:7px 10px!important;font-family:inherit!important;font-size:13px!important;font-weight:600!important;color:#6E6861!important;cursor:pointer!important}\
      .rk-search-chips button:hover{background:#fff!important;color:'+ORANGE+'!important}\
      .rk-search-note{margin-top:14px!important;font-size:12px!important;color:#9A948D!important}\
      .rk-search-stats{display:flex;align-items:center;justify-content:center;gap:0;margin-top:34px;color:#77716A;font-size:12px}\
      .rk-search-stat{padding:0 18px;border-right:1px solid '+LINE+'}.rk-search-stat:last-child{border-right:0}.rk-search-stat b{display:block;color:'+INK+';font-size:16px;margin-bottom:2px}.rk-search-stat b em{font-style:normal;color:'+ORANGE+'}\
      .rk-search-home #rk-tools{max-width:1040px!important;margin:0 auto!important;padding:40px 24px 70px!important}\
      .rk-search-home #rk-toollist{max-width:none!important;margin:0!important;display:grid!important;grid-template-columns:repeat(4,minmax(0,1fr))!important;gap:12px!important}\
      .rk-search-home #rk-toollist>h2{grid-column:1/-1!important;border:0!important;padding:0!important;margin:0 0 8px!important;font:700 22px/1.2 Onest,system-ui,sans-serif!important;text-transform:none!important;letter-spacing:-.025em!important;color:'+INK+'!important;text-align:left!important}\
      .rk-search-home #rk-toollist>.rk-search-dir{display:flex!important;align-items:center!important;gap:13px!important;padding:16px!important;min-height:88px!important;background:#fff!important;border:1px solid #EEE9E3!important;border-radius:16px!important;box-shadow:none!important;transition:.15s!important}\
      .rk-search-home #rk-toollist>.rk-search-dir:hover{border-color:#F2B8A3!important;transform:translateY(-1px)!important;background:#fff!important}\
      .rk-search-home .rk-search-dir>span:first-child{display:none!important}\
      .rk-search-home .rk-search-dir>span:nth-child(2){width:40px!important;height:40px!important;border-radius:12px!important;flex:none!important}\
      .rk-search-home .rk-search-dir>div{min-width:0!important;text-align:left!important}.rk-search-home .rk-search-dir h3{font:700 14px/1.2 Onest,system-ui,sans-serif!important;margin:0!important}.rk-search-home .rk-search-dir>div>div{font-size:11px!important;line-height:1.35!important;color:#8D8780!important;margin-top:4px!important;display:-webkit-box!important;-webkit-line-clamp:2!important;-webkit-box-orient:vertical!important;overflow:hidden!important}.rk-search-home .rk-search-dir>span:last-child{margin-left:auto!important;color:#BBB3AA!important;font-size:16px!important}\
      .rk-search-home #rk-all-calculators,.rk-search-home #rk-all-services{display:none!important}\
      .rk-search-home #rk-tools+section,.rk-search-home #rk-v2-featured,.rk-search-home #rk-home-benefits{display:none!important}\
      .rk-search-home [style*="max-width:840px"][style*="padding:10px 24px 0"]{max-width:940px!important;padding:0 24px 20px!important;margin-top:-14px!important}\
      .rk-search-home [style*="max-width:840px"][style*="padding:10px 24px 0"] h2{border:0!important;text-transform:none!important;letter-spacing:0!important;font:700 14px Onest,system-ui,sans-serif!important;color:#77716A!important;padding:0 8px 8px!important}\
      .rk-search-home [data-template-id],.rk-search-home [data-tool-tab]{background:#fff!important;border:1px solid #EEE9E3!important;border-radius:14px!important;margin:8px 0!important;padding:15px!important;box-shadow:none!important}\
      @media(max-width:760px){.rk-search-nav{display:none!important}.rk-search-hero{padding:64px 16px 30px!important}.rk-search-hero>.rk-search-logo>span:first-child{width:48px!important;height:48px!important}.rk-search-home #rk-herosearch{border-radius:20px!important;flex-direction:row!important}.rk-search-home #rk-herosearch input{height:72px!important;font-size:17px!important;padding:18px 12px 18px 54px!important}.rk-search-home #rk-herosearch svg{left:20px!important;width:22px!important;height:22px!important}.rk-search-home #rk-herosearch button{width:auto!important;height:58px!important;border:0!important;margin:7px!important;padding:0 20px!important;font-size:0!important;min-width:58px!important}.rk-search-home #rk-herosearch button:after{content:"→";font-size:22px}.rk-search-stats{display:grid;grid-template-columns:1fr 1fr;gap:14px;width:100%;max-width:420px}.rk-search-stat{border:0!important;padding:0!important}.rk-search-home #rk-toollist{grid-template-columns:1fr 1fr!important}.rk-search-home #rk-tools{padding:28px 16px 50px!important}}\
      @media(max-width:480px){.rk-search-home #rk-toollist{grid-template-columns:1fr!important}.rk-search-chips:before{width:100%;justify-content:center}.rk-search-home #rk-topbar>div{padding:11px 14px!important}.rk-search-hero{padding-top:50px!important}}\
    ';
    document.head.appendChild(s);
  }

  function makeStats(){
    var d=document.createElement('div');
    d.className='rk-search-stats';
    d.innerHTML='<div class="rk-search-stat"><b><em>200 000+</em></b>документов и вариантов</div><div class="rk-search-stat"><b><em>276</em></b>калькуляторов</div><div class="rk-search-stat"><b><em>468</em></b>сервисов</div><div class="rk-search-stat"><b>Бесплатно</b>без регистрации</div>';
    return d;
  }

  function apply(){
    var search=document.getElementById('rk-herosearch');
    var tools=document.getElementById('rk-tools');
    var topbar=document.getElementById('rk-topbar');
    if(!search||!tools||!topbar) return false;

    document.body.classList.remove('rk-home-v2');
    document.body.classList.add('rk-search-home');
    addStyles();

    var landing=topbar.parentElement;
    if(landing&&landing.classList.contains('rk-flat')) landing.classList.remove('rk-flat');

    var topInner=topbar.firstElementChild;
    if(topInner){
      var oldNav=topInner.querySelector('.rk-v2-nav'); if(oldNav) oldNav.remove();
      if(!topInner.querySelector('.rk-search-nav')){
        var nav=document.createElement('nav');
        nav.className='rk-search-nav';
        nav.innerHTML='<a href="./dokumenty.html">Документы</a><a href="./kalkulyatory.html">Калькуляторы</a><a href="./servisy.html">Сервисы</a><a href="./#tab=taxes">Налоги 2026</a>';
        topInner.appendChild(nav);
      }
    }

    var hero=search.parentElement;
    hero.classList.add('rk-search-hero');
    hero.classList.remove('rk-home-hero');

    var visual=hero.querySelector('.rk-v2-visual'); if(visual) visual.remove();
    var badge=hero.querySelector('.rk-v2-badge'); if(badge) badge.remove();
    var oldSub=hero.querySelector('.rk-v2-sub'); if(oldSub) oldSub.remove();

    var first=hero.firstElementChild;
    if(first&&first!==hero.querySelector('h1')&&first.id!=='rk-herosearch'){
      first.classList.remove('rk-v2-hide');
      first.classList.add('rk-search-logo');
    }

    var h1=hero.querySelector('h1');
    if(h1){
      h1.innerHTML='Поиск по инструментам для бизнеса';
      h1.dataset.rkSearch='1';
    }

    if(!hero.querySelector('.rk-search-sub')){
      var sub=document.createElement('div');
      sub.className='rk-search-sub';
      sub.textContent='Документы, расчёты и сервисы — в одной строке поиска';
      hero.insertBefore(sub,search);
    }

    var chips=search.nextElementSibling;
    if(chips){
      chips.classList.remove('rk-v2-chips');
      chips.classList.add('rk-search-chips');
      if(!chips.querySelector('[data-rk-chip="dogovor"]')){
        [['Договор','Договор','dogovor'],['Акт','Акт','akt'],['Бизнес-план','Бизнес-план','plan']].forEach(function(x){
          var b=document.createElement('button');
          b.type='button';b.textContent=x[0];b.dataset.rkChip=x[2];
          b.addEventListener('click',function(){var inp=document.getElementById('rk-herosearch-input');if(!inp)return;inp.focus();inp.value=x[1];inp.dispatchEvent(new Event('input',{bubbles:true}));});
          chips.appendChild(b);
        });
      }
    }

    var note=chips&&chips.nextElementSibling;
    if(note){
      note.classList.remove('rk-v2-note');
      note.classList.add('rk-search-note');
      note.textContent='Данные остаются в вашем браузере';
    }

    var oldStats=hero.querySelector('.rk-search-stats');
    if(!oldStats){ hero.appendChild(makeStats()); }

    var list=document.getElementById('rk-toollist');
    if(list){
      var heading=list.querySelector('h2'); if(heading) heading.textContent='Или выберите направление';
      Array.prototype.filter.call(list.children,function(el){return el.getAttribute&&el.getAttribute('role')==='link';}).slice(0,7).forEach(function(row){row.classList.remove('rk-v2-dir');row.classList.add('rk-search-dir');});
    }
    return true;
  }

  var queued=false;
  function schedule(){if(queued)return;queued=true;requestAnimationFrame(function(){queued=false;apply();});}
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',schedule,{once:true}); else schedule();
  new MutationObserver(schedule).observe(document.documentElement,{childList:true,subtree:true});
})();