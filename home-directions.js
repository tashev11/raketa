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

    var list=document.getElementById('rk-toollist');
    if(list){
      list.style.display='block';
      list.style.visibility='visible';
      list.style.opacity='1';
      var heading=list.querySelector('h2');
      if(heading&&heading.textContent!=='7 направлений · всё бесплатно') heading.textContent='7 направлений · всё бесплатно';

      var oldCta=document.getElementById('rk-all-calculators');
      if(!oldCta){
        var cta=document.createElement('a');
        cta.id='rk-all-calculators';
        cta.href='./kalkulyatory.html';
        cta.style.cssText='display:flex;align-items:center;justify-content:space-between;gap:18px;margin:20px 0 0;padding:20px 22px;background:#1A1712;color:#fff;text-decoration:none;border:2px solid #1A1712;transition:.15s';
        cta.innerHTML='<span><span style="display:block;font-size:11px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:#EA8B6D;margin-bottom:5px">Новый раздел</span><strong style="font-family:Unbounded,Onest,sans-serif;font-size:18px">Все 276 калькуляторов для бизнеса</strong><span style="display:block;font-size:13px;color:rgba(255,255,255,.68);margin-top:5px">21 направление · продажи, финансы, сотрудники, реклама, маркетплейсы, производство и другое</span></span><span style="font-size:26px;flex:none">→</span>';
        cta.addEventListener('mouseenter',function(){cta.style.background='#EA4E1B';cta.style.borderColor='#EA4E1B'});
        cta.addEventListener('mouseleave',function(){cta.style.background='#1A1712';cta.style.borderColor='#1A1712'});
        list.appendChild(cta);
      }
    }

    // Ставим исходный блок сразу после hero, до результатов поиска.
    if(hero.nextSibling!==tools){
      hero.parentNode.insertBefore(tools,hero.nextSibling);
    }

    // Гостевой режим уже не требует регистрации — убираем устаревшую подпись.
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