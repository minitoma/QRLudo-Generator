/**
 * @Author: alassane
 * @Date:   2018-12-10T13:37:39+01:00
 * @Last modified by:   alassane
 * @Last modified time: 2018-12-10T17:21:37+01:00
 */

$('a.nav-link')
  .click(function(e) {
    e.preventDefault();
    let element = e.target;
    let tab = $(element).attr('href');

    $('a').attr('class', 'nav-item nav-link');
    $('div.tab-pane').attr('class', 'tab-pane');

    $(element).addClass('active');
    $(tab).addClass('active');
  });
