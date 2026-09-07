(function(){
  'use strict';
  if(window.__RKHomeV2Actions) return;
  window.__RKHomeV2Actions=true;

  function rows(){
    var list=document.getElementById('rk-toollist');
    if(!list) return [];
    return Array.prototype.filter.call(list.children,function(el){
      return el.getAttribute&&el.getAttribute('role')==='link';
    }).slice(0,7);
  }

  function search(value){
    var input=document.getElementById('rk-herosearch-input');
    if(!input) return;
    input.focus();
    input.value=value;
    input.dispatchEvent(new Event('input',{bubbles:true}));
    var button=document.querySelector('#rk-herosearch button');
    if(button) setTimeout(function(){button.click();},30);
  }

  document.addEventListener('click',function(event){
    var chip=event.target.closest&&event.target.closest('[data-rk-chip]');
    if(chip){
      event.preventDefault();
      search(chip.getAttribute('data-rk-chip')==='akt'?'Акт':'Договор');
      return;
    }

    var feature=event.target.closest&&event.target.closest('.rk-v2-feature');
    if(!feature||feature.tagName==='A') return;
    var title=feature.querySelector('h3');
    var name=title?title.textContent.trim():'';
    var items=rows();
    if(name==='Документы за минуту'&&items[0]){event.preventDefault();items[0].click();}
    else if(name==='Калькулятор НДС'&&items[2]){event.preventDefault();items[2].click();}
    else if(name==='Возврат НДФЛ'&&items[5]){event.preventDefault();items[5].click();}
  });
})();
