document.addEventListener('DOMContentLoaded', function() {
    var trigger = new ScrollTrigger({
        offset: {
            x: 0,
            y: 50
        },
        once: false,
        toggle: {
            visible: 'visible',
            hidden: 'invisible'
        }
    });
});