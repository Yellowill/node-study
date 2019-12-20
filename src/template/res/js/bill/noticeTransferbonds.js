require(['head', 'menu', 'base', 'tab', 'page'],
    function () {
        M.define('noticeTransferbonds', {
            head: M.ui.head.init(),
            init: function () {
                M.ui.menu.init({
                    index: [0, 2],
                    url: M.getNormalPath('getMenu.json', 4),
                    callback: function () {
                    }
                });
                this.base = M.static.init();
                this.getDate();
                this.getTableData(1);
                this.pageSize = 10;
            },

            getDate: function () {
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

                //----------------添加查询事件--------------------
                M('.ui-search-button').click(function(event) {
                    M.noticeTransferbonds.getTableData(1);
                });
            },

            getTableData: function (page) {
                var transferorCompanyName = M("#transferorCompanyName").val();
                var transfereeCompanyName = M('#transfereeCompanyName').val();
                var billNo = M('#billNo').val();
                M.ajaxFn({
                    // url: 'http://10.60.36.160:8008/api/bill/t/financeOwnRecord/list',
                    url: M.interfacePath.bill + 't/TransferNotice/list',
                    type: 'post',
                    data: {
                        "pageNum": page,
                        "pageSize": M.noticeTransferbonds.pageSize,
                        "payerName": transferorCompanyName,
                        "transfereeCompanyName": transfereeCompanyName,
                        "billNo": billNo
                    },
                    dataType: 'json',
                    contentType: 'application/json',
                    success: function (data) {
//                        console.log(data);
                        var str = '';
                        if (!data.success) {
                            M.ui.waiting.creat({
                                status:false,
                                time:1000,
                                text:data.message,
                                hide:false,
                            });
                            return ;
                        };
                        if(data.data == null || data.success == false || data.data.length ==0){
                            var noData = '<td colspan="6"><div class="noData"><img src="../../template/res/images/empty.png" alt=""><div class="col60 mar-top-10">暂无记录</div></div></td>';
                            M('.notice-tbody-content').html(noData);
                            M.noticeTransferbonds.getPage(data, page, M('#page'))
                            M('.pageTotal').html(data.total);
                            M('.pageCount').html(data.pageCount);
                        }else if(data.success&&data.data.length!=0){
                            for (var i = 0; i < data.data.length; i++) {
                                var item = data.data[i];

                                var unreadHtml = item.status == '00' ? '<i class="iconfont unread">&#xe60c;</i>':'';
                                str += '<tr>' +
                                    '<td class="g-text-center">' + item.billNo + '</td>' +
                                    '<td class="g-text-center nameTxt" title="'+ item.payerName +'">' +
                                    item.payerName +
                                    '</td>' +
                                    '<td class="g-text-center nameTxt" title="'+ item.transfereeCompanyName +'">' +
                                    item.transfereeCompanyName +
                                    '</td>' +
                                    '<td class="maincol g-text-center">' +
                                    M.getFormatNumber(item.amount, 2, '.', ',') +
                                    '</td>' +
                                    '<td class="g-text-center">' +
                                    M.timetrans(item.createDate) +
                                    '</td>' +
                                    '<td class="g-text-center">' +
                                    '<a target="_blank" href="noticeTransferDetail.html?noticeId='+ item.id +'">' +
                                    '查看详情' +
                                    '</a>' +
                                    unreadHtml +
                                    '</td>' +
                                    '</tr>';
                            }
                            M.noticeTransferbonds.getPage(data, page, M('#page'))
                            M('.notice-tbody-content').html(str);
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
                    items: M.noticeTransferbonds.pageSize,
                    number: M.noticeTransferbonds.pageSize,
                    entries: 2,
                    isInput: true,
                    isText: false,
                    current: page - 1,
                    callback: function (that) {
                        M.noticeTransferbonds.getTableData(this.ops.current + 1)
                    }
                });
            }

        })(function () {
            M.noticeTransferbonds.init();
        });
    }
)
