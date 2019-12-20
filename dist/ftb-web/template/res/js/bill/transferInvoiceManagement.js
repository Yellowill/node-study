require(['head', 'menu', 'base', 'tab', 'page'],
    function () {
        M.define('billIssue', {
            head: M.ui.head.init(),
            init: function () {
                M.ui.menu.init({
                    index: [2, 3],
                    url: M.getNormalPath('getMenu.json', 4),
                    callback: function () {

                    }
                });
                this.base = M.static.init();
                this.getDate();
                this.getTableData();
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
                M.ui.page.init({
                    container: M('#page')[0],
                    total: 50,
                    items: 10,
                    number: 4,
                    entries: 1,
                    isInput: true,
                    isText: false,
                    current: 0,
                    callback: function (that) {
                    }
                });

            },

            //状态格式化
            statusFormat: function (data) {
                var type = null;
                if (data == 50) {
                    type = '验票成功';
                } else if (data == 51) {
                    type = '验票成功，购方不存在';
                } else if (data == 52) {
                    type = '验票成功，销方不存在';
                } else if (data == 53) {
                    type = '验票成功，购方和销方不存在';
                }
                return type;
            },

            getTableData: function () {
                M.ajaxFn({
                    // url: 'http://10.60.36.160:8008/api/bill/t/financeOwnRecord/list',
                    url: 'http://10.60.36.177:8081/t/invoice/list',
                    type: 'post',
                    data: {
                        "pageNum": 1,
                        "pageSize": 5,
                        "salesId": "C38412",
                        "purchaserId": "10001"
                    },
                    dataType: 'json',
                    contentType: 'application/json',
                    success: function (data) {
                        var str = '';
                        for (var i = 0; i < data.data.length; i++) {
                            var item = data.data[i];
                            str += '<tr>' +
                                '<td class="g-text-center">' +
                                item.invoiceNumber +
                                '<br>' +
                                item.invoiceCode +
                                '</td>' +
                                '<td class="maincol g-text-center">' +
                                M.getFormatNumber(item.totalAmount, 2, '.', ',') +
                                '</td>' +
                                '<td class="g-text-center">' +
                                M.getFormatNumber((item.totalAmount - item.totalTax), 2, '.', ',') +
                                '</td>' +
                                '<td class="g-text-center">' +
                                item.billingDate +
                                '</td>' +
                                '<td class="g-text-center">' +
                                item.taxRate +
                                '</td>' +
                                '<td class="g-text-center">' +
                                item.purchaserName +
                                '<br>' +
                                item.salesName +
                                '</td>' +
                                '<td class="g-text-center">' +
                                M.billIssue.statusFormat(item.checkStatus) +
                                '</td>' +
                                '<td class="g-text-center">' +
                                '<a href="">' +
                                '删除' +
                                '</a>' +
                                '&nbsp;' +
                                '<a href="">' +
                                '下载' +
                                '</a>' +
                                '</td>' +
                                '</tr>';
                        }
                        M.billIssue.getPage(data, page, M('#page'))
                        M('.billIssue-tbady-content').html(str);
                        M('.pageTotal').html(data.total);
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
                    items: 5,
                    number: 5,
                    entries: 1,
                    isInput: true,
                    isText: false,
                    current: page - 1,
                    callback: function (that) {
                        // that.setPage(that,data,this.ops.current);
                        M.invoiceManagement.getTableData(this.ops.current + 1, 5)
                    }
                });
            }

        })(function () {
            M.billIssue.init();
        });
    }
)
