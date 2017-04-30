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
     * These three lines ensure that the CSS :target selector is set without
     * scrolling the viewport prematurely.
     * Useful for when the :target selector is used to append an invisible div to
     * offset a fixed header.
     */
    var scrollReset = document.documentElement.scrollTop;
    document.location.hash = hash;
    document.documentElement.scrollTop = scrollReset;

    $('html, body').animate({
      scrollTop: $(hash).offset().top
    }, 1000);
  });
});
