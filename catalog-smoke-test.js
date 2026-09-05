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
load('catalog-extra-3.js');
load('document-taxonomy.js');
load('document-base-extra.js');
load('catalog-virtual.js');
load('catalog-policy.js');

const RK = sandbox.window.RKCatalog;
const Tax = sandbox.window.RKDocumentTaxonomy;
const DocBase = sandbox.window.RKDocumentBase;
assert(RK, 'RKCatalog должен загрузиться');
assert(Tax, 'таксономия документов должна загрузиться');
assert(DocBase, 'дополнительные основы документов должны загрузиться');

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
      searchResults:[], searchSummaryText:'0 совпадений', hasSearchResults:false,
      searchNoResults:!!this.state.searchQuery, hasSearchMore:false, searchMoreText:'',
      catalogCountText:String(this.templateCatalog().length), readyTemplateCountText:String(this.templateCatalog().length)
    };
  }
  submitSearch() { this.baseSubmitCalled = true; }
  openTemplate(id) { this.state.selectedTemplateId = id; this.opened = id; }
  downloadSavedDoc() { this.baseDownloadCalled = true; }
  downloadHtml() {}
  templateDocHtml() { return '<html></html>'; }
}

DocBase.install(Component);
RK.install(Component);
const app = new Component();

assert(Tax.items.length >= 180, `ожидалось минимум 180 типов документов, получено ${Tax.items.length}`);
assert(Tax.groups.length >= 12, 'должны быть отдельные группы документов');
assert(Tax.items.some(x => x.id === 'will' && x.status === 'notary'), 'завещание должно быть в нотариальной категории');
assert(Tax.items.some(x => /Расписка/.test(x.title)), 'в таксономии должны быть расписки');
assert(Tax.items.some(x => /Доверенность/.test(x.title)), 'в таксономии должны быть доверенности');
assert(Tax.items.some(x => x.group === 'acts'), 'в таксономии должны быть акты');
assert(Tax.items.some(x => x.group === 'billing'), 'в таксономии должны быть счета и бухгалтерские формы');

const baseList = app.templateCatalog();
assert(baseList.some(x => x.id === 'additional-agreement'), 'дополнительное соглашение должно стать реальной основой');
assert(baseList.some(x => x.id === 'termination-agreement'), 'соглашение о расторжении должно стать реальной основой');
assert(baseList.some(x => x.id === 'deposit-receipt'), 'расписка о задатке/авансе должна стать реальной основой');
assert(baseList.some(x => x.id === 'goods-power'), 'доверенность на получение товара должна стать реальной основой');
assert(baseList.some(x => x.id === 'vacation-application'), 'заявление на отпуск должно стать реальной основой');

const initial = app.renderVals();
const total = Number(String(initial.catalogCountText).replace(/\D/g,''));
assert(total >= 100000, `ожидалось не менее 100 000 отраслевых вариантов, получено ${total}`);
assert(RK.niches.length >= 380, `ожидалось не менее 380 ниш после третьего слоя, получено ${RK.niches.length}`);
assert(RK.services.length >= 320, `ожидалось не менее 320 услуг после третьего слоя, получено ${RK.services.length}`);
assert(baseList.length < 200, 'виртуальные отраслевые варианты не должны физически раздувать основной массив');

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

app.state.searchQuery = 'SOC кибербезопасность';
assert(app.renderVals().searchResults.length > 0, 'должен работать поиск SOC/кибербезопасности');
app.state.searchQuery = 'морская перевозка нефтесервис';
assert(app.renderVals().searchResults.length > 0, 'третий отраслевой слой должен участвовать в поиске');
app.state.searchQuery = 'обслуживание медицинского оборудования клиника';
assert(app.renderVals().searchResults.length > 0, 'новые специализированные услуги должны участвовать в поиске');

console.log(JSON.stringify({
  ok:true,
  total,
  baseTemplates:baseList.length,
  documentTypes:Tax.items.length,
  documentGroups:Tax.groups.length,
  readyTaxonomy:Tax.ready.length,
  niches:RK.niches.length,
  services:RK.services.length,
  parties:RK.parties.length
}, null, 2));
