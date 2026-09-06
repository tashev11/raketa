(function () {
  'use strict';

  // Масштабируемый отраслевой каталог.
  // Логика: базовый проверенный документ × ниша × услуга × тип сторон.
  // Варианты не копируют юридический текст: они наследуют тело базового шаблона,
  // а каталог добавляет контекст ниши/услуги и поисковые запросы.

  const MAX_VARIANTS = 30000;

  const parties = [
    { slug:'ip-ooo', label:'ИП → ООО', tags:['ип','ооо','исполнитель ип','заказчик ооо'] },
    { slug:'ooo-ip', label:'ООО → ИП', tags:['ооо','ип','исполнитель ооо','заказчик ип'] },
    { slug:'ooo-ooo', label:'ООО → ООО', tags:['ооо','юрлицо','между компаниями'] },
    { slug:'ip-ip', label:'ИП → ИП', tags:['ип','между предпринимателями'] }
  ];

  const niches = [
    ['dentistry','Стоматология',['medical','local']],
    ['medical-center','Медицинский центр',['medical','local']],
    ['private-clinic','Частная клиника',['medical','local']],
    ['cosmetology','Клиника косметологии',['medical','beauty','local']],
    ['laboratory','Медицинская лаборатория',['medical']],
    ['pharmacy','Аптека',['medical','retail']],
    ['beauty-salon','Салон красоты',['beauty','local']],
    ['barbershop','Барбершоп',['beauty','local']],
    ['nail-studio','Студия маникюра',['beauty','local']],
    ['brow-studio','Студия бровей и ресниц',['beauty','local']],
    ['spa','SPA-салон',['beauty','local']],
    ['fitness-club','Фитнес-клуб',['fitness','local']],
    ['yoga-studio','Студия йоги',['fitness','local']],
    ['sport-school','Спортивная школа',['fitness','education']],
    ['restaurant','Ресторан',['horeca','local']],
    ['cafe','Кафе',['horeca','local']],
    ['coffee-shop','Кофейня',['horeca','local']],
    ['bakery','Пекарня',['horeca','food','local']],
    ['food-delivery','Доставка еды',['horeca','food','ecommerce']],
    ['catering','Кейтеринг',['horeca','events']],
    ['hotel','Гостиница',['horeca','travel']],
    ['hostel','Хостел',['horeca','travel']],
    ['apart-hotel','Апарт-отель',['horeca','realestate','travel']],
    ['auto-dealer','Автосалон',['auto','retail']],
    ['auto-service','Автосервис',['auto','local']],
    ['tire-service','Шиномонтаж',['auto','local']],
    ['detailing','Детейлинг-центр',['auto','local']],
    ['car-rental','Прокат автомобилей',['auto','rent']],
    ['real-estate-agency','Агентство недвижимости',['realestate']],
    ['developer','Застройщик',['realestate','construction']],
    ['property-management','Управляющая недвижимостью компания',['realestate','facility']],
    ['construction-company','Строительная компания',['construction']],
    ['renovation-company','Компания по ремонту квартир',['construction','local']],
    ['engineering-company','Инженерная компания',['construction','industrial']],
    ['architecture-bureau','Архитектурное бюро',['construction','design']],
    ['interior-studio','Студия дизайна интерьера',['design','construction']],
    ['furniture-company','Мебельная компания',['manufacturing','retail']],
    ['printing-house','Типография',['manufacturing','advertising']],
    ['advertising-agency','Рекламное агентство',['advertising','b2b']],
    ['marketing-agency','Маркетинговое агентство',['advertising','b2b']],
    ['smm-agency','SMM-агентство',['advertising','b2b']],
    ['web-studio','Веб-студия',['it','design','b2b']],
    ['it-company','IT-компания',['it','b2b']],
    ['saas','SaaS-сервис',['it','b2b']],
    ['integrator','Системный интегратор',['it','industrial','b2b']],
    ['cybersecurity','Компания по информационной безопасности',['it','security','b2b']],
    ['accounting-firm','Бухгалтерская компания',['finance','b2b']],
    ['law-firm','Юридическая компания',['legal','b2b']],
    ['consulting-firm','Консалтинговая компания',['consulting','b2b']],
    ['hr-agency','Кадровое агентство',['hr','b2b']],
    ['training-center','Учебный центр',['education','b2b']],
    ['online-school','Онлайн-школа',['education','it']],
    ['private-school','Частная школа',['education','local']],
    ['kindergarten','Частный детский сад',['education','local']],
    ['language-school','Языковая школа',['education','local']],
    ['travel-agency','Туристическое агентство',['travel']],
    ['tour-operator','Туроператор',['travel']],
    ['logistics-company','Логистическая компания',['logistics','b2b']],
    ['courier-service','Курьерская служба',['logistics','local']],
    ['fulfillment','Фулфилмент-оператор',['logistics','ecommerce']],
    ['warehouse','Складской оператор',['logistics','industrial']],
    ['factory','Производственная компания',['manufacturing','industrial']],
    ['metalworking','Металлообработка',['manufacturing','industrial']],
    ['textile','Швейное производство',['manufacturing']],
    ['food-production','Пищевое производство',['manufacturing','food']],
    ['wholesale','Оптовая компания',['supply','b2b']],
    ['online-store','Интернет-магазин',['ecommerce','retail']],
    ['marketplace-seller','Продавец на маркетплейсах',['ecommerce','retail']],
    ['retail-store','Розничный магазин',['retail','local']],
    ['supermarket','Продуктовый магазин',['retail','food','local']],
    ['pet-shop','Зоомагазин',['pets','retail']],
    ['vet-clinic','Ветеринарная клиника',['pets','medical','local']],
    ['grooming','Груминг-салон',['pets','beauty','local']],
    ['farm','Фермерское хозяйство',['agro','food']],
    ['agro-company','Агрокомпания',['agro','industrial']],
    ['landscape','Ландшафтная компания',['construction','agro','local']],
    ['cleaning','Клининговая компания',['cleaning','facility','local']],
    ['security-company','Охранная компания',['security','facility']],
    ['event-agency','Event-агентство',['events','b2b']],
    ['photo-studio','Фотостудия',['media','local']],
    ['video-production','Видеопродакшн',['media','b2b']],
    ['call-center','Колл-центр',['sales','b2b']],
    ['sales-outsourcing','Аутсорсинговый отдел продаж',['sales','b2b']],
    ['franchise','Франчайзинговая сеть',['franchise','retail']],
    ['coworking','Коворкинг',['realestate','rent','b2b']],
    ['business-center','Бизнес-центр',['realestate','facility']],
    ['shopping-center','Торговый центр',['realestate','retail','facility']],
    ['laundry','Прачечная и химчистка',['cleaning','local']],
    ['repair-electronics','Сервисный центр электроники',['electronics','local']],
    ['appliance-repair','Ремонт бытовой техники',['electronics','local']],
    ['telecom','Телеком-компания',['it','telecom']],
    ['energy-service','Энергосервисная компания',['energy','industrial']],
    ['recycling','Компания по переработке отходов',['ecology','industrial']],
    ['certification','Центр сертификации',['certification','b2b']],
    ['tender-agency','Тендерное агентство',['procurement','b2b']],
    ['import-company','Импортёр и ВЭД-компания',['supply','logistics','b2b']],
    ['china-sourcing','Закупки и поставки из Китая',['supply','logistics','b2b']],
    ['office-service','Офисный сервис и аутсорсинг',['facility','b2b']],
    ['ai-agency','AI-агентство',['it','advertising','b2b']],
    ['telegram-agency','Telegram-агентство',['advertising','it','b2b']],
    ['production-studio','Контент-студия',['media','advertising','b2b']]
  ].map(x => ({ slug:x[0], name:x[1], tags:x[2] }));

  // Первые 10 услуг — сквозные для большинства бизнесов. Остальные включаются по тегам ниши.
  const services = [
    ['website','Разработка сайта','service',['all','it']],
    ['seo','SEO-продвижение','service',['all','advertising']],
    ['context','Контекстная реклама','service',['all','advertising']],
    ['smm','Ведение социальных сетей','service',['all','advertising']],
    ['branding','Брендинг и фирменный стиль','service',['all','design']],
    ['crm','Внедрение CRM','service',['all','it','sales']],
    ['accounting','Бухгалтерское обслуживание','service',['all','finance']],
    ['legal','Абонентское юридическое сопровождение','service',['all','legal']],
    ['recruiting','Подбор персонала','service',['all','hr']],
    ['sales','Построение и автоматизация отдела продаж','service',['all','sales']],

    ['reviews','Управление отзывами и репутацией','service',['local','medical','beauty','horeca','auto','realestate','retail','pets']],
    ['geo','Продвижение в картах и геосервисах','service',['local']],
    ['calltracking','Коллтрекинг и аналитика звонков','service',['medical','realestate','auto','sales','advertising']],
    ['callcenter','Колл-центр и обработка заявок','service',['medical','realestate','ecommerce','sales','travel']],
    ['booking','Онлайн-запись и бронирование','service',['medical','beauty','fitness','horeca','travel','pets']],
    ['photo','Профессиональная фотосъёмка','service',['medical','beauty','horeca','auto','realestate','retail','ecommerce','events','media']],
    ['video','Видеосъёмка и видеоконтент','service',['medical','beauty','horeca','auto','realestate','retail','ecommerce','events','media']],
    ['content','Контент-маркетинг','service',['advertising','education','it','medical','realestate','ecommerce']],
    ['email','Email- и CRM-маркетинг','service',['advertising','ecommerce','retail','education','sales']],
    ['loyalty','Программа лояльности','service',['retail','horeca','beauty','fitness','auto','pets']],

    ['medical-marketing','Медицинский маркетинг','service',['medical']],
    ['medical-license','Лицензионное сопровождение медицинской организации','service',['medical','legal']],
    ['medical-audit','Аудит медицинской организации','service',['medical']],
    ['mis','Внедрение медицинской информационной системы','service',['medical','it']],
    ['medical-equipment','Обслуживание медицинского оборудования','work',['medical','electronics']],

    ['salon-automation','Автоматизация салона и онлайн-записи','service',['beauty']],
    ['admin-training','Обучение администраторов','service',['beauty','medical','horeca','fitness']],
    ['beauty-supply','Поставка профессиональной косметики и расходников','supply',['beauty']],

    ['restaurant-automation','Автоматизация ресторана и кассовой системы','service',['horeca','it']],
    ['menu','Разработка и дизайн меню','service',['horeca','food','design']],
    ['food-photo','Фуд-фотография','service',['horeca','food','media']],
    ['restaurant-training','Обучение персонала ресторана','service',['horeca','education']],
    ['food-supply','Поставка продуктов и расходных материалов','supply',['horeca','food']],
    ['equipment-kitchen','Ремонт ресторанного оборудования','work',['horeca','electronics']],

    ['auto-leads','Лидогенерация для автосалона и автосервиса','service',['auto','advertising']],
    ['car-photo','Фотосъёмка автомобилей','service',['auto','media']],
    ['parts','Поставка автозапчастей и расходников','supply',['auto']],
    ['auto-equipment','Ремонт оборудования автосервиса','work',['auto','electronics']],

    ['estate-leads','Лидогенерация объектов недвижимости','service',['realestate','advertising']],
    ['estate-crm','CRM для агентства недвижимости и застройщика','service',['realestate','it']],
    ['estate-media','Фото, видео и 3D-тур недвижимости','service',['realestate','media']],
    ['estate-legal','Юридическое сопровождение сделок с недвижимостью','service',['realestate','legal']],

    ['estimate','Сметные работы','service',['construction']],
    ['project','Проектирование и рабочая документация','service',['construction']],
    ['supervision','Технический надзор','service',['construction']],
    ['renovation','Строительно-монтажные и ремонтные работы','work',['construction']],
    ['materials','Поставка строительных материалов','supply',['construction']],
    ['equipment-rent','Аренда строительной техники и оборудования','rent',['construction','industrial']],

    ['devops','DevOps и облачная инфраструктура','service',['it']],
    ['testing','Тестирование программного обеспечения','service',['it']],
    ['security-audit','Аудит информационной безопасности','service',['it','security']],
    ['tech-support','Техническая поддержка и сопровождение','service',['it']],
    ['ai','Внедрение ИИ и автоматизация процессов','service',['it','b2b']],
    ['integration','Интеграция API и бизнес-систем','service',['it','b2b']],

    ['lms','Внедрение LMS и образовательной платформы','service',['education','it']],
    ['course-production','Продюсирование и разработка онлайн-курса','service',['education','media']],
    ['education-ads','Продвижение образовательных услуг','service',['education','advertising']],
    ['teacher-recruiting','Подбор преподавателей','service',['education','hr']],

    ['freight','Грузоперевозки','service',['logistics']],
    ['expedition','Транспортная экспедиция','service',['logistics']],
    ['fulfillment-service','Фулфилмент и обработка заказов','service',['logistics','ecommerce']],
    ['storage','Ответственное хранение','service',['logistics']],
    ['customs','Таможенное оформление и ВЭД-сопровождение','service',['logistics','supply']],
    ['china','Организация поставок из Китая','service',['logistics','supply']],

    ['marketplace','Ведение магазина на маркетплейсах','service',['ecommerce']],
    ['product-card','Создание карточек товаров','service',['ecommerce','design','media']],
    ['marketplace-ads','Реклама на маркетплейсах','service',['ecommerce','advertising']],
    ['marketplace-analytics','Аналитика и юнит-экономика маркетплейса','service',['ecommerce','finance']],
    ['merch','Мерчандайзинг и аудит торговых точек','service',['retail']],
    ['inventory','Инвентаризация','service',['retail','logistics']],

    ['equipment-service','Техническое обслуживание промышленного оборудования','work',['industrial','manufacturing']],
    ['industrial-automation','Промышленная автоматизация и АСУ ТП','work',['industrial','manufacturing','it']],
    ['quality','Контроль качества и производственный аудит','service',['industrial','manufacturing']],
    ['industrial-supply','Поставка промышленного оборудования и запчастей','supply',['industrial','manufacturing']],
    ['contract-manufacturing','Контрактное производство','work',['manufacturing']],

    ['tender','Тендерное сопровождение','service',['procurement','b2b']],
    ['cert','Сертификация продукции и разрешительная документация','service',['certification','manufacturing','supply']],
    ['procurement','Аутсорсинг закупок и поиск поставщиков','service',['procurement','supply','b2b']],

    ['event','Организация мероприятий','service',['events']],
    ['event-rent','Аренда звука, света и оборудования для мероприятий','rent',['events']],
    ['stream','Трансляция и видеопродакшн мероприятия','service',['events','media']],
    ['event-catering','Кейтеринг для мероприятий','service',['events','horeca']],

    ['cleaning-service','Профессиональный клининг','service',['cleaning','facility','horeca','medical','retail']],
    ['facility','Техническая эксплуатация объекта','service',['facility','realestate']],
    ['security-service','Физическая и пультовая охрана','service',['security','facility','retail']],
    ['cctv','Монтаж видеонаблюдения и СКУД','work',['security','facility','construction']],

    ['agro','Агрономическое сопровождение','service',['agro']],
    ['agro-work','Полевые и сельскохозяйственные работы','work',['agro']],
    ['agro-supply','Поставка семян, удобрений и материалов','supply',['agro']],
    ['agro-repair','Ремонт и обслуживание сельхозтехники','work',['agro','industrial']],

    ['pet-marketing','Продвижение ветеринарных и зоосервисов','service',['pets','advertising']],
    ['pet-supply','Поставка зоотоваров и ветеринарных расходников','supply',['pets']],

    ['tour-marketing','Продвижение туристических услуг','service',['travel','advertising']],
    ['travel-booking','Организация бронирования и клиентского сервиса','service',['travel']],
    ['transfer','Трансфер и транспортное обслуживание туристов','service',['travel','logistics']],

    ['franchise-pack','Разработка и упаковка франшизы','service',['franchise','consulting']],
    ['franchise-sales','Продвижение и продажа франшизы','service',['franchise','advertising','sales']],
    ['franchise-legal','Юридическое сопровождение франчайзинга','service',['franchise','legal']],

    ['recycling-service','Вывоз, утилизация и переработка отходов','service',['ecology']],
    ['eco-audit','Экологический аудит и отчётность','service',['ecology','industrial']],
    ['energy-audit','Энергоаудит и энергосервис','service',['energy','industrial']],
    ['telecom-install','Монтаж и обслуживание сетей связи','work',['telecom','it']],
    ['electronics-repair','Ремонт электроники и оборудования','work',['electronics']]
  ].map(x => ({ slug:x[0], name:x[1], mode:x[2], tags:x[3] }));

  const docsByMode = {
    service:['dogovor-uslug','akt-vypolnennyh-rabot','schet','kommercheskoe-predlozhenie','pretenziya'],
    work:['dogovor-podryada','akt-vypolnennyh-rabot','schet','kommercheskoe-predlozhenie','pretenziya'],
    supply:['dogovor-postavki','akt-sverki','schet','kommercheskoe-predlozhenie','pretenziya'],
    rent:['dogovor-arendy','akt-priema-peredachi','schet','kommercheskoe-predlozhenie','pretenziya']
  };

  function intersects(a, b) {
    if (a.indexOf('all') !== -1) return true;
    for (let i = 0; i < a.length; i++) if (b.indexOf(a[i]) !== -1) return true;
    return false;
  }

  function hash(value) {
    let h = 2166136261;
    const s = String(value);
    for (let i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return (h >>> 0).toString(36);
  }

  function buildVariants(baseCatalog) {
    const byId = Object.create(null);
    baseCatalog.forEach(t => { byId[t.id] = t; });
    const out = [];

    outer:
    for (const niche of niches) {
      for (const service of services) {
        if (!intersects(service.tags, niche.tags)) continue;
        const docIds = docsByMode[service.mode] || docsByMode.service;
        for (const docId of docIds) {
          const base = byId[docId];
          if (!base) continue;
          for (const party of parties) {
            if (out.length >= MAX_VARIANTS) break outer;
            const variantId = 'rk-' + docId + '-' + niche.slug + '-' + service.slug + '-' + party.slug;
            out.push(Object.assign({}, base, {
              id: variantId,
              title: base.title + ': ' + service.name + ' — ' + party.label,
              category: niche.name,
              collection: 'Отраслевой вариант',
              status: 'ready',
              statusLabel: 'Отраслевой вариант',
              description: base.title + ' для услуги «' + service.name + '» в нише «' + niche.name + '». Сценарий сторон: ' + party.label + '.',
              tags: (base.tags || []).concat([niche.name, service.name, party.label]).concat(party.tags).concat(niche.tags).concat(service.tags),
              rkVariant: true,
              rkBaseId: base.id,
              rkNiche: niche.name,
              rkNicheSlug: niche.slug,
              rkService: service.name,
              rkServiceSlug: service.slug,
              rkParty: party.label,
              rkSearchKey: hash(niche.slug + '|' + service.slug + '|' + party.slug + '|' + docId)
            }));
          }
        }
      }
    }
    return out;
  }

  function install(Component) {
    if (!Component || !Component.prototype || Component.prototype.__rkCatalogInstalled) return;
    Component.prototype.__rkCatalogInstalled = true;

    const originalCatalog = Component.prototype.templateCatalog;
    Component.prototype.templateCatalog = function () {
      if (this._rkExpandedCatalog) return this._rkExpandedCatalog;
      const base = originalCatalog.call(this);
      const variants = buildVariants(base);
      this._rkExpandedCatalog = base.concat(variants);
      this._templateCatalog = this._rkExpandedCatalog;
      window.RKCatalog.meta = {
        baseTemplates: base.length,
        variants: variants.length,
        total: this._rkExpandedCatalog.length,
        niches: niches.length,
        services: services.length,
        parties: parties.length
      };
      return this._rkExpandedCatalog;
    };

    const originalDraft = Component.prototype.defaultDraftFor;
    Component.prototype.defaultDraftFor = function (templateId) {
      const draft = originalDraft.call(this, templateId);
      const template = this.templateCatalog().find(t => t.id === templateId);
      if (template && template.rkVariant) {
        draft.purpose = template.rkService;
        if (!draft.transfer_method) draft.transfer_method = 'по счёту и условиям договора';
        if (!draft.return_method) draft.return_method = 'по акту или иному закрывающему документу';
        if (!draft.penalty) draft.penalty = 'в соответствии с договором и законодательством РФ';
      }
      return draft;
    };
  }

  window.RKCatalog = {
    install,
    buildVariants,
    niches,
    services,
    parties,
    docsByMode,
    meta: { baseTemplates:0, variants:0, total:0, niches:niches.length, services:services.length, parties:parties.length }
  };
})();
