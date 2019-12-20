require(['head', 'menu', 'base', 'tab', 'page', 'calendar', 'confirm'],
    function () {
        M.define('transferBill', {
            head: M.ui.head.init(),
            init: function () {
                M.ui.menu.init({
                    index: [1, 0],
                    url: M.getNormalPath('getMenu.json', 4),
                    callback: function () {
                    }
                });
                this.base = M.static.init();
                this.status = 0;
                this.dateSort = true;
                this.pageSize=10;
                this.sortCode = "15";
                this.payment = own.fetch('stff');
                this.getDate();
                this.getTableData(1);
                this.queryData();

            },

            getDate: function () {
                var that = this;
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

                /*--------------------日历----------------------------------*/
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

                //时间排序
                M('.sort-group .date-sort').click(function() {
                    debugger;
                    var dateSort = M.transferBill.sortCode;
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
                    M.transferBill.sortCode = dateSort;
                    M.transferBill.getTableData(1);
                });
                // ----------------条件查询--------------------
                M('.ui-search-button').click(function (event) {
                    M.transferBill.getTableData(1);
                });
            },
            queryData:function(){
                M(".all").click(function(){
                    M.transferBill.status = 0;
                    M.transferBill.getTableData(1);
                });
                M(".submit").click(function(){
                    M.transferBill.status = 7;
                    M.transferBill.getTableData(1);
                });
                M(".audited").click(function(){
                    M.transferBill.status = 1;
                    M.transferBill.getTableData(1);
                });
                M(".wait").click(function(){
                    M.transferBill.status = 2;
                    M.transferBill.getTableData(1);
                });
                M(".ready").click(function(){
                    M.transferBill.status = 3;
                    M.transferBill.getTableData(1);
                });
                M(".reject").click(function(){
                    M.transferBill.status = 4;
                    M.transferBill.getTableData(1);
                });
                M(".revoke").click(function(){
                    M.transferBill.status = 9;
                    M.transferBill.getTableData(1);
                });
            },
            //撤销
            Revoke:function(id){
                var that = this;
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
                                    url:$.interfacePath.bill+'t/revokeTransferApply/update',
                                    type: 'post',
                                    data: {
                                        "id": id,
                                    },
                                    dataType: 'json',
                                    contentType: 'application/json',
                                    success: function (data) {
                                        if (data.success) {
                                            // M.transferBill.getTableData(1);
                                            var pageIndex = $('#page').find('span.current').text();
                                            that.getTableData(pageIndex);
                                            M.ui.waiting.creat({
                                                status:true,
                                                time:3000,
                                                text:data.message,
                                                hide:false
                                            });
                                        }else {
                                            M.ui.waiting.creat({
                                                status:false,
                                                time:3000,
                                                text:data.message,
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
            //待审核撤销
            RevokeTwo:function(id){
                var that = this;
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
                                    url:$.interfacePath.bill+'t/revokeTransferApply/review',
                                    type: 'post',
                                    data: {
                                        "id": id,
                                    },
                                    dataType: 'json',
                                    contentType: 'application/json',
                                    success: function (data) {
                                        if (data.success) {
                                            // M.transferBill.getTableData(1);
                                            var pageIndex = $('#page').find('span.current').text();
                                            that.getTableData(pageIndex);
                                            M.ui.waiting.creat({
                                                status:true,
                                                time:1000,
                                                text:data.message,
                                                hide:false
                                            });
                                        }else {
                                            M.ui.waiting.creat({
                                                status:false,
                                                time:3000,
                                                text:data.message,
                                                hide:false
                                            });
                                        }
                                        // window.location.reload();
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
            getTableData: function (page,status) {
                var that = this;
                var sortCode = M.transferBill.sortCode;
                var createDateStart = M("#js-calender-start").val();
                var createDateEnd = M("#js-calender-stop").val();
                var transfereeName = M(".pdright28").val();

                var status = M.transferBill.status;

                var statusObj = "";

                switch (status) {
                    case 7:
                        statusObj = "00";
                        break;
                    case 1:
                        statusObj = "10";
                        break;
                    case 2:
                        statusObj = "20";
                        break;
                    case 3:
                        statusObj = "30";
                        break;
                    case 4:
                        statusObj = "40";
                        break;
                    case 9:
                        statusObj = "99";
                        break;
                    default:
                        statusObj = "";
                }
                M.ajaxFn({
                    url: M.interfacePath.bill+'t/financeTransferOutApply/list',
                    type: 'post',
                    data: {
                        pageNum: page,
                        pageSize: M.transferBill.pageSize,
                        orderBy: sortCode,
                        createDateStart: createDateStart,
                        createDateEnd: createDateEnd,
                        transfereeName: transfereeName,
                        status:statusObj
                    },

                    dataType: 'json',
                    contentType: 'application/json',
                    success: function (data) {
//                        console.log(data);
                        if (data.data == null || data.success == false||data.data.length ==0) {
                            var noData = '<div class="noData"><img src="../../template/res/images/empty.png" alt=""><div class="col60 mar-top-10">暂无记录</div></div>';
                            M('.g-main-content').html(noData);
                            M('.pageTotal').html(data.total);
                            M('.pageCount').html(data.pageCount);
                            M.transferBill.getPage(data, page, M('#page'));
                        }else if(data.success && data.data.length!=0){
                            var str = '';
                            if(data.data != null){
                                for (var i = 0; i < data.data.length; i++) {
                                    var item = data.data[i];
                                    var checkHtml = '';
                                    var statusOperator = "";
                                    if(item.status =="00"){
                                        checkHtml='<div class="g-text-center">' +
                                            '<a class="ui-button ui-btn-bt ui-btn-red receive" href="javascript:;">提交</a>' +
                                            '</div> <div class="g-text-center mar6">' +
                                            '<a class="ui-btn-red maincol"  href="javascript:;" onclick=\'M.transferBill.Revoke("' + item.id + '");\'>撤销</a> ' +
                                            '</div>'
                                    }else if(item.status =="10"){
                                        checkHtml='<div class="g-text-center">' +
                                            '<a class="ui-button ui-btn-bt ui-btn-red" href="javascript:;" onclick=\'M.transferBill.RevokeTwo("' + item.id + '");\'>撤销</a>' +
                                            '</div>'
                                    }else if(item.status =="30"){
                                        checkHtml='<div class="g-text-center">' +
                                            '<a class="" href="contract.html?review=true&id='+ item.id +'" target="_blank">协议查看</a>' +
                                            '</div>'
                                    }else if(item.status == "40"||item.status == "45"){
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
                                        '<i class="iconfont  g-font18 movIcon">&#xe658;</i>转让编号：' +
                                        '<span class="col33">' + item.batchNo + '</span>' +
                                        '</div>' +
                                        '<div class="g-left col60 ce">' +
                                        '<i class="iconfont mar-right-5 movIcon">&#xe611;</i>' +
                                        '<span class="g-number-dropdown">区块链存证编号</span>' +
                                        '<div class="g-number-dropdown-content">' +
                                        '<span class="triangle"></span>'+item.hashCode+'</div>' +
                                        '</div>' +
                                        '<div class="g-left col60 mar-left-20">' +
                                        '<i class="iconfont mar-right-5 g-font14">&#xe614;</i>' +
                                        '时间戳：<span class="col33">' + (item.createDateRes == null ? '' : item.createDateRes) + '</span>' +
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
                                        '<div class="col60 mar1">' + '<span class="g-left">受让方：</span>' +
                                        '<span class="txt g-left maincol receivingName" title="'+ item.transfereeName +'">' + item.transfereeName + '</span>' +
                                        '</div>' +
                                        '</div>' +
                                        '<div class="g-left box5">' +
                                        '<div class="col60 g-text-center top-text">'+item.statusName+statusOperator+'</div>' +
                                        '<div class="none status">'+item.status+'</div>'+
                                        '<div class="none currId">'+item.id+'</div>'+
                                        '<div class="g-text-center mar1">' +
                                        '<a target="_blank" href="transferDetail.html?review=true&id=' + item.id + '">查看详情</a>' +
                                        '</div>' +
                                        '</div>' +
                                        '<div class="g-left box6 operator">'+checkHtml+'</div>' +
                                        '</div>' +
                                        '</div>';
                                }

                                M.transferBill.getPage(data, page, M('#page'));
                                M('.g-main-content').html(str);
                                M('.pageTotal').html(data.total);
                                M('.pageCount').html(data.pageCount);
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

                                    var receive =  M(this).find('.receive');

                                    receive.click(function(){
                                        var currId = M(this).parent().parent().parent().find('.currId').text();
                                        var currMoney = M(this).parent().parent().parent().find('.transferAmount').text();
                                        var newWindow = window.open();
                                        M.ajaxFn({
                                            url: $.interfacePath.bill + 't/findDebts/list',
                                            type: 'post',
                                            data: {
                                                transferApplyId: currId,
                                            },
                                            dataType: 'json',
                                            success: function (res) {
                                                // console.log(res);
                                                that.info = res.data;
                                                if(res.data.debtsBillDTOList.length ==0){
                                                    //   var payerName = own.fetch('userInfo').comName;
                                                    //   var payerEnterprisesId = own.fetch('userInfo').comId;
                                                    that.payment.amountMoney=res.data.financeTransferApply.transferAmount;
                                                    that.payment.receivingName=res.data.financeTransferApply.transfereeName;
                                                    that.payment.transferApplyId=res.data.financeTransferApply.id;
                                                    that.payment.receivingEnterprisesId = res.data.financeTransferApply.transfereeId;
                                                    that.payment.receivingTaxNum = res.data.transfereeTaxNum;
                                                    var contracts = [];
                                                    for (var i=0; i<res.data.listDocumentsFiles.length; i++) {
                                                        var item = res.data.listDocumentsFiles[i];
                                                        var obj = {};
                                                        obj.fileAddress = item.fileAddress;
                                                        obj.format = item.fileFormat;
                                                        obj.fileName = item.fileName;
                                                        obj.size = item.fileSize;
                                                        contracts.push(obj)
                                                    }
                                                    that.payment.contracts = contracts;
                                                    that.payment.remark = res.data.financeTransferApply.businessNum;
                                                    own.save('stff', that.payment);
                                                    newWindow.location.href = 'billTransferThree.html?noprev='+'1'

                                                }else{
                                                    var url = 'contract.html?id='+currId+'&money='+currMoney;
                                                    newWindow.location.href = url;

                                                }

                                            },
                                            error: function (err) {
                                                console.log(err)
                                            }
                                        });

                                    });
                                });

                            }else{
                                M.ui.waiting.creat({
                                    status:false,
                                    time:1000,
                                    text:'未查询到数据！',
                                    hide:false
                                });
                            }
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
                    items: M.transferBill.pageSize,
                    number: M.transferBill.pageSize,
                    entries: 4,
                    isInput: true,
                    isText: false,
                    current: page - 1,
                    callback: function (that) {
                        M.transferBill.getTableData(this.ops.current + 1)
                    }
                });
            }

        })(function () {
            M.transferBill.init();
        });
    }
)
