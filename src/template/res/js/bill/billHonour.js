require(['head', 'menu', 'base', 'tab', 'page', 'calendar', 'status'],
    function () {
        M.define('billHonour', {
            head: M.ui.head.init(),
            init: function () {
                M.ui.menu.init({
                    index: [0, 3],
                    url: M.getNormalPath('getMenu.json', 4),
                    callback: function () {

                    }
                });
                this.base = M.static.init();
                this.acceptanceDate=M.getUrlParam('acceptanceDate');
                this.status = 10
                this.pageSize = 10;
                this.isSearch = true;
                this.flag=false;
                this.getData();
                this.getTableData(1);
                this.queryData();
                M('#opens').bind('click',function(){
                    M('#othersc').toggle()
                });
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
                /*----------------------------日历结束-----------------------------------------------*/
                M('.in-tabs').on('click', 'li', function () {
                    M(this).find('a').addClass('active');
                    M(this).siblings().find('a').removeClass('active');

                })
            },
            queryData:function(){
                M(".all").click(function(){
                    M.billHonour.status = 10;
                    M.billHonour.getTableData(1);
                    M('.totalAmountName').text('总兑付金额：');
                });
                M(".not").click(function(){
                    M.billHonour.status = 30;
                    M.billHonour.getTableData(1);
                    M('.totalAmountName').text('待兑付金额：');
                });
                M(".ready").click(function(){
                    M.billHonour.status = 50;
                    M.billHonour.getTableData(1);
                    M('.totalAmountName').text('已兑付金额：');
                });

                M('.ui-search-button').click(function () {

                    M.billHonour.isSearch = true;
                    M.billHonour.flag=true;

                    M('.date-all').siblings('li').children('a').removeClass('active');
                    M('.date-all').children('a').addClass('active');
                    M.billHonour.getTableData(1);
                });

                M('.date-all').click(function () {
                    M.billHonour.isSearch = false;
                    M.billHonour.flag=true;
                    M.billHonour.getTableData(1, 10);
                });

                M('.date-month').click(function () {
                    M.billHonour.isSearch = false;
                    M.billHonour.flag=true;
                    M.billHonour.getTableData(1, 20);
                });

                M('.date-three').click(function () {
                    M.billHonour.isSearch = false;
                    M.billHonour.flag=true;
                    M.billHonour.getTableData(1, 30);
                });

                M('.date-half').click(function () {
                    M.billHonour.isSearch = false;
                    M.billHonour.flag=true;
                    M.billHonour.getTableData(1, 40);
                });

            },
            getTableData: function (page,dateSort) {
                var that=this
                var tbNum = M('.tbNum').val();
                var startTime = '';
                var endTime = '';
                if (M.billHonour.isSearch) {
                    startTime = M('#js-calender-start').val();
                    endTime = M('#js-calender-stop').val();

                }else {
                    switch (dateSort) {
                        case 10:
                            startTime = '';
                            endTime = '';
                            break;
                        case 20:
                            startTime = M.getDateScope('days',0);
                            endTime = M.getDateScope('days',30);;
                            break;
                        case 30:
                            startTime = M.getDateScope('days',0);
                            endTime = M.getDateScope('days',90);
                            break;
                        case 40:
                            startTime = M.getDateScope('days',0);
                            endTime = M.getDateScope('days',365);
                            break;
                        default:
                            break;
                    }

                }

                if(that.acceptanceDate && !M.billHonour.flag){
                    startTime=that.acceptanceDate
                    endTime=that.acceptanceDate
                }

                var status = M.billHonour.status;
                var financialInstitutionsName = M('.institution').val();

                M('.billIssue-main-content').html("");

                M.ajaxFn({
                    url: $.interfacePath.bill + 't/goldpayment/list',
                    type: 'post',
                    data: {
                            "receivName": financialInstitutionsName,
                            "billNo":tbNum,
                            "releaseDateStart":startTime,
                            "releaseDateEnd":endTime,
                            "pageNum": page,
                            "pageSize": M.billHonour.pageSize,
                            "statusList":status
                    },
                    dataType: 'json',
                    contentType: 'application/json',
                    success: function (data) {
//                        console.log(data);
                        var res = data.data;
                        if (data.success == false || res == null || res.length == 0) {
                            M('.totalAmount').text(0);
                            var noData = '<td colspan="6"><div class="noData"><img src="../../template/res/images/empty.png" alt=""><div class="col60 mar-top-10">暂无记录</div></div></td>';
                            M('.billIssue-main-content').html(noData);
                            M('.pageTotal').html(data.total);
                            M('.pageCount').html(data.pageCount);
                            M.billHonour.getPage(data, page, M('#page'));
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
                                str += '<tr>' +
                                    '<td class="g-text-center">' + item.billNo + '</td>' +
                                    '<td class="g-text-center nameTxt" title="'+ item.receivingName +'">' + item.receivingName + '</td>' +
                                    '<td class="g-text-center maincol">' + M.getFormatNumber(item.assetsAmount, 2, '.', ',') + '</td>' +
                                    '<td class="g-text-center">' + M.timetrans(item.maturityDate) + '</td>' +
                                    '<td class="g-text-center">' + remaining + item.statusOld + '</td>' +
                                    '<td class="g-text-center"><a target="_blank" href="honourDetail.html?payId=' + item.id + '">查看详情</a></td>' +
                                    '</tr>';
                            }
                            var totalAmount = res[0].notCash;
                            M('.billIssue-main-content').html(str);
                            M('.totalAmount').html(M.getFormatNumber(totalAmount, 2, '.', ','));

                            M.billHonour.getPage(data, page, M('#page'));
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
                    items: M.billHonour.pageSize,
                    number: M.billHonour.pageSize,
                    entries: 2,
                    isInput: true,
                    isText: false,
                    current: page - 1,
                    callback: function (that) {
                        M.billHonour.getTableData(this.ops.current + 1)
                    }
                });
            },

        })(function () {
            M.billHonour.init();
        });
    }
)
