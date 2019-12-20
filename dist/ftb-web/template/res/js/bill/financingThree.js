require(['head','menu','base', 'confirm', 'waiting','tab','page', 'calendar', 'calculator'],
    function(){
        M.define('financingOne',{
            head:M.ui.head.init(),
            init:function(){
                M.ui.menu.init({
                    index:[],
                    url:M.getNormalPath('getMenu.json',4),
                    callback: function() {

                    }
                });
                this.applicationId = M.getUrlParam('applicationId');
                // this.applicationId = "FTB-RZ-20190326-JK008";
                this.base = M.static.init();
                // this.getDate();
                this.getTableData();
                this.getBankInfo();
                this.bankConfig = {};  //金融机构配置
                this.newOpen =  M.getUrlParam('newOpen');
                M(".goback").on('click',function(){
                    if(M.financingOne.newOpen){
                        window.opener=null;window.open('','_self');window.close();
                    }else{
                        window.location.href='./financingList.html'
                    }
                })
            },

            getDate: function(){
                var that = this;
                //撤销
                M('.ui-detail-btn-return').off('click').on('click',function () {
                    M.ui.confirm.init({
                        html:'确定撤销吗？',
                        drag: false,
                        button:[
                            {
                                href:null,
                                html:'确认',
                                callback:function(){
                                   that.revoke();
                                }
                            },
                            {
                                href:null,
                                html:'关闭',
                                callback:function(){
                                    // $('body').css('height','auto');
                                }
                            }
                        ],
                        close: function () {
//                        console.log('close')
                        }
                    });
                });

                //下一步
                M('.ui-detail-btn-three').on('click', function () {
                    that.nextStep();
                });

            },

            getBankInfo: function() {
                $.ajaxFn({
                    url:$.interfacePath.bill+'t/nologin/getFinanceOrgConfigByAcceptCode',
                    data:{acceptCode:M.financingOne.applicationId},
                    type:'POST',
                    dataType:'JSON',
                    success:function(data,args){
                        if (data.success) {
                            M.financingOne.bankConfig = data.data;
                        } else {
                            M.ui.waiting.creat({
                                status:false,
                                time:1000,
                                text:data.message,
                                hide:false,
                            });
                        }
                    },
                    error:function(msg){
                        console.log(msg)
                    }
                })
            },

            nextStep: function() {

                var flag = true;

                M('.tr-head').each(function (e) {
                    var isComplete = M(this).attr('detail-complete');
                    if (isComplete != '1') {
                        flag = false;
                        return;
                    }
                })

                if (!flag) {
                    M.ui.waiting.creat({
                        status:false,
                        time:1000,
                        text:'请补充融资材料',
                        hide:false,
                    });
                    return;
                }

                $.ajaxFn({
                    url:$.interfacePath.bill+'t/financing/genZipByAcceptCode',
                    data:{acceptCode:M.financingOne.applicationId},
                    type:'POST',
                    dataType:'JSON',
                    success:function(data,args){

                        if (data.success) {
                            M.financingOne.nextToWhere();

                        } else {
                            M.ui.waiting.creat({
                                status:false,
                                time:1000,
                                text:data.message,
                                hide:false,
                            });
                        }
                    },
                    error:function(msg){
                        console.log(msg)
                    }
                })
            },

            nextToWhere: function() {
                var reqData = M.financingOne.applicationId;
                M.ajaxFn({
                    url:$.interfacePath.bill+'t/financeapplyinfo/query',
                    data:{applicationId:reqData},
                    type:'POST',
                    dataType:'JSON',
                    success:function(data,args){
                        if($.parseJSON(data.data)){
                            data = JSON.parse(data.data)
                        }
                        if(data.result === '1'){
                            if(M.financingOne.newOpen){
                                var url = M.financingOne.bankConfig.next01Page + "?applicationId=" + M.financingOne.applicationId+"&&newOpen="+'1';
                                // var banknum = data.financeApplication.bankNum;
                                // var url = "financingConfirm.html?applicationId=" + M.financingOne.applicationId;
                                //
                                // if (banknum == M.interfacePath.jianhangCode) {
                                //     url = "companyInfoTwo.html?applicationId=" + M.financingOne.applicationId;
                                // }
                                window.location.href = url;
                            }else{
                                var url = M.financingOne.bankConfig.next01Page + "?applicationId=" + M.financingOne.applicationId;
                                // var banknum = data.financeApplication.bankNum;
                                // var url = "financingConfirm.html?applicationId=" + M.financingOne.applicationId;
                                //
                                // if (banknum == M.interfacePath.jianhangCode) {
                                //     url = "companyInfoTwo.html?applicationId=" + M.financingOne.applicationId;
                                // }
                                window.location.href = url;
                            }

                        } else {
                            M.ui.waiting.creat({
                                status:false,
                                time:1000,
                                text:data.message,
                                hide:false,
                            });
                        }
                    },
                    error:function(msg){
                        console.log(msg)
                    }
                })
            },

            revoke: function(e) {

                var reqData = M.financingOne.applicationId;
                $.ajaxFn({
                    url:$.interfacePath.bill+'t/factorselectapplyinfo/update',
                    data:{acceptCode:reqData},
                    type:'POST',
                    dataType:'JSON',
                    success:function(data,args){

                        if (data.success) {
                            M.ui.waiting.creat({
                                status:true,
                                time:1000,
                                text:data.message,
                                hide:false,
                                callback: function () {
                                    if (data.success) {
                                        window.location.href = "financingList.html";
                                    }
                                }
                            });
                        } else {
                            M.ui.waiting.creat({
                                status:false,
                                time:1000,
                                text:data.message,
                                hide:false,
                            });
                        }
                    },
                    error:function(msg){
                        console.log(msg)
                    }
                })
            },

            getTableData: function () {
                var that = this;

                M.ajaxFn({
                    url: M.interfacePath.bill + 't/financing/getFinancingInfo',
                    type: 'post',
                    data: {
                        "acceptCode": this.applicationId
                    },
                    dataType: 'json',
                    contentType: 'application/json',
                    success: function (data) {
                        // console.log(data);
                        if (data.success) {
                            var str =   '<div class="table-th">' +
                                '<div class="check-box"></div>' +
                                '<div class="bill-num">通宝编号</div>' +
                                '<div class="create-side">开立方</div>' +
                                '<div class="cash-date">兑付日期</div>' +
                                '<div class="have-num">持有金额(元)</div>' +
                                '<div class="fin-num">本次融资金额(元)</div>' +
                                '<div class="opreation">操作</div>' +
                                '</div>';
                            str += '<div id="scroll-bar" class="table-con">';
                            for (var i = 0; i < data.data.length; i++) {
                                var item = data.data[i];

                                var imgStr = item.type == "T" ? '../../base/images/tong.png' : '../../base/images/zhuan.png';
                                var nameStr = item.type == "T" ? "通宝开立" : "通宝转让";

                                var completeDetail = '<a class="tr-see" detail-id="' + item.bizId + '"detail-bizNo="' + item.businessNo + '"type="' + item.type + '" href="javascript:;">查看融资材料</a>';
                                var notCompleteDetail = '<a class="tr-supplement" detail-id="' + item.bizId + '"detail-bizNo="' + item.businessNo + '"type="' + item.type + '"href="javascript:;">补充融资材料</a>';
                                var detailStr = item.infoComplete == '1' ?  completeDetail : notCompleteDetail;

                                var ddd = M.timetrans(item.maturityDate);
                                str += '<div class="tr-head" detail-complete="' + item.infoComplete + '">\n' +
                                    '            <div class="tr-from">\n' +
                                    '                <img src="' + imgStr + '" alt="">\n' +
                                    '                通宝来源：<span>' + nameStr + '</span>\n' +
                                    '            </div>\n' +
                                    '            <div class="tr-object">\n' +
                                    '                交易对象：<span>' + item.tradeCompany +'</span>\n' +
                                    '            </div>\n' +
                                    '            <div class="tr-billnum">\n' +
                                    '                交易单据号：<span>' + item.businessNo + '</span>\n' +
                                    '            </div>\n' +
                                    '            <div class="tr-operation">\n' +
                                    detailStr +
                                    '            </div>\n' +
                                    '        </div>\n';
                                for (var j = 0; j < item.ownRecordList.length; j++) {
                                    var subItem = item.ownRecordList[j];
                                    str += '     <div class="tr-body">\n' +
                                        '            <div class="body-number">' + subItem.billHoldNo + '</div>\n' +
                                        '            <div class="body-company">' + subItem.payerName + '</div>\n' +
                                        '            <div class="body-date">' + M.timetrans(subItem.maturityDate) + '</div>\n' +
                                        '            <div class="body-holdmoney">' + M.getFormatNumber(subItem.holdAmount) + '</div>\n' +
                                        '            <div class="body-nowmoney">' + M.getFormatNumber(subItem.billMoney) + '</div>\n' +
                                        '        </div>';
                                }
                            }
                            str += '</div>';
                            M('.table').html(str);
                            M('.data-num').html(data.total);
                            M('.tr-see').unbind('click').bind('click', function () {
                                var id=$(this).attr('detail-id');
                                var type=$(this).attr('type');
                                var bizNo=$(this).attr('detail-bizNo');

                                var url = "financingSupplement.html?bizId=" + id +"&bizNo=" + bizNo +"&type=" + type + '&applicationId=' + that.applicationId;

                                var el = document.createElement("a");
                                document.body.appendChild(el);
                                el.href = url; //url 是你得到的连接
                                el.target = '_blank'; //指定在新窗口打开
                                el.click();
                                // document.body.removeChild(el);
                            });
                            M('.tr-supplement').unbind('click').bind('click', function () {
                                var id=$(this).attr('detail-id');
                                var type=$(this).attr('type');
                                var bizNo=$(this).attr('detail-bizNo');

                                var url = "financingSupplement.html?bizId=" + id +"&bizNo=" + bizNo +"&type=" + type  + '&applicationId=' + that.applicationId;

                                var el = document.createElement("a");
                                document.body.appendChild(el);
                                el.href = url; //url 是你得到的连接
                                el.target = '_blank'; //指定在新窗口打开
                                el.click();
                                // document.body.removeChild(el);
                            });
                            M.financingOne.getDate();
                        } else {
                            M.ui.waiting.creat({
                                status:false,
                                time:1000,
                                text:data.message,
                                hide:false,
                            });
                        }
                    },
                    error: function (res) {
                        console.log(res);
                    }
                });
            },

        })(function(){
            M.financingOne.init();
        });
    }
)
