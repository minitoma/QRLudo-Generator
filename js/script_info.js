/**
 * @Author: alassane
 * @Date:   2018-12-08T17:37:13+01:00
 * @Last modified by:   alassane
 * @Last modified time: 2018-12-08T18:19:08+01:00
 */

$(document).ready({

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


});
