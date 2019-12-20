require(['head', 'menu', 'base', 'tab', 'page', 'calendar', 'status', 'waiting'],
    function () {
        M.define('financingList', {
            head: M.ui.head.init(),
            init: function () {
                M.ui.menu.init({
                    index: [2, 0],
                    url: M.getNormalPath('getMenu.json', 4),
                    callback: function () {

                    }
                });
                this.base = M.static.init();
                this.dateSort = false;
                this.pageSize = 10;
                this.status = 0;
                this.getDate();
                this.getTableData(1);
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

                var calenderStart = M.ui.calendar.init({
                    target: M('#js-calender-start'),
                    date: {
                        format: 'YYYY-MM-DD'
                    },
                    time: {
                        enabled: false
                    },
                    number: 1,
                    toggle: 1,
                    relative: {
                        type: 'stop'
                    },
                    tool: {
                        clear: true,
                        today: true
                    },
                    callback: function (that) {
                        M.delay(100, function () {
                            this.ops.relative.point = calenderStop;
                        }, this);
                    },
                    choose: function () {
                        // console.log(this);
                    }
                }, this);
                var calenderStop = M.ui.calendar.init({
                    target: M('#js-calender-stop'),
                    date: {
                        format: 'YYYY-MM-DD'
                    },
                    time: {
                        enabled: false
                    },
                    number: 1,
                    toggle: 2,
                    relative: {
                        type: 'start'
                    },
                    tool: {
                        clear: true,
                        today: true
                    },
                    callback: function (that) {
                        M.delay(100, function () {
                            this.ops.relative.point = calenderStart;
                            this.ops.date.min = calenderStart.ops.date.select;
                        }, this);
                    },
                    choose: function () {
                        // console.log(this);
                    }
                }, this);

                //我要融资
                M('.i-want-finance').on('click', function () {
                    M.financingList.getFinancePermission();
                });

                //----------------添加查询时间--------------------
                M('.ui-search-button').click(function(event) {
                    M.financingList.getTableData(1);
                });

                //----------------日期排序--------------------
                M('.date-sort .sort').click(function(event) {
                    var dateSort = M.financingList.dateSort;
                    if (!dateSort) {
                        M(this).find('i').addClass('g-180deg');
                        M(this).addClass('active');
                    } else{
                        M(this).removeClass('active');
                        M(this).find('i').removeClass('g-180deg');
                    }
                    M.financingList.dateSort = !dateSort;
                    M.financingList.getTableData(1);
                });

                M('.tapAll').click(function () {
                    M.financingList.status = 0;
                    M.financingList.getTableData(1);
                });

                M('.tapSubmit').click(function () {
                    M.financingList.status = 1;
                    M.financingList.getTableData(1);
                });

                 M('.tosgin').click(function () {
                    M.financingList.status = 5;
                   M.financingList.getTableData(1);
                  });


                M('.tapCheck').click(function () {
                    M.financingList.status = 2;
                    M.financingList.getTableData(1);
                });

                M('.tapPay').click(function () {
                    M.financingList.status = 3;
                    M.financingList.getTableData(1);
                });

                M('.tapBack').click(function () {
                    M.financingList.status = 4;
                    M.financingList.getTableData(1);
                });
            },

            getTableData: function (page, status) {

                var that = this;

                var startTime = M('#js-calender-start').val();
                var endTime = M('#js-calender-stop').val();
                var orderBy = M.financingList.dateSort ? "10" : "20";
                var financialInstitutionsName = M('.institution').val();

                var status = M.financingList.status;

                var statusObj = "";
                var statusList = [];

                switch (status) {
                    case 1:
                        statusObj = "10";
                        break;
                    case 5:
                        statusObj = "15";
                       break;
                    case 2:
                        statusObj = "20";
                        break;
                    case 3:
                        statusObj = "30";
                        break;
                    case 4:
                        statusList = ["00","001","002","003"];
                        break;
                    default:
                        statusObj = "";
                }

                M.ajaxFn({
                    url: M.interfacePath.bill + 't/financingApply/list',
                    type: 'post',
                    data: {
                        "status": statusObj,
                        "statusList": statusList,
                        "createDateStart":startTime,
                        "createDateEnd":endTime,
                        "orderBy": orderBy,
                        "financialInstitutionsName":financialInstitutionsName,
                        "pageNum": page,
                        "pageSize": M.financingList.pageSize
                    },
                    dataType: 'json',
                    contentType: 'application/json',
                    success: function (data) {
//                        console.log(data);
                        if (data.data == null || data.success == false||data.data.length ==0){
                            var noData = '<td colspan="10"><div class="noData"><img src="../../template/res/images/empty.png" alt=""><div class="col60 mar-top-10">暂无记录</div></div></td>';
                            M('.g-tbody').html(noData);
                            M('.pageTotal').html(data.total);
                            M('.pageCount').html(data.pageCount);
                            M.financingList.getPage(data, page, M('#page'));
                        }else if(data.success && data.data.length!=0){
                            var str = '';
                            for (var i = 0; i < data.data.length; i++) {
                                var item = data.data[i];
                                var nowDate=new Date().getTime()
                                var s,endDate
                                if(item.validTime){
                                    s = item.validTime.replace(/-/g,"/");
                                    endDate = new Date(s).getTime();
                                }

                                var downHtml = '';
                                var detailHTml='';
                                if (item.status == '20' || item.status == '30') {
                                    downHtml = '<span class="centerLine">|</span>'+'<a href="javascript:;" class="fin-download" detail-id="' + item.acceptCode + '"detail-num="'+ item.financialInstitutionsId +'">下载合同' + '</a>';
                                }
                                if((item.status == '10' || item.status == '20')&&(item.ccbReturnUrl)&&(nowDate<endDate)){
                                    detailHTml = '<span class="centerLine">|</span>'+'<a href="'+item.ccbReturnUrl+'" target="_blank" detail-id="' + item.acceptCode + '"detail-num="'+ item.financialInstitutionsId +'">信息补充' + '</a>';
                                }
                                // var detailUrl = M.interfacePath.financing + "detail?applicationId=" + item.acceptCode;

                                var bankFee = item.bankFee ? M.getFormatNumber(item.bankFee) : '0.00';
                                var financingServiceFee = item.financingServiceFee ? M.getFormatNumber(item.financingServiceFee) : '0.00';

                                str += '<tr>' +
                                    '<td class="g-text-center">' + item.applyNo + '</td>' +
                                    '<td class="g-text-center">' + M.timetrans(item.createDate) + '</td>' +
                                    '<td class="maincol g-text-center">' + M.getFormatNumber(item.amount)+ '</td>' +
                                    '<td class="maincol g-text-center">' + M.getFormatNumber(item.payAmount) + '</td>' +
                                    '<td class="maincol g-text-center">' + bankFee + '</td>' +
                                    '<td class="maincol g-text-center">' + financingServiceFee + '</td>' +
                                    '<td class="g-text-center nameTxt" title="'+ item.financialInstitutionsName +'">' + item.financialInstitutionsName + '</td>' +
                                    '<td class="g-text-center">' + item.statusName + '</td>' +
                                    '<td class="g-text-center">' + '<a href="javascript:;" class="fin-detail" detail-id="' + item.acceptCode + '">查看详情</a>' + downHtml + detailHTml+'</td>' +
                                    '</tr>';
                            }
                            M.financingList.getPage(data, page, M('#page'));
                            M('.g-tbody').html(str);
                            M('.pageTotal').html(data.total);
                            M('.pageCount').html(data.pageCount);
                            M('.fin-detail').unbind('click').bind('click',function(e){
                                var id=$(this).attr('detail-id');
                                that.factorselectapplyinfo(id);
                            });
                            M('.fin-download').unbind('click').bind('click',function(e){
                                var id=$(this).attr('detail-id');
                                var banknum=$(this).attr('detail-num');
                                that.downloadParams(id, banknum);
                            });
                        }
                    },
                    error: function (res) {
                        console.log(res);
                    }
                });
            },

            //合同下载
            downloadParams: function(id, banknum) {

                M.ajaxFn({
                    url:$.interfacePath.bill+'t/nologin/getValueByGroupAndCode',
                    data:{setGroup:'FINANCING_CONTRACT_DOWNLOAD',code:banknum},
                    type:'POST',
                    dataType:'JSON',
                    async:false,
                    success:function(data,args){
                        if (data.data == '1') {
                            var url = M.interfacePath.bill + 't/downloadFileRZ?applicationId=' + id;
                            var a = document.createElement('a');
                            a.target = '_blank';
                            a.download = decodeURI(decodeURI(id + '.pdf'));
                            a.href = url;
                            $("body").append(a);  // 修复firefox中无法触发click
                            a.click();
                            $(a).remove();
                        } else {
                            M.ui.status.init({
                                title: "提示",
                                html:"请向金融机构索要协议文本",
                                hide:false
                            });
                        }

                    },
                    error:function(msg){}
                })
            },

            //融资信息
            factorselectapplyinfo:function(id){
                var that = this;
                var reqData = id;
                M.ajaxFn({
                    url:$.interfacePath.bill+'/t/financingRecord/query',
                    data:{acceptCode:reqData},
                    type:'POST',
                    dataType:'JSON',
                    async:false,
                    success:function(data,args){
                        if(typeof data!='object'){
                            data = JSON.parse(data)
                        }
                        data = JSON.parse(data.data);
                        var financeStatus = data.resultData.financeStatus;
                        if (financeStatus == "30") {
                            // var url = "financingConfirm.html?applicationId=" + id;
                            var url = "financingThree.html?applicationId=" + id+"&&newOpen="+'1';
                            that.openNewWindow(url);
                        } else {
                            var url  = "financingDetail.html?applicationId=" + id;
                            that.openNewWindow(url);
                        }

                    },
                    error:function(msg){}
                })
            },
            openNewWindow: function(successUrl) {
                var el = document.createElement("a");
                document.body.appendChild(el);
                el.href = successUrl; //url 是你得到的连接
                el.target = '_blank'; //指定在新窗口打开
                el.click();
                document.body.removeChild(el);
            },
            //分页
            getPage: function (data, page, obj) {
                M.ui.page.init({
                    container: obj[0],
                    total: data.total,
                    items: M.financingList.pageSize,
                    number: M.financingList.pageSize,
                    entries: 2,
                    isInput: true,
                    isText: false,
                    current: page - 1,
                    callback: function (that) {
                        M.financingList.getTableData(this.ops.current + 1)
                    }
                });
            },

            //我要融资
            // financingOne.html
            getFinancePermission: function () {
                M.ajaxFn({
                    url: M.interfacePath.bill + 't/financing/admit',
                    type: 'post',
                    data: {},
                    dataType: 'json',
                    contentType: 'application/json',
                    success: function (data) {
//                        console.log(data);
                        //debugger;
                        var success = data.success;
                        if (success) {
                            window.location.href = "financingOne.html";
                        } else {
                            M.ui.status.init({
                                drag: false,
                                title:'提示',
                                html:'您还未开通融资服务，请联系客户经理进行业务咨询及办理。<br/>  &nbsp&nbsp联系方式：王经理021-36638757 &nbsp&nbsp 谢经理021-36638866 &nbsp&nbsp 秦经理021-36638879 &nbsp&nbsp',
                            },this);
                        }
                    },
                    error: function (res) {
                        console.log(res);
                    }
                });
            },

        })(function(){

            M.financingList.init();
        });
    }
)