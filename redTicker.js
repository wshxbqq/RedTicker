/// <reference path="Libs/jquery-1.2.6.min.js" />

var redTicker = {};

redTicker.init = function (cfg) {
    var _this = this;
    
    var _cfg = cfg || {};

    this.selector = _cfg.selector || "secondcount";
    this.renderFn = _cfg.renderFn || function (d) {
        var _this=this;
        var renderDefault = function (data) {
            if (data.secondcount <= 0) {
                _this.innerHTML = "该活动已结束";
                return;
            }

            _this.innerHTML = "剩余" + data.day + "天" + data.hour + "时" + data.minute + "分" + data.second + "秒";
        }

        var renderCustom=function(){
            _this.innerHTML = "" + data.day + " d" + data.hour + "h" + data.minute + "m" + data.second + "s";
        }
        
        switch ($(_this).attr("render_type")) {
            case "Custom": renderCustom(d); break;
            default: renderDefault(d); break;
        }   

    }
    this.RED_TICKER_PASSED = 0;
    this.RED_TICKER_ITEMS = [];
    this.RED_TICKER_ITEMS_ON_ACTIVE = [];
    this.RED_TICKER_INTERVAL = window.setInterval(function () {
        _this.tick();
    }, 1000);




    
}
redTicker._render = function (item) {
    var _this = this;
    var secondcountRemain = item.secondcount - _this.RED_TICKER_PASSED;
    item.renderFn(_this.parseData(secondcountRemain));
}

redTicker.tick = function () {
    var _this = this;
    _this.RED_TICKER_PASSED++;
    for (var i = 0; i < _this.RED_TICKER_ITEMS_ON_ACTIVE.length; i++) {
        var item = _this.RED_TICKER_ITEMS_ON_ACTIVE[i];
        _this._render(item);
    }
}

redTicker.render = function () {
    var _this = this;
    _this.RED_TICKER_ITEMS_ON_ACTIVE = [];

    for (var i = 0; i < _this.RED_TICKER_ITEMS.length; i++) {
        var item = _this.RED_TICKER_ITEMS[i];
        if (_this.inScreen(item)) {
            _this.RED_TICKER_ITEMS_ON_ACTIVE.push(item);
        }
       
    }

}

redTicker.inScreen = function (dom) { 
    var p = $(dom).offset();
    var result=0;
    var cHeight=$(window).height();
    //var aHeight=$(document).height();
    var scrollTop=$(window).scrollTop();
    if (p.top > scrollTop && p.top <= scrollTop+cHeight) {
        result = 1;
    }
    return result;
}

redTicker.adapt = function () {
    var _this = this;
    var a = $("[" + _this.selector + "]");
    a.each(function (n, i) {
        
        if ($.inArray(i, _this.RED_TICKER_ITEMS)) {
            i.renderFn = _this.renderFn;
            i.rendAble = 0;
            i.secondcount = window.parseInt($(i).attr("secondcount"));
            _this.RED_TICKER_ITEMS.push(i);
            _this._render(i);
        }
    });
}


redTicker.parseData = function (secondcount) {
    var daySecond = 60 * 60 * 24;
    var hourSecond = 60 * 60;
    var result = {};
    result.secondcount = secondcount;
    result.day = parseInt(secondcount / (daySecond));
    result.hour = parseInt((secondcount % (daySecond)) / (hourSecond));
    result.minute = parseInt((secondcount % (hourSecond)) / (60));
    result.second = parseInt((secondcount % 60) / (1));
    return result;

}