console.debug(`%c [ADMIN CATALOG JS] \n Running custom js `, 'background: #002833; color: #258bd2')
// TO UPDATE i18n version, deploy version and change tag here
const i18n_version = '0.1.148'

/*****************************************
*  THIS BLOCK HAS SOME HELPER FUNCTIONS  *
******************************************/
var addVtexLoaderScript = function () {
  var vtexLoaderScript = document.createElement('script')
  vtexLoaderScript.async = false
  vtexLoaderScript.src = "//io.vtex.com.br/io-vtex-loader/2.3.1/io-vtex-loader.min.js"
  document.body.appendChild(vtexLoaderScript)
}

var i18nextJqueryInit = function () {
  i18nextJquery.init(i18next, $, {
      tName: 't',
      i18nName: 'i18n',
      handleName: 'localize',
      selectorAttr: 'data-i18n',
      targetAttr: 'data-i18n-target',
      optionsAttr: 'data-i18n-options',
      useOptionsAttr: false,
      parseDefaultValueFromContent: true
  });
}

var handleTopbarLoaded = function () {
  vtex.topbar.topbar = new vtex.topbar.Topbar();
}

var handleI18nData = function (lang) { 
  return function (messagesJson) {
      var resources = {}
      resources[lang] = { 'translation': messagesJson };
      i18next.init({
          lng: lang,
          debug: true,
          resources: resources,
          fallbackLng: 'pt-BR'
      }, function () {
          $("body").localize();
          $("#areaUsuario").hide()
      });
  }
}

var handleLocaleSelected = function (e, lang) {
  console.debug(`%c [ADMIN CATALOG JS] \n Fetching messages from i18n repo version: ${i18n_version} for selected locale: `, 'background: #002833; color: #258bd2', lang)
  $.get(`//io.vtex.com.br/i18n/${i18n_version}/catalog/` + lang + '.json').done(handleI18nData(lang));
}

var handleIframePostMessage = (e) => {
  if (e.data && e.data.action && e.data.action.type === 'LOCALE_SELECTED') {
      handleLocaleSelected(e, e.data.action.payload)
  }
}
// End of helper functions

