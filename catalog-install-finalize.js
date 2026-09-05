(function(){
'use strict';
const RK=window.RKCatalog;
if(!RK||typeof RK.install!=='function'||typeof RK._installBeforeVirtual!=='function')return;
const virtualInstall=RK.install;
const baseInstall=RK._installBeforeVirtual;
RK.install=function(Component){
  baseInstall(Component);
  virtualInstall(Component);
};
})();
