require(['head','menu','base','tab','page', 'calendar','plupload', 'fuzzy', 'status'],
    function(){
        M.define('financingAdd',{
            head:M.ui.head.init(),
            init:function(){
                // M.ui.menu.init({
                //     index:[],
                //     url:M.getNormalPath('getMenu.json',4),
                //     callback: function() {
                //
                //     }
                // });
                var urlInfo=window.location.href;
                var applicationId =  M.getUrlParam('applicationId');
                // applicationId = "FTB-RZ-20181128-JK002";
                this.applicationId = applicationId;
                this.factorselectapplyinfo();
                this.getFinancList();
                $('.ui-detail-btn-confirm').off('click').on('click',this.next)
            },
            //融资信息
            factorselectapplyinfo:function(){
                var reqData = this.applicationId;
                M.ajaxFn({
                    url:$.interfacePath.bill+'/t/financingRecord/query',
                    data:{acceptCode:reqData},
                    type:'POST',
                    dataType:'JSON',
                    success:function(data,args){
                        if(typeof data!='object'){
                            data = JSON.parse(data)
                        }
                        data = JSON.parse(data.data);

                        // if (1) {
                        //     var btn = '<button id="pdfPrint" class="ui-button ui-btn-sm ui-btn-grey">下载合同</button>';
                        //     M('#print-wrap').html(btn);
                        //     //pdf Print
                        //     M('#pdfPrint').bind('click', function () {
                        //         M.financingAdd.downLoad();
                        //     });
                        // }

                        if(data.result === '1'){
                            $('.js-customer-id').text(data.resultData.customerId?data.resultData.customerId:'--');
                            $('.js-customer-name').text(data.resultData.customerName?data.resultData.customerName:'--');
                            $('.js-financing-name').text(data.resultData.bankName?data.resultData.bankName:'--');
                            $('.js-financing-no').text(data.resultData.applicationId?data.resultData.applicationId:'--');
                            $('.js-financing-type').text(data.resultData.source === '28'?'通宝':'--');
                            $('.js-loan-money').text(data.resultData.billMoney?$.getFormatNumber(data.resultData.billMoney.toFixed(2)):'--');
                            $('.js-financing-rate').text(data.resultData.totalInterest?$.getFormatNumber(data.resultData.totalInterest.toFixed(2)):'--');
                            $('.js-rec-money').text(data.resultData.refundableAmount?$.getFormatNumber(data.resultData.refundableAmount.toFixed(2)):'--');
                            if(data.resultData.financeStatus != '30'){
                                $('.ui-detail-btn-confirm').addClass('ui-detail-btn-return').off('click');
                                // $.ui.status.init({
                                //     html:'加签已完成'
                                // });
                            }
                        }
                    },
                    error:function(msg){}
                })
            },

            // //下载合同
            // downLoad: function() {
            //
            // },

            //通宝列表信息
            getFinancList:function(){
                var that = this;
                var reqData = this.applicationId;
                M.ajaxFn({
                    url:$.interfacePath.bill +'/t/factorselectapplyinfo/query',
                    data:{acceptCode:reqData},
                    type:'POST',
                    dataType:'json',
                    success:function(data,args){
                        if(data){
                            if($.parseJSON(data)){
                                data = JSON.parse(data)
                            }
                            data = JSON.parse(data.data);
                            if(data.result === '1'){
                                that.creatTable(data.applyInfoList)
                            }
                        }else{
                            M.ui.waiting.creat({
                                status:true,
                                time:1000,
                                text:data.message,
                                hide:false
                            });
                        }
                    },
                    error:function(msg){
                        console.log(msg)
                    }
                })
            },
            next:function(){
                location.href='confirm'
            },
            creatTable:function(data){
                var str ='';
                for(var i=0;i<data.length;i++){
                    str += '<tr style="border-bottom: 1px solid #f0f0f0">\
							<td width="9%" class="g-text-center"><div class="g-table-nowrap" title='+data[i].ownRecordId+'>'+data[i].ownRecordId+'</div></td>\
							<td width="9%" class="g-text-center">'+$.getFormatNumber((data[i].holdAmount).toFixed(2))+'</td>\
							<td width="9%" class="g-text-center"><div class="g-table-nowrap" title='+data[i].payerName+'>'+data[i].payerName+'</div></td>\
							<td width="11%" class="g-text-center">'+data[i].expirationTimeStr+'</td>\
							<td width="8%" class="g-text-center">'+$.getFormatNumber((data[i].actualPayAmount).toFixed(2))+'</td>\
							<td width="11%" class="g-text-center">'+$.getFormatNumber((data[i].ftbInterest).toFixed(2))+'</td>\
							<td width="9%" class="g-text-center">'+$.getFormatNumber((data[i].holdAmount - data[i].payAmount).toFixed(2))+'</td>\
							<td width="9%" class="g-text-center">'+data[i].calInterestDays+'</td>\
						</tr>';
                }
                $('.js-table').html(str)
                this.scrollX();
            },
            scrollX:function(){
                $.ui.scroll.init({
                    scrollbar:{
                        enabled:true,
                        place:true,
                        style:{
                            marginLeft:0,
                            marginRight:0,
                            marginTop:0,
                            marginBottom:0,
                            size:8
                        }
                    },
                    direction:'x',
                    container:$('.js-scroll'),
                    mousewheel:true,
                    tableSeparate:false,
                    mouseWheelSpeed:20,
                    callback:function(o){},
                    onScroll:function(){},
                    resize:function(){}
                })
            }

        })(function(){
            M.financingAdd.init();
        });
    }
)
