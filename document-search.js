(function(){
'use strict';
const RK=window.RKCatalog,T=window.RKDocumentTaxonomy;if(!RK||!T||typeof RK.install!=='function')return;
if(window.RKDocumentBase&&Array.isArray(window.RKDocumentBase.templates)){
  const readyIds=new Set(window.RKDocumentBase.templates.map(x=>x.id));
  T.items.forEach(x=>{if(readyIds.has(x.id)){x.status='ready';x.statusLabel='Готовая основа'}});
  T.ready=T.items.filter(x=>x.status==='ready');T.planned=T.items.filter(x=>x.status!=='ready');
}
function norm(v){return String(v||'').toLowerCase().replace(/ё/g,'е').replace(/[^a-zа-я0-9]+/gi,' ').replace(/\s+/g,' ').trim()}
function findTypes(raw,limit){const q=norm(raw);if(q.length<2)return[];const terms=q.split(' ');return T.items.map(x=>{const hay=norm(x.title+' '+x.groupName+' '+x.statusLabel);if(!terms.every(t=>hay.includes(t)))return null;let score=0;const title=norm(x.title);if(title===q)score+=200;if(title.startsWith(q))score+=100;if(title.includes(q))score+=60;terms.forEach(t=>{if(title.includes(t))score+=20});return{x,score}}).filter(Boolean).sort((a,b)=>b.score-a.score||a.x.title.localeCompare(b.x.title,'ru')).slice(0,limit||12).map(v=>v.x)}
const previousInstall=RK.install;
RK.install=function(Component){
  previousInstall(Component);
  const proto=Component&&Component.prototype;if(!proto||proto.__rkDocumentSearchInstalled)return;proto.__rkDocumentSearchInstalled=true;
  const previousRender=proto.renderVals;const previousSubmit=proto.submitSearch;
  proto.renderVals=function(){
    const vals=previousRender.call(this);const query=this.state&&this.state.searchQuery||'';const types=findTypes(query,10);if(!types.length)return vals;
    const existing=new Set((vals.searchResults||[]).map(r=>r.templateId||norm(r.title)));
    const extra=types.filter(x=>!existing.has(x.id)&&!existing.has(norm(x.title))).map(x=>({
      href:x.status==='ready'?'#template='+encodeURIComponent(x.id):'./documents.html#doc-'+encodeURIComponent(x.id),
      templateId:x.status==='ready'?x.id:'',toolTab:'',title:x.title,kind:x.groupName,desc:x.status==='ready'?'Готовая основа — можно открыть и заполнить.':x.statusLabel+'. Для этого типа предусмотрена отдельная реализация, а не универсальная подмена.',meta:'Вид документа · '+x.statusLabel,accent:x.status==='ready'?'#1E9E70':'#EA4E1B'
    }));
    vals.searchResults=extra.concat(vals.searchResults||[]).slice(0,24);vals.hasSearchResults=vals.searchResults.length>0;vals.searchNoResults=!vals.hasSearchResults;return vals;
  };
  proto.submitSearch=function(){
    const types=findTypes(this.state&&this.state.searchQuery||'',1);if(types.length){const x=types[0];if(x.status==='ready'&&this.templateCatalog().some(t=>t.id===x.id)){this.openTemplate(x.id);return;}if(typeof window!=='undefined'&&window.location){window.location.href='./documents.html#doc-'+encodeURIComponent(x.id);return;}}
    return previousSubmit.call(this);
  };
};
RK.documentSearch={findTypes};
})();
