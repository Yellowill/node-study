require(['head','menu','base','tab','page'],
    function(){
        M.define('billDetail',{
            head:M.ui.head.init(),
            init:function(){
                M.ui.menu.init({
                    index:[],
                    url:M.getNormalPath('getMenu.json',4),
                    callback: function() {
                    }
                });
                this.base = M.static.init();
                this.getDate();
            },

            getDate: function(){
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


                if (localStorage.bill && localStorage.userInfo) {
                    var bill = own.fetch('bill');
                    var user = own.fetch('userInfo');
                    $('#createDate').html($.getDateScope('days', 0));
                    $('#createCompany').html(bill.payerName);
                    $('#receivingCompany').html(bill.receivingName);
                    $('#createTaxNum').html(bill.payerTaxNum);
                    $('#recevTaxNum').html(bill.receivingTaxNum);
                    $('#createNum').html('<span class="maincol">'+$.getFormatNumber(bill.amountMoney, 2)+'</span>&nbsp;&nbsp;<span class="col60"> ( '+$.getChineseNumber(bill.amountMoney)+' )</span>');
                    $('#cashDate').html(bill.expirationTimeStr);
                    $('#createMember').html(user.userName);
                    $('.contractName').html(bill.contractName);
                    $('.contractNumber').html(bill.remark);
                    var uploadStr = '';
                    for (var i=0;i<bill.contracts.length;i++) {
                        var file = bill.contracts[i];
                        uploadStr += '<div class="upload-wrap g-left mar-right-20 mar-top-5"><i class="iconfont upload"></i><a href="javascript:;" onclick="M.downloadFileXhr('+"'"+file.fileAddress+"'"+','+"'"+file.fileName+"'"+')">'+ file.fileName +'</a></div>'
                    }
                    $('#upload-con').html(uploadStr);
                    var str = '';
                    for (var i=0; i<bill.invoiceInfos.length; i++) {
                        var invoice = bill.invoiceInfos[i];
                        str += '<tr>'+
                        '<td class="g-text-center">'+ invoice.invoiceCode +'</td>'+
                            '<td class="g-text-center">'+ invoice.invoiceNumber +'</td>'+
                            '<td class="g-text-center">'+invoice.billingDate+'</td>'+
                            '<td class="g-text-center">'+ invoice.taxRate*100 +'%</td>'+
                            '<td class="g-text-center maincol">'+ M.getFormatNumber(invoice.amountTax, 2) +'</td>'+
                        '<td class="g-text-center">'+invoice.purchaserName+'<br>'+
                            invoice.salesName+
                            '</td>'+
                            '<td class="g-text-center"><a class="underline" href="javascript:;" onclick="M.downloadFileXhr('+"'"+invoice.fileAddress+"'"+','+"'"+invoice.fileName+"'"+')">下载</a></td>'+
                        '</tr>'
                    }
                    $('.g-table-detail tbody').html(str);
                }


            },



        })(function(){
            M.billDetail.init();
        });
    }
)
