require(['signMessage','head', 'menu', 'base', 'tab', 'page', 'calendar', 'confirm','customDialog', 'status', 'qrcode'],
    function (signMessage) {
        M.define('billIssue', {
            head: M.ui.head.init(),
            init: function () {
                M.ui.menu.init({
                    index: [0, 1],
                //    url: M.getNormalPath('getMenu.json', 4),
                    callback: function () {
                    }
                });
                // var menuId = M.getMenuId('../bill/billExamine.html');;
                // this.getBtnPrivilege(menuId)
                this.hasBatchCheck = false;
                this.base = M.static.init();
                this.sortCode = "";
                this.pageSize = 10;
                this.status = 1;
                this.getDate();
                this.getTableData(1);
                this.dateSort = true;
                M('.Js-Allcheck-Btn').bind('click',function(){
                	M.billIssue.batchCheck();
                });
                M('#opens').bind('click',function(){
                    M('#othersc').toggle()
                });
                $('#checkall').unbind('click').bind('click', function(){
                	M.billIssue.allSelect();
                });
                M(document).on('click','.checkSingle',function(){
                	var flag = 0;
                	if(M(this).hasClass('act')){
                		M(this).removeClass('act');
                		M('#checkall').removeClass('act');
                	}else{
                		M(this).addClass('act');
                	}
                	for(var i=0;i<M('.Js-check-pending .checkSingle').length;i++){
                		if(!M('.Js-check-pending .checkSingle').eq(i).hasClass('act')){
                			flag = 1;
                		}
                	}
                	if(flag == 1){
                		M('#checkall').removeClass('act');
                	}else{
                		M('#checkall').addClass('act');
                	}
                })
            },
            allSelect : function() {
                var _target = M('#checkall');
                var $allItems = M(".checkSingle");
                if(_target.hasClass('act')){
                	_target.removeClass('act')
                	$allItems.removeClass('act')
                }else{
                	_target.addClass('act')
                	$allItems.addClass('act')
                }
            },
            hideCheckStatus: function() {
                M('#batchCheck').hide();
                M('.g-container').css('padding-bottom','0px');
                M('#batchCheck').removeClass('js-active');
                M('.js-manage-btn').html('批量管理');
                M('.js-check-all').hide()
                M('.js-all-approve').hide();
            },
            getBtnPrivilege: function(menuId) {
                M.buttonsPrivilege(menuId, function (data) {
                    if (!data || data.length == 0){
                        return;
                    }  
                    for (var i = 0; i<data.length; i++) {
                        if (data[i].btnNo == "YJFH") {
                            M('.g-nav-content').append('<a id="batchCheck" href="javascript:;" class="ui-button-ghost g-nav-btn ui-btn-red"><i class="iconfont mar-right-5">&#xe6fa;</i><span class="js-manage-btn">批量管理</span></a>');
                            M.billIssue.hasBatchCheck = true;
                            M.billIssue.setBatchCheckShow();
                            M('#batchCheck').click('on', function ( ) {
                            	if(M('#batchCheck').hasClass('js-active')){
                                    M('.g-container').css('padding-bottom','0px');
                                    M('#batchCheck').removeClass('js-active');
                                    M('.js-manage-btn').html('批量管理');
                                    M('.js-check-all').hide()
                                    M('.js-all-approve').hide();
                            	}else{
                            		M('#batchCheck').addClass('js-active');
                            		M('.g-container').css('padding-bottom','90px');
                                	M('.js-manage-btn').html('完成');
                                	M('.js-check-all').show();
                                	M('.js-all-approve').show();
                            	}
                            })
                        }
                    } 
                })
            },

            getDate: function () {
                var that = this;
                M.ui.tab.init({
                    index: 1,
                    button: $('.g-nav-tabs-li'),
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

                var calenderStart = M.ui.calendar.init({
                    target: M('#js-calender-start'),
                    date: {
                        format: 'YYYY-MM-DD'
                    },
                    time: {
                        enabled: false
                    },
                    number: 1,
                    toggle: 1,
                    relative: {
                        type: 'stop'
                    },
                    tool: {
                        clear: true,
                        today: true
                    },
                    callback: function (that) {
                        M.delay(100, function () {
                            this.ops.relative.point = calenderStop;
                        }, this);
                    },
                    choose: function () {
                    }
                }, this);
                var calenderStop = M.ui.calendar.init({
                    target: M('#js-calender-stop'),
                    date: {
                        format: 'YYYY-MM-DD'
                    },
                    time: {
                        enabled: false
                    },
                    number: 1,
                    toggle: 2,
                    relative: {
                        type: 'start'
                    },
                    tool: {
                        clear: true,
                        today: true
                    },
                    callback: function (that) {
                        M.delay(100, function () {
                            this.ops.relative.point = calenderStart;
                            this.ops.date.min = calenderStart.ops.date.select;
                        }, this);
                    },
                    choose: function () {
                    }
                }, this);
                //时间排序
                M('.sort-group .date-sort').click(function(event) {
                    var dateSort = M.billIssue.sortCode;
                    if (M(this).hasClass('active')) {
                        M(this).removeClass('active');
                        M(this).find('i').removeClass('g-180deg');
                        dateSort = "10"
                    }else {
                        M(this).addClass('active');
                        M(this).find('i').addClass('g-180deg');
                        dateSort = "15"
                    }
                    M('.sort-group .price-sort').removeClass('active');
                    M('.sort-group .price-sort').find('i').removeClass('g-180deg');
                    M.billIssue.sortCode = dateSort;
                    M.billIssue.getTableData(1);
                    return false;
                });

                //金额排序
                M('.sort-group .price-sort').click(function(event) {
                    var priceSort = M.billIssue.sortCode;
                    if (M(this).hasClass('active')) {
                        M(this).removeClass('active');
                        M(this).find('i').removeClass('g-180deg');
                        priceSort = "20"
                    }else {
                        M(this).addClass('active');
                        M(this).find('i').addClass('g-180deg');
                        priceSort = "25"
                    }
                    M.billIssue.sortCode = priceSort;
                    M('.sort-group .date-sort').removeClass('active');
                    M('.sort-group .date-sort').find('i').removeClass('g-180deg');
                    M.billIssue.getTableData(1);
                    return false;
                });

                M('.ui-search-button').click(function(event) {
                    M.billIssue.getTableData(1);
                });

                M('.tapAll').click('on', function () {
                    M.billIssue.status = 0;
                    M.billIssue.getTableData(1);
                    M.billIssue.setBatchCheckShow();
                });

                M('.tapCheck').click('on', function () {
                    M.billIssue.status = 1;
                    M.billIssue.getTableData(1);
                    M.billIssue.setBatchCheckShow();
                });

                M('.tapPay').click('on', function () {
                    M.billIssue.status = 2;
                    M.billIssue.getTableData(1);
                    M.billIssue.setBatchCheckShow();
                });

                M('.tapBack').click('on', function () {
                    M.billIssue.status = 3;
                    M.billIssue.getTableData(1);
                    M.billIssue.setBatchCheckShow();
                });
                M('.tapRevoke').click('on', function () {
                    M.billIssue.status = 4;
                    M.billIssue.getTableData(1);
                    M.billIssue.setBatchCheckShow();
                });

                $(document).on("change",'select.search-select',function(){

                    M.billIssue.getTableData(1);
                });

            },

            //是否显示批量审核
            setBatchCheckShow: function() {
                if (M.billIssue.status == 1 && M.billIssue.hasBatchCheck) {
                    M('#batchCheck').show();
                } else {
                    M.billIssue.hideCheckStatus();
                }

            },

            //批量审批
            batchCheck: function() {
                var selectIds = [];

                for(var i=0;i<M('.Js-check-pending .checkSingle').length;i++){
                    var checkDom = M('.Js-check-pending .checkSingle').eq(i);
                    if(checkDom.hasClass('act')){
                        var spanDom = checkDom[0];
                        selectIds.push(M.getDataset(spanDom).id);
                    }
                }

                if (selectIds.length == 0) {
                    M.ui.confirm.init({
                        html:'您未选择通宝，是否复核全部？',
                        button:[
                            {
                                href:null,
                                html:'确认',
                                callback:function(){
                                    var startTime = M('#js-calender-start').val();
                                    var endTime = M('#js-calender-stop').val();
                                    var financialInstitutionsName = M('.institution').val();
                                    var payDate = M('.search-select').val();
                                    var payDateStart = "";
                                    var payDateEnd = "";
                                    switch (payDate) {
                                        case '1':
                                            payDateStart = $.getDateScope('days',0);
                                            payDateEnd = $.getDateScope('days',14);
                                            break;
                                        case '2':
                                            payDateStart = $.getDateScope('days',0);
                                            payDateEnd = $.getDateScope('days',30);
                                            break;
                                        case '3':
                                            payDateStart = $.getDateScope('days',0);
                                            payDateEnd = $.getDateScope('days',90);
                                            break;
                                        case '4':
                                            payDateStart = $.getDateScope('days',0);
                                            payDateEnd = $.getDateScope('days',180);
                                            break;
                                        default:
                                            break;
                                    }

                                    var waiting = M.ui.waiting.creat({
                                        status:'loading',
                                        hide:true,
                                    });

                                    M.ajaxFn({
                                        url:$.interfacePath.bill+'t/agreed/checkUserfor',
                                        type: 'post',
                                        data: {
                                            "payName": financialInstitutionsName,
                                            "releaseDateStart": startTime,
                                            "releaseDateEnd": endTime,
                                            "maturityDateStart": payDateStart,
                                            "maturityDateEnd": payDateEnd,
                                        },
                                        dataType: 'json',
                                        contentType: 'application/json',
                                        success: function (res) {
                                            M.ui.waiting.dismiss()
                                            if (res.success) {
                                                var data = res.data;
                                                if (data) {
                                                    M.ui.waiting.creat({
                                                        status:true,
                                                        time:1000,
                                                        text:res.message,
                                                        hide:false
                                                    });
                                                    M.billIssue.hideCheckStatus();
                                                    M.billIssue.getTableData(1);
                                                }
                                            }else {
                                                M.ui.waiting.creat({
                                                    status:false,
                                                    time:1000,
                                                    text:res.message,
                                                    hide:false
                                                });
                                            }
                                        },
                                        error: function (res) {
                                            M.ui.waiting.dismiss()
                                        }
                                    });
                                }
                            }
                        ]
                    });
                } else {
                    M.ui.confirm.init({
                        html:'是否复核已选中通宝？',
                        button:[
                            {
                                href:null,
                                html:'确认',
                                callback:function(){

                                    var waiting = M.ui.waiting.creat({
                                        status:'loading',
                                        hide:true,
                                    });

                                    M.ajaxFn({
                                        url:$.interfacePath.bill+'t/agreed/conditions/checkUserfor',
                                        type: 'post',
                                        data: {
                                            ids: selectIds
                                        },
                                        dataType: 'json',
                                        contentType: 'application/json',
                                        success: function (res) {
                                            M.ui.waiting.dismiss()
                                            if (res.success) {
                                                var data = res.data;
                                                if (data) {
                                                    M.ui.waiting.creat({
                                                        status:true,
                                                        time:1000,
                                                        text:res.message,
                                                        hide:false
                                                    });
                                                    M.billIssue.hideCheckStatus();
                                                    M.billIssue.getTableData(1);
                                                }
                                            }else {
                                                M.ui.waiting.creat({
                                                    status:false,
                                                    time:1000,
                                                    text:res.message,
                                                    hide:false
                                                });
                                            }
                                        },
                                        error: function (res) {
                                            M.ui.waiting.dismiss()
                                        }
                                    });
                                }
                            }
                        ]
                    });
                }

            },

            //状态格式化
            statusFormat: function (data) {
                var type = null;
                if (data == 0) {
                    type = '新增';
                } else if (data == 10) {
                    type = '待复核';
                } else if (data == 20) {
                    type = '待平台审核';
                } else if (data == 25) {
                    type = '待平台复核';
                } else if (data == 2) {
                    type = '复核';
                } else if (data == 28) {
                    type = '待签收';
                } else if (data == 30) {
                    type = '已签收';
                } else if (data == 40) {
                    type = '兑付中';
                }else if (data == 42) {
                    type = '兑付中';
                }else if (data == 45) {
                    type = '兑付中';
                } else if (data == 50) {
                    type = '已兑付';
                } else if (data == 90) {
                    type = '业务驳回';
                } else if (data == 95) {
                    type = '平台驳回';
                } else if (data == 96) {
                    type = '接收方驳回';
                } else if (data == 97) {
                    type = '逾期冻结';
                } else if (data == 98) {
                    type = '作废';
                } else if(data ==99){
                    type = '已撤销';
                }
                return type;
            },

            //撤销
            Revoke: function(id) {
                if (!id) {
                    return;
                }

                M.ui.confirm.init({
                    html:'确定撤销吗？',
                    button:[
                        {
                            href:null,
                            html:'确认',
                            callback:function(){
                                M.ajaxFn({
                                    url:$.interfacePath.bill+'t/goldReview/revoke',
                                    type: 'post',
                                    data: {
                                        "id": id,
                                        "status": "20",
                                    },
                                    dataType: 'json',
                                    contentType: 'application/json',
                                    success: function (res) {
                                        if (res.success) {
                                            var data = res.data;
                                            if (data) {
                                                M.ui.waiting.creat({
                                                    status:true,
                                                    time:1000,
                                                    text:res.message,
                                                    hide:false
                                                });
                                                var pageIndex = $('#page').find('span.current').text();
                                                M.billIssue.getTableData(pageIndex);
                                            }
                                        }else {
                                            M.ui.waiting.creat({
                                                status:false,
                                                time:1000,
                                                text:res.message,
                                                hide:false
                                            });
                                        }
                                    },
                                    error: function (res) {
                                        console.log(res);
                                    }
                                });
                            }
                        }
                    ]
                });
            },

            //复核
            check: function (billNo, id, payerId,payerIsGroup) {
                M.ajaxFn({
                    url:  $.interfacePath.bill +'t/checkBillAccept',
                    type: 'post',
                    data: {
                        id: id
                    },
                    dataType: 'json',
                    success: function (res) {
                        if ( res.success ) {
                            M.billIssue.checkItem(billNo, id, payerId,payerIsGroup);
                        }else {
                            M.ui.waiting.creat({
                                status:false,
                                time:3000,
                                text:res.message,
                                hide:false
                            });
                        }
                    },
                    error: function (err) {
                        console.log('err+'+err)
                    }
                });
            },

            //复核
            checkItem: function(billNo, id, payerId,payerIsGroup) {
                var that = this;
                //提交
                that.isClick = false;
                that.signStatus = 0;
                if (!billNo) {
                    return;
                }

                M.ui.customDialog.init({
                    drag: true,
                    width:1000,
                    height:520,
                    autoClose: false,
                    url: '../dialog/dialog-check.html',
                    callback: function (e) {
                        M.ajaxFn({
                            url:  $.interfacePath.basic +'chapterEnterprise',
                            type: 'post',
                            data: {
                                userId: own.fetch('userInfo').userId,
                                customerId: payerId
                            },
                            dataType: 'json',
                            success: function (res) {

//                                console.log(res);
                                if ( res.success ) {
                                    if (res.data.troeePath && res.data.troeePath.length > 0) {
                                        M.downloadFileXhrImg(res.data.troeePath, '', M('#recieveSign'));
                                    } else {
                                        M('#recieveSign').hide();
                                    }
                                    if (res.data.treeIdPath && res.data.treeIdPath.length > 0) {
                                        M.downloadFileXhrImg(res.data.treeIdPath, '', M('#createSign'));
                                    } else {
                                        M('#createSign').hide();
                                    }
                                }else {
                                    M.ui.waiting.creat({
                                        status:false,
                                        time:3000,
                                        text:res.message,
                                        hide:false
                                    });
                                }
                            },
                            error: function (err) {
                                console.log('err+'+err)
                            }
                        });
                        M.ajaxFn({
                            url:$.interfacePath.bill+'t/myFinanceBillOne/query',
                            type: 'post',
                            data: {
                                billNo:billNo
                            },
                            dataType: 'json',
                            contentType: 'application/json',
                            success:function(data){
                                // if(payerIsGroup=="0"){
                                //     $('.tab-title').show()
                                //     $('.tab-title').on('click','.tab-title-li',function(){
                                //         var index=$(this).index()
                                //         $(this).addClass('active')
                                //         $(this).siblings().removeClass('active')
                                //         $('.tab-content').eq(index).show()
                                //         $('.tab-content').eq(index).siblings().hide()
                                //     })
                                //
                                // }
                                that.info = data.data;
//                                console.log(data);
                                var res = data.data;
                                M('#billNo').html(res.billNo);
                                M('#releaseDate').html($.timetrans(res.releaseDate).replace(/\-/g, '/'));
                                M('#payerName').html(res.payerLegalName);
                                M('#taxNumPay').html(res.taxNumPay);
                                M('#maturityDate').html($.timetrans_cn(res.maturityDate));
                                M('#billAmount_cn').html(M.getChineseNumber(res.billAmount));
                                M('#operateUserName').html(res.operateUserName);
                                M('#passedUserName').html(res.auditUserName);
                                M('#receivingName').html(res.receiverLegalName);
                                M('#taxNumReceiv').html(res.taxNumReceiv);
                                M('#hashCode').html(res.hashCode);
                                M('#unix').html(res.unix);
                                M('#sign').html(res.sgin);
                                M('#signTime').html($.timetrans(res.sginTime).replace(/\-/g, '/'));

                                M(".receivingNameY").html(res.receiverLegalName)
                                M(".payerNameJ").html(res.payerLegalName)
                                var numArr = M.getFormatNumber(res.billAmount).replace(/\,|\./g, '').split('').reverse();
                                for (var i=0;i<numArr.length; i++) {
                                    M(M('.num-bot')[i]).html(numArr[i]);
                                }
                                if (numArr.length < 11) {
                                    M(M('.num-bot')[numArr.length]).html('¥');
                                }
                            },
                            error:function(){

                            }
                        });

                        M('.objection-btn-close').click(function () {
                            e.remove();
                        });
                        M('.objection-btn').click(function () {
                            if (!that.isClick) {
                                that.isClick = true;
                                var userInfo = own.fetch('userInfo');
                                that.ajaxSubmit(that, '', userInfo.userId, that.info.billNo);
                                // if(payerIsGroup=="0"){
                                //     M.ajaxFn({
                                //         url:  $.interfacePath.bill +'t/receivingBill/viewsSgin',
                                //         type: 'post',
                                //         data: {
                                //             id:id,
                                //         },
                                //         dataType: 'json',
                                //         success: function (res) {
                                //
                                //             if ( res.success ) {
                                //                 var formStr = res.data;
                                //                 $('body').append(formStr);
                                //             }else {
                                //                 return M.ui.waiting.creat({
                                //                     status:false,
                                //                     time:1000,
                                //                     text:res.message,
                                //                     hide:false,
                                //                     callback: function () {
                                //                         that.isClick = false;
                                //                     }
                                //                 });
                                //             }
                                //         },
                                //         error: function (err) {
                                //             console.log('err+'+err)
                                //         }
                                //     })
                                // }else{
                                //     that.ajaxSubmit(that, '', userInfo.userId, that.info.billNo);
                                // }



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
                        bizType: '19',
                        signNo: signNo,
                        bizId: signNo
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
                        returnUrl: 'bill/billIssueDetail.html?isSign=true&id='+that.info.billNo,
                        notifyUrl: 'bill/nologin/fianceBill/callbackReceiving'
                    },
                    dataType: 'json',
                    success: function (res) {
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
            //驳回
            goBack:function(id){
                if (!id) {
                    return;
                }
                M.ui.customDialog.init({
                    drag: true,
                    title: '驳回意见',
                    width: 510,
                    height: 230,
                    autoClose: false,
                    url: '../dialog/dialog-objection.html',
                    callback: function (e) {
                        M('.objection-btn-close').click(function () {
                            e.remove();
                        });
                        M('.objection-btn').click(function () {
                            var js_textarea = M('.js-textarea').val();
                            M.ajaxFn({
                                url:M.interfacePath.bill+'t/fianceBill/refusedReceiving',
                                type:'post',
                                dataType:'json',
                                data:{
                                    "id": id,
                                    "status": "99",
                                    refuseReason:js_textarea
                                },
                                success:function(res){
                                    if (res.success) {
                                        M.ui.waiting.creat({
                                            status:true,
                                            time:1000,
                                            text:res.message,
                                            hide:false,
                                        });
                                        // location.reload();
                                        var pageIndex = $('#page').find('span.current').text();
                                        M.billIssue.getTableData(pageIndex);
                                    }else{
                                        M.ui.waiting.creat({
                                            status:false,
                                            time:1000,
                                            text:res.message,
                                            hide:false,
                                        });
                                    }
                                },
                                error:function(){
                                }
                            });
                            e.remove();
                        });

                    }
                });
            },
            getTableData: function (page) {

                var sortCode = M.billIssue.sortCode;
                var startTime = M('#js-calender-start').val();
                var endTime = M('#js-calender-stop').val();
                var financialInstitutionsName = M('.institution').val();
                var tbNum = M('.tbNum').val();
                var payDate = M('.search-select').val();
                var payDateStart = "";
                var payDateEnd = "";
                switch (payDate) {
                    case '1':
                        payDateStart = $.getDateScope('days',0);
                        payDateEnd = $.getDateScope('days',14);
                        break;
                    case '2':
                        payDateStart = $.getDateScope('days',0);
                        payDateEnd = $.getDateScope('days',30);
                        break;
                    case '3':
                        payDateStart = $.getDateScope('days',0);
                        payDateEnd = $.getDateScope('days',90);
                        break;
                    case '4':
                        payDateStart = $.getDateScope('days',0);
                        payDateEnd = $.getDateScope('days',180);
                        break;
                    default:
                        break;
                }


                var status = M.billIssue.status;
                var statusObj = "00";

                switch (status) {
                    case 1:
                        statusObj = "28";
                        break;
                    case 2:
                        statusObj = "30";
                        break;
                    case 3:
                        statusObj = "96";
                        break;
                    // case 4:
                    //     statusObj = "99";
                    //     break;
                    default:
                        statusObj = "00";
                }

                M.ajaxFn({
                    url:$.interfacePath.bill+'t/fianceBill/receiving/list',
                    type: 'post',
                    data: {
                        "payName": financialInstitutionsName,
                        "billNo":tbNum,
                        "releaseDateStart": startTime,
                        "releaseDateEnd": endTime,
                        "statusList": statusObj,
                        "maturityDateStart": payDateStart,
                        "maturityDateEnd": payDateEnd,
                        "orderBy": sortCode,
                        pageNum: page,
                        pageSize: M.billIssue.pageSize,
                    },
                    dataType: 'json',
                    contentType: 'application/json',
                    success: function (res) {
                        // console.log(res);
                        var data = res.data;
                        if (data == null || res.success == false||data.length ==0) {
                            var noData = '<div class="noData"><img src="../../template/res/images/empty.png" alt=""><div class="col60 mar-top-10">暂无记录</div></div>';
                            M('.g-main-content').html(noData);
                            M('.pageTotal').html(res.total);
                            M('.pageCount').html(res.pageCount);
                            M.billIssue.getPage(res, page, M('#page'));
                        }else if(res.success && data.length!=0){
                            var str = '';
                            for (var i = 0; i < data.length; i++) {

                                var item = data[i];

                                var ddd = $.TimeDifference(M.timetrans(item.maturityDate), $.currentDate());
                                if (ddd.length && ddd.substring(1,ddd.length-1) <= 7) {
                                    var dateHtml = '<i class="iconfont mar-right-5 g-font14">&#xe614;</i><span class="Surplus">' + ddd + '</span>';
                                }else if (ddd.length == 3 && isNaN(parseInt(ddd.substring(1,ddd.length-1)))) {
                                    var dateHtml = '<i class="iconfont mar-right-5 g-font14">&#xe614;</i><span class="Surplus">' + ddd + '</span>';
                                }else {
                                    var dateHtml = '';
                                }

                                if (item.status == '50' || item.status == '90' || item.status == '95' || item.status == '96' || item.status == '99' ) {
                                    dateHtml = '';
                                }

                                var checkHtml = "";
                                var goBack = "";
                                var statusOperator = "";
                                // if (item.status == 10) {
                                //     checkHtml = '<a class="ui-button ui-btn-bt ui-btn-red" href="javascript:;" onclick=\'M.billIssue.check("' + item.billNo+'","'+ item.id + '");\'>复核</a>';
                                //     goBack = '<a class="ui-btn-red  maincol" href="javascript:;" onclick=\'M.billIssue.goBack("' + item.id + '");\'>驳回</a> '
                                // } else if (item.status == 0) {
                                //     checkHtml = '<a class="ui-button ui-btn-bt ui-btn-red" href="javascript:;" onclick=\'M.billIssue.addItem("' + item.id + '");\'>新增</a>';
                                // }else if(item.status == 20){
                                //     checkHtml = '<a class="ui-button ui-btn-bt ui-btn-red" href="javascript:;" onclick=\'M.billIssue.Revoke("' + item.id + '");\'>撤销</a>';
                                // }else
                                if(item.status == 28){
                                    checkHtml = '<a class="ui-button ui-btn-bt ui-btn-red" href="javascript:;" onclick=\'M.billIssue.check("' + item.billNo+'","'+ item.id + '","'+ item.payerId+ '","'+ item.payerIsGroup+ '");\'>签收</a>';
                                    goBack = '<a class="ui-btn-red  maincol" href="javascript:;" onclick=\'M.billIssue.goBack("' + item.id + '");\'>驳回</a> '
                                }
                                else if(item.status=="96"){
                                    if(item.refuseAcceptReason != null){
                                        statusOperator = '<i class="iconfont notice-icon">&#xe797;</i><div class="tips tips-icon"><span class="triangle"></span><span class="icon-span">'+item.refuseAcceptReason+'</span></div>';
                                    }
                                }
                                if(item.hashCode==null){
                                    item.hashCode = '生成中...';
                                }
                                str += '<div class="g-tr-content">' +
                                    '<div class="g-top-content">' +
                                    '<div class="g-left col60 le">' +
                                    '<div class="ui-examinebottmo-left js-check-all" style="display:none"><div class="ui-examinebottmo-check"><span class="checkbox checkSingle" data-id="'+item.id+'"><i class="iconfont">&#xe74c;</i> </span></div></div>'+
                                    '<i class="iconfont g-font18 movIcon">&#xe658;</i>通宝编号：' +
                                    '<span class="col33">' + item.billNo + '</span>' +
                                    '</div>' +
                                    '<div class="g-left col60 ce">' +
                                    '<i class="iconfont mar-right-5  movIcon">&#xe611;</i>' +
                                    '<span class="g-number-dropdown">区块链存证编号</span>' +
                                    '<div class="g-number-dropdown-content">' +
                                    '<span class="triangle"></span>' + item.hashCode + '</div>' +
                                    '</div>' +
                                    '<div class="g-left col60 mar-left-20">' +
                                    '<i class="iconfont mar-right-5 g-font14">&#xe614;</i>' +
                                    '开立日期：' +
                                    '<span class="col33">' + M.timetrans(item.releaseDate) + '</span>' +
                                    '</div>' +
                                    '</div>' +
                                    '<div class="g-bottom-content">' +
                                    '<div class="g-left box1 col33">' +
                                    '<div class="clearBoth">' +
                                    '<div class="g-left top-text">兑付日期</div>' +
                                    '<div class="g-left maincol remaining">' +
                                    dateHtml +
                                    '</div>' +
                                    '</div>' +
                                    '<div class="g-font18 mar2">' + M.timetrans(item.maturityDate) + '</div>' +
                                    '</div>' +
                                    '<div class="g-left box3">' +
                                    '<div class="top-text">开立金额(元)</div>' +
                                    '<div class="g-font18 maincol mar3">' + M.getFormatNumber(item.billAmount, 2, '.', ',') + '</div>' +
                                    '</div>' +
                                    '<div class="g-left box7 ui-line">' +
                                    '<div class="line-green"></div>' +
                                    '<div class="line-line"></div>' +
                                    '<div class="line-red"></div>' +
                                    '</div>' +
                                    '<div class="g-left box2">' +
                                    '<div class="col60 top-text">' +
                                    '<span class="g-left">接收方：</span>' +
                                    '<span class="col33 txt g-left" title="' + item.receivingName + '">' + item.receivingName + '</span>' +
                                    '</div>' +
                                    '<div class="col60 mar1">' +
                                    '<span class="g-left">兑付方：</span>' +
                                    '<span class="col33 txt g-left" title="' + item.payerName + '">' + item.payerName + '</span>' +
                                    '</div>' +
                                    '</div>' +
                                    '<div class="g-left box5">' +
                                    '<div class="col60 g-text-center top-text">' + M.billIssue.statusFormat(item.status) +statusOperator+ '</div>' +
                                    '<div class="g-text-center mar1">' +
                                    '<a target="_blank" href="billIssueDetail.html?id='+ item.billNo +'">查看详情</a>' +
                                    '</div>' +
                                    '</div>' +
                                    '<div class="g-left box6">' +
                                    '<div class="g-text-center">' +
                                    checkHtml +
                                    '</div>' +
                                    '<div class="g-text-center mar6">' +
                                    goBack +
                                    '</div>' +
                                    '</div>' +
                                    '</div>' +
                                    '</div>';
                            }
                            M.billIssue.getPage(res, page, M('#page'));
                            M('.g-main-content').html(str);
                            M('.pageTotal').html(res.total);
                            M('.pageCount').html(res.pageCount);
                            if(M('#batchCheck').hasClass('js-active')) {
                                M('.js-check-all').show();
                            }
                            $('.notice-icon').mouseover(function(){
                                $(this).siblings('div.tips').addClass('show');
                            }).mouseout(function(){
                                $(this).siblings('div.tips').removeClass('show');
                            });
                            M(".g-tr-content").each(function () {
                                M(this).find(".g-number-dropdown").hover(function () {
                                    M(this).siblings(".g-number-dropdown-content").show();
                                }, function () {
                                    M(this).siblings(".g-number-dropdown-content").hide();
                                });
                            });
                        }

                    },
                    error: function (res) {
                        console.log(res);
                    }
                });
            },
            //分页
            getPage: function (data, page, obj) {
                M.ui.page.init({
                    container: obj[0],
                    total: data.total,
                    items: M.billIssue.pageSize,
                    number: M.billIssue.pageSize,
                    entries: 2,
                    isInput: true,
                    isText: false,
                    current: page - 1,
                    callback: function (that) {
                        M.billIssue.getTableData(this.ops.current + 1)
                    }
                });
            },
        })(function () {
            M.billIssue.init();
        });
    }
)
