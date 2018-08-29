console.debug(`%c [ADMIN CMS JS] - Running custom js `, 'background: #002833; color: #258bd2');

$(window).on('topbarLoaded.vtex', function () {
  vtex.topbar.topbar = new vtex.topbar.Topbar();
});