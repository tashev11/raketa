const fs = require('fs');
const vm = require('vm');
const assert = require('assert');

const sandbox = { window: {}, console, Set, Object, Array, String, Number, Math, Date, JSON, encodeURIComponent, decodeURIComponent };
vm.createContext(sandbox);
function localPath(file) { return String(file).replace(/^\.\//,'').replace(/\?.*$/,''); }
function load(file) { const path=localPath(file); vm.runInContext(fs.readFileSync(path, 'utf8'), sandbox, { filename: path }); }

load('catalog-manifest.js');
assert(Array.isArray(sandbox.window.RK_EXTENSION_SCRIPTS), 'manifest должен содержать список расширений');
sandbox.window.RK_EXTENSION_SCRIPTS.forEach(load);

const RK = sandbox.window.RKCatalog;
const Tax = sandbox.window.RKDocumentTaxonomy;
const DocBase = sandbox.window.RKDocumentBase;
assert(RK, 'RKCatalog должен загрузиться');
assert(Tax, 'таксономия документов должна загрузиться');
assert(DocBase, 'дополнительные основы документов должны загрузиться');

const baseTemplates = [
  ['dogovor-uslug','Договор оказания услуг','Договор'],['akt-vypolnennyh-rabot','Акт выполненных работ','Акт'],['schet','Счёт на оплату','Счёт'],['kommercheskoe-predlozhenie','Коммерческое предложение','Предложение'],['pretenziya','Претензия','Претензия'],['dogovor-podryada','Договор подряда','Договор'],['dogovor-postavki','Договор поставки','Договор'],['akt-sverki','Акт сверки взаиморасчётов','Акт'],['dogovor-arendy-oborudovaniya','Договор аренды оборудования','Договор'],['akt-priema-peredachi','Акт приёма-передачи','Акт']
].map(([id,title,kind]) => ({id,title,kind,category:'Базовые документы',tags:[title.toLowerCase()],status:'ready',statusLabel:'Готов к заполнению',time:'5–10 минут',fields:['Стороны','Предмет','Стоимость'],when:['Нужно оформить отношения сторон'],risks:['Проверьте существенные условия'],body:'{{lender_name}} и {{borrower_name}}. Предмет: {{purpose}}.'}));

class Component {
  constructor() { this.state = { searchQuery:'', selectedTemplateId:'dogovor-uslug', templateDraft:{} }; }
  templateCatalog() { return baseTemplates; }
  selectedTemplate() { return this.templateCatalog().find(t => t.id === this.state.selectedTemplateId) || this.templateCatalog()[0]; }
  defaultDraftFor() { return { city:'Казань', purpose:'', transfer_method:'', return_method:'', penalty:'' }; }
  plu(n, f) { n=Math.abs(n)%100; const n1=n%10; if(n>10&&n<20)return f[2]; if(n1>1&&n1<5)return f[1]; if(n1===1)return f[0]; return f[2]; }
  renderVals() { return {searchResults:[],searchSummaryText:'0 совпадений',hasSearchResults:false,searchNoResults:!!this.state.searchQuery,hasSearchMore:false,searchMoreText:'',catalogCountText:String(this.templateCatalog().length),readyTemplateCountText:String(this.templateCatalog().length)}; }
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
assert(Tax.items.some(x => x.id === 'will' && x.status === 'notary'), 'завещание должно оставаться нотариальной категорией');
assert(Tax.items.some(x => x.id === 'invoice' && x.status === 'regulated'), 'счёт-фактура должна оставаться регулируемой формой');
assert(Tax.items.some(x => /Расписка/.test(x.title)), 'в таксономии должны быть расписки');
assert(Tax.items.some(x => /Доверенность/.test(x.title)), 'в таксономии должны быть доверенности');

const baseList = app.templateCatalog();
const ids = baseList.map(x => x.id);
assert.strictEqual(new Set(ids).size, ids.length, 'в основном каталоге не должно быть дублирующихся ID');
[
  'additional-agreement','debt-repayment-agreement','setoff-agreement','acceptance-services','defect-act','loan-receipt','bank-power','refund-application','agency-contract','rent-apartment','software-development','accounting-services','founder-decision','privacy-policy','public-offer','sla','technical-specification','invoice-offer','quality-claim','employment-offer','handover-employee','assignment-agreement','vehicle-transfer-act','data-processing-agreement','software-assignment','child-residence','preliminary-sale','information-letter','shortage-act'
].forEach(id => assert(baseList.some(x => x.id === id), `готовая основа ${id} должна присутствовать`));
assert(Tax.ready.length >= 120, `ожидалось не менее 120 готовых видов документов, получено ${Tax.ready.length}`);

const initial = app.renderVals();
const total = Number(String(initial.catalogCountText).replace(/\D/g,''));
assert(total >= 200000, `ожидалось не менее 200 000 отраслевых вариантов, получено ${total}`);
assert(RK.niches.length >= 450, `ожидалось не менее 450 ниш, получено ${RK.niches.length}`);
assert(RK.services.length >= 400, `ожидалось не менее 400 услуг, получено ${RK.services.length}`);
assert(baseList.length < 350, 'виртуальные отраслевые варианты не должны физически раздувать основной массив');
assert(RK.virtual.docsByMode.service.length >= 12, 'для услуг должен быть полный комплект документов');
assert(RK.virtual.docsByMode.supply.length >= 13, 'для поставки должен быть расширенный комплект документов');
assert(RK.virtual.docsByMode.rent.length >= 12, 'для аренды должен быть расширенный комплект документов');

app.state.searchQuery = 'SEO стоматология';
const seo = app.renderVals();
assert(seo.searchResults.some(r => /стоматолог/i.test(r.title + ' ' + r.desc)), 'поиск должен находить стоматологию');
assert(seo.searchResults.some(r => /SEO/i.test(r.title + ' ' + r.desc)), 'поиск должен учитывать SEO-контекст');
const variantId = seo.searchResults.find(r => r.templateId && r.templateId.indexOf('rk--') === 0).templateId;
app.state.selectedTemplateId = variantId;
assert(app.selectedTemplate().rkVariant === true, 'отраслевой ID должен лениво разрешаться в шаблон');
assert(/SEO/i.test(app.defaultDraftFor(variantId).purpose), 'услуга должна автоматически попадать в предмет документа');

app.state.searchQuery = 'НДС';
assert.strictEqual(app.renderVals().searchResults.length, 0, 'общий запрос НДС не должен разворачивать отраслевые варианты');
app.submitSearch();
assert(app.baseSubmitCalled === true, 'общий запрос должен оставаться в базовом поиске');

app.state.searchQuery = 'завещание';
const willSearch = app.renderVals();
assert(willSearch.searchResults.some(r => /Завещание/i.test(r.title)), 'главный поиск должен находить завещание');
assert(willSearch.searchResults.some(r => /Нотариаль/i.test(r.desc + ' ' + r.meta)), 'завещание должно быть явно помечено как нотариальное');
app.state.searchQuery = 'публичная оферта';
assert(app.renderVals().searchResults.some(r => /Публичная оферта/i.test(r.title)), 'поиск должен находить публичную оферту');
app.state.searchQuery = 'акт передачи исходного кода';
assert(app.renderVals().searchResults.some(r => /исходного кода/i.test(r.title)), 'поиск должен находить IT-акты');
app.state.searchQuery = 'претензия качество товара';
assert(app.renderVals().searchResults.some(r => /качеству товара/i.test(r.title)), 'поиск должен находить специализированные претензии');
app.state.searchQuery = 'договор уступки права требования';
assert(app.renderVals().searchResults.some(r => /уступк/i.test(r.title)), 'поиск должен находить цессию/уступку');
app.state.searchQuery = 'письмо запрос';
assert(app.renderVals().searchResults.some(r => /Письмо-запрос/i.test(r.title)), 'поиск должен находить деловую переписку');
app.state.searchQuery = 'место жительства ребёнка';
assert(app.renderVals().searchResults.some(r => /жительства ребёнка/i.test(r.title)), 'поиск должен находить семейное соглашение');
app.state.searchQuery = 'аренда оборудования мероприятие';
assert(app.renderVals().searchResults.some(r => r.templateId && r.templateId.indexOf('rk--') === 0), 'должен существовать отраслевой вариант аренды оборудования');
app.state.searchQuery = 'ремонт холодильников сервис';
assert(app.renderVals().searchResults.length > 0, 'четвёртый слой массовых услуг должен участвовать в поиске');
app.state.searchQuery = 'репетитор английский';
assert(app.renderVals().searchResults.length > 0, 'четвёртый слой образования должен участвовать в поиске');
app.state.searchQuery = 'неразрушающий контроль промышленность';
assert(app.renderVals().searchResults.length > 0, 'четвёртый слой промышленного сервиса должен участвовать в поиске');

console.log(JSON.stringify({ok:true,total,baseTemplates:baseList.length,documentTypes:Tax.items.length,documentGroups:Tax.groups.length,readyTaxonomy:Tax.ready.length,niches:RK.niches.length,services:RK.services.length,parties:RK.parties.length,serviceDocs:RK.virtual.docsByMode.service.length,supplyDocs:RK.virtual.docsByMode.supply.length,manifestScripts:sandbox.window.RK_EXTENSION_SCRIPTS.length}, null, 2));
