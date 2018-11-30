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
    if ($('#editor')[0] && $('#editor').height() !== 450) {
      console.debug(`%c [ADMIN CMS JS] - adjusting editor height`, 'background: #002833; color: #258bd2')
      if($('#editor')[0] && $('#editor')[0].style) {
        $('#editor')[0].style.height = '450px;'
      }
      var contentHeight = $('.ace_content').height()
      if ($('.ace_scroller')[0] && $('.ace_scroller')[0].style) {
        $('.ace_scroller')[0].style.height = `${contentHeight}px`
      }
    }
    const uiWidgets = $('.ui-dialog.ui-widget.ui-widget-content.ui-corner-all.ui-draggable.ui-resizable.ui-dialog-buttons')
    if (uiWidgets && uiWidgets.length > 0) {
      uiWidgets.each((index, el) => {
        if (el.style['display'] === 'block' && el.style.position && el.style.top) {
          console.debug(`%c [ADMIN CMS JS] - adjusting dialog box widget`, 'background: #002833; color: #258bd2')
          // ajusta posiçao da caixa de dialogo qnd ela aparece por algum motivo com "top: -900px" e relativa
          el.style.position = null
          el.style.top = null
        }
      })
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