$(function() {
  // Remove "no-js" class if script loading is successful
  $('html').removeClass('no-js');

  // Add smooth scrolling to internal links
  $('a').filter(function() {
    return this.hash.length > 1;
  }).on('click', function(event) {
    event.preventDefault();
    var hash = this.hash;
    /*
     * These lines ensure that the CSS :target selector is set without scrolling
     * the viewport prematurely. Useful for when the :target selector is used to
     * append an invisible div to offset a fixed header.
     */
    var win = $(window);
    var scrollReset = win.scrollTop();
    document.location.hash = hash;
    win.scrollTop(scrollReset);

    hash = "#" + hash.substring(1)
      .replace(/[!"#$%&'()*+,.\/:;<=>?@[\\\]^`{|}~]/g, "\\$&");

    $('html, body').animate({
      scrollTop: $(hash).offset().top
    }, 1000);
  });
});
