require(['signMessage', 'head','menu','base','tab','page','status'],
    function(signMessage){
        M.define('billContract',{
            head:M.ui.head.init(),
            init:function(){
                M.ui.menu.init({
                    index:[],
                    url:M.getNormalPath('getMenu.json',4),
                    callback: function() {
                    }
                });
                this.base = M.static.init();
                var id = $.getUrlParam('id');
                var index = id == '96' ? 1: 0;
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
            getDate: function(){
                var that = this;
                var id = $.getUrlParam('id');
                var signNo = $.getUrlParam('signNo');
                var userInfo = own.fetch('userInfo');
                if ( userInfo.fromPlatformContracts == true || id == '95'|| id == '96' ) {
                    userInfo.fromPlatformContracts = false;
                    own.save('userInfo', userInfo);
                    $('.ui-page-confirm').html('<div class="col-xs-12 g-text-right">\n' +
                        '            <button class="ui-button ui-btn-lg ui-btn-gray" onclick="javascript:window.close();">关闭</button>\n' +
                        '        </div>')
                }else if (signNo) {
                    $('.ui-page-confirm').html('<div class="col-xs-12 g-text-right">\n' +
                        '            <button class="ui-button ui-btn-lg ui-btn-gray" onclick="javascript:window.close();">关闭</button>\n' +
                        '        </div>')
                    M.ajaxFn({
                        url:  $.interfacePath.basic + 'synchronizedCallBack/byBizType',
                        type: 'post',
                        data: {
                            signNo: signNo,
                            bizType: '95',
                            user_code: own.fetch('userInfo').userId
                        },
                        dataType: 'json',
                        success: function (res) {
//                            console.log(res);
                            if ( res.success ) {
                                M.ui.waiting.creat({
                                    status:true,
                                    time:1000,
                                    text:'开立协议签署成功',
                                    hide:false,
                                    callback: function () {
                                        that.updateToken(that, signNo);
                                    }
                                });

                            }else {
                                return M.ui.waiting.creat({
                                    status:false,
                                    time:1000,
                                    text:res.message,
                                    hide:false,
                                    callback: function () {
                                        that.isClick = false;
                                    }
                                });
                            }
                        },
                        error: function (err) {
                            console.log('err+'+err)
                        }
                    })
                }
                else {
                    $('.ui-page-confirm').html('<div class="g-right">\n' +
                        '            <label style="float: left;">\n' +
                        '            <a href="javascript:;" class="ui-detail-btn-return mar-left-10 mar-right-20 download" style="position: absolute;top: 10px;left: 0;">下载</a>\n' +
                        '                <input style="float: left;margin-top: 20px;" id="check-confirm" class="g-form-check" type="checkbox">\n' +
                        '                <span class="g-form-lbl"> &nbsp;我已阅读以上内容</span>\n' +
                        '            </label>\n' +
                        '            <a href="javascript:;" style="float: right;margin-top: 10px;" class="ui-detail-btn-confirm mar-left-10 mar-right-20" id="Confirm">同意</a>\n' +
                        '        </div>')
                }
                M.ajaxFn({
                    url: $.interfacePath.basic + 't/parameter/pdfPrintParameter',
                    type: 'post',
                    data: {
                        bizType: "95",
                    },
                    dataType: 'json',
                    success: function (res) {
//                        console.log(res)
                        if(res.success) {
                            M('#contract-num').html(res.data.signNo)
                            M('#transferSide').html(res.data.platformChineseFullName)
                            M('#transferCode').html(res.data.platformBusinessCreditNo)
                            M('#transTaxNum').html(res.data.platformTaxNum)
                            M('#receiveSide').html(res.data.memberChineseFullName)
                            M('#receiveCode').html(res.data.memberBusinessCreditNo)
                            M('#receiveTaxNum').html(res.data.memberTaxNum)
                            M('#yiAddress').html(res.data.memberChineseFullName)
                            M('.js-addressAndPostCode').html(res.data.memberAddress)
                            if (res.data.createDate) {
                                var date = M.timetrans(res.data.createDate).split('-');
                                M('#year').html(date[0]);
                                M('#month').html(date[1]);
                                M('#day').html(date[2]);
                            }else {
                                var date = M.currentDate().split('-');
                                M('#year').html(date[0]);
                                M('#month').html(date[1]);
                                M('#day').html(date[2]);
                            }
                        }
                    },
                    error: function (err) {
                        console.log(err)
                    }
                });

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
                            var isQuick=$.getUrlParam('isQuick')
                            that.isClick = true;
                            var userInfo = own.fetch('userInfo');
                            M.ajaxFn({
                                url:  $.interfacePath.basic +'t/more/viewSign',
                                type: 'post',
                                data: {
                                    "isQuick":isQuick,
                                    "returnUrl":"bill/addBill.html",
                                    "notifyUrl":"basic/nologin/more/asynchronouscallback"
                                },
                                dataType: 'json',
                                success: function (res) {
                                    // console.log(res);
                                    if ( res.success ) {
                                        var formStr = res.data.views;
                                        $('body').append(formStr);
                                        that.ajaxSubmit(that, res.data.pdfPath, userInfo.userId, res.data.signNo);
                                        M.ui.waiting.creat({
                                            position:'fixed',
                                            status:'loading',
                                            time:10000,
                                            callback:function(){

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
                        }
                    }
                });

                M(document).on('click', '.download', function () {
                    // console.log(M('.isdownload'))
                    if(M('.isdownload').hasClass('active')){
                        M.ajaxFn({
                            url:  $.interfacePath.basic +'t/pdfDownload/agreement',
                            type: 'get',
                            data: {
                                // bizType: M(this).attr('data-type')
                                bizType: "95"
                            },
                            dataType: 'json',
                            success: function (res) {
                                // console.log(res);
                                if ( res.success ) {
                                    M.downloadFileXhr(res.data.pdfPath, '')
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
                        });
                    }else{
                        M.ajaxFn({
                            url:  $.interfacePath.basic +'t/agency/ageementPdf',
                            type: 'get',
                            data: {
                                // bizType: M(this).attr('data-type')
                                bizType:"96"
                            },
                            dataType: 'json',
                            success: function (res) {
                                // console.log(res);
                                if ( res.success ) {
                                    M.downloadFileXhr(res.data.endPath, '')
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
                        });
                    }

                });
            },
            ajaxSubmit: function(that, filePath, userId, signNo) {
                M.ajaxFn({
                    url:  $.interfacePath.basic +'uploadPdf',
                    type: 'post',
                    data: {
                        pdfFilePath: filePath,
                        userId: userId,
                        bizType: '95',
                        signNo: signNo
                    },
                    dataType: 'json',
                    success: function (res) {
//                        console.log(res)
                        if ( res.success ) {
                            that.viewSign(that, res.data);
                        }else {
                            return M.ui.waiting.creat({
                                status:false,
                                time:1000,
                                text:res.message,
                                hide:false,
                                callback: function () {
                                    that.isClick = false;
                                }
                            });
                        }
                    },
                    error: function (err) {
                        console.log('err+'+err)
                    }
                })
            },
            viewSign: function (that, signNo) {
                M.ajaxFn({
                    url:  $.interfacePath.basic +'viewSign',
                    type: 'post',
                    data: {
                        signNo: signNo,
                        name: own.fetch('userInfo').userId,
                        returnUrl: 'bill/billContract.html',
                        notifyUrl: 'basic/nologin/asynchronous'
                    },
                    dataType: 'json',
                    success: function (res) {
//                        console.log(res)
                        if ( res.success ) {
                            var formStr = res.data;
                            $('body').append(formStr);
                        }else {
                            return M.ui.waiting.creat({
                                status:false,
                                time:1000,
                                text:res.message,
                                hide:false,
                                callback: function () {
                                    that.isClick = false;
                                }
                            });
                        }
                    },
                    error: function (err) {
                        console.log('err+'+err)
                    }
                })
            },
            updateToken: function (that, signNo) {
                M.ajaxFn({
                    url:  $.interfacePath.basic +'protocol/agree',
                    type: 'post',
                    data: {
                        agreementType: '10',
                        signNo: signNo
                    },
                    dataType: 'json',
                    success: function (res) {
//                        console.log(res)
                        if ( res.success ) {
                            var userInfo = own.fetch('userInfo');
                            userInfo.cus_caAgreementFlag = '1';
                            own.save('userInfo', userInfo);
                            window.location.href = 'addBill.html'
                        }else {
                            return M.ui.waiting.creat({
                                status:false,
                                time:1000,
                                text:res.message,
                                hide:false,
                                callback: function () {
                                    that.isClick = false;
                                }
                            });
                        }
                    },
                    error: function (err) {
                        console.log('err+'+err)
                    }
                })
            }

        })(function(){
            M.billContract.init();
        });
    }
)
