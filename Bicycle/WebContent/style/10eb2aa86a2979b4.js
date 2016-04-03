
Do(function(){
  var cookieCfg={key:"ap",cookie:"1"},$doubanTip=$("#doubanapp-tip"),data={};function hideDoubanTip(){if(!$doubanTip.length){return}$doubanTip.hide();data[cookieCfg.key]=cookieCfg.cookie;set_cookie(data)}$doubanTip.delegate("a","click",hideDoubanTip);if(!get_cookie(cookieCfg.key)){$doubanTip.show()}var popup;var nav=$("#db-global-nav");var more=nav.find(".bn-more");function handleShowMoreActive(c){var a=$(c.currentTarget);var b=a.parent();hideDoubanTip();if(popup){popup.parent().removeClass("more-active");if($.contains(b[0],popup[0])){popup=null;return}}b.addClass("more-active");popup=b.find(".more-items");popup.trigger("moreitem:show")}nav.delegate(".bn-more, .top-nav-reminder .lnk-remind","click",function(a){a.preventDefault();handleShowMoreActive(a);return}).delegate(".lnk-doubanapp","mouseenter",function(b){var a=$(this);if(!a.parent().hasClass("more-active")){handleShowMoreActive(b)}}).delegate(".top-nav-doubanapp","mouseleave",function(){var b=$(this);var a=b.find(".lnk-doubanapp");if(popup){b.removeClass("more-active");if($.contains(b[0],popup[0])){popup=null}}});$(document).click(function(a){if($(a.target).closest(".more-items").length||$(a.target).closest(".more-active").length){return}if(popup){popup.parent().removeClass("more-active");popup=null}});
});

        (window.DoubanAdSlots = window.DoubanAdSlots || []).push('dale_movie_top_nav_index');
    
    Do(function() {
      $.getScripts=function(){var b=Array.prototype.slice.call(arguments);if(!b.length){return}(function a(c){if(!c){return}if(typeof c=="function"){c();return}$.ajax({url:c,dataType:"script",cache:true,complete:function(){a(b.shift())}})})(b.shift())};
      $.getScripts(
        'https://img3.doubanio.com/f/shire/45dbd19d76e2601d4b8ac605bf7f1fefc4f34d10/js/lib/jquery.tmpl.min.js',
        'https://img3.doubanio.com/f/movie/a197eee0a397e035a64abc25febc9b88c554f5c4/js/movie/search_sugg.js',
        function() {
         $("#db-nav-movie").find("input[name=search_text]").iSuggest({
             api: '/j/subject_suggest',
             tmplId: 'suggResult',
             item_act: function(item){
                 window.location = item.data("link");
             }
         });
      });
    });
  
