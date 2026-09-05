(function () {
  'use strict';

  const RK = window.RKCatalog;
  if (!RK || typeof RK.install !== 'function') return;

  function norm(value) {
    return String(value == null ? '' : value)
      .toLowerCase()
      .replace(/ё/g, 'е')
      .replace(/[^a-zа-я0-9%]+/gi, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  const contextDictionary = [];
  RK.niches.forEach(function (n) {
    contextDictionary.push(norm(n.name));
    contextDictionary.push(norm(n.slug));
  });
  RK.services.forEach(function (s) {
    contextDictionary.push(norm(s.name));
    contextDictionary.push(norm(s.slug));
  });

  function hasIndustryContext(query) {
    const q = norm(query);
    if (q.length < 2) return false;
    const terms = q.split(/\s+/).filter(Boolean);
    return terms.some(function (term) {
      if (term.length < 2) return false;
      return contextDictionary.some(function (entry) {
        return entry === term || entry.indexOf(term) !== -1 || term.indexOf(entry) !== -1;
      });
    });
  }

  const virtualInstall = RK.install;
  RK.install = function (Component) {
    const proto = Component && Component.prototype;
    if (!proto) return;

    const baseRenderVals = proto.renderVals;
    const baseSubmitSearch = proto.submitSearch;
    virtualInstall(Component);

    const virtualRenderVals = proto.renderVals;
    const virtualSubmitSearch = proto.submitSearch;

    proto.renderVals = function () {
      const query = this.state && this.state.searchQuery ? this.state.searchQuery : '';
      if (hasIndustryContext(query)) return virtualRenderVals.call(this);

      const vals = baseRenderVals.call(this);
      if (RK.virtual && typeof RK.virtual.totalVariants === 'function') {
        const baseCount = this.templateCatalog().length;
        const variants = RK.virtual.totalVariants(this);
        const total = baseCount + variants;
        vals.catalogCountText = total.toLocaleString('ru-RU');
        vals.catalogCountNoun = this.plu(total, ['вид документа','вида документов','видов документов']);
        vals.readyTemplateCountText = total.toLocaleString('ru-RU');
        vals.readyTemplateCountNoun = this.plu(total, ['готовый вариант','готовых варианта','готовых вариантов']);
      }
      return vals;
    };

    proto.submitSearch = function () {
      const query = this.state && this.state.searchQuery ? this.state.searchQuery : '';
      if (!hasIndustryContext(query)) return baseSubmitSearch.call(this);
      return virtualSubmitSearch.call(this);
    };

    RK.hasIndustryContext = hasIndustryContext;
  };
})();
