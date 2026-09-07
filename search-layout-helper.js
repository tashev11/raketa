(function(){
'use strict';
const EN='qwertyuiop[]asdfghjkl;\'zxcvbnm,./`';
const RU='йцукенгшщзхъфывапролджэячсмитьбю.ё';
let timer=0;
function mapLayout(s,from,to){return String(s||'').split('').map(ch=>{const low=ch.toLowerCase(),i=from.indexOf(low);if(i<0)return ch;const out=to[i]||ch;return ch===ch.toUpperCase()?out.toUpperCase():out}).join('')}
function norm(v){return String(v||'').trim()}
function candidate(q){
  q=norm(q);if(q.length<3)return'';
  const hasLat=/[a-z]/i.test(q),hasCyr=/[а-яё]/i.test(q);
  if(hasLat&&!hasCyr)return mapLayout(q,EN,RU);
  if(hasCyr&&!hasLat)return mapLayout(q,RU,EN);
  return'';
}
function removeHint(){const old=document.getElementById('rk-layout-hint');if(old)old.remove()}
function renderHint(input){
  clearTimeout(timer);timer=setTimeout(()=>{
    removeHint();if(!input||document.activeElement!==input)return;
    const fixed=candidate(input.value);if(!fixed||fixed===input.value)return;
    const api=window.RKSearchAutocomplete;if(!api||typeof api.collect!=='function')return;
    let groups=[];try{groups=api.collect(fixed)||[]}catch(e){return}
    if(!groups.length)return;
    const box=document.getElementById('rk-search-suggest'),host=box&&!box.hidden?box:document.getElementById('rk-herosearch');if(!host)return;
    const hint=document.createElement('button');hint.type='button';hint.id='rk-layout-hint';hint.dataset.rkLayoutQuery=fixed;
    hint.innerHTML='<span>Возможно, вы искали:</span> <b>'+fixed.replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]))+'</b> <span aria-hidden="true">→</span>';
    if(box&&!box.hidden)box.appendChild(hint);else host.insertAdjacentElement('afterend',hint);
  },80)
}
function styles(){if(document.getElementById('rk-layout-style'))return;const s=document.createElement('style');s.id='rk-layout-style';s.textContent='#rk-layout-hint{width:100%;max-width:1000px;border:0;border-top:1px solid #eeeae4;background:#fffaf7;color:#77716a;padding:10px 18px;text-align:left;font:500 12px Onest,system-ui,sans-serif;cursor:pointer}#rk-layout-hint b{color:#f4511e;font-weight:750}#rk-layout-hint span:last-child{float:right;color:#c9b9ae}#rk-layout-hint:hover{background:#fff4ee}#rk-herosearch + #rk-layout-hint{margin-top:8px;border:1px solid #eee4dc;border-radius:14px}@media(max-width:720px){#rk-layout-hint{padding:10px 13px}}';document.head.appendChild(s)}
function install(){styles();if(window.__RKLayoutHelper)return;window.__RKLayoutHelper=true;
 document.addEventListener('input',e=>{if(e.target&&e.target.id==='rk-herosearch-input')renderHint(e.target)},true);
 document.addEventListener('focusin',e=>{if(e.target&&e.target.id==='rk-herosearch-input')renderHint(e.target)});
 document.addEventListener('focusout',e=>{if(e.target&&e.target.id==='rk-herosearch-input')setTimeout(removeHint,180)});
 document.addEventListener('mousedown',e=>{if(e.target.closest&&e.target.closest('#rk-layout-hint'))clearTimeout(timer)});
 document.addEventListener('click',e=>{const h=e.target.closest&&e.target.closest('[data-rk-layout-query]');if(!h)return;e.preventDefault();const input=document.getElementById('rk-herosearch-input');if(!input)return;input.focus();input.value=h.dataset.rkLayoutQuery||'';input.dispatchEvent(new Event('input',{bubbles:true}));removeHint()});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else install();setTimeout(install,600);
})();
