console.debug(`%c [ADMIN CATALOG JS] \n Running custom js `, 'background: #002833; color: #258bd2')
// TO UPDATE i18n version, deploy version and change tag here
const i18n_version = '0.1.194'
const FALLBACK_LANG = 'en-US'

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

var handleDatesFormat = (lang) => {
    console.debug(`%c [ADMIN CATALOG JS] \n Handling dates format in lang: ${lang}`, 'background: #002833; color: #258bd2');
    const dateFormatOptions = { year: "numeric", month: "2-digit", day: "2-digit" }
    const dateTimeFormatOptions = { ...dateFormatOptions, hour: "2-digit", minute: "2-digit", second: "2-digit" }
    // DATE ELEMENTS
    var dateElements = $(".vtex-locale-date");
    // loop trough date elements
    $.each(dateElements, (obj, e) => {
        // translate element text based on lang using iso date attribute
        const isoDate = $(e).attr('data-vtex-date-utc')
        const finalDate = new Date(isoDate).toLocaleDateString(lang, dateFormatOptions)
        if (finalDate && finalDate !== 'Invalid Date') {
            $(e).text(finalDate)
        }
    })
    // DATE TIME ELEMENTS
    var dateTimeElements = $(".vtex-locale-datetime");
    // loop trough date time elements
    $.each(dateTimeElements, (obj, e) => {
        // translate element text based on lang using iso date attribute
        const isoDate = $(e).attr('data-vtex-datetime-utc')
        const finalDate = new Date(isoDate).toLocaleDateString(lang, dateTimeFormatOptions)
        if (finalDate && finalDate !== 'Invalid Date') {
            $(e).text(finalDate)
        }
    })
}

var handleI18nData = (lang) => {
  if (!lang) {
    // Load again in english if initial lang is not found
    console.debug(`%c [ADMIN CATALOG JS] \n Trying the fallback locale lang: ${FALLBACK_LANG}`, 'background: #002833; color: #258bd2');
    handleLocaleSelected(null, FALLBACK_LANG)
    return
  }
  return function (messagesJson) {
      var resources = {}
      resources[lang] = { 'translation': messagesJson };
      i18next.init({
          lng: lang,
          debug: true,
          resources: resources,
          fallbackLng: FALLBACK_LANG
      }, function () {
          $("body").localize();
      });
      handleDatesFormat(lang)
  }
}

var handleLocaleSelected = function (e, lang = FALLBACK_LANG) {
  console.debug(`%c [ADMIN CATALOG JS] \n Fetching messages from i18n repo version: ${i18n_version} for selected locale: `, 'background: #002833; color: #258bd2', lang)
  $.get(`//io.vtex.com.br/i18n/${i18n_version}/catalog/` + lang + '.json')
  .done(handleI18nData(lang))
  .fail(function () {
    console.debug(`%c [ADMIN CATALOG JS] \n Error fetching lang locale: ${lang}`, 'background: #002833; color: #F71963');
    handleI18nData(null) // this triggers the load again, but with fallback lang
  });
}

var handleIframePostMessage = (e) => {
  if (e.data && e.data.action && e.data.action.type === 'LOCALE_SELECTED') {
      handleLocaleSelected(e, e.data.action.payload)
  }
}

var handleUnload = (e) => {
    const focusedElement = $(':focus')[0]
    const destination = focusedElement ? focusedElement.href : null
    if (destination && destination.includes('/admin') && !(destination.includes('/admin/Site') || destination.includes('/admin/Control'))) {
        console.debug(`%c [ADMIN CATALOG JS] \n Will navigate to other domain: ${destination}`, 'background: #002833; color: #258bd2')
        window.top.postMessage({
            type: 'admin.absoluteNavigation',
            destination,
        }, '*');
    }
}
// End of helper functions

$(function ($) {
/*****************************
*   THIS BLOCK ALWAYS RUNS   *
******************************/

    // Initialize jQuery i18n
    i18nextJqueryInit();

    var pathname = window.location.pathname;

    if (pathname.toLocaleLowerCase().includes('site/categories.aspx')) {
        // open categories automatically if category page
        var colapseBtns = $('.hitarea.expandable-hitarea.lastExpandable-hitarea')
        if (colapseBtns.length > 0) {
            colapseBtns[0].click()
        } else {
            setTimeout(() => {
                $('.hitarea.expandable-hitarea.lastExpandable-hitarea')[0].click()
            }, 420); // blaze it
        }
        // highlight of searched category style fix (desculpe mundo)
        var stylesheet = document.styleSheets[(document.styleSheets.length - 1)];
        for( var i in document.styleSheets ){
            if( document.styleSheets[i].href && document.styleSheets[i].href.indexOf("everything-else.css") ) {
                stylesheet = document.styleSheets[i];
                break;
            }
        }
        if( stylesheet.addRule ){
            stylesheet.addRule('.label-success', 'color:#1346d8 !important;background-color: #f2f4f5 !important');
        } else if( stylesheet.insertRule ){
            stylesheet.insertRule('.label-success { color:#1346d8 !important;background-color: #f2f4f5 !important }', stylesheet.cssRules.length);
        }
    }

/*************************************************
*   THIS BLOCK RUNS ONLY WHEN INSIDE AN IFRAME   *
**************************************************/

    if (window.self !== window.top) {
        console.debug(`%c [ADMIN CATALOG JS] \n running inside iframe`, 'background: #002833; color: #258bd2')
        window.addEventListener("message", handleIframePostMessage);
        // Monitor navigation before it happens, if its an admin (not catalog) navigate to right url
        window.addEventListener("beforeunload", handleUnload);
        // Let the parent frame know details about our navigation AFTER navigating
        window.top.postMessage({
            type: 'admin.navigation',
            hash: window.location.hash,
            search: window.location.search,
            pathname: window.location.pathname,
        }, '*');
        // hides menu and header titles when inside iframe since there is already a header there
        $(".AspNet-Menu").parent().parent().hide()
        $(".barra-alerta").hide() // esconde barra-alerta
        // $('#breadCrumbNav').hide()
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
        // style changes
        $("#areaUsuario").children().removeClass('bt');
        $("#ctl00_AreaUsuario_AreaUsuario1_lnkAcesseSite").removeClass('bt');
        $("#ctl00_AreaUsuario_AreaUsuario1_lnkAcesseSiteAdminBeta").removeClass('bt');
        $("#areaUsuario")[0].style['margin-top'] = "20px";
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
