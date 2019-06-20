/* eslint-disable */

document.title = 'Turing E-Commerce API documentation';

(function() {
  let favicons = document.querySelectorAll("link[rel*='icon']");
  for(let i=0; i < favicons.length; i++) {
    let icon = favicons[i];
    icon.href = '/public/img/favicon.png';
  }
})();