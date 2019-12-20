require(['signMessage','head','menu','base','tab','page','status'],
    function(signMessage){
        M.define('transferContract',{
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
                var id = M.getUrlParam('id');

                M.ajaxFn({
                    url: $.interfacePath.bill + 't/findDebts/list',
                    type: 'post',
                    data: {
                        transferApplyId: id,
                    },
                    dataType: 'json',
                    success: function (res) {
                        // console.log(res);


                            if(res.success) {
                                var bill = res.data;
                                $('.batchNo').html(bill.financeTransferApply.batchNo)
                                $('.contractNumber').html(bill.financeTransferApply.contractNumber)
                                $('#transferSide').html(bill.financeTransferApply.transferorLegalName)
                                $('#transferCode').html(bill.transferorBusinessCreditNo)
                                $('#transTaxNum').html(bill.transferotTaxNum)
                                $('#receiveSide').html(bill.financeTransferApply.transfereeLegalName)
                                $('#receiveCode').html(bill.transfereeBusinessCreditNo)
                                $('#receiveTaxNum').html(bill.transfereeTaxNum)
                                $('#totalNum').html(M.getFormatNumber(bill.sumHoldAmount, 2))
                                $('#cn_totalNum').html(bill.sumHoldAmountStr)
                                $('#transferNum').html(M.getFormatNumber(bill.sumAccpetAmount, 2))
                                $('#cn_transferNum').html(bill.sumAccpetAmountStr)
                                $('#paySign').html(bill.transferorSgin)
                                $('#receiveSign').html(bill.transfereeSgin)

                                if (bill.debtsBillDTOList && bill.debtsBillDTOList.length !== 0) {
                                    var str = '';
                                    for (var i=0; i<bill.debtsBillDTOList.length; i++ ) {
                                        var item = bill.debtsBillDTOList[i];
                                        var index = i+1;
                                        str += '<tr>'+

                                            '<td align="center">'+ index +'</td>'+
                                            '<td align="center">'+ item.billNo +'</td>'+
                                            '<td align="center">'+ item.payerName +'</td>'+
                                            '<td align="center">'+ M.getFormatNumber(item.holdAmount) +'</td>'+
                                            '<td align="center">'+ $.getFormatNumber(item.accpetAmount, 2) +'</td>'+
                                            '<td align="center">'+ $.timetrans(item.maturityDate) +'</td>'+
                                            '</tr>'
                                    }
                                    M('#list-content').append(str);
                                }


                            }

                    },
                    error: function (err) {
                        console.log(err)
                    }
                });

            },


        })(function(){
            M.transferContract.init();
        });
    }
)
