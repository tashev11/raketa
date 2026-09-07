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
