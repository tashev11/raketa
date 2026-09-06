(function(){
'use strict';
function esc(s){return String(s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
function norm(s){return String(s||'').toLowerCase().replace(/ё/g,'е');}
function hint(item){if(item.status==='ready')return 'Можно открыть и заполнить';if(item.status==='notary')return 'Требует нотариального или специального порядка';if(item.status==='regulated')return 'Нужна отдельная реализация по требованиям формы';return 'Готовим отдельную юридическую основу';}
function link(item){return item.status==='ready'?'./index.html#template='+encodeURIComponent(item.id):'#doc-'+encodeURIComponent(item.id);}
function start(){
  const T=window.RKDocumentTaxonomy;if(!T)return;
  const q=document.getElementById('q'),status=document.getElementById('status'),content=document.getElementById('content');
  function render(){
    const query=norm(q.value),st=status.value;let html='';let shown=0;
    T.groups.forEach(function(g){
      const items=T.items.filter(function(x){return x.group===g.slug&&(!st||x.status===st)&&(!query||norm(x.title+' '+x.groupName).includes(query));});
      if(!items.length)return;shown+=items.length;
      html+='<section class="group"><h2>'+esc(g.name)+' <span class="group-count">'+items.length+'</span></h2><div class="grid">'+items.map(function(x){return '<a class="doc" id="doc-'+esc(x.id)+'" href="'+link(x)+'"><strong>'+esc(x.title)+'</strong><span class="status '+x.status+'">'+esc(x.statusLabel)+'</span><span class="hint">'+esc(hint(x))+'</span></a>';}).join('')+'</div></section>';
    });
    content.innerHTML=html||'<div class="empty">Ничего не найдено</div>';
    const shownNode=document.getElementById('shownCount');if(shownNode)shownNode.textContent=shown.toLocaleString('ru-RU');
  }
  q.addEventListener('input',render);status.addEventListener('change',render);
  document.getElementById('allCount').textContent=T.items.length.toLocaleString('ru-RU');
  document.getElementById('readyCount').textContent=T.items.filter(x=>x.status==='ready').length.toLocaleString('ru-RU');
  document.getElementById('groupCount').textContent=T.groups.length.toLocaleString('ru-RU');
  render();
}
window.RKDocumentsApp={start:start};
})();
