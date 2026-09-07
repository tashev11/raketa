const fs=require('fs');const vm=require('vm');const assert=require('assert');
const code=fs.readFileSync('business-calculators-catalog.js','utf8');
const ctx={globalThis:{}};ctx.window=ctx;vm.createContext(ctx);vm.runInContext(code,ctx);
const cat=ctx.RKBusinessCalculatorCatalog;assert(cat,'catalog missing');
assert.strictEqual(cat.categories.length,21,'expected 21 calculator categories');
assert.strictEqual(cat.items.length,276,'expected all 276 calculators');
const keys=new Set();for(const item of cat.items){const key=item.category+'::'+item.title;assert(!keys.has(key),'duplicate: '+key);keys.add(key)}
['Точка безубыточности','LTV/CAC','NPV','IRR','Food Cost','DSCR — сможет ли бизнес обслуживать долг','Юнит-экономика Wildberries','Себестоимость изделия','Доходность аренды','Кассовый разрыв'].forEach(title=>assert(cat.items.some(x=>x.title===title),'missing: '+title));
console.log('business calculators catalog OK:',cat.items.length,'calculators in',cat.categories.length,'categories');