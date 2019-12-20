require(['head', 'menu', 'base', 'tab', 'page', 'calendar', 'status', 'confirm'],
    function () {
        M.define('billIssueReceipt', {
            head: M.ui.head.init(),
            init: function () {
                M.ui.menu.init({
                    index: [0, 3],
                    url: M.getNormalPath('getMenu.json', 4),
                    callback: function () {

                    }
                });
                this.base = M.static.init();
                this.status = 10;
                this.pageSize = 10;
                this.isSearch = true;
                this.getData();
                this.getTableData(1);
                this.queryData();
                M('#opens').bind('click',function(){
                    M('#othersc').toggle()
                });
                $(".institution").on("focus",function(){

                    $("#recName").hide()
                })
                $(".institution").on("blur",function(){
                    if(!$(this).val()){
                        $("#recName").show()
                    }

                })
                $("#recName").on("click",function(){
                    $(this).hide()
                    $(".institution").focus()
                })
            },

            getData: function () {
                M.ui.tab.init({
                    index: 0,
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
                var paymentStart = M.ui.calendar.init({
                    target: M('#js-payment-start'),
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
                            this.ops.relative.point = paymentStop;
                        }, this);
                    },
                    choose: function () {
                        //console.log(this);
                    }
                }, this);
                var paymentStop = M.ui.calendar.init({
                    target: M('#js-payment-stop'),
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
                            this.ops.relative.point = paymentStart;
                            this.ops.date.min = paymentStart.ops.date.select;
                        }, this);
                    },
                    choose: function () {
                        //console.log(this);
                    }
                }, this);
                /*----------------------------日历结束-----------------------------------------------*/
                M('.in-tabs').on('click', 'li', function () {
                    M(this).find('a').addClass('active');
                    M(this).siblings().find('a').removeClass('active');

                })

                M('.all-check').on('click', function () {
                    if (M(this).hasClass('active')) {
                        M(this).removeClass('active');
                        M('.billIssue-main-content>tr').removeClass('active');
                    } else {
                        M(this).addClass('active');
                        M('.billIssue-main-content>tr').addClass('active');
                    }
                })

                M('.g-table').on('click', '.table-tr', function (ev) {
                    if (M(this).hasClass('active')) {
                        M(this).removeClass('active');
                    } else {
                        M(this).addClass('active');
                    }
                    var selectedLen=M(this).parent().children("tr.table-tr.active").length
                    var totalLen=M(this).parent().children().length
                    if(selectedLen>=totalLen){
                        M(this).parent().prev().children().children().eq(0).addClass('active')
                    }else{
                        M(this).parent().prev().children().children().eq(0).removeClass('active')
                    }
                });

                M('#downloadSelect').on('click', function() {
                    M.billIssueReceipt.downloadSelect();
                })
                  M('#openbillexc').on('click', function() {
                                    M.billIssueReceipt.openbillexc();
                                })

                M('#downloadAll').on('click', function () {
                    M.billIssueReceipt.downloadAll();
                })
            },

            downloadSelect: function(){

                var selectIds = [];
                var tbNum = M('.tbNum').val();
                M('.billIssue-main-content').children('.table-tr').each(function(index, element){
                    if (M(this).is('.active')){
                        selectIds.push(M.getDataset(this).id);
                    }
                });

                if (selectIds.length == 0) {
                    // M.ui.waiting.creat({
                    //     status:false,
                    //     time:1000,
                    //     text:'请选择通宝',
                    //     hide:false,
                    // });
                    M.billIssueReceipt.downloadAll();
                    return;
                }

                M.ui.confirm.init({
                    html:'确定下载选中通宝开立凭证吗？',
                    drag: false,
                    button:[
                        {
                            href:null,
                            html:'确认',
                            callback:function(){
                                var waiting = M.ui.waiting.creat({
                                    status:'loading',
                                    hide:true
                                });
                                M.ajaxFn({
                                    url:$.interfacePath.bill+'t/openBill/downFileZip',
                                    type: 'post',
                                    data: {
                                        "ids": selectIds,
                                        "billNo":tbNum
                                    },
                                    dataType: 'json',
                                    contentType: 'application/json',
                                    success: function (res) {
                                        M.ui.waiting.dismiss();
                                        if (res.success) {
                                            var data = res.data;
                                            var zipUrl = data.zipUrl;
                                            var zipName = data.zipName;
                                            M.downloadFileXhr(zipUrl, zipName);
                                        }else {
                                            return  M.ui.waiting.creat({
                                                status:false,
                                                time:3000,
                                                text:res.message,
                                                hide:false,
                                            });
                                        }
                                    },
                                    error: function (res) {
                                        M.ui.waiting.dismiss();
                                    }
                                });
                            }
                        },
                        {
                            href:null,
                            html:'关闭',
                            callback:function(){
                                // $('body').css('height','auto');
                            }
                        }
                    ],
                    close: function () {
//                        console.log('close')
                    }
                });
            },

            downloadAll: function() {
                M.ui.confirm.init({
                    html:'您没有选择任何单据，是否下载全部？',
                    drag: false,
                    button:[
                        {
                            href:null,
                            html:'确认',
                            callback:function(){

                                var startTime = M('#js-calender-start').val();
                                var endTime = M('#js-calender-stop').val();
                                var tbNum = M('.tbNum').val();
                                var paymentStart = M('#js-payment-start').val();
                                var paymentEnd = M('#js-payment-stop').val();

                                var status = M.billIssueReceipt.status;
                                var financialInstitutionsName = M('.institution').val();
                                var tbNum = M('.tbNum').val();
                                var waiting = M.ui.waiting.creat({
                                    status:'loading',
                                    hide:true
                                });

                                M.ajaxFn({
                                    url:$.interfacePath.bill+'t/openBill/conditions/downFileZip',
                                    type: 'post',
                                    data: {
                                        "billNo":tbNum,
                                        "receivName": financialInstitutionsName,
                                        "maturityDateStart":startTime,
                                        "maturityDateEnd":endTime,
                                        "releaseDateStart": paymentStart,
                                        "releaseDateEnd": paymentEnd,
                                        "statusList":status
                                    },
                                    dataType: 'json',
                                    contentType: 'application/json',
                                    success: function (res) {
                                        M.ui.waiting.dismiss();
                                        if (res.success) {
                                            var data = res.data;
                                            var zipUrl = data.zipUrl;
                                            var zipName = data.zipName;
                                            M.downloadFileXhr(zipUrl, zipName);
                                        }else {
                                            return  M.ui.waiting.creat({
                                                status:false,
                                                time:3000,
                                                text:res.message,
                                                hide:false,
                                            });
                                        }
                                    },
                                    error: function (res) {
                                        M.ui.waiting.dismiss();
                                    }
                                });
                            }
                        },
                        {
                            href:null,
                            html:'关闭',
                            callback:function(){
                                // $('body').css('height','auto');
                            }
                        }
                    ],
                    close: function () {
//                        console.log('close')
                    }
                });
            },
            openbillexc: function() {
   M.ui.confirm.init({
                    html:'您是否导出EXCEL',
                    drag: false,
                    button:[
                        {
                            href:null,
                            html:'确认',
                            callback:function(){

                                var startTime = M('#js-calender-start').val();
                                var endTime = M('#js-calender-stop').val();

                                var paymentStart = M('#js-payment-start').val();
                                var paymentEnd = M('#js-payment-stop').val();
                                var tbNum = M('.tbNum').val();
                                var status = M.billIssueReceipt.status;
                                var financialInstitutionsName = M('.institution').val();

                                var waiting = M.ui.waiting.creat({
                                    status:'loading',
                                    hide:true
                                });

                                M.ajaxFn({
                                    url:$.interfacePath.bill+'t/openBill/exportExec',
                                    type: 'post',
                                    data: {
                                        "billNo":tbNum,
                                        "receivName": financialInstitutionsName,
                                        "maturityDateStart":startTime,
                                        "maturityDateEnd":endTime,
                                        "releaseDateStart": paymentStart,
                                        "releaseDateEnd": paymentEnd,
                                        "statusList":status
                                    },
                                    dataType: 'json',
                                    contentType: 'application/json',
                                    success: function (res) {
                                        M.ui.waiting.dismiss();
                                        if (res.success) {
                                            var data = res.data;
                                            var pathUrl = data.pathUrl;
                                            var pathName = data.pathName;
                                            M.downloadFileXhr(pathUrl, pathName);
                                        }else {
                                            return  M.ui.waiting.creat({
                                                status:false,
                                                time:3000,
                                                text:res.message,
                                                hide:false,
                                            });
                                        }
                                    },
                                    error: function (res) {
                                        M.ui.waiting.dismiss();
                                    }
                                });
                            }
                        },
                        {
                            href:null,
                            html:'关闭',
                            callback:function(){
                                // $('body').css('height','auto');
                            }
                        }
                    ],
                    close: function () {
//                        console.log('close')
                    }
                });
            },

            queryData:function(){
                M(".all").click(function(){
                    M.billIssueReceipt.status = 10;
                    M.billIssueReceipt.getTableData(1);
                });

                M('.ui-search-button').click(function () {
                    M.billIssueReceipt.isSearch = true;
                    M('.date-all').siblings('li').children('a').removeClass('active');
                    M('.date-all').children('a').addClass('active');
                    M.billIssueReceipt.getTableData(1);
                });
            },
            
            getTableData: function (page,dateSort) {
                if(M('.all-check').hasClass('active')){
                    M('.all-check').removeClass('active')
                }
                var startTime = M('#js-calender-start').val();
                var endTime = M('#js-calender-stop').val();
                var tbNum = M('.tbNum').val();
                var paymentStart = M('#js-payment-start').val();
                var paymentEnd = M('#js-payment-stop').val();


                var status = M.billIssueReceipt.status;
                var financialInstitutionsName = M('.institution').val();

                M('.billIssue-main-content').html("");

                M.ajaxFn({
                    url: $.interfacePath.bill + 't/goldpayment/list',
                    type: 'post',
                    data: {
                            "receivName": financialInstitutionsName,
                            "billNo":tbNum,
                            "maturityDateStart":startTime,
                            "maturityDateEnd":endTime,
                            "releaseDateStart": paymentStart,
                            "releaseDateEnd": paymentEnd,
                            "pageNum": page,
                            "pageSize": M.billIssueReceipt.pageSize,
                            "statusList":status
                    },
                    dataType: 'json',
                    contentType: 'application/json',
                    success: function (data) {
//                        console.log(data);
                        var res = data.data;
                        if (data.success == false || res == null || res.length == 0) {
                            M('.totalAmount').text(0);
                            var noData = '<td colspan="10"><div class="noData"><img src="../../template/res/images/empty.png" alt=""><div class="col60 mar-top-10">暂无记录</div></div></td>';
                            M('.billIssue-main-content').html(noData);
                            M('.pageTotal').html(data.total);
                            M('.pageCount').html(data.pageCount);
                            M.billIssueReceipt.getPage(data, page, M('#page'));
                        }
                        if(data.success && res !== null && res.length !== 0){
                            var str = '';
                            for (var i = 0; i < res.length; i++) {
                                var item = res[i];
                                var ddd = $.aTimeDifference(M.timetrans(item.maturityDate),$.currentDate());
                                var remaining = '';
                                if(item.status == 30&&ddd<=7){
                                    remaining = '<div class="maincol"><i class="iconfont mar-right-5 g-font14">&#xe614;</i><span class="timeDifference">剩' +ddd+ '天</span></div>';
                                };
                                str += '<tr class="table-tr" data-id="' + item.id +'">' +
                                    '<td class="check-box g-text-center">' +
                                        '<span>' + '<i class="iconfont">' + '&#xe74c;' + '</i>' + '</span>' +
                                    '</td>' +
                                    '<td class="g-text-center">' + item.billNo + '</td>' +
                                    '<td class="g-text-center nameTxt" title="'+ item.receivingName +'">' + item.receivingName + '</td>' +
                                    '<td class="g-text-center maincol">' + M.getFormatNumber(item.assetsAmount, 2, '.', ',') + '</td>' +
                                    '<td class="g-text-center">' + M.timetrans(item.releaseDate) + '</td>' +
                                    '<td class="g-text-center">' + M.timetrans(item.maturityDate) + '</td>' +
                                    '<td class="g-text-center">' + remaining + item.statusOld + '</td>' +
                                    '<td class="g-text-center"><a target="_blank" class="stopEvt" href="billIssueDetail.html?id=' + item.billNo + '">查看详情</a></td>' +
                                    '</tr>';
                            }
                            var totalAmount = res[0].notCash;
                            M('.billIssue-main-content').html(str);
                            M(".stopEvt").on("click",function (event){
                                event.stopPropagation()
                            })
                            M.billIssueReceipt.getPage(data, page, M('#page'));
                            M('.pageTotal').html(data.total);
                            M('.pageCount').html(data.pageCount);
                            M('.billIssue-main-content tr').each(function(){
                                var timeDifference=M(this).find('.timeDifference').text();
                                if(timeDifference == ''){
                                    M(this).find('.timeDifference').siblings('i').addClass('none');
                                }
                            });
                        }
                    },
                    error: function (res) {
//                        console.log(res);
                    }
                    
                });
            },
            //分页
            getPage: function (data, page, obj) {
                M.ui.page.init({
                    container: obj[0],
                    total: data.total,
                    items: M.billIssueReceipt.pageSize,
                    number: M.billIssueReceipt.pageSize,
                    entries: 2,
                    isInput: true,
                    isText: false,
                    current: page - 1,
                    callback: function (that) {
                        M.billIssueReceipt.getTableData(this.ops.current + 1)
                    }
                });
            },

        })(function () {
            M.billIssueReceipt.init();
        });
    }
)
