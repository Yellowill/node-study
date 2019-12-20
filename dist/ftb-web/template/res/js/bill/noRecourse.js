require(['cfcaUtils','head', 'menu', 'base', 'tab', 'page', 'status'],
    function (cfcaUtils) {
        M.define('noRecourse', {
            head: M.ui.head.init(),
            init: function () {
                M.ui.menu.init({
                    index: [],
                    url: M.getNormalPath('getMenu.json', 4),
                    callback: function () {
                    }
                });
                var urlInfo=window.location.href;
                var applicationId =  M.getUrlParam('applicationId');
//                applicationId = "FTB-RZ-20190514-JK010";
                this.applicationId = applicationId;
                this.base = M.static.init();
                this.getDate();
                var p7SignOrgData = {};
                var now = new Date();
                var year = now.getFullYear()
                var month = now.getMonth()+1
                var days = now.getDate()
                $(".js-beginDate-year").html(year)
                $(".js-beginDate-month").html(month)
                $(".js-beginDate-day").html(days)
                var companyself = own.fetch('userInfo').comName;
                $(".companyself").html(companyself)
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

                //合同下载
                $('#printAllBut').unbind('click').bind('click',function(){
                    that.fileDownload();
                });

                this.getContractInfo();
                
              //提交
                that.isClick = false;
                that.signStatus = 0;
                that.signData = {};
                $('.citicContractSubmit').click(function () {
                	 //加签参数
                    if(!$(this).prev('label').children('input').prop('checked')){
                        M.ui.waiting.creat({
                            status:false,
                            time:1000,
                            text:'请勾选阅读条件！',
                            hide:false,
                        });
                        return;
                    }
                    if (!that.isClick) {
                        that.isClick = true;
//                        that.payment.originalData = '';
//                        that.payment.sgin = '';
                        $("#txtToSign").text(M.noRecourse.applicationId);
                        cfcaUtils.init(function () {
                        	cfcaUtils.SignP7OnClick();
                        }, that);
                        if($('#Signature').val() != ''){
                        	 $.ajaxFn({
                                 url:$.interfacePath.bill+'t/cfcaSign/contractMade',
                                 data:{
                                     applicationId:M.noRecourse.applicationId,
                                     p7SIGN: $('#Signature').val()
                                 },
                                 type:'POST',
                                 dataType:'JSON',
                                 contentType: 'application/json',
                                 success: function (data) {
                                	 var resData ={};
                                     if(data.success) {
                                    	 resData = data.data;
                                         $("#txtToSign").text(resData.signatureAttr);
                                         cfcaUtils.init(function () {
                                        	 cfcaUtils.SignOnClick();
                                         }, that);
                                     }else{
                                    	 M.ui.status.init({
                                             position: 'fixed',
                                             html: data.message,
                                             callback: function() {
                                                 // console.log('callback')
                                             },
                                             close: function () {

                                             }
                                         });
                                         return;
                                     }
                                     if($('#p7SignedData').val() != ''){
                                    	 $.ajaxFn({
                                             url:$.interfacePath.bill+'t/cfcaSign/contractDownload',
                                             data:{
                                                 applicationId:M.noRecourse.applicationId,
                                                 p7SignedData:$('#p7SignedData').val(),
                                                 contractNo:resData.contractNo,
                                                 hash: resData.signatureAttr,
                                                 cfcaid:resData.cfcaid
                                             },
                                             type:'POST',
                                             dataType:'JSON',
                                             contentType: 'application/json',
                                             success: function (data) {
                                                 if(data.success) {
                                                	 M.ui.waiting.creat({
                                                         status:true,
                                                         time:1000,
                                                         text:'操作成功',
                                                         hide:false,
                                                         callback: function () {
                                                             location.href='financingFinish.html';
                                                         }
                                                     });
                                                     return;
                                                 }else{
                                                	 M.ui.status.init({
                                                         position: 'fixed',
                                                         html: data.message,
                                                         callback: function() {
                                                             // console.log('callback')
                                                         },
                                                         close: function () {

                                                         }
                                                     });
                                                     return;
                                                 }
                                                 
                                             },
                                             error: function (res) {
                                                 $('#js-confirm').removeAttr("disabled");
                                             }
                                         });
                                     }
                                     
                                 },
                                 error: function (res) {
                                     $('#js-confirm').removeAttr("disabled");
                                 }
                             });
                        	
                        	
                        }
//                        if ( that.signStatus !== 2 ) {
//                            that.isClick = false;
//                        }
                    }


                });
            },

            getContractInfo:function(){
                var that = this;
                var reqData = this.applicationId;
                var noRecourseData={}
                $.ajaxFn({
                    url:$.interfacePath.bill+'t/hbzxyhpdfinfo/find',
                    data:{applicationId:reqData},
                    type:'POST',
                    dataType:'JSON',
                    success:function(data,args){
                        noRecourseData=data
                        var d=noRecourseData.data
                        // var s=that.DateChangeY(d.dueDate);
                        // var e=that.DateChangeY(d.dueDate);
                        if(d!=null){
                            M.noRecourse.p7SignOrgData = d;
                            var ts=M.timetrans_cn(d.dueDate)
                            $(".end-time").html(ts)
                            var t1=d.accountsReceivableArr
                            var t2=d.paymentInfoArr
                            // $('.js-beginDate-year').html(s[0]);
                            // $('.js-beginDate-month').html(s[1]);
                            // $('.js-beginDate-day').html(s[2]);
                            $(".full-name").html(d.customerName)
                            $(".companyself").html(d.customerName)
                            $(".billMoney").html(d.billMoney)
                            $(".bankName").html(d.bankName)
                            // $(".fenBank").html(d.accBank)

                            // $(".end-day").html(e[2])
                            // $(".end-month").html(e[1])
                            // $(".end-year").html(e[0])
                            $(".BLFeeRate").html(d.BLFeeRate)
                            $(".accName").html(d.accName)
                            $(".accNo").html(d.accNo)
                            $(".accBank").html(d.accBank)
                            $(".platformFeeRate").html(d.platformFeeRate)
                            $(".tbCode").html(d.TBCode)

                            var str1=""
                            var allmon=0
                            for(var i=0;i<t1.length;i++){
                                str1+='<div style="width: 100%;border-bottom: 1px solid;" class="tr clearBoth">\n' +
                                    '<div style="text-align:center;width: 12.5%;border-right:1px solid;height: 60px;line-height: 30px;float: left" class="td">'+(i+1)+'</div>\n' +
                                    '<div style="text-align:center;width: 12.5%;height: 60px;line-height: 30px;float: left;border-right:1px solid;" class="td tradeNo">'+t1[i].tradeNo+'</div>\n' +
                                    '<div style="text-align:center;width: 12.5%;border-right:1px solid;height: 60px;line-height: 30px;float: left" class="td pushName">'+t1[i].pushName+'</div>\n' +
                                    '<div style="text-align:center;width: 12.5%;border-right:1px solid;height: 60px;line-height: 30px;float: left" class="td invoiceCode">'+t1[i].invoiceCode+'</div>\n' +
                                    '<div style="text-align:center;width: 12.5%;border-right:1px solid;height: 60px;line-height: 30px;float: left" class="td invoiceNo">'+t1[i].invoiceNo+'</div>\n' +
                                    '<div style="text-align:center;width: 12.5%;height: 60px;line-height: 30px;float: left;border-right:1px solid;" class="td dateIssued">'+t1[i].dateIssued+'</div>\n' +
                                    '<div style="text-align:center;width: 12.5%;border-right:1px solid;height: 60px;line-height: 30px;float: left" class="td totalAmount">'+ M.getFormatNumber(t1[i].totalAmount) +'</div>\n' +
                                    '<div style="text-align:center;width: 12.5%;border-right:1px solid;height: 60px;line-height: 30px;float: left" class="td expriationTime">'+M.timetrans_cn(t1[i].expriationTime)+'</div>\n' +
                                    '</div>'
                                allmon+=parseFloat(t1[i].totalAmount);
                            }
                            if(t1.length>0){
                                $(".accountsReceivableArr").html(str1);
                                $(".allMoney").html(M.getFormatNumber(allmon));
                            }

                            var str2=""
                            for(var j=0;j<t2.length;j++){
                                str2+='<div style="width: 100%;border-bottom: 1px solid;" class="tr clearBoth">\n' +
                                    '<div style="text-align:center;width: 12%;border-right:1px solid;height: 60px;line-height: 30px;float: left" class="td">'+(j+1)+'</div>\n' +
                                    '<div style="text-align:center;width: 22%;height: 60px;line-height: 30px;float: left;border-right:1px solid;" class="td billId">'+t2[j].billId+'</div>\n' +
                                    '<div style="text-align:center;width: 22%;border-right:1px solid;height: 60px;line-height: 30px;float: left" class="td payerName">'+t2[j].payerName+'</div>\n' +
                                    '<div style="text-align:center;width: 22%;border-right:1px solid;height: 60px;line-height: 30px;float: left" class="td openAmount">'+t2[j].openAmount+'</div>\n' +
                                    '<div style="text-align:center;width: 22%;border-right:1px solid;height: 60px;line-height: 30px;float: left" class="td endDate">'+M.timetrans_cn(t2[j].endDate)+'</div>\n' +
                                    '</div>'

                            }
                            if(t2.length>0){
                                $(".paymentInfoArr").html(str2)
                                $(".rate").html(t2[0].rate)
                                $(".creditCode").html(t2[0].holderTaxId)
                            }
                        }




                    },
                    error:function(){}
                })
            },
            DateChangeY: function(string) {
                var s=string.split(' ')[0].split('-');
                return s
            },
            DateChangeH: function(string) {
                var s=string.split(' ')[1].split(':');
                return s
            },
            DateChangeC:function(string){
                var s=string.split(' ')[0].split('-');
                return s[0]+'年'+s[1]+'月'+s[2]+'日'
            },
            encryption:function(that){
                //加签参数
                if(!that.prev('label').children('input').prop('checked')){
                    M.ui.waiting.creat({
                        status:false,
                        time:1000,
                        text:'请勾选阅读条件！',
                        hide:false,
                    });
                    return;
                }
                M.noRecourse.addLotsTest();
            },

            addLotsTest:function(text){

                if (M('#js-confirm').attr("disabled") == "disabled") {
                    return;
                }

                $('#js-confirm').attr("disabled", "disabled");

                $.ajaxFn({
                    url:$.interfacePath.bill+'t/signJump',
                    data:{
                        applicationId:M.noRecourse.applicationId,
                        returnUrl: $.interfacePath.server +$.interfacePath.webApp+ "/template/bill/financingFinish.html?applicationId=" + M.noRecourse.applicationId,
                        callBackUrl:''
                    },
                    type:'POST',
                    dataType:'JSON',
                    contentType: 'application/json',
                    success: function (data) {
                        if(data.success) {
                            data = $.parseJSON(data.data);
                            var form = data.formStr;
                            $('.htmlSignView').html(form);
                        } else  {
                            $('#js-confirm').removeAttr("disabled");
                        }
                    },
                    error: function (res) {
                        $('#js-confirm').removeAttr("disabled");
                    }
                });


            },
            //timer处理函数
            SetRemainTime:function() {
                if (curCount <= 0) {
                    window.clearInterval(InterValObj);// 停止计时器
                    $('#printAllBut').removeAttr("disabled");
                    $('#timeCountDisplay').hide();
                }else {
                    curCount--;
                    $('#timeCountDisplay').show();
                    $("#timeCountDisplay").html("（" + curCount + "秒）");
                }
            },

            fileDownload: function(){

                if (M('#printAllBut').attr("disabled") == "disabled") {
                    return;
                }

                var reqData = M.noRecourse.applicationId;

                curCount = count;
                $('#printAllBut').attr("disabled", "disabled");
                InterValObj = window.setInterval(this.SetRemainTime, 1000); // 启动计时器，1秒执行一次
                $.ajaxFn({
                    url:$.interfacePath.bill+'t/uploadPDFinfo',
                    data:{applicationId:reqData},
                    type:'POST',
                    dataType:'JSON',
                    contentType: 'application/json',
                    success: function (data) {
                        if (data.success) {
                            data= $.parseJSON(data.data);
                            var fileAddr = data.fileAddr;
                            var fileName = data.fileName;
                            M.downloadFileXhr(fileAddr, '');
                        } else {
                            that.fileDownloadErr();
                        }
                    },
                    error: function (res) {
                        that.fileDownloadErr();
                    }
                });
            },

            fileDownloadErr: function () {
                M.ui.status.init({
                    drag: false,
                    title:'提示',
                    html:'下载失败，请重试',
                },this);
                curCount = 0;
            },
            
            
            


        })(function () {
            M.noRecourse.init();
        });
    }
)
