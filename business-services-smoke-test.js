const assert=require('assert');
global.window=global;
require('./business-services-catalog.js');
const C=global.RKBusinessServices;
assert(C,'RKBusinessServices должен быть загружен');
assert.strictEqual(C.categories.length,28,'Должно быть 28 направлений сервисов');
assert.strictEqual(C.services.length,468,'Должно быть 468 сервисов');
const ids=C.services.map(x=>x.id);
assert.strictEqual(new Set(ids).size,ids.length,'ID сервисов не должны повторяться');
[
 'Платёжный календарь','Управленческий P&L','База клиентов','Конструктор коммерческого предложения',
 'Какой договор нужен','Клиент не платит','Первый сотрудник','Карточка сотрудника','Риск трудовых отношений',
 'Налоговый профиль бизнеса','Рейтинг риска контрагента','Создать прайс-лист','Склад',
 'Wildberries — юнит-экономика','Маркетинговый план','Скрипт звонка','NPS','ABC-анализ',
 'Проекты','Заявка на закупку','Мастер бизнес-плана','Открыть кофейню','Как выставить счёт',
 'Календарь налогов','Скоро налог','Создать договор','Реквизиты бизнеса'
].forEach(title=>assert(C.services.some(x=>x.title===title),'Нет сервиса: '+title));
['registry','planner','generator','checklist','analyzer','wizard','guide'].forEach(type=>assert(C.services.some(x=>x.type===type),'Нет типа сервиса: '+type));
console.log(JSON.stringify({categories:C.categories.length,services:C.services.length,types:Object.keys(C.types)}));
