const fs = require('fs');
const vm = require('vm');
const assert = require('assert');

const sandbox = {
  window: {},
  console,
  Set,
  Object,
  Array,
  String,
  Number,
  Math,
  Date,
  JSON,
  encodeURIComponent,
  decodeURIComponent
};
vm.createContext(sandbox);

function load(file) {
  const code = fs.readFileSync(file, 'utf8');
  vm.runInContext(code, sandbox, { filename: file });
}

load('catalog-runtime.js');
load('catalog-extra.js');
load('catalog-extra-2.js');
load('catalog-virtual.js');
load('catalog-policy.js');

const RK = sandbox.window.RKCatalog;
assert(RK, 'RKCatalog должен загрузиться');

const baseTemplates = [
  ['dogovor-uslug','Договор оказания услуг','Договор'],
  ['akt-vypolnennyh-rabot','Акт выполненных работ','Акт'],
  ['schet','Счёт на оплату','Счёт'],
  ['kommercheskoe-predlozhenie','Коммерческое предложение','Предложение'],
  ['pretenziya','Претензия','Претензия'],
  ['dogovor-podryada','Договор подряда','Договор'],
  ['dogovor-postavki','Договор поставки','Договор'],
  ['akt-sverki','Акт сверки взаиморасчётов','Акт'],
  ['dogovor-arendy-oborudovaniya','Договор аренды оборудования','Договор'],
  ['akt-priema-peredachi','Акт приёма-передачи','Акт']
].map(([id,title,kind]) => ({
  id,
  title,
  kind,
  category:'Базовые документы',
  tags:[title.toLowerCase()],
  status:'ready',
  statusLabel:'Готов к заполнению',
  time:'5–10 минут',
  fields:['Стороны','Предмет','Стоимость'],
  when:['Нужно оформить отношения сторон'],
  risks:['Проверьте существенные условия'],
  body:'{{lender_name}} и {{borrower_name}}. Предмет: {{purpose}}.'
}));

class Component {
  constructor() {
    this.state = { searchQuery:'', selectedTemplateId:'dogovor-uslug', templateDraft:{} };
  }

  templateCatalog() { return baseTemplates; }
  selectedTemplate() { return this.templateCatalog().find(t => t.id === this.state.selectedTemplateId) || this.templateCatalog()[0]; }
  defaultDraftFor() { return { city:'Казань', purpose:'', transfer_method:'', return_method:'', penalty:'' }; }
  plu(n, f) { n=Math.abs(n)%100; const n1=n%10; if(n>10&&n<20)return f[2]; if(n1>1&&n1<5)return f[1]; if(n1===1)return f[0]; return f[2]; }
  renderVals() {
    return {
      searchResults:[],
      searchSummaryText:'0 совпадений',
      hasSearchResults:false,
      searchNoResults:!!this.state.searchQuery,
      hasSearchMore:false,
      searchMoreText:'',
      catalogCountText:String(this.templateCatalog().length),
      readyTemplateCountText:String(this.templateCatalog().length)
    };
  }
  submitSearch() { this.baseSubmitCalled = true; }
  openTemplate(id) { this.state.selectedTemplateId = id; this.opened = id; }
  downloadSavedDoc() { this.baseDownloadCalled = true; }
  downloadHtml() {}
  templateDocHtml() { return '<html></html>'; }
}

RK.install(Component);
const app = new Component();

const initial = app.renderVals();
const total = Number(String(initial.catalogCountText).replace(/\D/g,''));
assert(total >= 100000, `ожидалось не менее 100 000 вариантов после второго расширения, получено ${total}`);
assert(RK.niches.length >= 300, `ожидалось не менее 300 ниш, получено ${RK.niches.length}`);
assert(RK.services.length >= 250, `ожидалось не менее 250 услуг, получено ${RK.services.length}`);
assert.strictEqual(app.templateCatalog().length, baseTemplates.length, 'виртуальный каталог не должен раздувать основной массив');

app.state.searchQuery = 'SEO стоматология';
const seo = app.renderVals();
assert(seo.searchResults.length > 0, 'поиск SEO + стоматология должен находить отраслевые варианты');
assert(seo.searchResults.some(r => /стоматолог/i.test(r.title + ' ' + r.desc)), 'в результатах должна быть стоматология');
assert(seo.searchResults.some(r => /SEO/i.test(r.title + ' ' + r.desc)), 'в результатах должен быть SEO-контекст');

const variantId = seo.searchResults.find(r => r.templateId && r.templateId.indexOf('rk--') === 0).templateId;
app.state.selectedTemplateId = variantId;
const resolved = app.selectedTemplate();
assert(resolved.rkVariant === true, 'отраслевой ID должен лениво разрешаться в шаблон');
assert(/SEO/i.test(resolved.rkService), 'разрешённый шаблон должен сохранять услугу');

const draft = app.defaultDraftFor(variantId);
assert(/SEO/i.test(draft.purpose), 'услуга должна автоматически попадать в предмет документа');

app.state.searchQuery = 'НДС';
const vat = app.renderVals();
assert.strictEqual(vat.searchResults.length, 0, 'общий запрос НДС не должен разворачивать отраслевые варианты');
app.submitSearch();
assert(app.baseSubmitCalled === true, 'общий запрос должен оставаться в базовом поиске');

app.state.searchQuery = 'аренда оборудования мероприятие';
const rent = app.renderVals();
const rentVariant = rent.searchResults.find(r => r.templateId && r.templateId.indexOf('rk--') === 0);
assert(rentVariant, 'должен существовать отраслевой вариант аренды оборудования');
app.state.selectedTemplateId = rentVariant.templateId;
const rentResolved = app.selectedTemplate();
assert.strictEqual(rentResolved.rkBaseId, 'dogovor-arendy-oborudovaniya', 'аренда оборудования должна использовать профильный базовый договор');

app.state.searchQuery = '1С производство';
const oneC = app.renderVals();
assert(oneC.searchResults.some(r => /1С/i.test(r.title + ' ' + r.desc)), 'расширенный справочник должен находить 1С для производства');

app.state.searchQuery = 'SOC кибербезопасность';
const soc = app.renderVals();
assert(soc.searchResults.length > 0, 'второй слой должен находить SOC/кибербезопасность');

app.state.searchQuery = 'аренда спецтехники строительство';
const equipment = app.renderVals();
assert(equipment.searchResults.length > 0, 'второй слой должен находить аренду спецтехники');

console.log(JSON.stringify({
  ok:true,
  total,
  niches:RK.niches.length,
  services:RK.services.length,
  parties:RK.parties.length,
  pairs:RK.meta && RK.meta.pairs,
  seoResults:seo.searchResults.length,
  oneCResults:oneC.searchResults.length,
  socResults:soc.searchResults.length,
  equipmentResults:equipment.searchResults.length
}, null, 2));