Do(function(){
    var nav = $('#db-nav-movie');
    var inp=$("#inp-query"),label=inp.closest(".nav-search").find("label");if("placeholder" in inp[0]){label.hide();inp.attr("placeholder",label.text())}else{if(inp.val()!==""){label.hide()}inp.parent().click(function(){inp.focus();label.hide()}).end().focusin(function(){label.hide()}).focusout(function(){if($.trim(this.value)===""){label.show()}else{label.hide()}}).keydown(function(){label.hide()})}inp.parents("form").submit(function(){if(!$.trim(inp.val()).length){return false}});nav.find(".lnk-more, .lnk-account").click(function(b){b.preventDefault();var d,a=$(this),c=a.hasClass("lnk-more")?$("#db-productions"):$("#db-usr-setting");if(!c.data("init")){d=a.offset();c.css({"margin-left":(d.left-$(window).width()/2-c.width()+a.width()+parseInt(a.css("padding-right"),10))+"px",left:"50%",top:d.top+a.height()+"px"});c.data("init",1);c.hide();$("body").click(function(g){var f=$(g.target);if(f.hasClass("lnk-more")||f.hasClass("lnk-account")||f.closest("#db-usr-setting").length||f.closest("#db-productions").length){return}c.hide()})}if(c.css("display")==="none"){$(".dropdown").hide();c.show()}else{$(".dropdown").hide()}});
});

        Do.ready(
            'https://img3.doubanio.com/f/movie/3e90b461e39ac098f1ad8aa8e080cf410d073dc5/js/movie/slide.js',
            'https://img3.doubanio.com/f/movie/cedfd3c8ab9671b413b5327344818cf42ed64129/js/movie/subject_detail_tip.js',
            function(){
                var screeningSlide = new Slide({
                    autoplay: true,
                    wrap: $('#screening .screening-bd'),
                    speed: 600,
                    duration: 20000,
                    itemsPerSlide: 4,
                    lazyload: false
                });
                var galleryID="#hot-gallery";var gallerySlide=new Slide({autoplay:true,wrap:$(galleryID),speed:1000,duration:5000,itemsPerSlide:1,index:".gallery-ui-slide-index",max:".gallery-ui-slide-max",btnPrev:".gallery-btn-prev",btnNext:".gallery-btn-next",controlNav:".gallery-ui-control-nav",lazyload:false});$(galleryID).find("a").click(function(){var a=$(this).data("fid");$.post("/j/misc/gallery/click_count",{frame_id:a,ck:get_cookie("ck")})});;
                $('.ui-slide-item img').subjectTip('.ui-slide-item', 'screening');
            });
    
        Do.ready(
            'https://img3.doubanio.com/f/movie/9696e785827346c2ae0b4085065408feee7722ec/js/movie/cinemas_suggestion.js',
            'https://img3.doubanio.com/f/movie/8af56711f3387cb18aa972ce4784e91889a6d1d6/js/movie/hot_cities.js',
            'https://img3.doubanio.com/f/shire/d96d615ee6e42807bb081b3e3e0089753ffdb731/js/core/moreurl.js',
            function(){
                $.fn.searchCinema($('#cinemas-suggestion-input input'), {
                    itemCallback: function(self){
                        moreurl(self, {from: 'mv_cg'});
                        window.location.href = $(self).find('a').attr('href');
                    }
                });

                function changeCity(e){
                    $('#city-id')
                        .data('city-id', $(e.target).attr('id'))
                        .text($(e.target).text());
                }

                var hot = new HotCities({'trigger': '#city-id', 'changeCity': changeCity});

                hot.init();
        });
    
      $('.hot_link').find('a').click(function(){
          var buzz_id = $(this).data("bid");
          $.post_withck('/j/misc/buzz/click_count', { buzz_id: buzz_id })
      });
  
        var gaiaConfig = {
            hashbang: false,
            fixFilter: false,
            is_mobile: "False"
        };

        Do.add('_', {path: 'https://img3.doubanio.com/f/movie/71651576b5cb5e143d5b7b7ae78cb7bec6d4bbcb/js/movie/lib/underscore.js', type: 'js'});
        Do.add('lazyload', {path: 'https://img3.doubanio.com/f/shire/5688df2ab9b7ba25e651e0d1b87daeaf8c54dd93/js/jquery.lazyload.min.js', type: 'js'});
        Do.add('deparam', {path: 'https://img3.doubanio.com/f/movie/9b33d0e3b47f7cabc0e24f23572170b627b1c412/js/movie/lib/jquery.deparam.js', type: 'js'});
        Do.add('gaia', {path: 'https://img3.doubanio.com/f/movie/321291a4bac52196fd75f48c6382d5e853e22e8d/js/movie/project/gaia/__init__.js', type: 'js'});

        Do.ready('_', 'lazyload', 'deparam', 'gaia', function(){

            $('.lazy').lazyload({threshold: 350, effect: 'fadeIn'});

            $('#city-id').bind('click', function(e){
                $('#cinemas-suggestion-input input').blur();
                return false;
            });

            $(document)
                .delegate('.poster img', 'mouseenter', function(e){
                    $('#cities-list').hide();
                    $('#cinemas-suggestion-input input').blur();
                });

            $('#cinemas-suggestion-input input').val('').blur();
        });
    