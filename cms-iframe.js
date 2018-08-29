console.debug(`%c [ADMIN CMS JS] - Running custom js `, 'background: #002833; color: #258bd2');

/*****************************************
*  THIS BLOCK HAS SOME HELPER FUNCTIONS  *
******************************************/

var addVtexLoaderScript = function () {
  var vtexLoaderScript = document.createElement('script')
  vtexLoaderScript.async = false
  vtexLoaderScript.src = "//io.vtex.com.br/io-vtex-loader/2.3.1/io-vtex-loader.min.js"
  document.body.appendChild(vtexLoaderScript)
}

var handleIframePostMessage = (e) => {
  console.debug(`%c [ADMIN CMS JS] - message received: \n data: ${e.data} `, 'background: #002833; color: #258bd2')
}

/*************************************************
*   THIS BLOCK RUNS ONLY WHEN INSIDE AN IFRAME   *
**************************************************/

if (window.self !== window.top) {
  console.debug(`%c [ADMIN CMS JS] - running inside iframe`, 'background: #002833; color: #258bd2')
  window.addEventListener("message", handleIframePostMessage);
}

/***************************************************
*  THIS BLOCK RUNS ONLY WHEN NOT INSIDE AN IFRAME  *
****************************************************/

if (window.self === window.top) {
  console.debug(`%c [ADMIN CMS JS] - NOT running inside iframe`, 'background: #002833; color: #258bd2')
  // legacy topbar load
  addVtexLoaderScript();
  $(window).on('topbarLoaded.vtex', function () {
    vtex.topbar.topbar = new vtex.topbar.Topbar();
  });
}