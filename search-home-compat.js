(function(){
  'use strict';

  function addStyle(){
    if(document.getElementById('rk-search-home-compat-style')) return;
    var s=document.createElement('style');
    s.id='rk-search-home-compat-style';
    s.textContent='body.rk-autocomplete-open .rk-search-v5-results{display:none!important}';
    document.head.appendChild(s);
  }

  function restoreSearchHelpers(){
    var box=document.getElementById('rk-search-suggest');
    if(box&&box.style.display==='none') box.style.removeProperty('display');
    var hint=document.getElementById('rk-layout-hint');
    if(hint&&hint.style.display==='none') hint.style.removeProperty('display');
  }

  function install(){
    addStyle();
    restoreSearchHelpers();
    if(window.__RKSearchHomeCompat) return;
    window.__RKSearchHomeCompat=true;
    new MutationObserver(function(){requestAnimationFrame(restoreSearchHelpers);}).observe(document.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:['style']});
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',install,{once:true});
  else install();
})();
