require(['head', 'menu', 'base', 'tab', 'page', 'calendar', 'confirm', 'customDialog'],
    function () {
        M.define('assigneeBill', {
            head: M.ui.head.init(),
            init: function () {
                M.ui.menu.init({
                    index: [1, 1],
                    url: M.getNormalPath('getMenu.json', 4),
                    callback: function () {

                    }
                });
                var menuId = M.getMenuId('../bill/assigneeBill.html');
                this.getBtnPrivilege(menuId)
                this.hasQuickAccept = false;
                this.base = M.static.init();
                this.status = 0;
                this.dateSort = true;
                this.pageSize=10;
                this.sortCode = "15";
                this.getData();
                this.getTableData(1);
                this.queryData();

                M('.Js-Allcheck-Btn').bind('click',function(){
                    M.assigneeBill.quickAccept();
                });
                $('#checkall').unbind('click').bind('click', function(){
                    M.assigneeBill.allSelect();
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
                // M('#batchCheck').hide();
                M('.g-container').css('padding-bottom','0px');
                M('#batchCheck').removeClass('js-active');
                M('.js-manage-btn').html('一键受让');
                M('.js-check-all').hide();
                M('.js-all-approve').hide();
            },

            getBtnPrivilege: function(menuId) {
                M.buttonsPrivilege(menuId, function (data) {
                    if (!data || data.length == 0){
                        return;
                    }
                    for (var i = 0; i<data.length; i++) {
                        if (data[i].btnNo == "YJJS") {
                            M('.g-nav-content').append('<a id="batchCheck" href="javascript:;" class="ui-button-ghost g-nav-btn ui-btn-red"><i class="iconfont mar-right-5">&#xe6fa;</i><span class="js-manage-btn">一键受让</span></a>');
                            M.assigneeBill.hasQuickAccept = true;
                            M.assigneeBill.setBatchCheckShow();

                            //一键受让
                            M('#batchCheck').click('on', function ( ) {
                                var flag;
                                if(M('#batchCheck').hasClass('js-active')){
                                    M('.g-container').css('padding-bottom','0px');
                                    M('#batchCheck').removeClass('js-active');
                                    M('.js-manage-btn').html('一键受让');
                                    M('.js-check-all').hide();
                                    M('.js-all-approve').hide();
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
                                }else{
                                    M('#batchCheck').addClass('js-active');
                                    M('.g-container').css('padding-bottom','90px');
                                    M('.js-manage-btn').html('完成');
                                    M('.js-check-all').show();
                                    M('.js-all-approve').show();
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
                                }
                            })
                        }
                    }
                })
            },

            getData: function () {
                var that = this;
                // if (own.fetch('userInfo').fromWorkbench === true) {
                //     var userInfo = own.fetch('userInfo');
                //     userInfo.fromWorkbench = false;
                    // own.save('userInfo', userInfo);
                    this.status = 2;
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
                // }else {
                //     M.ui.tab.init({
                //         index: 0,
                //         button: $('.g-nav-tabs-li'),
                //         panel: $('.g-tab-main'),
                //         event: 'click',
                //         currentClass: 'active',
                //         url: null,
                //         data: null,
                //         callback: function () {
                //         },
                //         error: function () {
                //         }
                //     });
                // }

                M('.tip-box-icon').hover(function () {
                    $(this).children('div.tips').addClass('show');
                }, function () {
                    $(this).children('div.tips').removeClass('show');
                })

                /*---------------日历---------------------------------------*/
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
                        //console.log(this);
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
                        //console.log(this);
                    }
                }, this);
                /*----------------------------日历结束---------------------*/
                //时间排序
                M('.sort-group .date-sort').click(function(event) {
                    var dateSort = M.assigneeBill.sortCode;
                    if (dateSort == "15") {
                        M(this).find('i').addClass('g-180deg');
                        M(this).addClass('active');
                        dateSort = "10"
                    } else{
                        M(this).find('i').removeClass('g-180deg');
                        M(this).removeClass('active');
                        dateSort = "15"
                    }
                    M('.sort-group .price-sort').find('i').removeClass('g-180deg');
                    M.assigneeBill.sortCode = dateSort;
                    M.assigneeBill.getTableData(1);
                });
                // ----------------条件查询--------------------
                M('.ui-search-button').click(function (event) {
                    M.assigneeBill.getTableData(1);
                });

            },
            //一键受让
            quickAccept: function() {

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
                        html:'您未选择通宝，是否受让全部？',
                        button:[
                            {
                                href:null,
                                html:'确认',
                                callback:function(){
                                    var transfereeName = M(".pdright28").val();
                                    var createDateStart = M("#js-calender-start").val();
                                    var createDateEnd = M("#js-calender-stop").val();

                                    var waiting = M.ui.waiting.creat({
                                        status:'loading',
                                        hide:true,
                                    });

                                    M.ajaxFn({
                                        url:$.interfacePath.bill+'t/transfer/toConfirm',
                                        type: 'post',
                                        data: {
                                            transferorName: transfereeName,
                                            createDateStart: createDateStart,
                                            createDateEnd: createDateEnd,
                                        },
                                        dataType: 'json',
                                        contentType: 'application/json',
                                        success: function (res) {
                                            M.ui.waiting.dismiss();
                                            if (res.success) {
                                                var data = res.data;
                                                if (data) {
                                                    M.ui.waiting.creat({
                                                        status:true,
                                                        time:1000,
                                                        text:res.message,
                                                        hide:false
                                                    });
                                                    M.assigneeBill.hideCheckStatus();
                                                    M.assigneeBill.getTableData(1);
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
                                            M.ui.waiting.dismiss();
                                        }
                                    });
                                }
                            }
                        ]
                    });
                } else {
                    M.ui.confirm.init({
                        html:'是否受让已选中通宝？',
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
                                        url:$.interfacePath.bill+'t/transfer/conditions/toConfirm',
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
                                                    M.assigneeBill.hideCheckStatus();
                                                    M.assigneeBill.getTableData(1);
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


            //是否显示一键受让
            setBatchCheckShow: function() {
                if (M.assigneeBill.status == 2 && M.assigneeBill.hasQuickAccept) {
                    M('#batchCheck').show();
                } else {
                    M.assigneeBill.hideCheckStatus();
                    M('#batchCheck').hide();
                }

            },

            //状态格式化
            statusFormat: function (data) {
                var type = null;
                if (data == 0) {
                    type = '新增';
                } else if (data == 20) {
                    type = '待签收';
                } else if (data == 30) {
                    type = '已签收';
                } else if (data == 40) {
                    type = '平台驳回';
                }else if (data == 45) {
                    type = '已驳回';
                }else if(data == 99){
                    type = '已撤销';
                }
                return type;
            },
            queryData:function(){
                M(".all").click(function(){
                    M.assigneeBill.status = 0;
                    M.assigneeBill.getTableData(1);
                    M.assigneeBill.setBatchCheckShow();
                });
                M(".wait").click(function(){
                    M.assigneeBill.status = 2;
                    M.assigneeBill.getTableData(1);
                    M.assigneeBill.setBatchCheckShow();
                });
                M(".ready").click(function(){
                    M.assigneeBill.status = 3;
                    M.assigneeBill.getTableData(1);
                    M.assigneeBill.setBatchCheckShow();
                });
                M(".reject").click(function(){
                    M.assigneeBill.status = 4;
                    M.assigneeBill.getTableData(1);
                    M.assigneeBill.setBatchCheckShow();
                });
            },
            getTableData: function (page,status) {
                var that = this;
                var status = M.assigneeBill.status;
                var sortCode = M.assigneeBill.sortCode;
                var transfereeName = M(".pdright28").val();
                var statusObj = "";
                var createDateStart = M("#js-calender-start").val();
                var createDateEnd = M("#js-calender-stop").val();

                switch (status) {

                    case 2:
                        statusObj = "20";
                        break;
                    case 3:
                        statusObj = "30";
                        break;
                    case 4:
                        statusObj = "45";
                        break;
                    default:
                        statusObj = "";
                }
                M.ajaxFn({
                    url: M.interfacePath.bill+'t/financeTransferEnterApply/list',
                    type: 'post',
                    data: {
                        pageNum: page,
                        pageSize:M.assigneeBill.pageSize,
                        orderBy: sortCode,
                        transferorName: transfereeName,
                        status:statusObj,
                        createDateStart: createDateStart,
                        createDateEnd: createDateEnd,
                    },
                    dataType: 'json',
                    contentType: 'application/json',
                    success: function (data) {
//                        console.log(data);
                        if(data.data == null || data.success == false||data.data.length==0){
                            var noData = '<div class="noData"><img src="../../template/res/images/empty.png" alt=""><div class="col60 mar-top-10">暂无记录</div></div>';
                            M('.g-main-content').html(noData);
                            M('.pageTotal').html(data.total);
                            M('.pageCount').html(data.pageCount);
                            M.assigneeBill.getPage(data, page, M('#page'));
                        }else if(data.success&&data.data.length!=0){
                            var str = '';
                            for (var i = 0; i < data.data.length; i++) {
                                var item = data.data[i];
                                var statusOperator = "";
                                if (item.status == 40||item.status == 45) {
                                    if(item.refuseReason != null){
                                        statusOperator = '<i class="iconfont notice-icon">&#xe797;</i><div class="tips tips-icon"><span class="triangle"></span><span class="icon-span">'+item.refuseReason+'</span></div>';
                                    }
                                };
                                if(item.hashCode==null){
                                    item.hashCode = '生成中...';
                                }
                                str += '<div class="g-tr-content">' +
                                    '<div class="g-top-content">' +
                                    '<div class="g-left col60 le">' +
                                    '<div class="ui-examinebottmo-left js-check-all" style="display:none"><div class="ui-examinebottmo-check"><span class="checkbox checkSingle" data-id="'+item.id+'"><i class="iconfont">&#xe74c;</i> </span></div></div>'+
                                    '<i class="iconfont  g-font18 movIcon">&#xe658;</i>' +
                                    '转让编号：' +
                                    '<span class="col33">' + item.batchNo + '</span>' +
                                    '</div>' +
                                    '<div class="g-left col60 ce">' +
                                    '<i class="iconfont mar-right-5 movIcon">&#xe611;</i>' +
                                    '<span class="g-number-dropdown">区块链存证编号</span>' +
                                    '<div class="g-number-dropdown-content">' +
                                    '<span class="triangle"></span>' + item.hashCode + '</div>' +
                                    '</div>' +
                                    '<div class="g-left col60 mar-left-20">' +
                                    '<i class="iconfont mar-right-5 g-font14">&#xe614;</i>' +
                                    '时间戳：' +
                                    '<span class="col33">' + (item.createDateRes == null ? '' : item.createDateRes) + '</span>' +
                                    '</div>' +
                                    '</div>' +
                                    '<div class="g-bottom-content">' +
                                    '<div class="g-left box1 col33">' +
                                    '<div class="clearBoth">' +
                                    '<div class="g-left top-text">转让金额(元)</div>' +
                                    '</div>' +
                                    '<div class="g-font18 maincol mar2 transferAmount">' + M.getFormatNumber(item.transferAmount, 2, '.', ',') + '</div>' +
                                    '</div>' +
                                    '<div class="g-left box3 col33">' +
                                    '<div class="top-text">转让日期</div>' +
                                    '<div class="g-font18  mar3">' + M.timetrans(item.createDate) + '</div>' +
                                    '</div>' +
                                    '<div class="g-left box7 ui-line">' +
                                    '<div class="line-green"></div>' +
                                    '<div class="line-line"></div>' +
                                    '<div class="line-red"></div>' +
                                    '</div>' +
                                    '<div class="g-left box2">' +
                                    '<div class="col60 top-text">' +
                                    '<span class="g-left">转出方：</span>' +
                                    '<span class="col33 txt g-left" title="'+ item.transferorName +'">' + item.transferorName + '</span>' +
                                    '</div>' +
                                    '<div class="col60 mar1">' +
                                    '<span class="g-left">受让方：</span>' +
                                    '<span class="col33 txt g-left" title="'+ item.transfereeName +'">' + item.transfereeName + '</span>' +
                                    '</div>' +
                                    '</div>' +
                                    '<div class="g-left box5">' +
                                    '<div class="col60 g-text-center top-text">' + M.assigneeBill.statusFormat(item.status)+ statusOperator + '</div>' +
                                    '<div class="none status">'+item.status+'</div>'+
                                    '<div class="none currId">'+item.id+'</div>'+
                                    '<div class="g-text-center mar1">' +
                                    '<a target="_blank" href="transferDetail.html?reviewAccept=true&id=' + item.id + '">查看详情</a>' +
                                    '</div>' +
                                    '</div>' +
                                    '<div class="g-left box6 operator">' + (item.status == '30' ? '<div class="g-text-center">' +
                                        '<a class="" href="contract.html?reviewAccept=true&id='+ item.id +'" target="_blank">协议查看</a>' +
                                        '</div>' : '')+
                                    '</div>' +
                                    '</div>' +
                                    '</div>';
                            };

                            var waitStatus = '<div class="g-text-center">' +
                                '               <a class="ui-button ui-btn-bt ui-btn-red receive" href="javascript:;">接受</a> ' +
                                '              </div> ' +
                                '               <div class="g-text-center  mar-top-10"> ' +
                                '                  <a class=" ui-btn-red bohui maincol" href="javascript:;">驳回</a> ' +
                                '                </div>';


                            M('.g-main-content').html(str);
                            M('.pageTotal').html(data.total);
                            M('.pageCount').html(data.pageCount);
                            if(M('#batchCheck').hasClass('js-active')) {
                                M('.js-check-all').show();
                            }
                            M.assigneeBill.getPage(data, page, M('#page'));
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
                            $('.g-tr-content').each(function(){
                                var s = M(this).find('.status').text();
                                if(s == "20"){
                                    M(this).find(".operator").html(waitStatus);
                                };

                                var bohui =  M(this).find('.bohui');
                                bohui.click(function(){
                                    var ject =  M(this).parent().parent().parent().find('.currId').text();
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
                                                    url:M.interfacePath.bill+'t/financeTransferApply/refuse',
                                                    type:'post',
                                                    dataType:'json',
                                                    data:{
                                                        id:ject,
                                                        refuseReason:js_textarea
                                                    },
                                                    success:function(data){
//                                                        console.log(data);
                                                        var pageIndex = $('#page').find('span.current').text();
                                                        M.ui.waiting.creat({
                                                            status:true,
                                                            time:1000,
                                                            text:data.message,
                                                            hide:false
                                                        });
                                                        that.getTableData(pageIndex);

                                                    },
                                                    error:function(){

                                                    }
                                                });
                                                e.remove();
                                            });

                                        }
                                    });
                                });
                                var receive =  M(this).find('.receive');
                                receive.click(function(){
                                    var currId = M(this).parent().parent().parent().find('.currId').text();
                                    var currMoney = M(this).parent().parent().parent().find('.transferAmount').text();
                                    window.open(M.interfacePath.server +M.interfacePath.webApp+ '/template/bill/contract.html?id='+currId+'&money='+currMoney);
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
                    items: M.assigneeBill.pageSize,
                    number: M.assigneeBill.pageSize,
                    entries: 4,
                    isInput: true,
                    isText: false,
                    current: page - 1,
                    callback: function (that) {
                        M.assigneeBill.getTableData(this.ops.current + 1)
                        var flag;
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
                    }
                });
            }

        })
        (function () {
            M.assigneeBill.init();
        });
    }
)
