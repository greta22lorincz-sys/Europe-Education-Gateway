(function ($) {
    "use strict";

    // Spinner
    var spinner = function () {
        setTimeout(function () {
            if ($('#spinner').length > 0) {
                $('#spinner').removeClass('show');
            }
        }, 1);
    };
    spinner();
    
    
    // Initiate the wowjs
    new WOW().init();

    // University gallery: if img/uni_stem.jpg 404s, try .jpeg, .png, .webp (common export / OneDrive cases)
    (function () {
        var exts = ['jfif', 'JFIF', 'jpg', 'jpeg', 'JPG', 'JPEG', 'png', 'PNG', 'webp', 'WEBP'];
        document.querySelectorAll('img.uni-city-img[data-uni-stem]').forEach(function (img) {
            var stem = img.getAttribute('data-uni-stem');
            if (!stem) return;
            var curExt = (img.getAttribute('src') || '').split('.').pop();
            var idx = exts.indexOf(curExt);
            if (idx < 0) idx = 0;
            img.addEventListener('error', function onErr() {
                idx++;
                if (idx < exts.length) {
                    img.src = 'img/' + stem + '.' + exts[idx];
                } else {
                    img.removeEventListener('error', onErr);
                }
            });
        });
    })();

    // Sticky Navbar
    $(window).scroll(function () {
        if ($(this).scrollTop() > 45) {
            $('.navbar').addClass('sticky-top shadow-sm');
        } else {
            $('.navbar').removeClass('sticky-top shadow-sm');
        }
    });
    
    
    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
        return false;
    });
    
})(jQuery);

