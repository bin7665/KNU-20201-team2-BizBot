document.addEventListener('DOMContentLoaded', function() {
    var trigger = new ScrollTrigger({
        offset: {
            x: 0,
            y: 200
        },
        toggle: {
            visible: 'visible',
            hidden: 'invisible'
        },
        once: true,
    });
});

var leftButton;