(function($){
    var ctr = 0;
    $.fn.niceTooltip = function (options) {
        var transition = options.time || 300;
        if (!options.position) position = {horizontal:"right",vertical:"top"};
        else {
            var position = {};
            switch (options.position.horizontal) {
                case "left":
                    position.horizontal = "left";
                    break;
                case "center":
                    position.horizontal = "center";
                    break;
                default:
                    position.horizontal = "right"
            }
            switch (options.position.vertical) {
                case "bottom":
                    position.vertical = "bottom";
                    break;
                case "center":
                    position.vertical = "center";
                    break;
                default:
                    position.vertical = "top"
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
        var mobile = touchSupport || ios || android;
        this.data({
            'nice-tooltip-content': options.HTML,
            'nice-tooltip-id': ctr++
        });
        if (!mobile) {
            this.on('mouseenter', function (e) {
                var $el = $(this),
                    tpId = $tp.data('id'),
                    thId = $el.data('nice-tooltip-id');
                if (!(tpId === thId)) $tp.data('id',thId).html($el.data('nice-tooltip-content'));
                if (options.disableMove) {
                    var coords = setPosition($tp.width(),$tp.height(),$el.position());
                    $tp.css({
                        left: coords.horizontal,
                        top: coords.vertical
                    });
                }
                $tp.stop().animate({opacity:1},transition);
            })
                .on('mouseleave', function (e) {
                    $tp.stop().animate({opacity:0},transition);
                });
            var shift = +new Date;
            if (!options.disableMove) this.on('mousemove', function (e) {
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
                        values = setPosition(w,h,coords);
                    $tp.css({
                        left:values.horizontal,
                        top: values.vertical
                    });
                }
            });
        } else {
            this.on('click', function (e) {
                if ($tp.css('opacity')==1) return;
                var $el = $(this),
                    tpId = $tp.data('id'),
                    thId = $el.data('nice-tooltip-id');
                if (!(tpId === thId)) $tp.data('id',thId).html($el.data('nice-tooltip-content'));
                var coords = setPosition($tp.width(),$tp.height(),$el.position());
                $tp.css({
                    left: coords.horizontal,
                    top: coords.vertical
                });
                $tp.stop().animate({opacity:1},transition);
                setTimeout(function(){$(document).on('click.nicetooltipfade', function () {
                    $tp.stop().animate({opacity:0},transition);
                    $(document).off('.nicetooltipfade');
                });},0);
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
        function setPosition (w, h, coords) {
            var aw = document.documentElement.clientWidth,
                ah = document.documentElement.clientHeight,
                check = {
                    horizontal: {
                        left: coords.left - w - 20,
                        center: coords.left - Math.ceil(w/2),
                        right: aw - coords.left - w + 20
                    },
                    vertical: {
                        top: coords.top - h - 20,
                        center: coords.top - Math.ceil(h/2),
                        bottom: ah - coords.top + h + 20
                    }
                },
                values = {
                    horizontal: {
                        left: coords.left - w - 50,
                        center: coords.left - Math.ceil(w/2),
                        right: coords.left + 20
                    },
                    vertical: {
                        top: coords.top - h - 30,
                        center: coords.top - Math.ceil(h/2),
                        bottom: coords.top + 25
                    }
                },
                obj = {};
            if (check.horizontal[position.horizontal] > 0) obj.horizontal = values.horizontal[position.horizontal];
            else {
                switch (position.horizontal) {
                    case "center":
                        if (check.horizontal.right > 0) obj.horizontal = values.horizontal["right"];
                        else if (check.horizontal.left > 0) obj.horizontal = values.horizontal["left"];
                        else obj.horizontal = values.horizontal["center"];
                        break;
                    case "left":
                        if (check.horizontal.right > 0) obj.horizontal = values.horizontal["right"];
                        else obj.horizontal = values.horizontal["center"];
                        break;
                    case "right":
                        if (check.horizontal.left > 0) obj.horizontal = values.horizontal["left"];
                        else obj.horizontal = values.horizontal["center"];
                }
            }
            if (check.vertical[position.vertical] > 0) obj.vertical = values.vertical[position.vertical];
            else {
                switch (position.vertical) {
                    case "center":
                        if (check.vertical.top > 0) obj.vertical = values.vertical["top"];
                        else if (check.vertical.bottom > 0) obj.vertical = values.vertical["bottom"];
                        else obj.vertical = values.vertical["center"];
                        break;
                    case "bottom":
                        if (check.vertical.top > 0) obj.vertical = values.vertical["top"];
                        else obj.vertical = values.vertical["center"];
                        break;
                    case "top":
                        if (check.vertical.bottom > 0) obj.vertical = values.vertical["bottom"];
                        else obj.vertical = values.vertical["center"];
                }
            }
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
            font: "14px/1.3 arial, sans-serif",
            color: "#333",
            maxWidth: "250px",
            background: "#fff",
            boxShadow: "3px 3px 3px rgba(0,0,0,.3)",
            opacity: 0
        }
    };
})(jQuery);
