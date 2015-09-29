# Carousel
一个轮播图框架

##使用
使用很简单，下载回去看example

本质上轮播的div，而不是图。

##可以自定义添加切换效果。
例如：
<pre><code>
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
</code></pre>
