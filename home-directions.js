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

    var description='Бесплатные инструменты для малого бизнеса: 200 000+ шаблонов и отраслевых вариантов документов, 276 калькуляторов и 468 рабочих сервисов предпринимателя. Финансы, продажи, CRM, кадры, налоги, закупки, маркетинг, склад и аналитика.';
    var meta=document.querySelector('meta[name="description"]');
    var og=document.querySelector('meta[property="og:description"]');
    if(meta&&meta.getAttribute('content')!==description) meta.setAttribute('content',description);
    if(og&&og.getAttribute('content')!==description) og.setAttribute('content',description);

    var list=document.getElementById('rk-toollist');
    if(list){
      list.style.display='block';
      list.style.visibility='visible';
      list.style.opacity='1';
    }

    if(hero.nextSibling!==tools){
      hero.parentNode.insertBefore(tools,hero.nextSibling);
    }

    return true;
  }

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',restoreDirections,{once:true});
  }else{
    restoreDirections();
  }
})();
