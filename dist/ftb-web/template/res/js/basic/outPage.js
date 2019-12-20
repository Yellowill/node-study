require(['base','menu','status','tab'],
    function(){
        M.define('outPage',{
            init:function(){
                this.base = M.static.init();
                this.getData();
                this.getTabs();
            },
            getData: function(){
                M.ui.tab.init({
                    index: 0,
                    button: $('.about-tabs-li'),
                    panel: $('.g-tab-main'),
                    event: 'click',
                    currentClass: 'active',
                    url: null,
                    data: null,
                    callback: function () {
                    },
                    error: function () {
                    }
                });
                M.ui.tab.init({
                    index: 0,
                    button: $('.help-tabs-li1'),
                    panel: $('.help-tab-main1'),
                    event: 'click',
                    currentClass: 'active',
                    url: null,
                    data: null,
                    callback: function () {
                    },
                    error: function () {
                    }
                });

                M(".help-tabs .help-tabs-li2").click(function(){
                    var num = M(this).index();
                    M(this).addClass("active").siblings().removeClass("active");
                  //  console.log(M(this).index());

                    M(".help-tabs-content .help-tab-main2").eq(num).show().siblings().hide();
                });
            },
            getTabs:function(){

            }

        })(function(){
            M.outPage.init();
        });
    }
)
