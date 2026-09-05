(function () {
  'use strict';

  class DCLogic {
    constructor(props) {
      this.props = props || {};
    }

    setState(update) {
      const patch = typeof update === 'function' ? update(this.state, this.props) : update;
      if (!patch) return;
      this.state = Object.assign({}, this.state, patch);
      if (typeof this.__render === 'function') this.__render();
    }
  }

  window.DCLogic = DCLogic;

  function injectResponsiveCss() {
    if (document.getElementById('rk-runtime-responsive')) return;
    const style = document.createElement('style');
    style.id = 'rk-runtime-responsive';
    style.textContent = [
      '@media(max-width:720px){',
      '  #rk-topbar>div{padding:10px 14px!important;flex-wrap:wrap!important;gap:10px!important}',
      '  #rk-topbar>div>span:first-child{font-size:18px!important}',
      '  #rk-topbar>div>div:last-child{gap:8px!important}',
      '  #rk-topbar>div>div:last-child>span{display:none!important}',
      '  #rk-headsearch{order:3!important;flex:0 0 100%!important;max-width:none!important}',
      '  #rk-herosearch{flex-direction:column!important;border-width:2px!important;margin-top:28px!important}',
      '  #rk-herosearch input{height:72px!important;font-size:18px!important;padding:20px 18px 20px 56px!important}',
      '  #rk-herosearch svg{left:18px!important;width:22px!important;height:22px!important}',
      '  #rk-herosearch button{height:56px!important;width:100%!important;border-left:0!important;border-top:2px solid #1A1712!important;padding:0 20px!important;font-size:18px!important}',
      '  #rk-tools{padding:38px 16px 0!important}',
      '  #rk-toollist [style*="gap:18px"]{gap:12px!important}',
      '  body.rk-app-view .rk-app-shell{flex-direction:column!important;width:100%!important;min-width:0!important}',
      '  body.rk-app-view .rk-empty-shell-spacer{display:none!important;min-height:0!important;height:0!important}',
      '  body.rk-app-view aside{width:100%!important;border-right:0!important;border-bottom:1px solid #E9DDC1!important;padding:12px!important}',
      '  body.rk-app-view aside>button{padding:2px 4px 10px!important}',
      '  body.rk-app-view aside nav{display:flex!important;flex-direction:row!important;flex-wrap:wrap!important;gap:6px!important;overflow:visible!important;margin:0!important;padding:0!important;max-width:100%!important}',
      '  body.rk-app-view aside nav>div{display:none!important}',
      '  body.rk-app-view aside nav button{flex:0 0 auto!important;width:auto!important;white-space:nowrap!important;padding:9px 11px!important}',
      '  body.rk-app-view aside>div:last-child{padding-top:10px!important}',
      '  body.rk-app-view aside+div{width:100%!important;height:auto!important;min-height:0!important}',
      '  body.rk-app-view aside+div>div:first-child{height:auto!important;min-height:56px!important;padding:12px 16px!important;gap:10px!important;align-items:flex-start!important}',
      '  body.rk-app-view aside+div>div:first-child>div:first-child{font-size:16px!important;line-height:1.25!important}',
      '  body.rk-app-view aside+div>div:first-child>span{font-size:11px!important;white-space:nowrap!important}',
      '  body.rk-app-view aside+div>div:not(:first-child){padding:18px 16px 30px!important}',
      '  body.rk-app-view aside+div iframe{min-height:calc(100vh - 170px)!important}',
      '  body.rk-app-view [style*="grid-template-columns:1.35fr 1fr"]{grid-template-columns:1fr!important}',
      '  [style*="grid-template-columns:minmax(0,1.2fr)"]{grid-template-columns:1fr!important}',
      '  [style*="grid-template-columns:minmax(0,1.1fr)"]{grid-template-columns:1fr!important}',
      '  [style*="position:sticky"]:not(#rk-topbar){position:static!important}',
      '  body:not(.rk-app-view) div[style*="padding:20px 6px"]{align-items:flex-start!important}',
      '}'
    ].join('\n');
    document.head.appendChild(style);
  }

  function defaultsFromProps(script) {
    try {
      const schema = JSON.parse(script.getAttribute('data-props') || '{}');
      return Object.keys(schema).reduce(function (acc, key) {
        acc[key] = schema[key] && Object.prototype.hasOwnProperty.call(schema[key], 'default')
          ? schema[key].default
          : undefined;
        return acc;
      }, {});
    } catch (error) {
      return {};
    }
  }

  function evalInContext(expr, ctx) {
    try {
      return Function('ctx', 'with(ctx){ return (' + expr + '); }')(ctx);
    } catch (error) {
      return undefined;
    }
  }

  function valueFromTemplate(raw, ctx) {
    const trimmed = String(raw || '').trim();
    const exact = trimmed.match(/^\{\{\s*([\s\S]+?)\s*\}\}$/);
    if (exact && exact[1].indexOf('{{') === -1 && exact[1].indexOf('}}') === -1) {
      return evalInContext(exact[1], ctx);
    }
    return String(raw || '').replace(/\{\{\s*([\s\S]+?)\s*\}\}/g, function (_, expr) {
      const val = evalInContext(expr, ctx);
      return val == null ? '' : String(val);
    });
  }

  function truthy(value) {
    return !!value && value !== 'false' && value !== '0';
  }

  function cloneChildren(node) {
    const frag = document.createDocumentFragment();
    Array.from(node.childNodes).forEach(function (child) {
      frag.appendChild(child.cloneNode(true));
    });
    return frag;
  }

  function processFragment(fragment, ctx, bindEvent) {
    Array.from(fragment.childNodes).forEach(function (node) {
      processNode(node, ctx, bindEvent);
    });
  }

  function processNode(node, ctx, bindEvent) {
    if (node.nodeType === Node.TEXT_NODE) {
      if (node.nodeValue.indexOf('{{') !== -1) node.nodeValue = valueFromTemplate(node.nodeValue, ctx);
      return;
    }
    if (node.nodeType !== Node.ELEMENT_NODE) return;

    const tag = node.tagName.toLowerCase();
    if (tag === 'sc-if') {
      const ok = truthy(valueFromTemplate(node.getAttribute('value') || '', ctx));
      if (!ok) {
        node.replaceWith(document.createComment('sc-if'));
        return;
      }
      const frag = cloneChildren(node);
      processFragment(frag, ctx, bindEvent);
      node.replaceWith(frag);
      return;
    }

    if (tag === 'sc-for') {
      const list = valueFromTemplate(node.getAttribute('list') || '', ctx) || [];
      const as = node.getAttribute('as') || 'item';
      const frag = document.createDocumentFragment();
      Array.from(list).forEach(function (item, index) {
        const itemCtx = Object.assign({}, ctx);
        itemCtx[as] = item;
        itemCtx.index = index;
        const itemFrag = cloneChildren(node);
        processFragment(itemFrag, itemCtx, bindEvent);
        frag.appendChild(itemFrag);
      });
      node.replaceWith(frag);
      return;
    }

    Array.from(node.attributes).forEach(function (attr) {
      const name = attr.name;
      const lower = name.toLowerCase();
      const raw = attr.value;

      if (lower.indexOf('on') === 0) {
        const handler = valueFromTemplate(raw, ctx);
        node.removeAttribute(name);
        if (typeof handler === 'function') bindEvent(node, lower.slice(2), handler);
        return;
      }

      if (lower === 'style-hover' || lower === 'style-focus') return;

      if (raw.indexOf('{{') !== -1) {
        const val = valueFromTemplate(raw, ctx);
        if (val == null || val === false) {
          node.removeAttribute(name);
        } else {
          node.setAttribute(name, String(val));
          if (lower === 'value') node.value = String(val);
        }
      }
    });

    attachStateStyles(node);

    Array.from(node.childNodes).forEach(function (child) {
      processNode(child, ctx, bindEvent);
    });
  }

  function appendCss(base, extra) {
    base = base || '';
    extra = extra || '';
    return base.replace(/\s*;?\s*$/, ';') + extra;
  }

  function attachStateStyles(el) {
    const hover = el.getAttribute('style-hover');
    const focus = el.getAttribute('style-focus');
    const base = el.getAttribute('style') || '';

    if (hover) {
      el.removeAttribute('style-hover');
      el.addEventListener('mouseenter', function () { el.setAttribute('style', appendCss(base, hover)); });
      el.addEventListener('mouseleave', function () { el.setAttribute('style', base); });
    }
    if (focus) {
      el.removeAttribute('style-focus');
      el.addEventListener('focus', function () { el.setAttribute('style', appendCss(base, focus)); }, true);
      el.addEventListener('blur', function () { el.setAttribute('style', base); }, true);
    }
  }

  function captureFocus(root) {
    const active = document.activeElement;
    if (!active || !root.contains(active)) return null;
    const selector = active.name
      ? '[name="' + CSS.escape(active.name) + '"]'
      : (active.id ? '#' + CSS.escape(active.id) : null);
    if (!selector) return null;
    return {
      selector: selector,
      start: typeof active.selectionStart === 'number' ? active.selectionStart : null,
      end: typeof active.selectionEnd === 'number' ? active.selectionEnd : null
    };
  }

  function restoreFocus(root, info) {
    if (!info) return;
    const next = root.querySelector(info.selector);
    if (!next) return;
    try {
      next.focus({ preventScroll: true });
      if (info.start != null && typeof next.setSelectionRange === 'function') {
        next.setSelectionRange(info.start, info.end == null ? info.start : info.end);
      }
    } catch (error) {}
  }

  function eventNameFor(attrEvent, el) {
    if (attrEvent === 'click') return 'click';
    if (attrEvent === 'keydown') return 'keydown';
    if (attrEvent === 'input') return 'input';
    if (attrEvent === 'change') {
      const tag = el.tagName.toLowerCase();
      return tag === 'input' || tag === 'textarea' ? 'input' : 'change';
    }
    return attrEvent;
  }

  function shouldPassEvent(attrEvent) {
    return attrEvent !== 'click';
  }

  function boot() {
    injectResponsiveCss();
    const root = document.querySelector('x-dc');
    const logicScript = document.querySelector('script[type="text/x-dc"][data-dc-script]');
    if (!root || !logicScript) return;

    const helmet = root.querySelector('helmet');
    if (helmet) {
      Array.from(helmet.childNodes).forEach(function (child) {
        document.head.appendChild(child);
      });
      helmet.remove();
    }

    if (!document.title) document.title = 'Ракета — портал для бизнеса';

    const source = root.innerHTML;
    const Component = Function('DCLogic', logicScript.textContent + '\nreturn Component;')(DCLogic);
    if (window.RKDocumentBase && typeof window.RKDocumentBase.install === 'function') {
      try { window.RKDocumentBase.install(Component); } catch (error) { console.error('Raketa document base install failed', error); }
    }
    if (window.RKCatalog && typeof window.RKCatalog.install === 'function') {
      try { window.RKCatalog.install(Component); } catch (error) { console.error('Raketa catalog install failed', error); }
    }
    const instance = new Component(defaultsFromProps(logicScript));
    window.__RaketaPortal = { Component: Component, instance: instance };
    let mounted = false;
    let rendering = false;

    function handleHashRoute() {
      const hash = window.location.hash || '';
      const templateMatch = hash.match(/^#template=(.+)$/);
      const tabMatch = hash.match(/^#tab=(.+)$/);
      if (templateMatch && typeof instance.openTemplate === 'function') {
        instance.openTemplate(decodeURIComponent(templateMatch[1]));
      } else if (tabMatch && typeof instance.goTab === 'function') {
        instance.goTab(decodeURIComponent(tabMatch[1]));
      } else {
        return;
      }
      if (window.history && window.history.replaceState) {
        window.history.replaceState(null, '', window.location.pathname + window.location.search);
      }
    }

    function handleResultPointer(event) {
      const target = event.target && event.target.closest
        ? event.target.closest('[data-template-id],[data-tool-tab]')
        : null;
      if (!target || !root.contains(target)) return;
      const templateId = target.getAttribute('data-template-id');
      const toolTab = target.getAttribute('data-tool-tab');
      if (!templateId && !toolTab) return;
      event.preventDefault();
      if (templateId && typeof instance.openTemplate === 'function') {
        instance.openTemplate(templateId);
      } else if (toolTab && typeof instance.goTab === 'function') {
        instance.goTab(toolTab);
      }
    }

    root.addEventListener('pointerdown', handleResultPointer);
    window.addEventListener('hashchange', handleHashRoute);

    function render() {
      if (rendering) return;
      rendering = true;
      const focus = captureFocus(root);
      const vals = typeof instance.renderVals === 'function' ? instance.renderVals() : {};
      const ctx = Object.assign({}, vals, { state: instance.state, props: instance.props });
      const template = document.createElement('template');
      template.innerHTML = source;

      processFragment(template.content, ctx, function (el, attrEvent, handler) {
        const eventName = eventNameFor(attrEvent, el);
        el.addEventListener(eventName, function (event) {
          if (eventName === 'click') event.preventDefault();
          if (shouldPassEvent(attrEvent)) handler(event);
          else handler();
        });
      });

      root.replaceChildren(template.content);
      const aside = root.querySelector('aside');
      document.body.classList.toggle('rk-app-view', !!aside);
      if (aside && aside.parentElement) {
        aside.parentElement.classList.add('rk-app-shell');
        Array.from(root.children).forEach(function (child) {
          if (child !== aside.parentElement && !child.textContent.trim()) {
            child.classList.add('rk-empty-shell-spacer');
          }
        });
      }
      restoreFocus(root, focus);
      rendering = false;

      if (mounted && typeof instance._applyPin === 'function') {
        requestAnimationFrame(function () { instance._applyPin(); });
      }
    }

    instance.__render = render;
    render();
    mounted = true;
    if (typeof instance.componentDidMount === 'function') instance.componentDidMount();
    handleHashRoute();
  }

  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      const script = document.createElement('script');
      script.src = src;
      script.async = false;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  async function start() {
    try {
      await loadScript('./catalog-runtime.js?v=3');
      await loadScript('./catalog-extra.js?v=1');
      await loadScript('./catalog-extra-2.js?v=1');
      await loadScript('./catalog-extra-3.js?v=1');
      await loadScript('./document-taxonomy.js?v=1');
      await loadScript('./document-base-extra.js?v=1');
      await loadScript('./document-base-extra-2.js?v=1');
      await loadScript('./document-base-extra-3.js?v=1');
      await loadScript('./document-base-contracts-2.js?v=1');
      await loadScript('./document-taxonomy-sync.js?v=1');
      await loadScript('./catalog-virtual.js?v=2');
      await loadScript('./catalog-policy.js?v=2');
      await loadScript('./document-search.js?v=1');
    } catch (error) {
      console.warn('Raketa catalog runtime unavailable, starting base portal', error);
    }
    boot();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