$(function ($) {
/*****************************
*   THIS BLOCK ALWAYS RUNS   *
******************************/

    // Initialize jQuery i18n
    i18nextJqueryInit();

    // hides breadcrumb
    $('#breadCrumbNav').hide()

    var pathname = window.location.pathname;
    // open categories automatically if category page
    if (pathname.includes('Site/Categories.aspx')) {
        var colapseBtns = $('.hitarea.expandable-hitarea.lastExpandable-hitarea')
        if (colapseBtns.length > 0) {
            colapseBtns[0].click()
        } else {
            setTimeout(() => {
                $('.hitarea.expandable-hitarea.lastExpandable-hitarea')[0].click()
            }, 420); // blaze it
        }
    }

/*************************************************
*   THIS BLOCK RUNS ONLY WHEN INSIDE AN IFRAME   *
**************************************************/

    if (window.self !== window.top) {
        console.debug(`%c [ADMIN CATALOG JS] \n running inside iframe`, 'background: #002833; color: #258bd2')
        window.addEventListener("message", handleIframePostMessage);
        // Let the parent frame know details about our navigation
        window.top.postMessage({
            type: 'admin.navigation',
            hash: window.location.hash,
            search: window.location.search,
            pathname: window.location.pathname,
        }, '*');
        // hides menu and header titles when inside iframe since there is already a header there
        $(".AspNet-Menu").parent().parent().hide()
        $(".barra-alerta").hide() // esconde barra-alerta
        if (!window.location.href.includes('Site/RelatorioIndexacao.aspx')) {
            $("#content h2").hide()
        } else { // in RelatorioIndexacao.aspx page, header is a div with an h3
            $('.page-header').hide()
            // ajusta largura para ficar grid com 3 cards ao inves de 2 com menu lateral aberto
            $('.container')[0].style.width = "100%"
        }
        $("#areaUsuario").hide()
        // dispatch event to myvtex sending content height to update iframe size
        var currentHeight = document.body.scrollHeight
        setInterval(() => {
            var newHeight = document.body.scrollHeight
            if (currentHeight !== newHeight) {
                currentHeight = newHeight
                window.parent.postMessage({
                    type: 'admin.updateContentHeight',
                    height: newHeight,
                }, '*')
            }
        }, 1000)
    }

/***************************************************
*  THIS BLOCK RUNS ONLY WHEN NOT INSIDE AN IFRAME  *
****************************************************/

    if (window.self === window.top) {
        console.debug(`%c [ADMIN CATALOG JS] \n NOT running inside iframe`, 'background: #002833; color: #258bd2')
        // legacy topbar load
        addVtexLoaderScript();
        $(window).on("localeSelected.vtex", handleLocaleSelected);
        $(window).on('topbarLoaded.vtex', handleTopbarLoaded);
        // start marking correct menu item as active
        var aspNetMenuChildren = $(".AspNet-Menu").children();
        var checkIfPathIsActive = (href) => {
            return href && href.includes(pathname)
        }
        var titlePathDictionary = {
            "mainMenu.products.label": [
                "Site/Produto.aspx",
                "Site/Categories.aspx",
                "Site/Marca.aspx",
                "Site/Relatorio_Skus.aspx",
                "Site/ProdutoExportacaoImportacaoEspecificacaoV2.aspx",
                "Site/ProdutoExportacaoImportacaoEspecificacaoSKUV2.aspx",
                "Site/SkuTabelaValor.aspx",
                "Site/gerarimagens.aspx",
                "Site/ProdutoImagemExportacao.aspx",
                "Site/ProdutoExportacaoImportacaoAvaliacao.aspx",
                "Site/Anexo.aspx",
                "Site/SkuServicoTipo.aspx",
                "Site/SkuServicoValor.aspx",
                "Site/SkuVincularValorServico.aspx",
                "Site/Relatorio_Seguranca.aspx",
                "Site/LinksRelatorios.aspx",
                "Site/GiftList.aspx",
                "Site/RelatorioIndexacao.aspx",
                "Site/Relatorio_AviseMeSku.aspx",
                "Site/RelatorioNews.aspx",
                "Site/Resenha.aspx",
                "Site/SkuCondicaoComercial.aspx",
                "Site/Fornecedor.aspx",
            ],
            "mainMenu.campaigns.vouchers": [
                "Site/Vale.aspx",
            ],
            "mainMenu.settings.label": [
                "Site/ConfigForm.aspx",
                "Site/ConfigSEOContents.aspx",
                "Site/TextoSite.aspx",
                "Site/GiftListType.aspx",
                "Site/Xml.aspx",
                "Site/TipoArquivo.aspx",
                "Site/GeographicRegion.aspx",
            ],
            "mainMenu.marketplace.label": [
                "Site/Store.aspx",
                "Site/Seller.aspx",
                "Site/SkuSeller.aspx",
            ],
        }
        var forceTitleActiveStyle = (el) => {
            $.each(titlePathDictionary[el.children[0].dataset.i18n], (index, path) => {
                if (pathname.includes(path)) {
                    if (el.style) {
                        el.children[0].style['border-bottom'] = '1px solid #368df7'
                    } else {
                        el.children[0].style = {}
                        el.children[0].style['border-bottom'] = '1px solid #368df7'
                    }
                }
            })
        }
        var forceSubItemActiveStyle = (el) => {
            if (el.style) {
                el.style['background-color'] = '#ddd'
            } else {
                el.style = {}
                el.style['background-color'] = '#ddd'
            }
        }

        // loop trough menu items
        $.each(aspNetMenuChildren, (obj, e) => {
            // loop trough menu item children (they are all LI tags)
            $.each(e.children, (obj, _e) => {
                if (_e.tagName === 'A') {
                    forceTitleActiveStyle(_e)
                } else { // if it's not tag A it's UL
                    // loop trough UL children
                    $.each(_e.children, (obj, __e) => {
                        // here every __e is an LI, so loop again
                        $.each(__e.children, (obj, ___e) => {
                            if (___e.tagName === 'A') {
                                if (checkIfPathIsActive(___e.href)) {
                                    forceSubItemActiveStyle(___e)
                                }
                            } else { // if it's not tag A it's UL again
                                // loop trough UL children again
                                $.each(___e.children, (obj, ____e) => {
                                    if (checkIfPathIsActive(____e.children[0].href)) {
                                        forceSubItemActiveStyle(____e.children[0])
                                    }
                                })
                            }
                        })
                    })
                }
            })
        })
        // end marking correct menu item as active
    }
});
