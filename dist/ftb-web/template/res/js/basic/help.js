require(['base','menu','status'],
    function(){
        M.define('help',{
            init:function(){
                this.base = M.static.init();
                this.getData();
                $(".capRegUrl").attr('href',$.interfacePath.capRegUrl);
            },

            getData: function(){


                    $('.main_mas ul li').on('click',function(){
                        $(this).find('.main_mas_li').slideToggle();
                        $(this).siblings().find('.main_mas_li').slideUp();
                      //  $(this).css('z-index','2').siblings().css('z-index','1')
                    });
            // ,function(){
            //         $(this).find('.main_mas_li').hide();
            //     }

            },

        })(function(){
            M.help.init();
        });
    }
)


