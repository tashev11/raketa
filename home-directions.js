(function(){
  'use strict';

  function restoreDirections(){
    var tools=document.getElementById('rk-tools');
    var heroSearch=document.getElementById('rk-herosearch');
    if(!tools||!heroSearch) return false;

    var hero=heroSearch.parentElement;
    if(!hero) return false;

    tools.style.display='block';
    tools.style.visibility='visible';
    tools.style.opacity='1';
    tools.style.padding='20px 24px 0';
    tools.style.margin='0 auto';

    var heroTitle=hero.querySelector('h1');
    if(heroTitle&&heroTitle.innerHTML.indexOf('6 калькуляторов')!==-1){
      heroTitle.innerHTML=heroTitle.innerHTML.replace('6 калькуляторов','276 калькуляторов');
    }

    var description='Бесплатные инструменты для малого бизнеса: 200 000+ шаблонов и отраслевых вариантов документов, 276 калькуляторов и 468 рабочих сервисов предпринимателя. Финансы, продажи, CRM, кадры, налоги, закупки, маркетинг, склад и аналитика.';
    var meta=document.querySelector('meta[name="description"]');
    var og=document.querySelector('meta[property="og:description"]');
    if(meta) meta.setAttribute('content',description);
    if(og) og.setAttribute('content',description);

    var list=document.getElementById('rk-toollist');
    if(list){
      list.style.display='block';
      list.style.visibility='visible';
      list.style.opacity='1';
      var heading=list.querySelector('h2');
      if(heading&&heading.textContent!=='7 направлений · всё бесплатно') heading.textContent='7 направлений · всё бесплатно';

      if(!document.getElementById('rk-all-calculators')){
        var cta=document.createElement('a');
        cta.id='rk-all-calculators';
        cta.href='./kalkulyatory.html';
        cta.style.cssText='display:flex;align-items:center;justify-content:space-between;gap:18px;margin:20px 0 0;padding:20px 22px;background:#1A1712;color:#fff;text-decoration:none;border:2px solid #1A1712;transition:.15s';
        cta.innerHTML='<span><span style="display:block;font-size:11px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:#EA8B6D;margin-bottom:5px">Калькуляторы</span><strong style="font-family:Unbounded,Onest,sans-serif;font-size:18px">Все 276 калькуляторов для бизнеса</strong><span style="display:block;font-size:13px;color:rgba(255,255,255,.68);margin-top:5px">21 направление · продажи, финансы, сотрудники, реклама, маркетплейсы, производство и другое</span></span><span style="font-size:26px;flex:none">→</span>';
        cta.addEventListener('mouseenter',function(){cta.style.background='#EA4E1B';cta.style.borderColor='#EA4E1B'});
        cta.addEventListener('mouseleave',function(){cta.style.background='#1A1712';cta.style.borderColor='#1A1712'});
        list.appendChild(cta);
      }

      if(!document.getElementById('rk-all-services')){
        var services=document.createElement('a');
        services.id='rk-all-services';
        services.href='./servisy.html';
        services.style.cssText='display:flex;align-items:center;justify-content:space-between;gap:18px;margin:10px 0 0;padding:20px 22px;background:#fff;color:#1A1712;text-decoration:none;border:2px solid #1A1712;transition:.15s';
        services.innerHTML='<span><span style="display:block;font-size:11px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:#C23D14;margin-bottom:5px">Рабочий кабинет бизнеса</span><strong style="font-family:Unbounded,Onest,sans-serif;font-size:18px">Все 468 сервисов предпринимателя</strong><span style="display:block;font-size:13px;color:#726A57;margin-top:5px">28 направлений · деньги, CRM, счета, кадры, закупки, склад, маркетинг, аналитика и другое</span></span><span style="font-size:26px;flex:none">→</span>';
        services.addEventListener('mouseenter',function(){services.style.borderColor='#EA4E1B';services.style.color='#C23D14'});
        services.addEventListener('mouseleave',function(){services.style.borderColor='#1A1712';services.style.color='#1A1712'});
        list.appendChild(services);
      }
    }

    if(hero.nextSibling!==tools){
      hero.parentNode.insertBefore(tools,hero.nextSibling);
    }

    Array.from(hero.children).forEach(function(node){
      if(node&&node.textContent&&node.textContent.indexOf('Регистрация нужна только для заполнения')!==-1){
        node.textContent='Все направления и заполнение документов доступны без регистрации. Данные остаются в вашем браузере.';
      }
    });

    return true;
  }

  restoreDirections();
  var scheduled=false;
  var observer=new MutationObserver(function(){
    if(scheduled) return;
    scheduled=true;
    requestAnimationFrame(function(){
      scheduled=false;
      restoreDirections();
    });
  });
  observer.observe(document.documentElement,{childList:true,subtree:true});
})();