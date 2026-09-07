(function () {
  'use strict';

  function injectTaxCenterExtra(frame) {
    if (!frame || !frame.contentDocument) return;
    try {
      const doc = frame.contentDocument;
      if (!doc || doc.getElementById('rk-tax-center-extra')) return;
      const script = doc.createElement('script');
      script.id = 'rk-tax-center-extra';
      script.src = './tax-center-extra.js?v=1';
      script.defer = true;
      (doc.head || doc.documentElement).appendChild(script);
    } catch (error) {
      console.warn('Raketa tax center extra unavailable', error);
    }
  }

  function watchTaxFrames() {
    const attach = function (frame) {
      if (!frame || !String(frame.getAttribute('src') || '').includes('nalogi-2026.html')) return;
      frame.addEventListener('load', function () { injectTaxCenterExtra(frame); }, { once: true });
      try {
        if (frame.contentDocument && frame.contentDocument.readyState === 'complete') injectTaxCenterExtra(frame);
      } catch (error) {}
    };
    document.querySelectorAll('iframe[src*="nalogi-2026.html"]').forEach(attach);
    const observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        mutation.addedNodes.forEach(function (node) {
          if (!node || node.nodeType !== 1) return;
          if (node.matches && node.matches('iframe[src*="nalogi-2026.html"]')) attach(node);
          if (node.querySelectorAll) node.querySelectorAll('iframe[src*="nalogi-2026.html"]').forEach(attach);
        });
      });
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });
  }

  watchTaxFrames();

  const RK = window.RKCatalog;
  if (!RK) return;

  const previousInstall = typeof RK.install === 'function' ? RK.install : null;

  RK.install = function (Component) {
    if (previousInstall) previousInstall(Component);
    if (!Component || !Component.prototype || Component.prototype.__rkGuestAccessInstalled) return;

    const proto = Component.prototype;
    proto.__rkGuestAccessInstalled = true;

    const originalRenderVals = proto.renderVals;

    proto.openAuth = function (tab, templateId) {
      this.setState({
        authOpen: false,
        authStep: 'idle',
        pendingTab: null,
        pendingTemplateId: null,
        view: 'app',
        tab: tab || 'overview',
        selectedTemplateId: templateId || this.state.selectedTemplateId
      });
    };

    proto.goTab = function (tab) {
      this.setState({ authOpen: false, view: 'app', tab: tab });
    };

    proto.startTemplateFill = function (id) {
      const templateId = id || this.state.selectedTemplateId;
      this.setState(Object.assign({
        authOpen: false,
        view: 'app',
        tab: 'fillTemplate',
        selectedTemplateId: templateId
      }, this.ensureDraftFor(templateId)));
    };

    proto.renderVals = function () {
      const vals = originalRenderVals.call(this);
      vals.authOpen = false;
      vals.loggedIn = false;
      vals.notLoggedIn = false;
      vals.fillButtonText = 'Заполнить документ';
      vals.notLoggedTemplateHint = '';
      vals.loggedTemplateHint = 'Заполнение, сохранение и скачивание работают без регистрации. Данные остаются в вашем браузере.';
      return vals;
    };
  };
})();
