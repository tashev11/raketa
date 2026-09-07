(function(){
'use strict';
function money(text){return Number(String(text||'').replace(/[^0-9.,-]/g,'').replace(/\s/g,'').replace(',','.'))||0}
function rub(x){return Math.round(Number(x)||0).toLocaleString('ru-RU')+' ₽'}
function boot(){
 const employee=document.getElementById('view-employee');
 if(!employee||document.getElementById('affordabilityBox')) return false;
 const right=employee.querySelector('.grid>div:last-child');
 if(!right) return false;
 const box=document.createElement('div');box.className='panel';box.id='affordabilityBox';box.style.marginTop='12px';box.innerHTML='<h3>Потянет ли бизнес этого сотрудника</h3><div class="row"><div class="field"><label>Выручка бизнеса, ₽/мес</label><input id="aRevenue" type="number" min="0" value="1000000"></div><div class="field"><label>Маржа после переменных расходов, %</label><input id="aMargin" type="number" min="0" max="100" value="40"></div></div><div class="field"><label>Прочие постоянные расходы, ₽/мес</label><input id="aFixed" type="number" min="0" value="200000"></div><div class="metrics"><div class="metric"><div class="l">До найма</div><div class="v" id="aBefore">—</div></div><div class="metric"><div class="l">После найма</div><div class="v" id="aAfter">—</div></div><div class="metric"><div class="l">Нужная выручка</div><div class="v" id="aRequired">—</div></div></div><div id="aVerdict"></div>';
 right.appendChild(box);
 function calc(){const rev=Math.max(0,Number(document.getElementById('aRevenue').value)||0),margin=Math.max(0,Math.min(100,Number(document.getElementById('aMargin').value)||0))/100,fixed=Math.max(0,Number(document.getElementById('aFixed').value)||0),annualCost=money(document.getElementById('eCost')?.textContent),employeeCost=annualCost/12,before=rev*margin-fixed,after=before-employeeCost,required=margin>0?(fixed+employeeCost)/margin:0;document.getElementById('aBefore').textContent=rub(before);document.getElementById('aAfter').textContent=rub(after);document.getElementById('aRequired').textContent=margin>0?rub(required):'—';let cls='good',text='По введённым данным бизнес покрывает полную стоимость сотрудника.';if(after<0){cls='bad';text='При текущей выручке и марже найм уводит операционный результат в минус примерно на '+rub(Math.abs(after))+' в месяц.'}else if(rev&&after/rev<.1){cls='warn';text='Сотрудник окупается, но запас после найма меньше 10% месячной выручки.'}document.getElementById('aVerdict').innerHTML='<div class="alert '+cls+'">'+text+'</div>'}
 ['aRevenue','aMargin','aFixed'].forEach(id=>document.getElementById(id).addEventListener('input',calc));
 const obs=new MutationObserver(calc);const target=document.getElementById('eCost');if(target)obs.observe(target,{childList:true,characterData:true,subtree:true});calc();return true
}
if(!boot()){const obs=new MutationObserver(function(){if(boot())obs.disconnect()});obs.observe(document.documentElement,{childList:true,subtree:true})}
})();
