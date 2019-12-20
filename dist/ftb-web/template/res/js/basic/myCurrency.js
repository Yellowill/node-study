require(['head', 'menu', 'base', 'tab', 'page', 'status','confirm'],
    function () {
        M.define('myCurrency', {
            head: M.ui.head.init(),
            init: function () {
                M.ui.menu.init({
                    index: [3,0],
                    url: M.interfacePath.privilege+'/t/rms/getMenuListByMemberForRf',
                    callback: function () {
                       // console.log(this);
                    }
                });
                this.base = M.static.init();
                this.pageSize = 10;
                this.getDate();
                this.getTableData(1);
            },

            getDate: function () {
                var that = this;
                M(document).on('click', '.viewDetail', function () {
                    var index = $('.viewDetail').index($(this));
                    var select = that.list[index];
                    // own.save('currencyDetail', select);
                    // var selectStr=JSON.stringify(that.list[index])
                    // sessionStorage.setItem('currencyDetail',selectStr)
                })
                // ----------------条件查询--------------------
                M('.ui-search-button').click(function () {
                    M.myCurrency.getTableData(1);

                });
                M('.alldate').click('on', function () {
                    M('#dateFormat').val('');
                    M.myCurrency.getTableData(1);
                });
                M('.onemonth').click('on', function () {
                    M('#dateFormat').val('30');
                    M.myCurrency.getTableData(1);
                });
                M('.threemonth').click('on', function () {
                    M('#dateFormat').val('90');
                    M.myCurrency.getTableData(1);
                });
                M('.oneyear').click('on', function () {
                    M('#dateFormat').val('365');
                    M.myCurrency.getTableData(1);
                });
                M('.in-tabs').on('click', 'li', function () {
                    M(this).find('a').addClass('active');
                    M(this).siblings().find('a').removeClass('active');

                })
                M('#openbillexc').on('click', function() {
                    M.myCurrency.openbillexc(1);
                })
            },

            getTableData: function (page, timeStart, timeEnd, payerName) {
                var that = this;
                var dateFormat =  M('#dateFormat').val();
                var tbNum = M('.tbNum').val();
                var payerName = M('#payer').val();
                var startTime;
                var endTime;
                if(dateFormat != ''){
                    startTime = $.getDateScope('days',0);
                    endTime = $.getDateScope('days',parseInt(dateFormat));
                }
                M.ajaxFn({
                    url: $.interfacePath.bill +'t/myfinanceBill/list',
                    type: 'post',
                    data: {
                        "pageNum": page,
                        "pageSize": M.myCurrency.pageSize,
                        "payerName": payerName,
                        "billNo":tbNum,
                        releaseDateStart: startTime,
                        releaseDateEnd:endTime,
                    },
                    dataType: 'json',
                    contentType: 'application/json',
                    success: function (data) {
                       // console.log(data);
                        that.list = data.data;
                        if (data.data == null || data.success == false||data.data.length ==0){
                            var noData = '<td colspan="10"><div class="noData"><img src="../../template/res/images/empty.png" alt=""><div class="col60 mar-top-10">暂无记录</div></div></td>';
                            M('.billIssue-tbady-content').html(noData);
                            M.myCurrency.getPage(data, page, M('#page'))
                            M('.pageTotal').html(data.total);
                            M('.pageCount').html(data.pageCount);
                        }else if(data.success && data.data.length!=0){
                            var str = '';
                            for (var i = 0; i < data.data.length; i++) {
                                var item = data.data[i];

                                var clearAmount = item.clearAmount ? M.getFormatNumber(item.clearAmount, 2, '.', ',') : '0.00';

                                if (own.fetch('userInfo').comId ==  item.receivingId) {
                                    str += '<tr>' +
                                        '<td class="g-text-center">' +
                                        '<a target="_blank" href="../bill/billIssueDetail.html?id=' + item.billNo + '">' + item.billNo + '</a>' +
                                        '</td>' +
                                        '<td class="g-text-center nameTxt"><span title="'+ item.payerName +'">' + item.payerName + '</span></td>' +
                                        '<td class="maincol g-text-center">' + M.getFormatNumber(item.amount, 2, '.', ',') + '</td>' +
                                        '<td class="maincol g-text-center">' + M.getFormatNumber(item.lockAmount, 2, '.', ',') + '</td>' +
                                        '<td class="maincol g-text-center">' + clearAmount + '</td>' +
                                        '<td class="g-text-center">' + item.statusName + '</td>' +
                                        '<td class="g-text-center">' + M.timetrans(item.maturityDate) + '</td>' +
                                        '<td class="g-text-center">' + '<a class="viewDetail" target="_blank" href="currencyDetail.html?id=' + item.id + '">' + '查看详情' + '</a>' +
                                        '</td>' +
                                        '</tr>';
                                }else {
                                    str += '<tr>' +
                                        '<td class="g-text-center">' +
                                        '<span>' + item.billNo + '</span>' +
                                        '</td>' +
                                        '<td class="g-text-center nameTxt"><span title="'+ item.payerName +'">' + item.payerName + '</span></td>' +
                                        '<td class="maincol g-text-center">' + M.getFormatNumber(item.amount, 2, '.', ',') + '</td>' +
                                        '<td class="maincol g-text-center">' + M.getFormatNumber(item.lockAmount, 2, '.', ',') + '</td>' +
                                        '<td class="maincol g-text-center">' + clearAmount + '</td>' +
                                        '<td class="g-text-center">' + item.statusName + '</td>' +
                                        '<td class="g-text-center">' + M.timetrans(item.maturityDate) + '</td>' +
                                        '<td class="g-text-center">' + '<a class="viewDetail" target="_blank" href="currencyDetail.html?id=' + item.id + '">' + '查看详情' + '</a>' +
                                        '</td>' +
                                        '</tr>';
                                }
                            }
                            M.myCurrency.getPage(data, page, M('#page'))
                            M('.billIssue-tbady-content').html(str);
                            M('.pageTotal').html(data.total);
                            M('.pageCount').html(data.pageCount);
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
                    items: M.myCurrency.pageSize,
                    number: M.myCurrency.pageSize,
                    entries: 1,
                    isInput: true,
                    isText: false,
                    current: page - 1,
                    callback: function (that) {
                        M.myCurrency.getTableData(this.ops.current + 1)
                    }
                });
            },
            //导出
            openbillexc: function(page, timeStart, timeEnd, payerName) {
                M.ui.confirm.init({
                    html:'您是否导出EXCEL',
                    drag: false,
                    button:[
                        {
                            href:null,
                            html:'确认',
                            callback:function(){

                                var that = this;
                                var dateFormat =  M('#dateFormat').val();
                                var tbNum = M('.tbNum').val();
                                var payerName = M('#payer').val();
                                var startTime;
                                var endTime;
                                if(dateFormat != ''){
                                    startTime = $.getDateScope('days',0);
                                    endTime = $.getDateScope('days',parseInt(dateFormat));
                                }

                                var waiting = M.ui.waiting.creat({
                                    status:'loading',
                                    hide:true
                                });

                                M.ajaxFn({
                                    url:$.interfacePath.bill+'t/myBill/exportExec',
                                    type: 'post',
                                    data: {
                                        "pageNum": page,
                                        "pageSize": M.myCurrency.pageSize,
                                        "payerName": payerName,
                                        "billNo":tbNum,
                                        releaseDateStart: startTime,
                                        releaseDateEnd:endTime,
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

        })(function () {
            M.myCurrency.init();
        });
    }
)
