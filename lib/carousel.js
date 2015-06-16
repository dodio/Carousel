(function($){

function Carousel(conf,ele){
  conf = $.extend({
    width:undefined,
    duration:3000,
    effect:{
      name:"slide",
      speed:500
    },
    btn_mouseover:false,
    auto:true
  },conf);

  var _self = this;
  var duration = conf.duration;
  var carousel = $(ele);

  conf.width = conf.width || carousel.width();

  var items = carousel.find(".carousel-item");
      items.width(conf.width);

  var total = items.length;
  var btns = carousel.find(".carousel-btn");
  var pre = carousel.find(".carousel-btn.cur").index();



  carousel.on('click',".carousel-btn_pre",function(){
    addAction(prev);
  });
  carousel.on('click',".carousel-btn_next",function(){
    addAction(next);
  });

  var _method = conf.btn_mouseover  ? "mouseover" : "click";
  btns.each(function(i){
    $(this)[_method](function(){
      addAction(function(){
        setTo(i);
      });
    });
  });

  // 自动播放
  var autoThread = undefined;
  function autoPlay(){
    stopAuto();
    if(duration >> 0){
      autoThread = setTimeout(function(){
        addAction(next);
        autoPlay();
      },duration);
    }
  }
  function stopAuto(){
    clearTimeout(autoThread);
  }

  autoPlay();

  // 按钮点击队列
  var queque = [];
  var done = true;

  function addAction(callback){
    queque.push(callback);
    startAction();
  }
  function startAction(){
    var fn = queque.shift();
    if(fn && done){
      done = false;
      fn();
      stopAuto();
    };
  }
  function doneAction(){
    done = true;
    if(conf.auto){
      autoPlay();
    }
    startAction();
  }

  // 下一个
  function next(){
    var now = pre;
    var then = pre = (pre+1)%total;
    rend(now,then);
  }
  // 前一个
  function prev(){
    var now = pre;
    var then = pre = (pre+total-1)%total;
    rend(now,then);
  }

  // 设置到某个
  function setTo(index){
    var now = pre;

    var then = pre = index;

    rend(now,then);
  }

  // 执行动画
  function rend(now,then){
    if(now == then){
      doneAction();
      return;
    }
    $( btns.removeClass("cur").get(pre) ).addClass("cur");
    if(Carousel.effects[conf.effect.name]){
      Carousel.effects[conf.effect.name].call(_self,now,then);
    }else{
      Carousel.effects['slide'].call(_self,now,then);
    }
  }


  conf.carousel = carousel;
  conf.items = items;
  conf.btns = btns;
  _self.conf = conf;
  _self.next = function(){
    addAction(next);
  }
  _self.prev = function(){
    addAction(prev);
  }
  _self.setTo = function(i){
    addAction(function(){
      setTo(i);
    });
  }
  _self.stopAuto = stopAuto;
  _self.autoPlay = autoPlay;
  _self.doneAction = doneAction;
}
  
  Carousel.effects = {};
  $.Carousel = Carousel;

  $.fn.carousel = function(conf){
    var obj = this.map(function(){
      var _self = $(this);
      if(_self.data('carousel_obj')){
        return _self.data('carousel_obj');
      }
      var carousel_obj = new $.Carousel(conf,this);
      _self.data("carousel_obj",carousel_obj);
      return carousel_obj;
    }).get();
    return obj.length == 1 ? obj[0] : this;
  }
})(jQuery);


/**
 * 滑动效果定义
 * @param  {[type]} $ [description]
 * @return {[type]}   [description]
 */
(function($){
  // 往左移
 $.Carousel.effects.slide = function(now,then){
    var _self = this;
    var elenow = $(_self.conf.items.get(now));
    var elethen = $(_self.conf.items.get(then));

    if(elenow.length == 0 || elethen.length == 0){
      _self.doneAction();
      return;
    }
    
    then > now ? moveleft(elenow,elethen,_self) : moveRight(elenow,elethen,_self);
  }
  function moveleft(elenow,elethen,carousel){

    var width = carousel.conf.width;
    var speed = carousel.conf.effect.speed || 300;
    elethen.show();

    elenow.animate({marginLeft:-width},speed,function(){
      elenow.hide().css({marginLeft:0});
      // 保证对此点击一次执行
      carousel.doneAction();
    });
  }
  // 右移
  function moveRight(elenow,elethen,carousel){
    var width = carousel.conf.width;
    var speed = carousel.conf.effect.speed || 300;
    elethen.css({marginLeft:-width}).show().animate({marginLeft:0},speed,function(){
      elenow.hide();
      // 保证对此点击一次执行
      carousel.doneAction();
    });
  }
})(jQuery);


(function($){
  $.Carousel.effects.fade = function(now,then){
    var _self = this;
    var elenow = $(_self.conf.items.get(now));
    var elethen = $(_self.conf.items.get(then)); 

    var speed = _self.conf.effect.speed || 300;
    elenow.fadeOut(speed,function(){
      elethen.show();
      _self.doneAction();
    });
  }
})(jQuery);