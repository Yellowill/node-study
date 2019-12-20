require(['signMessage','head','menu','base','tab','page','status'],
    function(signMessage){
        M.define('billConfirm',{
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
                this.payment = own.fetch('bill');

                M('.toPrev').click('on', function () {
                    var bill = own.fetch('bill');
                    if (bill.isQuick) {
                        var bill = own.fetch('bill');
                        bill.saveFlag = true;
                        own.save('bill',bill);
                        window.location.href = 'addBill.html?isQuick=1';
                    } else {
                        window.location.href = 'addBillTwo.html';
                    }
                })
            },

            getDate: function(){
                var that =this;
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

                        var downloadStr = invoice.fileAddress ? '<td class="g-text-center"><a class="underline" href="javascript:;" onclick="M.downloadFileXhr('+"'"+invoice.fileAddress+"'"+','+"'"+invoice.fileName+"'"+')">下载</a></td>' : '<td class="g-text-center"></td>';

                        str += '<tr>'+
                            '<td class="g-text-center">'+ invoice.invoiceCode +'</td>'+
                            '<td class="g-text-center">'+ invoice.invoiceNumber +'</td>'+
                            '<td class="g-text-center">'+invoice.billingDate+'</td>'+
                            '<td class="g-text-center">'+ invoice.taxRate*100 +'%</td>'+
                            '<td class="g-text-center maincol">'+ M.getFormatNumber(invoice.amountTax, 2) +'</td>'+
                            '<td class="g-text-center">'+invoice.purchaserName+'<br>'+
                            invoice.salesName+
                            '</td>'+ downloadStr
                            +
                            '</tr>'
                    }
                    $('.g-table-detail tbody').html(str);
                }

                //提交
                that.isClick = false;
                that.signStatus = 0;
                $('.billSubmit').click(function () {

                    if (!that.isClick) {
                        that.isClick = true;

                        if (bill.isQuick) {
                            that.quickSubmit(that);
                        }  else {
                            that.ajaxSubmit(that);
                        }
                    }


                });

            },
            ajaxSubmit: function(that) {
                M.ajaxFn({
                    url:  $.interfacePath.assets +'t/assetsRegister/addMyPayment',
                    type: 'post',
                    data: that.payment,
                    dataType: 'json',
                    success: function (res) {
                        if ( res.success ) {
                            M.ui.waiting.creat({
                                status:true,
                                time:1000,
                                text:res.message,
                                hide:false,
                                callback: function () {

                                    own.removeKey('bill');
                                    window.location.href = 'billIssue.html';
                                }
                            });
                        }else {
                            that.isClick = false;
                            return M.ui.waiting.creat({
                                status:false,
                                time:1000,
                                text:res.message,
                                hide:false
                            });
                        }
                    },
                    error: function (err) {
                        console.log('err+'+err)
                    }
                })
            },


            quickSubmit: function (that) {
                M.ajaxFn({
                    url:  $.interfacePath.assets +'t/assets/quickCreateBill',
                    type: 'post',
                    data: that.payment,
                    dataType: 'json',
                    success: function (res) {
                        if ( res.success ) {
                            M.ui.waiting.creat({
                                status:true,
                                time:1000,
                                text:res.message,
                                hide:false,
                                callback: function () {

                                    own.removeKey('bill');
                                    window.location.href = 'billIssue.html';
                                }
                            });
                        }else {
                            that.isClick = false;
                            return M.ui.waiting.creat({
                                status:false,
                                time:1000,
                                text:res.message,
                                hide:false
                            });
                        }
                    },
                    error: function (err) {
                        console.log('err+'+err)
                    }
                })
            }



        })(function(){
            M.billConfirm.init();
        });
    }
)
