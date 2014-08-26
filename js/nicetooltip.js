(function($){
    var ctr = 0;
    $.fn.niceTooltip = function (options) {
        var transition = options.time || 300;
        if (options.position) {
            var position = {
                left: (options.position.left === "left" || options.position.left === "right" || options.position.left === "center") ? options.position.left : "right",
                top: (options.position.top === "top" || options.position.top === "bottom" || options.position.top === "center") ? options.position.top : "top"
            };
        } else position = {left: "right", top: "top"};

        // we have only 1 instance of tooltip
        var $b = $('body'),
            $tp = $b.find('>div#nice-tooltip-instance');
        if (!$tp.length) $tp = $('<div id="nice-tooltip-instance"></div>').appendTo('body').css($.fn.niceTooltip.defaults.css);

        if (this.prop('tagName')==="SPAN" && !options.disableBorder) this.css({
            borderBottom: "1px dotted black",
            cursor: "help"
        });

        var touch = 'ontouchstart' in document.documentElement,
            ios = /(iPad|iPhone|iPod)/g.test( navigator.userAgent),
            android = navigator.userAgent.toLowerCase().indexOf("android") > -1;

        this.data({
            'nice-tooltip-content': options.HTML,
            'nice-tooltip-id': ctr++
        });
        if (!touch && !ios && !android) {
            this.on('mouseenter', function (e) {
                var $el = $(this),
                    tpId = $tp.data('id'),
                    thId = $el.data('nice-tooltip-id');
                if (!(tpId === thId)) $tp.data('id',thId).html($el.data('nice-tooltip-content'));
                $tp.stop().animate({
                    opacity:1
                },transition);
            })
                .on('mouseleave', function (e) {
                    $tp.stop().animate({opacity:0},transition);
                });

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
                            obj = setPosition(aw, w, ah, h, coords);
                        $tp.css({
                            left:obj.left,
                            top: obj.top
                        });
                    }
                });
            }
        } else {

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

        function setPosition (aw, w, ah, h, coords) {
            var obj = {},
                left = {
                    right: coords.left + 15,
                    left: coords.left - w - 50,
                    leftCheck: aw - coords.left - w - 20,
                    rightCheck: coords.left - w - 20
                },
                top = {
                    top: coords.top - h - 30,
                    bottom: coords.top + 20,
                    topCheck: ah - coords.top + h + 20,
                    bottomCheck: coords.top - h + 20
                };

            if (position.left == "right") obj.left = (left.leftCheck > 0) ? left.right : left.left;
            else if (position.left == "left") obj.left = (left.rightCheck <= 0) ? left.right : left.left;
            if (position.top == "top") obj.top = (top.topCheck > 0) ? top.top : top.bottom;
            else obj.top = (top.bottomCheck <= 0) ? top.top : top.bottom;

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
