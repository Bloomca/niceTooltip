(function($){
    var ctr = 0;
    $.fn.niceTooltip = function (options) {
        var transition = options.time || 300;
        if (!options.position) position = {left:"right",top:"top"};
        else {
            var position = {
                
            }
        }
        // we have only 1 instance of tooltip
        var $b = $('body'),
            $tp = $b.find('>div#nice-tooltip-instance');
        if (!$tp.length) $tp = $('<div id="nice-tooltip-instance"></div>').appendTo('body').css($.fn.niceTooltip.defaults.css);

        if (this.prop('tagName')==="SPAN") this.css({
            borderBottom: "1px dotted black",
            cursor: "help"
        });

        var touchSupport = "ontouchstart" in document.documentElement,
            ios = /(iPad|iPhone|iPod)/g.test(navigator.userAgent),
            android = (navigator.userAgent.toLowerCase().indexOf("android") > -1);

        this.data({
            'nice-tooltip-content': options.HTML,
            'nice-tooltip-id': ctr++
        });

        if (!touchSupport && !ios && !android) {
            this.on('mouseenter', function (e) {
                var $el = $(this),
                    tpId = $tp.data('id'),
                    thId = $el.data('nice-tooltip-id');
                if (!(tpId === thId)) $tp.data('id',thId).html($el.data('nice-tooltip-content'));
                $tp.stop().animate({opacity:1},transition);
            })
                .on('mouseleave', function (e) {
                    $tp.stop().animate({opacity:0},transition);
                });
        } else {
            // just appear & disappear
        }

        if ($.fn.niceTooltip.defaults.move) {
            var shift = +new Date;
            this.on('mousemove', function (e) {
                var newShift = +new Date;
                if ((newShift - shift) < 15 ) return;
                else {
                    shift = newShift;
                    fixPageXY(e);
                    var coords = {
                            left: e.pageX,
                            top: e.pageY
                        },
                        w = $tp.width(),
                        h = $tp.height(),
                        aw = document.documentElement.clientWidth,
                        ah = document.documentElement.clientHeight,
                        left = (aw - coords.left - w - 20 > 0 ) ? (coords.left + 20) : (coords.left - w - 20),
                        top = (ah - coords.top + h + 20 > 0 ) ? (coords.top - 20) : (coords.top + h + 20);
                    $tp.css({
                        left:left,
                        top: top
                    });
                }
            });
        }

        // compatible with old IE
        function fixPageXY(e) {
            if (e.pageX == null && e.clientX != null ) {
                var html = document.documentElement;
                var body = document.body;

                e.pageX = e.clientX + (html.scrollLeft || body && body.scrollLeft || 0);
                e.pageX -= html.clientLeft || 0;

                e.pageY = e.clientY + (html.scrollTop || body && body.scrollTop || 0);
                e.pageY -= html.clientTop || 0;
            }
        }

        function setPosition (aw, ah, w, h, coords) {
            var obj = {};

            return obj;
        }

    };

    $.fn.niceTooltip.defaults = {
        css: {
            position: "absolute",
            zIndex: 9999,
            padding: "10px 20px",
            border: "1px solid #b3c9ce",
            borderRadius: "4px",
            textAlign: "center",
            font: "14px/1.3 arial, sans-serif",
            color: "#333",
            background: "#fff",
            boxShadow: "3px 3px 3px rgba(0,0,0,.3)",
            opacity: 0
        },
        move: true
    };

})(jQuery);
