;
(function($, window, document, undefined) {
    var _doc = $(document),
        $body = $('body');
    methods = {
        init: function(options) {
            return this.each(function() {
                var $this = $(this),
                    opt = $this.data('hDialog');
                if (typeof(opt) == 'undefined') {
                    var defaults = {
                        title: '',
                        box: '#HBox',
                        boxBg: '#fff',
                        modalBg: 'rgba(0,0,0,0.5)',
                        closeBg: '#fdce24',
                        width: 300,
                        height: 320,
                        positions: 'center',
                        triggerEvent: 'click',
                        effect: 'hide',
                        modalHide: true,
                        closeHide: true,
                        escHide: true,
                        beforeShow: function() {},
                        afterHide: function() {}
                    };
                    opt = $.extend({}, defaults, options);
                    $this.data('hDialog', opt);
                }
                opt = $.extend({}, opt, options);
                $(opt.box).hide();
                $this.on(opt.triggerEvent, function() {
                    if (opt.resetForm) {
                        var $obj = $(opt.box);
                        $obj.find('input[type=text],textarea').val('');
                        $obj.find('select option').removeAttr('selected');
                        $obj.find('input[type=radio],input[type=checkbox]').removeAttr('checked');
                    }
                    if (opt.escHide) {
                        $(document).keyup(function(event) {
                            switch (event.keyCode) {
                                case 27:
                                    methods.close(opt);
                                    break;
                            }
                        });
                    }
                    methods.fire.call(this, opt.beforeShow);
                    methods.add(opt, $this);
                    var $close = $('#HCloseBtn');
                    if (opt.modalHide) {
                        $close = $('#HOverlay,#HCloseBtn');
                    }
                    $close.on('click', function(event) {
                        event = event || window.event;
                        event.stopPropagation();
                        methods.close(opt);
                    });
                });
            });
        },
        add: function(o, $this) {
            var w, h, t, l, m;
            $obj = $(o.box);
            title = o.title;
            c = $this.attr("class");
            modalBg = o.modalBg;
            closeBg = o.closeBg;
            w = o.width != undefined ? parseInt(o.width) : '300';
            h = o.height != undefined ? parseInt(o.height) : '320';
            m = "" + (-(h / 2)) + 'px 0 0 ' + (-(w / 2)) + "px";
            switch (o.positions) {
                case 'center':
                    t = l = '50%';
                    break;
                case 'top':
                    t = 0;
                    l = '50%';
                    m = "0 0 0 " + (-(w / 2)) + "px";
                    break;
                case 'left':
                    t = l = m = 0;
                    break;
                default:
                    t = l = '50%';
            }
            methods.remove('#HOverlay,#HCloseBtn,#HTitle');
            $body.stop().append("<div id='HOverlay' style='width:" + _doc.width() + "px;height:" + _doc.height() + "px;background-color:" + modalBg + ";position:fixed;top:0;left:0;z-index:9999;'></div>");
            if (o.title != '') {
                $obj.stop().prepend('<div id="HTitle" style="padding:10px 45px 10px 12px;border-bottom:1px solid #ddd;background-color:#f2f2f2;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">' + o.title + '</div>');
            }
            // if (o.closeHide != false) {
            //     $obj.stop().append('<a id="HCloseBtn" title="关闭" style="width:24px;height:24px;line-height:18px;display:inline-block;cursor:pointer;background-color:' + closeBg + ';color:#fff;font-size:1.4em;text-align:center;position:absolute;top:8px;right:8px;"><span style="width:24px;height:24px;display:inline-block;">×</span></a>').css({
            //         'position': 'fixed',
            //         'backgroundColor': o.boxBg,
            //         'top': t,
            //         'left': l,
            //         'margin': m,
            //         'zIndex': '100000'
            //     });
            // }
            $obj.stop().animate({
                'width': o.width,
                'height': o.height
            }, 300).removeAttr('class').addClass('animated ' + c + '').show();
        },
        close: function(o, urls) {
            var $obj = $(o.box);
            switch (o.effect) {
                case "hide":
                    $obj.stop().hide(_effect);
                    break;
                case "fadeOut":
                    $obj.stop().fadeOut(_effect);
                    break;
                default:
                    $obj.stop().hide(_effect);
            }

            function _effect() {
                methods.remove('#HOverlay,.HTooltip');
                $(this).removeAttr('class').removeAttr('style').addClass('animated').hide();
                if (urls != undefined) {
                    setTimeout(function() {
                        window.location.href = urls;
                    }, 1000);
                }
                methods.fire.call(this, o.afterHide);
            }
        },
        remove: function(a) {
            $(a).remove();
        },
        fire: function(event, data) {
            if ($.isFunction(event)) {
                return event.call(this, data);
            }
        }
    };
    $.fn.hDialog = function(method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Error! Method' + method + 'does not exist on jQuery.hDialog！');
        }
    };
    $.extend({
        showLoading: function(t, w, h) {
            t = t != undefined ? t : '正在加载...';
            w = w != undefined ? parseInt(w) : '90';
            h = h != undefined ? parseInt(h) : '30';
            var margin = "" + (-(h / 2)) + 'px 0 0 ' + (-(w / 2)) + "px";
            methods.remove('#HLoading');
            $body.stop().append('<div id="HLoading" style="width:' + w + 'px;height:' + h + 'px;line-height:' + h + 'px;background:rgba(0,0,0,0.6);color:#fff;text-align:center;position:fixed;top:50%;left:50%;margin:' + margin + ';">' + t + '</div>');
        },
        hideLoading: function() {
            methods.remove('#HLoading');
        },
        tooltip: function(t1, t2, t3) {
            t1 = t1 != undefined ? t1 : '哎呀，出错啦 ！';
            t2 = t2 != undefined ? parseInt(t2) : 2500;
            var tip = '<div class="HTooltip shake animated" style="width:280px;padding:10px;text-align:center;background-color:#D84C31;color:#fff;position:fixed;top:10px;left:50%;z-index:100001;margin-left:-150px;box-shadow:1px 1px 5px #333;-webkit-box-shadow:1px 1px 5px #333;">' + t1 + '</div>';
            if (t3) {
                tip = '<div class="HTooltip fadeIn animated" style="width:280px;padding:10px;text-align:center;background-color:#5cb85c;color:#fff;position:fixed;top:10px;left:50%;z-index:100001;margin-left:-150px;box-shadow:1px 1px 5px #333;-webkit-box-shadow:1px 1px 5px #333;">' + t1 + '</div>';
            }
            methods.remove('.HTooltip');
            $body.stop().append(tip);
            setTimeout(function() {
                methods.remove('.HTooltip');
            }, t2);
        },
        goTop: function(b, r) {
            b = b != undefined ? b : '30px';
            r = r != undefined ? r : '20px';
            methods.remove('#HGoTop');
            $body.stop().append('<a id="HGoTop" href="javascript:;" class="animated" style="width:40px;height:40px;line-height:40px;display:inline-block;text-align:center;background:#f5e65d;color:#fff;position:fixed;bottom:' + b + ';right:' + r + ';z-index:100000;">Top</a>').find('#HGoTop').hide();
            $(window).scroll(function() {
                if ($(window).scrollTop() > 150) {
                    $('#HGoTop').removeClass('rollIn rollOut').addClass('rollIn').show();
                } else {
                    $('#HGoTop').removeClass('rollIn rollOut').addClass('rollOut');
                }
            });
            $('#HGoTop').on('click', function() {
                $('body,html').animate({
                    scrollTop: 0
                }, 500);
                return false;
            });
        }
    });
})(jQuery, window, document);