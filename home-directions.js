(function(){
  'use strict';

  function restoreDirections(){
    var tools=document.getElementById('rk-tools');
    var heroSearch=document.getElementById('rk-herosearch');
    if(!tools||!heroSearch) return false;
    if(tools.dataset.rkDirectionsRestored==='1') return true;

    var hero=heroSearch.parentElement;
    if(!hero) return false;

    tools.dataset.rkDirectionsRestored='1';
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
      if(heading) heading.textContent='7 направлений · всё бесплатно';
    }

    // Ставим исходный блок сразу после hero, до результатов поиска/футера.
    if(hero.nextSibling!==tools){
      hero.parentNode.insertBefore(tools,hero.nextSibling);
    }

    return true;
  }

  if(!restoreDirections()){
    var observer=new MutationObserver(function(){
      if(restoreDirections()) observer.disconnect();
    });
    observer.observe(document.documentElement,{childList:true,subtree:true});
  }
})();
