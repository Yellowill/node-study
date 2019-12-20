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
                            $('#js-topesa').val(data);
                            var d=data.appendix;
                            if(d.serviceFee!=null&&d.serviceFee!=0){
                                M('#js-serve').show()
                            }else{
                                M('#js-serve').hide()
                            }
                            var t=d.ftbBillDetailVos;
                            var str1='',str2='',str3='',str4='',str5='',str6='';
                            if(data.result==='1'){
                                $('.js-billMoney').html($.getFormatNumber(d.billMoney.toFixed(2)));
                                var len=d.contractNo.length
                                var oyjfContractNo='QYJF'+d.contractNo.substring(4,len);
                                $('.oyjf-contractNo').html(oyjfContractNo);
                                $('.js-contractNo').html(d.contractNo);
                                $('.js-billMoney-uppercase').html($.getChineseNumber(d.billMoney))
                                if(t.length>0){
                                    $('.js-holdAmountAll').html($.getFormatNumber(d.holdAmountAll.toFixed(2)));
                                    $('.js-holdAmountAll-uppercase').html($.getChineseNumber(d.holdAmountAll))
                                    $('.js-totalInterest').html($.getFormatNumber(d.totalInterest.toFixed(2)));
                                    $('.js-totalInterest-uppercase').html($.getChineseNumber(d.totalInterest))
                                    $('.js-customerName').html(d.customerName);
                                    $('.js-bankName').html(d.bankName);
                                    $('.js-baliBankNo').html(d.baliBankNo);
                                    $('.addressAndPostCode').html(d.addressAndPostCode)
                                    $('.linkMen').html(d.linkMan)
                                    $('.linkTel').html(d.linkTel)
                                    $('.serviceFeeS').html($.getChineseNumber(d.serviceFee))
                                    $('.serviceFeeB').html($.getFormatNumber(d.serviceFee.toFixed(2)));
                                    $('.yearrate').html($.getFormatNumber(d.tb_bl_rate,4))
                                    $('.sfinRate').html($.getFormatNumber(d.tb_bl_bank_fee.toFixed(2)))
                                    $('.bfinRate').html($.getChineseNumber(d.tb_bl_bank_fee))
                                    $('.sptRate').html($.getFormatNumber(d.tb_bl_service_fee.toFixed(2)))
                                    $('.bptRate').html($.getChineseNumber(d.tb_bl_service_fee))
                                    var s=that.DateChangeY(d.beginDate);
                                    var h=that.DateChangeH(d.beginDate);
                                    $('.js-beginDate-year').html(s[0]);
                                    $('.js-beginDate-month').html(s[1]);
                                    $('.js-beginDate-day').html(s[2]);
                                    $('.js-beginDate-hour').html(h[0]);
                                    $('.js-beginDate-minute').html(h[1]);
                                    $('.js-beginDate-second').html(h[2]);
                                    $('.js-accountNameBaoLi').html(d.accountNameBaoLi);
                                    $('.js-accountNoBaoLi').html(d.accountNoBaoLi);
                                    $('.js-accountBankBaoLi').html(d.accountBankBaoLi);
                                    $('.js-accountName').html(d.accountName);
                                    $('.js-accountNo').html(d.accountNo);
                                    $('.js-accountBank').html(d.accountBank);
                                    $('.js-contractName').html(d.contractName);
                                    $('.js-contractNumber').html(d.contractNumber);
                                    $('.js-addressAndPostCode').html(d.addressAndPostCode);
                                    $('.js-personAndTelephone').html(d.linkMan+'   '+d.linkTel);
                                    $('.js-rate').html(d.rate*100);
                                    $('.legalCustomerName').html(d.legalCustomerName)
                                    var t1=d.rzFtbInvoiceInfo02,t2=d.ftbBillDetailVos,t3=d.rzFtbInvoiceInfo01,t4=d.rzFtbApplyAttorneyInfos;
                                    // t4=d.rzFtbApplyAttorneyInfos
                                    if(t1.length>0){
                                        for(var i=0;i<t1.length;i++){
                                            str1+='<tr>\
										<td align="center">'+(i+1)+'</td>\
										<td align="center">'+t1[i].purchName+'</td>\
										<td align="center">'+t1[i].invoiceNo+'</td>\
										<td align="center">'+$.getFormatNumber(t1[i].totalAmount.toFixed(2))+'</td>\
										<td align="center">/</td>\
										</tr>'
                                        }
                                        $('.table1 tbody').html(str1);
                                        $('.js-totalAmount02').html($.getFormatNumber(d.totalAmount02.toFixed(2)));
                                    }
                                    if(t2.length>0){
                                        for(var i=0;i<t2.length;i++){
//                                        console.log($.getFormatNumber(t2[i].holdAmount))
                                            str2+='<tr>\
										<td align="center">'+(i+1)+'</td>\
										<td align="center">'+t2[i].ownRecordId+'</td>\
										<td align="center">'+d.customerName+'</td>\
										<td align="center">'+d.bankName+'</td>\
										<td align="center">'+$.getFormatNumber(t2[i].holdAmount.toFixed(2))+'</td>\
										<td align="center">'+that.DateChangeC(t2[i].expirationTime)+'</td>\
										<td align="center">'+$.getFormatNumber(t2[i].actualPayAmount.toFixed(2))+'</td>\
										<td align="center">'+that.DateChangeC(t2[i].createDate)+'</td>\
										<td align="center">'+that.DateChangeC(t2[i].endDate)+'</td>\
										<td align="center">'+$.getFormatNumber((t2[i].rate*100),4)+'</td>\
										<td align="center">'+t2[i].rateCalculateDesc+'</td>\
										</tr>';
                                            str6='<tr>\n' +
                                                '                                        <td style="padding:5px 10px; font-size: 22px; text-align: center;font-weight:bold;">应收账款债权凭证转让通知签收回执</td>\n' +
                                                '                                    </tr>\n' +
                                                '                                    <tr>\n' +
                                                '                                        <td style="padding:5px 10px;text-align:right;">编号：<span style=" min-width:200px; display:inline-block; line-height:1; padding:0 5px 5px; text-align:center; text-indent:0;">' + d.contractNo + '</span></td>\n' +
                                                '                                    </tr>\n' +
                                                '                                    <tr>\n' +
                                                '                                        <td style="padding:5px 15px; text-indent:2em;">&nbsp;</td>\n' +
                                                '                                    </tr>\n' +
                                                '                                    <tr>\n' +
                                                '                                        <td style="padding:5px 15px; text-indent:2em;">我司已于<span style="min-width:40px; display:inline-block; line-height:1; padding:0 5px 5px; text-align:center; text-indent:0;">' + s[0] + '</span>年<span  style="min-width:20px; display:inline-block; line-height:1; padding:0 5px 5px; text-align:center; text-indent:0;">' + s[1] + '</span>月<span style="min-width:20px; display:inline-block; line-height:1; padding:0 5px 5px; text-align:center; text-indent:0;">' + s[2] + '</span>日收悉你司向我司发送的编号为<span style="min-width:200px;border-bottom:1px solid #333; display:inline-block; line-height:1; padding:0 5px 5px; text-align:center; text-indent:0;">' + d.contractNo + '</span>的《应收账款债权凭证转让通知》，我公司谨确认已知晓该通知所载事项，并承诺将按上述通知要求在到期还款日（载明具体日期）前将通宝项下债权，即人民币<span style="min-width:100px;border-bottom:1px solid #333; display:inline-block; line-height:1; padding:0 5px 5px; text-align:center; text-indent:0;">' + $.getFormatNumber(t2[i].holdAmount) + '</span>元【大写：<span style="min-width:200px;border-bottom:1px solid #333; display:inline-block; line-height:1; padding:0 5px 5px; text-align:center; text-indent:0;">' + $.getChineseNumber(t2[i].holdAmount) + '</span>】，通过东方付通信息技术有限公司提供的资金清算功能，支付至上述通知指定的账户。</td>\n' +
                                                '                                    </tr>\n' +
                                                '                                    <tr>\n' +
                                                '                                        <td style="padding:5px 15px; text-indent:2em;">&nbsp;</td>\n' +
                                                '                                    </tr>\n' +
                                                '                                    <tr>\n' +
                                                '                                        <td style="padding:5px 15px; text-indent:2em;">&nbsp;</td>\n' +
                                                '                                    </tr>\n' +
                                                '                                    <tr>\n' +
                                                '                                        <td style="padding:5px 15px; text-indent:2em;">&nbsp;</td>\n' +
                                                '                                    </tr>\n' +
                                                '                                    <tr>\n' +
                                                '                                        <td style="padding:5px 15px; text-indent:2em;">&nbsp;</td>\n' +
                                                '                                    </tr>\n' +
                                                '                                    <tr>\n' +
                                                '                                        <td style="padding:5px 15px; text-indent:2em;">&nbsp;</td>\n' +
                                                '                                    </tr>\n' +
                                                '                                    <tr>\n' +
                                                '                                        <td style="padding:5px 15px; text-indent:2em; text-align:right;">公司：<span style=" min-width:100px; display:inline-block; line-height:1; padding:0 0px 5px; text-align:center; text-indent:0;">' + t2[i].payerName + '</span></td>\n' +
                                                '                                    </tr>\n' +
                                                '                                    <tr>\n' +
                                                '                                        <td style="padding:5px 15px; text-indent:2em; text-align:right;"><span class="js-beginDate-year">' + s[0] + '</span>年<span style="border-bottom:1px solid #333; min-width:20px; display:inline-block; line-height:1; padding:0 5px 5px; text-align:center; text-indent:0;">' + s[1] + '</span>月<span  style="border-bottom:1px solid #333; min-width:20px; display:inline-block; line-height:1; padding:0 5px 5px; text-align:center; text-indent:0;">' + s[2] + '</span>日</td>\n' +
                                                '                                    </tr>'
                                            str4+='<tr>\
							              <td style="padding:5px 10px; font-size: 22px; text-align: center;font-weight:bold;">应收账款债权凭证转让通知（通知开立方）</td>\
							            </tr>\
							            <tr>\
							              <td style="padding:5px 10px;text-align:right;">编号：<span style=" min-width:200px; display:inline-block; line-height:1; padding:0 5px 5px; text-align:center; text-indent:0;">'+d.contractNo+'</span></td>\
							            </tr>\
							            <tr>\
							              <td style="padding:5px 15px;"><span style="min-width:200px; display:inline-block; line-height:1; padding:0 5px 5px; text-align:center; text-indent:0;">'+t2[i].payerName+'</span>（以下简称“贵公司”）</td>\
							            </tr>\
							            <tr>\
							              <td style="padding:5px 15px; text-indent:2em;">&nbsp;</td>\
							            </tr>\
							            <tr>\
							              <td style="padding:5px 15px; text-indent:2em;"><span style="border-bottom:1px solid #333; min-width:200px; display:inline-block; line-height:1; padding:0 5px 5px; text-align:center; text-indent:0;">'+d.customerName+'</span>持有的贵公司开立的通宝编号为<span style="border-bottom:1px solid #333; min-width:200px; display:inline-block; line-height:1; padding:0 5px 5px; text-align:center; text-indent:0;">'+t2[i].ownRecordId+'</span>、到期日为<span style="border-bottom:1px solid #333; min-width:200px; display:inline-block; line-height:1; padding:0 5px 5px; text-align:center; text-indent:0;">'+that.DateChangeC(t2[i].expirationTime)+'</span>、金额为<span style="border-bottom:1px solid #333; min-width:200px; display:inline-block; line-height:1; padding:0 5px 5px; text-align:center; text-indent:0;">'+$.getFormatNumber(t2[i].holdAmount.toFixed(2))+'</span>的应收账款债权凭证，现<span style="border-bottom:1px solid #333; min-width:200px; display:inline-block; line-height:1; padding:0 5px 5px; text-align:center; text-indent:0;">'+d.customerName+'</span>已向欧冶商业保理有限责任公司（以下简称“本公司”）申请了保理融资业务，依法将通宝项下债权及相关其他权利一并转让给本公司。</td>\
							            </tr>\
							            <tr>\
							              <td style="padding:5px 15px; text-indent:2em;">请及时关注贵司债权人的变化，并请贵司在通宝到期日之前向本公司履行付款义务，收款账户如下：</td>\
							            </tr>\
							            <tr>\
							              <td style="padding:5px 15px; text-indent:2em;">户  名：<span style=" min-width:200px; display:inline-block; line-height:1; padding:0 5px 5px; text-align:center; text-indent:0;">'+d.accountNameBaoLi+'</span></td>\
							            </tr>\
							            <tr>\
							              <td style="padding:5px 15px; text-indent:2em;">账  号：<span style=" min-width:200px; display:inline-block; line-height:1; padding:0 5px 5px; text-align:center; text-indent:0;">'+d.accountNoBaoLi+'</span></td>\
							            </tr>\
							            <tr>\
							              <td style="padding:5px 15px; text-indent:2em;">开户行：<span style=" min-width:200px; display:inline-block; line-height:1; padding:0 5px 5px; text-align:center; text-indent:0;">'+d.accountBankBaoLi+'</span></td>\
							            </tr>\
							            <tr>\
							              <td style="padding:5px 15px; text-indent:2em;">本债权转让通知书自我司确认之日起即时生效，特此通知。</td>\
							            </tr>\
							            <tr>\
							              <td style="padding:5px 15px; text-indent:2em;">联系人：<span style=" min-width:200px; display:inline-block; line-height:1; padding:0 5px 5px; text-align:center; text-indent:0;">'+d.linkManBaoLi+'</span></td>\
							            </tr>\
							            <tr>\
							              <td style="padding:5px 15px; text-indent:2em;">联系方式：<span style=" min-width:200px; display:inline-block; line-height:1; padding:0 5px 5px; text-align:center; text-indent:0;">'+d.linkTelBaoLi+'</span></td>\
							            </tr>\
							            <tr>\
							              <td style="padding:5px 15px; text-indent:2em;">&nbsp;</td>\
							            </tr>\
							            <tr>\
							              <td style="padding:5px 15px; text-indent:2em; text-align:right;">欧冶商业保理有限责任公司</td>\
							            </tr>\
							            <tr>\
							              <td style="padding:5px 15px; text-indent:2em; text-align:right;"><span>'+s[0]+'</span>年<span style="border-bottom:1px solid #333; min-width:20px; display:inline-block; line-height:1; padding:0 5px 5px; text-align:center; text-indent:0;">'+s[1]+'</span>月<span style="border-bottom:1px solid #333; min-width:20px; display:inline-block; line-height:1; padding:0 5px 5px; text-align:center; text-indent:0;">'+s[2]+'</span>日</td>\
							            </tr>\
							            <tr>\
							              <td style="padding:5px 15px; text-indent:2em;">&nbsp;</td>\
							            </tr>\
							            <tr>\
							              <td style="padding:5px 15px; text-indent:2em;">&nbsp;</td>\
							            </tr>\
							            <tr>\
							              <td style="padding:5px 15px; text-indent:2em;">&nbsp;</td>\
							            </tr>\
							            <tr>\
							              <td style="padding:5px 15px; text-indent:2em;">&nbsp;</td>\
							            </tr>\
							            <tr>\
							              <td style="padding:5px 15px; text-indent:2em;">&nbsp;</td>\
							            </tr>\
							            <tr>\
							              <td style="padding:5px 15px; text-indent:2em; text-align:right;"><span style="min-width:100px; display:inline-block; line-height:1; padding:0 0px 5px; text-align:center; text-indent:0;">'+d.customerName+'</span></td>\
							            </tr>\
							            <tr>\
							              <td style="padding:5px 15px; text-indent:2em; text-align:right;"><span>'+s[0]+'</span>年<span style="border-bottom:1px solid #333; min-width:20px; display:inline-block; line-height:1; padding:0 5px 5px; text-align:center; text-indent:0;">'+s[1]+'</span>月<span style="border-bottom:1px solid #333; min-width:20px; display:inline-block; line-height:1; padding:0 5px 5px; text-align:center; text-indent:0;">'+s[2]+'</span>日</td>\
							            </tr>\
							            <tr>\
							              <td style="padding:5px 15px; text-indent:2em;">&nbsp;</td>\
							            </tr>\
							            <tr>\
							              <td style="padding:5px 15px; text-indent:2em;">&nbsp;</td>\
							            </tr>\
							            <tr>\
							              <td style="padding:5px 15px; text-indent:2em;">&nbsp;</td>\
							            </tr>\
							            <tr>\
							              <td style="padding:5px 15px; text-indent:2em;">&nbsp;</td>\
							            </tr>\
							            <tr>\
							              <td style="padding:5px 15px; text-indent:2em;">&nbsp;</td>\
							            </tr>'

                                        }
                                        $('.table2 tbody').html(str2);
                                        $('.js-holdAmountAll').html($.getFormatNumber(d.holdAmountAll.toFixed(2)));
                                        $('.js-payAmountAll').html($.getFormatNumber(d.billMoney.toFixed(2)));
                                        $('.table4 tbody').html(str4+str6);
                                    }
                                    if(t3.length>0){
                                        for(var i=0;i<t3.length;i++){
                                            str3+='<tr>\
										<td align="center">'+(i+1)+'</td>\
										<td align="center">'+t3[i].billIds+'</td>\
										<td align="center">'+t3[i].purchName+'</td>\
										<td align="center">'+t3[i].salerName+'</td>\
										<td align="center">'+t3[i].invoiceNo+'</td>\
										</tr>'
                                        }
                                        $('.table3 tbody').html(str3);
                                    }
                                    if(t4.length>0){
                                        for(var i=0;i<t4.length;i++){
                                            str5+='<tr>\
										<td align="center">'+(i+1)+'</td>\
										<td align="center">'+t4[i].ownRecordId+'</td>\
										<td align="center">'+t4[i].payAmount+'</td>\
										<td align="center">'+$.getFormatNumber((t4[i].serviceRate*100),4)+"%"+'</td>\
										<td align="center">'+t4[i].serviceAmount+'</td>\
										</tr>'
                                            $('.js-customerName1').html(t4[i].payerName);
                                        }
                                        $('.table5 tbody').html(str5);
                                    }
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
            }


        })(function () {
            M.financingContract.init();
        });
    }
)
