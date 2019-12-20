require(['head', 'menu', 'base', 'tab', 'page', 'status'],
    function () {
        M.define('financingContract', {
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
                // applicationId = "FTB-RZ-20181214-JK001";
                this.applicationId = applicationId;
                this.base = M.static.init();
                this.countDown = 10;
                this.getDate();
                // this.getTableData();
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
                M('#js-confirm').css('opacity','.5')
                M('#js-confirm').html('同意 ('+ 10 + 'S)');
                var timer = setInterval(function () {
                    that.countDown--;
                    M('#js-confirm').html('同意 ('+ that.countDown + 'S)');
                    if (that.countDown === 0){
                        clearInterval(timer)
                        M('#js-confirm').html('同意');
                        M('#js-confirm').css('opacity','1')
                    }
                },1000);

                //合同下载
                $('#printAllBut').unbind('click').bind('click',function(){
                    that.fileDownload();
                });

                this.getContractInfo();
                that.config = {
                    //product
                    "license" : "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",
                    //test
//					"license" : "MIIFawYJKoZIhvcNAQcCoIIFXDCCBVgCAQExDjAMBggqgRzPVQGDEQUAMIGxBgkqhkiG9w0BBwGggaMEgaB7Iklzc3VlciI6IigoLipPPeWkqeWogeivmuS/oea1i+ivleezu+e7ny4qKXsxfSkiLCJ2ZXJzaW9uIjoiMS4wLjAuMSIsInNvZnRWZXJzaW9uIjoiMy4xLjAuMCIsIm5vdGFmdGVyIjoiMjAyNS0wOC0wNyIsIm5vdGJlZm9yZSI6IjIwMTUtMDgtMDciLCJub0FsZXJ0IjoidHJ1ZSJ9oIIDRDCCA0AwggLloAMCAQICFF8lnNrMgrt+8wWzAHuLjsm9+bXyMAwGCCqBHM9VAYN1BQAwVTEmMCQGA1UEAwwd5aSp6K+a5a6J5L+h5rWL6K+VU00y55So5oi3Q0ExDjAMBgNVBAsMBVRPUENBMQ4wDAYDVQQKDAVUT1BDQTELMAkGA1UEBhMCQ04wHhcNMTQwOTI2MDc0NjA4WhcNMTUwOTI2MDc0NjA4WjAxMRgwFgYDVQQDDA9TaWduRVNBMjAxNDA5MjcxFTATBgNVBAoMDOWkqeivmuWuieS/oTBZMBMGByqGSM49AgEGCCqBHM9VAYItA0IABJYWeFLmIy9mTud+ai0LBeLoxhgnO6HcQGbsQhl4fveJzoVx0Cyzt/xvWY5y7l3qAwd59AbI+Im6Ftl/wAOShYmjggGzMIIBrzAJBgNVHRMEAjAAMAsGA1UdDwQEAwIGwDCBigYIKwYBBQUHAQEEfjB8MHoGCCsGAQUFBzAChm5odHRwOi8vWW91cl9TZXJ2ZXJfTmFtZTpQb3J0L1RvcENBL3VzZXJFbnJvbGwvY2FDZXJ0P2NlcnRTZXJpYWxOdW1iZXI9NUE0N0VDRjEwNTgwNEE1QzZBNUIyMjkyOUI3NURGMERGQkMwRDc5NjBXBgNVHS4EUDBOMEygSqBIhkZQb3J0L1RvcENBL3B1YmxpYy9pdHJ1c2NybD9DQT01QTQ3RUNGMTA1ODA0QTVDNkE1QjIyOTI5Qjc1REYwREZCQzBENzk2MG8GA1UdHwRoMGYwZKBioGCGXmh0dHA6Ly9Zb3VyX1NlcnZlcl9OYW1lOlBvcnQvVG9wQ0EvcHVibGljL2l0cnVzY3JsP0NBPTVBNDdFQ0YxMDU4MDRBNUM2QTVCMjI5MjlCNzVERjBERkJDMEQ3OTYwHwYDVR0jBBgwFoAUPYnGR8txhbDZO9ZIsInZ5/7v2tkwHQYDVR0OBBYEFEs77X+HgoaHoBKSsS7mACXYtREAMAwGCCqBHM9VAYN1BQADRwAwRAIgvbTXF8yNH5jsbG6r7XL5LEupJd8l8x9akz8rhO5XYYICIOg+hxn5F44N5+waqG+1Dbs6m9xiID83VkHnmptdMoR7MYIBRTCCAUECAQEwbTBVMSYwJAYDVQQDDB3lpKnor5rlronkv6HmtYvor5VTTTLnlKjmiLdDQTEOMAwGA1UECwwFVE9QQ0ExDjAMBgNVBAoMBVRPUENBMQswCQYDVQQGEwJDTgIUXyWc2syCu37zBbMAe4uOyb35tfIwDAYIKoEcz1UBgxEFAKBpMBgGCSqGSIb3DQEJAzELBgkqhkiG9w0BBwEwHAYJKoZIhvcNAQkFMQ8XDTE1MDgwNzE3MzAyM1owLwYJKoZIhvcNAQkEMSIEIBJeyebFtFcougN8kN5ifp/xrvvpdpJHPpvMi7oR2OSzMAwGCCqBHM9VAYItBQAERjBEAiD+AQLvSOXePUd9WHU5k8G3erod8GhQodK+GkEbvHh0vgIg4LEj7wpevBgJ88qrf/5HNTAeQP482Jb33xoGPFuj2Mw=",
                    exportKeyAble : false,
                    disableExeUrl : true
                };
            },

            getContractInfo:function(){
                var that = this;
                var reqData = this.applicationId;
                $.ajaxFn({
                    url:$.interfacePath.bill+'t/fincningapplySignfo/query',
                    data:{applicationId:reqData},
                    type:'POST',
                    dataType:'JSON',
                    success:function(data,args){
                        if(data.success){
                            $('#signInfos').val(data);
                            data=$.parseJSON(data.data);
                            var dd=data.appendix
                            if(dd.serviceFee!=null&&dd.serviceFee!=0){
                                M('#js-serve').show()
                            }else{
                                M('#js-serve').hide()
                            }
                            if(data.result==='1'){
                                if(dd){
                                    M('.jrxy-Num').html(dd.JRXY_number)
                                    M('.blsqs').html(dd.BLSQS_number)
                                    M('.djxy_number').html(dd.DJXY_number)
                                    M('.ptservice_number').html(dd.serviceNo)
                                    M('.yhrate').html(dd.YH_bankRate)
                                    M('.sxrate').html(dd.YH_serviceCharge)
                                    M('.js-addressAndPostCode').html(dd.OFFICE_ADDRESS);
                                    M('.js-personAndTelephone').html(dd.PHONE);
                                    M('.licen-address').html(dd.LICENSE_ADDRESS)
                                    M('.js-customerName').html(dd.customername);
                                    M('.hxcompany').html(dd.payerNames)
                                    M('.office-address').html(dd.OFFICE_ADDRESS)
                                    M('.office-phone').html(dd.PHONE)
                                    M('.licenseLegalRepresentative').html(dd.licenseLegalRepresentative)
                                    var t2=dd.result1;
                                    var t3=dd.result2;
                                    var t4=dd.result3
                                    var str5='',str7='',str8='';
                                    if(t2.length>0){
                                        for(var i=0;i<t2.length;i++){
                                            str5+='<tr>\
										<td align="center">'+t2[i].billId1+'</td>\
										<td align="center">'+t2[i].payerName1+'</td>\
										<td align="center">'+$.getFormatNumber(t2[i].openAmount1)+'</td>\
										<td align="center">'+t2[i].openDate1+'</td>\
										<td align="center">'+t2[i].expirationTime1+'</td>\
										</tr>'
                                        }
                                        $('.table5 tbody').html(str5);

                                    }
                                    if(t3.length>0){
                                        for(var i=0;i<t2.length;i++){

                                            str7+='<tr>\
										<td align="center">'+t3[i].ownRecordId2+'</td>\
										<td align="center">'+t3[i].payerName2+'</td>\
										<td align="center">'+$.getFormatNumber(t3[i].holdAmount2)+'</td>\
										<td align="center">'+t3[i].openDate2+'</td>\
										<td align="center">'+t3[i].expirationTime2+'</td>\
										</tr>'
                                        }
                                        $('.table7 tbody').html(str7);
                                    }
                                    M('.totalHoldAmount').html(dd.totalHoldAmount)
                                    M('.totalMoney').html(dd.totalMoney)
                                    M('.totalMoneybig').html(dd.TOTALMONEY)
                                    M('.bankRate').html(dd.bankRate)
                                    M('.serviceRate').html(dd.serviceRate)
                                    M('.settleAccount').html(dd.settleAccount)
                                    M('.totalMoneybz').html(dd.totalMoney+'元')
                                    M('.linkAddr').html(dd.linkAddr)
                                    M('.linkMan').html(dd.linkMan)
                                    M('.linkTel').html(dd.linkTel)
                                    M('.serviceFeeB').html(dd.SERVICEFEE)
                                    M('.serviceFee').html(dd.serviceFee)
                                    M('.billId').html(dd.repeatOwnRecordId)
                                    if(t4.length>0){
                                        for(var i=0;i<t4.length;i++){
                                            str8+='<tr>\
										<td align="center">'+t4[i].number+'</td>\
										<td align="center">'+t4[i].ownRecordId3+'</td>\
										<td align="center">'+t4[i].payAmount3+'</td>\
										<td align="center">'+t4[i].serviceRate3+'</td>\
										<td align="center">'+t4[i].serviceAmount3+'</td>\
										</tr>'
                                        }
                                        $('.table8 tbody').html(str8);
                                    }
                                    var date = new Date();
                                    M('.js-beginDate-year').html(date .getFullYear())
                                    M('.js-beginDate-month').html(date .getMonth()+1)
                                    M('.js-beginDate-day').html(date .getDate())

                                    $('#js-confirm').unbind('click').bind('click',function(){
                                        if (that.countDown !== 0) {
                                            M.ui.waiting.creat({
                                                status:false,
                                                time:1000,
                                                text: '请在 '+that.countDown+' 秒之后点击同意',
                                                hide:false,
                                                callback: function () {

                                                }
                                            });
                                        }else if (!M('#check-confirm').attr('checked')) {
                                            M.ui.waiting.creat({
                                                status:false,
                                                time:1000,
                                                text: '请确认勾选我已阅读',
                                                hide:false,
                                            });
                                        }else {
                                            that.encryption($(this));
                                        }
//                                    console.log($(this))

                                    })
                                }
                            }else{
                                $.ui.status.init({
                                    html:'获取数据失败!',
                                    callback:function(){
                                    }
                                })
                            }
                        }else{
                            M.ui.waiting.creat({
                                status:false,
                                time:1000,
                                text: data.message,
                                hide:false,
                            });
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
                M.financingContract.addLotsTest();
            },
            addLots:function(text){
                var reqData = {
                    signInfo:$("#signInfos").val(),
                    applicationId:sessionStorage.getItem('applicationId'),
                    signResult:text,
                    uCode:''
                }
                $.ui.ajax.init({
                    url:M.interfacePath.rzServer+'ftbFinance/ftbFinanceApplySign',
                    data:{reqData:JSON.stringify(reqData)},
                    type:'POST',
                    dataType:'json',
                    success:function(data,args){
                        data=$.parseJSON( data );
                        if(data.result==='1'){
                            $.ui.status.init({
                                html:'加签成功',
                                close:function(){
                                    open(' ', '_self').close()
//			  					window.location.href=panel.getContextPath()+'/financing/financingManager';
                                }
                            })
                        }else{
                            $.ui.status.init({
                                html:'加签失败',
                                close:function(){

                                }
                            })
                        }
                    },
                    error:function(msg){
                        $.ui.status.init({
                            html:'加签失败',
                            callback:function(){
                                console.log(msg)
                            }
                        })
                    }
                })
            },

            addLotsTest:function(text){

                if (M('#js-confirm').attr("disabled") == "disabled") {
                    return;
                }

                $('#js-confirm').attr("disabled", "disabled");

                $.ajaxFn({
                    url:$.interfacePath.bill+'t/signJump',
                    data:{
                        applicationId:M.financingContract.applicationId,
                        returnUrl: $.interfacePath.server +$.interfacePath.webApp+ "/template/bill/financingFinish.html?applicationId=" + M.financingContract.applicationId,
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
                            data = $.parseJSON(data.data)
                            M.ui.waiting.creat({
                                status:false,
                                time:1000,
                                text:data.msg,
                                hide:false,
                            });
                        }
                    },
                    error: function (res) {
                        $('#js-confirm').removeAttr("disabled");
                    }
                });

//                 var reqData = {
//                     signInfo:"众签加签",
//                     applicationId:this.applicationId,
//                     signResult:"众签加签结果",
//                     uCode:''
//                 }
//                 $.ui.ajax.init({
//                     url:M.interfacePath.rzServer+'/ftbFinance/ftbFinanceApplySign',
//                     data:{reqData:JSON.stringify(reqData)},
//                     type:'POST',
//                     dataType:'json',
//                     success:function(data,args){
//                         if(typeof data!='object'){
//                             data = JSON.parse(data)
//                         }
//                         if(data.result==='1'){
// //                            console.log(data.resultDesc);
//                             $('.htmlSignView').html(data.resultDesc);
//
// //						$.ui.status.init({
// //			  				 html:'加签成功',
// //			  				close:function(){
// //			  					open(' ', '_self').close();
// ////			  					window.location.href=panel.getContextPath()+'/financing/financingManager';
// //							}
// //			  			 })
//                         }else{
//                             $('.js-confirm').unbind('click').bind('click',function(){
//                                 that.encryption($(this)).bind(that);
//                             })
//                             $.ui.status.init({
//                                 html:'加签失败',
//                                 close:function(){
//
//                                 }
//                             })
//                         }
//                     },
//                     error:function(msg){
//                         $('.js-confirm').unbind('click').bind('click',function(){
//                             that.encryption($(this)).bind(that);
//                         })
//                         $.ui.status.init({
//                             html:'加签失败',
//                             callback:function(){
//                                 console.log(msg)
//                             }
//                         })
//                     }
//                 })
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

                var reqData = M.financingContract.applicationId;

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
                            M.downloadFileXhr(fileAddr, '');
                        } else {
                            M.financingContract.fileDownloadErr();
                        }
                    },
                    error: function (res) {
                        M.financingContract.fileDownloadErr();
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
            }


        })(function () {
            M.financingContract.init();
        });
    }
)
