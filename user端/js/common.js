$(document).ready(function() {
    $('.fade-in').each(function(i) {
        $(this).css('opacity', 0).delay(200 * i).animate({opacity: 1}, 1000);
    });
});