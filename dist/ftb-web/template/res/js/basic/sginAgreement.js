require(['head','menu','base','tab','page','status'],
    function(){
        M.define('userDzqm',{
            head:M.ui.head.init(),
            init:function(){

                this.base = M.static.init();
                this.getsignature();
                var id = $.getUrlParam('id');
                // var index = id == '90' ? 1: 0;
                var index = 0;
                M.ui.tab.init({
                    index: index,
                    button: $('.g-nav-tabs-li'),
                    panel: $('.g-tab-main'),
                    event: 'click',
                    currentClass: 'active',
                    url: null,
                    data: null,
                    callback: function (e) {
                    },
                    error: function () {
                    }
                });
                this.getDate();

            },
            getsignature:function(){

                M.ajaxFn({
                    url:  $.interfacePath.basic +'protocol/query/companys',
                    type: 'post',
                    data: {
                        comId: own.fetch('userInfo').comId
                    },
                    dataType: 'json',
                    success: function (res) {

                        if ( res.success ) {
                            M('.chineseFullName').html(res.data.comName )
                            M('.chineseArtificialPerson').html(res.data.legal)
                            M('.registerAddress').html(res.data.address)
                            M('.platAddress').html(res.data.platAddress)
                            M('.platLegal').html(res.data.platLegal)
                        }else {
                            M.ui.waiting.creat({
                                status:false,
                                time:1000,
                                text:res.message,
                                hide:false
                            });
                        }
                    },
                    error: function (err) {
                        console.log('err+'+err)
                    }
                })
            },
            getDate: function(){

                var that = this;
                var id = $.getUrlParam('id');
                var userInfo = own.fetch('userInfo');
                if ( userInfo.fromPlatformContracts == true || id == '90' || id == '92'  ) {
                    userInfo.fromPlatformContracts = false;
                    own.save('userInfo', userInfo);
                    $('.ui-page-confirm').html('<div class="col-xs-12 g-text-right">\n' +
                        '            <button class="ui-button ui-btn-lg ui-btn-gray" onclick="javascript:window.close();">关闭</button>\n' +
                        '        </div>')
                }else {
                    $('.ui-page-confirm').html('<div class="g-right">\n' +
                        '            <label>\n' +
                        '                <input id="check-confirm" class="g-form-check eighthack" type="checkbox">\n' +
                        '                <span class="g-form-lbl"> &nbsp;我已阅读以上内容</span>\n' +
                        '            </label>\n' +
                        '            <a href="javascript:;" class="ui-detail-btn-confirm mar-left-10 mar-right-20" id="Confirm">同意</a>\n' +
                        '        </div>')
                }
                var count = 10;
                M('#Confirm').css('opacity','.5')
                M('#Confirm').html('同意 ('+ 10 + 'S)');
                var timer = setInterval(function () {
                    count--;
                    M('#Confirm').html('同意 ('+ count + 'S)');
                    if (count === 0){
                        clearInterval(timer)
                        M('#Confirm').html('同意');
                        M('#Confirm').css('opacity','1')
                    }
                },1000);


                //提交
                that.isClick = false;
                that.signStatus = 0;
                M('#Confirm').click(function () {
                    if (count !== 0) {
                        M.ui.waiting.creat({
                            status:false,
                            time:1000,
                            text: '请在 '+count+' 秒之后点击同意',
                            hide:false,
                            callback: function () {

                            }
                        });
                    }else if (!M('#check-confirm').attr('checked')) {
                        M.ui.waiting.creat({
                            status:false,
                            time:1000,
                            text: '请确认勾选我已阅读',
                            hide:false,
                        });
                    }else {
                        if (!that.isClick) {
                            that.isClick = true;
                            that.ajaxSubmit(that);
                        }
                    }
                });

            },

            ajaxSubmit: function(that) {
                M.ajaxFn({
                    url:  $.interfacePath.basic +'protocol/authorization',
                    type: 'post',
                    data: {

                    },
                    dataType: 'json',
                    success: function (res) {
//                        console.log(res);
                        if ( res.success ) {


                            M.ui.waiting.creat({
                                status:true,
                                time:1000,
                                text:res.message,
                                hide:false,
                                callback: function () {

                                    var userInfo = own.fetch('userInfo');
                                    var caAgreementFlag= userInfo.caAgreementFlag;
                                    userInfo.sginFlag = '1';
                                    userInfo.token = res.data.token;
                                    own.save('userInfo', userInfo);
                                    var userRole = userInfo.userRole;
                                    if(caAgreementFlag=='1'){
                                        if (userRole[0] == "R10"){
                                            window.location.href = 'workbench.html';
                                        }else if (userRole[0] !== "R55") {
                                            window.location.href = 'workbench-supplier.html';
                                        }
                                    }else{
                                        window.location.href = 'userAgreement.html';
                                    }


                                }
                            });
                        }else {
                            that.isClick = false;
                            return M.ui.waiting.creat({
                                status:false,
                                time:1000,
                                text:res.message,
                                hide:false
                            });
                        }
                    },
                    error: function (err) {
                        console.log('err+'+err)
                    }
                })
            },

        })(function(){
            M.userDzqm.init();
        });
    }
)
