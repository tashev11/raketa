(function () {
  'use strict';

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
