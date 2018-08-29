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

/*************************************************
*   THIS BLOCK RUNS ONLY WHEN INSIDE AN IFRAME   *
**************************************************/

if (window.self !== window.top) {
  console.debug(`%c [ADMIN CMS JS] - running inside iframe`, 'background: #002833; color: #258bd2')
  $("#btnVoltar").hide() // botao que volta pro catálogo (ñ faz sentido no)
  $(".tool-box").hide()
  // adjust height of code editor
  setInterval(() => {
    if ($('#editor')[0] && $('#editor').height() !== 342) {
      console.debug(`%c [ADMIN CMS JS] - adjusting editor height`, 'background: #002833; color: #258bd2')
      $('#editor')[0].style = 'height:342px;'
    }
  }, 500)
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