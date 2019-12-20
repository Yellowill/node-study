require(['head','menu','base','tab','page', 'customDialog'],
    function(){
        M.define('honourDetail',{
            head:M.ui.head.init(),
            init:function(){
                M.ui.menu.init({
                    index:[],
                    url:M.getNormalPath('getMenu.json',4),
                    callback: function() {

                    }
                });
                this.base = M.static.init();
                this.payId = M.getUrlParam('payId');
                this.getDate();
                this.getTableData(1);
            },

            getDate: function(){
                var that = this;
                M.ui.tab.init({
                    index:0,
                    button:$('.g-nav-tabs-li'),
                    panel:$('.g-tab-main'),
                    event:'click',
                    currentClass:'active',
                    url:null,
                    data:null,
                    callback:function(){},
                    error:function(){}
                });
                //通宝兑付回单
                M(document).on('click', '#print-review', function () {

                    M.ui.customDialog.init({
                        drag: true,
                        width:1000,
                        height:520,
                        autoClose: false,
                        url: '../dialog/dialog-cashReceipt.html',
                        callback: function (e) {
                            M.ajaxFn({
                                url:$.interfacePath.bill+'t/financeBillCash/parameter',
                                type: 'post',
                                data: {
                                    billNo: M('.honour-no').text()
                                },
                                dataType: 'json',
                                contentType: 'application/json',
                                success:function(res){
//                                    console.log(res);
                                   if (res.success) {
                                       var data = res.data;
                                        M('#billNo').html(data.billNo);
                                        M('#releaseDate').html(M.timetrans(data.releaseDate).replace(/\-/g, '/'));
                                        M('#createName').html(data.payerLegalName);
                                        M('#createNum').html(M.getFormatNumber(data.billAmount)+' 元');
                                        M('#taxNumCreate').html(data.payerTaxNum);
                                        M('#cashTotalNum').html(M.getFormatNumber(data.cashAmount));
                                        M('#billAmount_cn').html(M.getChineseNumber(data.cashAmount));
                                        M('#revName').html(data.receiverLegalName);
                                        M('#taxNumRev').html(data.receiveTaxNum);
                                        M('#cashDate').html(data.maturityString);
                                        var numArr = M.getFormatNumber(data.cashAmount).replace(/\,|\./g, '').split('').reverse();
                                        for (var i=0;i<numArr.length; i++) {
                                            M(M('.num-bot')[i]).html(numArr[i]);
                                        }
                                        if (numArr.length < 11) {
                                            M(M('.num-bot')[numArr.length]).html('¥');
                                        }
                                       var str = '';
                                       var str2 = '';
                                       for (var i=0;i < data.mapList.length; i++) {
                                           var item = data.mapList[i];
                                           if (i%2 == 0) {
                                               str +=  '<tr>'+
                                                   '<td class="hd-holder line-num">'+ (i+1) +'</td>'+
                                                   '<td class="hd-holder own-member">'+ item.companyLegalName +'</td>'+
                                                   '<td class="hd-holder cash-num">'+ M.getFormatNumber(item.amount) +'</td>'
                                               '</tr>'
                                           }else {
                                               str2 +=  '<tr>'+
                                                   '<td class="hd-holder line-num">'+ (i+1) +'</td>'+
                                                   '<td class="hd-holder own-member">'+ item.companyLegalName +'</td>'+
                                                   '<td class="hd-holder cash-num">'+ M.getFormatNumber(item.amount) +'</td>'
                                               '</tr>'
                                           }
                                       }
                                        if (data.mapList.length > 0 && data.mapList.length%2 == 0 ) {
                                            M('#cashBody').html(str);
                                            M('#cashBody2').html(str2);
                                        }else if ( data.mapList.length > 0 && data.mapList.length%2 == 1 ) {
                                            str2 += '<tr>'+
                                            '<td class="hd-holder line-num"></td>'+
                                                '<td class="hd-holder own-member"></td>'+
                                                '<td class="hd-holder cash-num"></td>'+
                                                '</tr>';
                                            M('#cashBody').html(str);
                                            M('#cashBody2').html(str2);
                                        }
                                   }
                                },
                                error:function(){

                                }
                            });

                            M('.objection-btn-close').click(function () {
                                e.remove();
                            });
                            M('.objection-btn').click(function () {
                                M.ajaxFn({
                                    url:  $.interfacePath.bill +'t/financeBillCash/pdfPrint',
                                    type: 'get',
                                    data: {
                                        billNo: M('.honour-no').text()
                                    },
                                    dataType: 'json',
                                    success: function (res) {
//                                        console.log(res);
                                        if ( res.success ) {
                                            M.downloadFileXhr(res.data, '')
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
                                        console.log('err', err)
                                    }
                                });
                            });

                        }
                    });
                })
            },

            getTableData: function (page) {

                var id = M.honourDetail.payId;

                M.ajaxFn({
                    url: $.interfacePath.bill + 't/goldpayment/one',
                    type: 'post',
                    data: {
                        "id": id,
                        "pageNum": page,
                        "pageSize": 5,
                    },
                    dataType: 'json',
                    contentType: 'application/json',
                    success: function (data) {

                        var items = data.data

                        if (!items || items.length == 0) {
                            M('.honour-main-content').html("");
                            return;
                        }

                        var str = '';
                        for (var i = 0; i < items.length; i++) {
                            var item = items[i];

                            str += '<tr>' +
                                        '<td class="g-text-center">' + item.companyName + '</td>' +
                                        '<td class="g-text-center">' + M.getFormatNumber(item.amount, 2, '.', ',') + '</td>' +
                                    '</tr>';
                        }

                        M('.honour-main-content').html(str);

                        M('.honour-no').html(items[0].billNo);
                        M('.honour-amount').html(M.getFormatNumber(items[0].billAmount, 2, '.', ','));
                        M('.honour-date').html(M.timetrans(items[0].maturityDate));
                        M('.honour-rec').html(items[0].receivingName);

                        M.honourDetail.getPage(data, page, M('#page'));
                        M('.pageTotal').html(data.total);
                        M('.pageCount').html(data.pageCount);
                        if (items[0].status == '50' ) {
                            var btn = '<button class="ui-button ui-btn-lg ui-btn-red" id="print-review">打印预览</button>';
                            M('#print-wrap').append(btn)
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
                    items: 5,
                    number: 5,
                    entries: 2,
                    isInput: true,
                    isText: false,
                    current: page - 1,
                    callback: function (that) {
                        M.honourDetail.getTableData(this.ops.current + 1)
                    }
                });
            },



        })(function(){
            M.honourDetail.init();
        });
    }
)
