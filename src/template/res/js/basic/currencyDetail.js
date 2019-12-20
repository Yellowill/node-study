require(['head', 'menu', 'base', 'tab', 'page','customDialog',],
    function () {
        M.define('currencyDetail', {
            head: M.ui.head.init(),
            init: function () {
                M.ui.menu.init({
                    index: [],
                    url: M.getNormalPath('getMenu.json', 4),
                    callback: function () {

                    }
                });
                this.base = M.static.init();
                this.id = $.getUrlParam('id');
                this.getDate();
                this.getTableData(1);
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
                M("#lockNum").click(function(){

                    M.ui.customDialog.init({
                        drag:true,
                        title:'',
                        width:'390',
                        height:'300',
                        autoClose:false,
                        url:'../dialog/dialog-lockNumInfo.html',
                        callback:function(e){
                            M.ajaxFn({
                                url:$.interfacePath.bill+'t/lockAmount/detailStearm',
                                type: 'post',
                                data: {
                                    billId: that.id,
                                },
                                dataType: 'json',
                                contentType: 'application/json',
                                success: function (data) {
                                   // console.log(data);
                                    if (data.data == null || data.success == false||data.data.length ==0){
                                        var noData = '<td colspan="10"><div class="noData"><img src="../../template/res/images/empty.png" alt=""><div class="col60 mar-top-10">暂无记录</div></div></td>';
                                        M('.g-lockTable').html(noData);
                                    }else if(data.success && data.data.length!=0){
                                        var str = '';
                                        for (var i = 0; i < data.data.length; i++) {
                                            var item = data.data[i];
                                                str += '<tr>' +
                                                    '<td class="g-text-center nameTxt" title="'+item.batchNo+'">' + item.batchNo + '</td>' +
                                                    '<td class="g-text-center">' + that.statusFormat2(item.batcType) + '</td>' +
                                                    '<td class="g-text-center nameTxt"><span title="'+item.fereeName+'">' + item.fereeName + '</span></td>' +
                                                    '<td class="maincol g-text-center">' + M.getFormatNumber(item.accpetAmount,2) + '</td>' +
                                                    '<td class="g-text-center">' + M.timetrans(item.batchTime) + '</td>' +
                                                    '</tr>';
                                        }
                                        M('.g-lockTable').html(str);
                                    }
                                },
                                error: function (res) {
                                    console.log(res);
                                }
                            });
                            M('.ui-dialog-close').click(function(){
                                e.remove();
                            });
                            M('#close').click(function(){
                                e.remove();
                            });
                        }
                    });
                });
            },

            //状态格式化
            statusFormat: function (data) {
                var type = null;
                if (data == 10) {
                    type = '开立';
                } else if (data == 20) {
                    type = '转让';
                } else if (data == 30) {
                    type = '融资';
                } else if (data == 55) {
                    type = '融资';
                } else if (data == 60) {
                    type = '拆分';
                } else if (data == 70) {
                    type = '再转让';
                }
                return type;
            },
            statusFormat2: function (data) {
                var type = null;
                if (data == 10) {
                    type = '转让';
                } else if (data == 20) {
                    type = '融资';
                } else if (data == 60) {
                    type = '拆分';
                } else if (data == 70) {
                    type = '再转让';
                }
                return type;
            },

            getTransData:function(page) {
                var that = this;

                M.ajaxFn({
                    url: $.interfacePath.bill+ 't/myfinanceApply/applyStearm',
                    type: 'post',
                    data: {
                        pageNum: page,
                        billId: that.id,
                        pageSize:5,
                    },
                    dataType: 'json',
                    contentType: 'application/json',
                    success: function (data) {
                        //console.log(data)
                        var str = '';
                        for (var i = 0; i < data.data.length; i++) {
                            var item = data.data[i];
                            var href = item.opentType == 10 ? '../bill/billIssueDetail.html?id='+item.batchNo : '../bill/transferDetail.html?id='+item.applyId;
                            var batchNoHtml = '<a target="_blank" href='+ href +'>' +
                                item.batchNo +
                                '</a>';

                            if (item.opentType == 30 || item.opentType == 55) {
                                batchNoHtml = '<a target="_blank" class="fin-detail" detail-id="' + item.acceptCode + '">' + item.batchNo + '</a>'
                            }else if (item.opentType == 60) {
                                batchNoHtml = '——'
                            }
                            str += '<tr>' +
                                '<td class="g-text-center">' +
                                batchNoHtml +
                                '</td>' +
                                '<td class="g-text-center">' +
                                item.transfereerName +
                                '</td>' +
                                '<td class="maincol g-text-center">' +
                                M.getFormatNumber(item.transferAmount, 2) +
                                '</td>' +
                                '<td class="g-text-center">' +
                                that.statusFormat(item.opentType) +
                                '</td>' +
                                '<td class="g-text-center">' +
                                M.timetrans(item.createDate) +
                                '</td>' +
                                '</tr>';
                        }
                        M.currencyDetail.getPage(data, page, M('#page'), true)
                        M('.billIssue-tbady-content').eq(0).html(str);
                        M('.pageTotal').eq(0).html(data.total);
                        M('.pageCount').eq(0).html(data.pageCount);
                    },
                    error: function (res) {
                        console.log(res);
                    }
                });
            },

            getAssigneeData: function(page) {
                var that = this;

                M.ajaxFn({
                    url: $.interfacePath.bill+ 't/myfinanceBill/assigneeStearm',
                    type: 'post',
                    data: {
                        pageNum: page,
                        billId: that.id,
                        pageSize:5,
                    },
                    dataType: 'json',
                    contentType: 'application/json',
                    success: function (data) {
                        // console.log(data)
                        var str = '';
                        for (var i = 0; i < data.data.length; i++) {
                            var item = data.data[i];
                            var href = item.opentType == 10 || item.opentType == 60 ? '../bill/billIssueDetail.html?id='+item.batchNo : '../bill/transferDetail.html?id='+item.applyId;
                            var batchNoHtml = '<a target="_blank" href='+ href +'>' +
                                item.batchNo +
                                '</a>';

                            if (item.opentType == 30 || item.opentType == 55) {
                                batchNoHtml = '<a target="_blank" class="fin-detail" detail-id="' + item.acceptCode + '">' + item.batchNo + '</a>'
                            }
                            str += '<tr>' +
                                '<td class="g-text-center">' +
                                batchNoHtml +
                                '</td>' +
                                '<td class="g-text-center">' +
                                item.transferorName +
                                '</td>' +
                                '<td class="maincol g-text-center">' +
                                M.getFormatNumber(item.transferAmount, 2) +
                                '</td>' +
                                '<td class="g-text-center">' +
                                that.statusFormat(item.opentType) +
                                '</td>' +
                                '<td class="g-text-center">' +
                                M.timetrans(item.createDate) +
                                '</td>' +
                                '</tr>';
                        }
                        M.currencyDetail.getPage(data, page, M('#page1'), false);
                        M('.billIssue-tbady-content').eq(1).html(str);
                        M('.pageTotal').eq(1).html(data.total);
                        M('.pageCount').eq(1).html(data.pageCount);
                        M('.fin-detail').unbind('click').bind('click',function(e){
                            var id=$(this).attr('detail-id');
                            that.factorselectapplyinfo(id);
                        });
                    },
                    error: function (res) {
                        console.log(res);
                    }
                });
            },

            getTableData: function (page) {
                var that = this;
                //获得主键
                // var info=JSON.parse(sessionStorage.getItem('currencyDetail'))


                M.ajaxFn({
                    url: $.interfacePath.bill +'t/myfinanceBill/list',
                    type: 'post',
                    data: {
                        billId:that.id
                    },
                    dataType: 'json',
                    contentType: 'application/json',
                    success: function (data) {

                        var info = data.data[0];

                        M('#createSide').html(info.payerName);

                        M('#cashDate').html($.timetrans(info.maturityDate));
                        M('#haveNum').html($.getFormatNumber(info.amount, 2));
                        M('#lockNum').html($.getFormatNumber(info.lockAmount, 2));
                        M('#billNum').html(info.billNo);
                        M('#clearAmount').html(M.getFormatNumber(info.clearAmount));

                    },
                    error: function (res) {
                        console.log(res);
                    }
                });

                // var info = own.fetch('currencyDetail');
                // own.removeKey('currencyDetail');


                this.getTransData(page);
                this.getAssigneeData(page);
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
                            var url = "../bill/financingConfirm.html?applicationId=" + id;
                            that.openNewWindow(url);
                        } else {
                            var url  = "../bill/financingDetail.html?applicationId=" + id;
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
            getPage: function (data, page, obj, flag) {
                M.ui.page.init({
                    container: obj[0],
                    total: data.total,
                    items: 5,
                    number: 5,
                    entries: 1,
                    isInput: true,
                    isText: false,
                    current: page - 1,
                    callback: function (that) {
                        flag ? M.currencyDetail.getTransData(this.ops.current + 1, 5) : M.currencyDetail.getAssigneeData(this.ops.current + 1, 5)
                    }
                });
            }

        })(function () {
            M.currencyDetail.init();
        });
    }
)
