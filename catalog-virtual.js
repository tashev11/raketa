(function () {
  'use strict';

  const RK = window.RKCatalog;
  if (!RK) return;

  const MAX_RESULTS = 24;
  const docsByMode = {
    service: ['dogovor-uslug','acceptance-services','akt-vypolnennyh-rabot','schet','invoice-offer','kommercheskoe-predlozhenie','additional-agreement','termination-agreement','guarantee-letter','payment-demand','pretenziya','service-claim'],
    work: ['dogovor-podryada','akt-vypolnennyh-rabot','defect-act','inspection-act','acceptance-transfer','schet','invoice-offer','kommercheskoe-predlozhenie','additional-agreement','termination-agreement','payment-demand','service-claim'],
    supply: ['dogovor-postavki','akt-sverki','discrepancy-act','schet','invoice-offer','packing-list','kommercheskoe-predlozhenie','additional-agreement','termination-agreement','payment-demand','quality-claim','delivery-claim','penalty-demand'],
    rent: ['dogovor-arendy-oborudovaniya','equipment-transfer-act','acceptance-transfer','damage-act','inspection-act','schet','invoice-offer','kommercheskoe-predlozhenie','additional-agreement','termination-agreement','payment-demand','pretenziya']
  };

  function norm(value) {
    return String(value == null ? '' : value)
      .toLowerCase()
      .replace(/ё/g, 'е')
      .replace(/[«»“”„]/g, ' ')
      .replace(/[^a-zа-я0-9%]+/gi, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function intersects(a, b) {
    if (a.indexOf('all') !== -1) return true;
    for (let i = 0; i < a.length; i++) if (b.indexOf(a[i]) !== -1) return true;
    return false;
  }

  function variantId(baseId, niche, service, party) {
    return ['rk', baseId, niche.slug, service.slug, party.slug].join('--');
  }

  function buildPairs() {
    const pairs = [];
    RK.niches.forEach(function (niche) {
      RK.services.forEach(function (service) {
        if (!intersects(service.tags, niche.tags)) return;
        pairs.push({
          niche: niche,
          service: service,
          search: norm([niche.name, niche.slug, service.name, service.slug, niche.tags.join(' '), service.tags.join(' ')].join(' '))
        });
      });
    });
    return pairs;
  }

  const pairs = buildPairs();

  function baseIndex(instance) {
    if (instance._rkBaseIndex) return instance._rkBaseIndex;
    const map = Object.create(null);
    instance.templateCatalog().forEach(function (item) { map[item.id] = item; });
    instance._rkBaseIndex = map;
    return map;
  }

  function docsFor(instance, service) {
    const index = baseIndex(instance);
    return (docsByMode[service.mode] || docsByMode.service)
      .map(function (id) { return index[id]; })
      .filter(Boolean);
  }

  function totalVariants(instance) {
    if (typeof instance._rkVariantTotal === 'number') return instance._rkVariantTotal;
    let total = 0;
    pairs.forEach(function (pair) {
      total += docsFor(instance, pair.service).length * RK.parties.length;
    });
    instance._rkVariantTotal = total;
    return total;
  }

  function materialize(base, niche, service, party) {
    const contextWhen = 'Нужен ' + base.title.toLowerCase() + ' для услуги «' + service.name + '» в нише «' + niche.name + '».';
    const contextRisk = 'Предмет, объём и результат услуги «' + service.name + '» нужно описать конкретно, чтобы отраслевой вариант не оставался общей формой.';
    return Object.assign({}, base, {
      id: variantId(base.id, niche, service, party),
      title: base.title + ' — ' + service.name + ' для «' + niche.name + '» · ' + party.label,
      category: niche.name,
      collection: 'Отраслевой вариант',
      status: 'ready',
      statusLabel: 'Отраслевой вариант',
      description: base.title + ' для услуги «' + service.name + '» в нише «' + niche.name + '». Сценарий сторон: ' + party.label + '.',
      tags: (base.tags || []).concat([niche.name, service.name, party.label]).concat(niche.tags || []).concat(service.tags || []).concat(party.tags || []),
      when: [contextWhen].concat(base.when || []),
      risks: [contextRisk].concat(base.risks || []),
      rkVariant: true,
      rkBaseId: base.id,
      rkNiche: niche.name,
      rkNicheSlug: niche.slug,
      rkService: service.name,
      rkServiceSlug: service.slug,
      rkParty: party.label,
      rkPartySlug: party.slug
    });
  }

  function resolveVariant(instance, id) {
    if (!id || id.indexOf('rk--') !== 0) return null;
    instance._rkResolved = instance._rkResolved || Object.create(null);
    if (instance._rkResolved[id]) return instance._rkResolved[id];

    const index = baseIndex(instance);
    for (let p = 0; p < pairs.length; p++) {
      const pair = pairs[p];
      const docs = docsByMode[pair.service.mode] || docsByMode.service;
      for (let d = 0; d < docs.length; d++) {
        const base = index[docs[d]];
        if (!base) continue;
        for (let r = 0; r < RK.parties.length; r++) {
          const party = RK.parties[r];
          if (variantId(base.id, pair.niche, pair.service, party) !== id) continue;
          const found = materialize(base, pair.niche, pair.service, party);
          instance._rkResolved[id] = found;
          return found;
        }
      }
    }
    return null;
  }

  function scoreVariant(query, terms, base, pair, party) {
    const title = norm(base.title);
    const niche = norm(pair.niche.name);
    const service = norm(pair.service.name);
    const partyText = norm(party.label + ' ' + (party.tags || []).join(' '));
    const baseTags = norm((base.tags || []).join(' ') + ' ' + base.category + ' ' + base.kind);
    const all = [title, niche, service, partyText, baseTags, pair.search].join(' ');
    for (let i = 0; i < terms.length; i++) if (all.indexOf(terms[i]) === -1) return -1;

    let score = 0;
    if (service === query) score += 180;
    if (niche === query) score += 160;
    if (title === query) score += 150;
    if (service.indexOf(query) !== -1) score += 100;
    if (niche.indexOf(query) !== -1) score += 90;
    if (title.indexOf(query) !== -1) score += 80;
    terms.forEach(function (term) {
      if (service.indexOf(term) !== -1) score += 30;
      if (niche.indexOf(term) !== -1) score += 28;
      if (title.indexOf(term) !== -1) score += 22;
      if (partyText.indexOf(term) !== -1) score += 12;
      if (baseTags.indexOf(term) !== -1) score += 8;
    });
    return score;
  }

  function searchVirtual(instance, rawQuery, limit) {
    const query = norm(rawQuery);
    if (query.length < 2) return { items: [], total: 0 };
    const terms = query.split(/\s+/).filter(Boolean);
    const index = baseIndex(instance);
    const found = [];
    let total = 0;

    pairs.forEach(function (pair) {
      const hasContextTerm = terms.some(function (term) { return pair.search.indexOf(term) !== -1; });
      if (!hasContextTerm) return;

      const docs = docsByMode[pair.service.mode] || docsByMode.service;
      docs.forEach(function (docId) {
        const base = index[docId];
        if (!base) return;
        RK.parties.forEach(function (party) {
          const score = scoreVariant(query, terms, base, pair, party);
          if (score < 0) return;
          total++;
          if (found.length < (limit || MAX_RESULTS) * 3 || score > found[found.length - 1].score) {
            found.push({ score: score, base: base, pair: pair, party: party });
            found.sort(function (a, b) { return b.score - a.score || a.base.title.localeCompare(b.base.title, 'ru'); });
            if (found.length > (limit || MAX_RESULTS) * 3) found.length = (limit || MAX_RESULTS) * 3;
          }
        });
      });
    });

    return {
      total: total,
      items: found.slice(0, limit || MAX_RESULTS).map(function (item) {
        return materialize(item.base, item.pair.niche, item.pair.service, item.party);
      })
    };
  }

  function install(Component) {
    if (!Component || !Component.prototype || Component.prototype.__rkVirtualCatalogInstalled) return;
    const proto = Component.prototype;
    proto.__rkVirtualCatalogInstalled = true;

    const originalCatalog = proto.templateCatalog;
    const originalSelected = proto.selectedTemplate;
    const originalDraft = proto.defaultDraftFor;
    const originalRenderVals = proto.renderVals;
    const originalSubmitSearch = proto.submitSearch;
    const originalDownloadSavedDoc = proto.downloadSavedDoc;

    proto.templateCatalog = function () { return originalCatalog.call(this); };

    proto.selectedTemplate = function () {
      const virtual = resolveVariant(this, this.state && this.state.selectedTemplateId);
      return virtual || originalSelected.call(this);
    };

    proto.defaultDraftFor = function (templateId) {
      const virtual = resolveVariant(this, templateId);
      const draft = virtual ? originalDraft.call(this, virtual.rkBaseId) : originalDraft.call(this, templateId);
      if (virtual) {
        draft.purpose = virtual.rkService;
        if (!draft.transfer_method) draft.transfer_method = 'по счёту и условиям договора';
        if (!draft.return_method) draft.return_method = 'по акту или иному закрывающему документу';
        if (!draft.penalty) draft.penalty = 'в соответствии с договором и законодательством РФ';
      }
      return draft;
    };

    proto.renderVals = function () {
      const vals = originalRenderVals.call(this);
      const baseCount = this.templateCatalog().length;
      const variants = totalVariants(this);
      const allCount = baseCount + variants;
      const query = this.state && this.state.searchQuery ? this.state.searchQuery : '';
      const virtual = searchVirtual(this, query, 18);
      const originalResults = Array.isArray(vals.searchResults) ? vals.searchResults : [];
      const virtualResults = virtual.items.map(function (t) {
        return {href:'#template='+encodeURIComponent(t.id),templateId:t.id,title:t.title,kind:t.kind+' · '+t.rkNiche,desc:t.description,meta:t.rkService+' · '+t.rkParty+' · '+t.time,accent:'#EA4E1B'};
      });
      const merged = virtualResults.concat(originalResults).slice(0, MAX_RESULTS);
      const originalTotal = Number(String(vals.searchSummaryText || '').replace(/\D/g, '')) || originalResults.length;
      const resultTotal = virtual.total + originalTotal;

      vals.catalogCountText = allCount.toLocaleString('ru-RU');
      vals.catalogCountNoun = this.plu(allCount, ['вид документа','вида документов','видов документов']);
      vals.readyTemplateCountText = allCount.toLocaleString('ru-RU');
      vals.readyTemplateCountNoun = this.plu(allCount, ['готовый вариант','готовых варианта','готовых вариантов']);
      if (norm(query).length >= 2) {
        vals.searchResults = merged;
        vals.hasSearchResults = merged.length > 0;
        vals.searchNoResults = merged.length === 0;
        vals.searchSummaryText = resultTotal.toLocaleString('ru-RU') + ' ' + this.plu(resultTotal, ['совпадение','совпадения','совпадений']);
        vals.hasSearchMore = resultTotal > merged.length;
        vals.searchMoreText = vals.hasSearchMore ? ('Показаны первые ' + merged.length + ' из ' + resultTotal.toLocaleString('ru-RU') + '. Уточните нишу, услугу или тип документа.') : '';
      }

      RK.meta = {baseTemplates:baseCount,variants:variants,total:allCount,niches:RK.niches.length,services:RK.services.length,parties:RK.parties.length,pairs:pairs.length};
      return vals;
    };

    proto.submitSearch = function () {
      const query = this.state && this.state.searchQuery ? this.state.searchQuery : '';
      const virtual = searchVirtual(this, query, 1);
      if (virtual.items.length) { this.openTemplate(virtual.items[0].id); return; }
      return originalSubmitSearch.call(this);
    };

    proto.downloadSavedDoc = function (doc) {
      const virtual = doc && resolveVariant(this, doc.templateId);
      if (!virtual) return originalDownloadSavedDoc.call(this, doc);
      const name = (doc.title || virtual.title || 'Документ').replace(/\s+/g, '_').replace(/[·:]/g, '');
      this.downloadHtml(name + '.doc', this.templateDocHtml(doc.fields || {}, doc.title || virtual.title, virtual));
    };
  }

  RK.virtual = {pairs:pairs,docsByMode:docsByMode,search:searchVirtual,resolve:resolveVariant,totalVariants:totalVariants,materialize:materialize};
  RK.install = install;
})();
