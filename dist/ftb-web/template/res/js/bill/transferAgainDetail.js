require(['head', 'menu', 'base', 'tab', 'page', 'status'],
    function () {
        M.define('billIssue', {
            head: M.ui.head.init(),
            init: function () {
                M.ui.menu.init({
                    index: [],
                    url: M.getNormalPath('getMenu.json', 4),
                    callback: function () {

                    }
                });
                this.base = M.static.init();
                this.getDate();
                this.getTableData();
              //  this.getTableData2();
            },

            getDate: function () {
                var that = this;

                var id = M.getUrlParam('id');
                var review = M.getUrlParam('review');
                var reviewAccept = M.getUrlParam('reviewAccept');
                //pdf Print
                if (review || reviewAccept) {
                    //再转让
                    M('.g-bigTab').append('<li class="g-nav-tabs-li"><a href="javascript:;">融资协议下载</a></li>')
                    this.getFinanceList(id);
                }

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

                M(document).on('click', '#pdfPrint', function () {
                    M.ajaxFn({
                        url:  $.interfacePath.basic +'t/autograph/filePath',
                        type: 'get',
                        data: {
                            signNo: that.batchNo,
                            bizType: review ? '20' : '25'
                        },
                        dataType: 'json',
                        success: function (res) {
//                            console.log(res);
                            if ( res.success ) {
                                M.downloadFileXhr(res.data[0].autographFilePath, '')
                            }else {
                                M.ui.waiting.creat({
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
                    });
                });
                M(document).on('click', '#pdfPrint2', function () {
                    M.ajaxFn({
                        url:  $.interfacePath.bill +'t/billFinance/pdfPrint',
                        type: 'get',
                        data: {
                            id: id
                        },
                        dataType: 'json',
                        success: function (res) {
//                            console.log(res);
                            if ( res.success ) {
                                M.downloadFileXhr(res.data, '')
                            }else {
                                M.ui.waiting.creat({
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
                    });
                });

            },

            getFinanceList: function(transId) {
                var that = this;
                M.ajaxFn({
                    url: M.interfacePath.bill + 't/transferAgainFinancingDetail',
                    type: 'post',
                    data: {
                        id: transId
                    },
                    dataType: 'json',
                    contentType: 'application/json',
                    success: function (data) {
//                        console.log(data);
                        if (data.data == null || data.success == false||data.data.length ==0){
                            var noData = '<td colspan="10"><div class="noData"><img src="../../template/res/images/empty.png" alt=""><div class="col60 mar-top-10">暂无记录</div></div></td>';
                            M('.g-tbody').html(noData);
                            // M.financingList.getPage(data, page, M('#page'));
                        }else if(data.success && data.data.length!=0){
                            var str = '';
                            for (var i = 0; i < data.data.length; i++) {
                                var item = data.data[i];
                                var downHtml = '';
                                if (item.status == '20' || item.status == '30') {
                                    downHtml = '<a href="javascript:;" class="fin-download" detail-id="' + item.acceptCode + '"detail-num="'+ item.financialInstitutionsId +'">下载合同' + '</a>';
                                }
                                // var detailUrl = M.interfacePath.financing + "detail?applicationId=" + item.acceptCode;

                                str += '<tr>' +
                                    '<td class="g-text-center">' + item.applyNo + '</td>' +
                                    '<td class="g-text-center">' + M.timetrans(item.createDate) + '</td>' +
                                    '<td class="g-text-center nameTxt" title="'+ item.financialInstitutionsName +'">' + item.financialInstitutionsName + '</td>' +
                                    '<td class="g-text-center">' + downHtml + '</td>' +
                                    '</tr>';
                            }
                            // M.financingList.getPage(data, page, M('#page'));
                            M('.g-tbody').html(str);
                            // M('.pageTotal').html(data.total);
                            // M('.pageCount').html(data.pageCount);
                            // M('.fin-detail').unbind('click').bind('click',function(e){
                            //     var id=$(this).attr('detail-id');
                            //     that.factorselectapplyinfo(id);
                            // });
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
                // M.ajaxFn({
                //     url:$.interfacePath.bill+'t/nologin/getValueByGroupAndCode',
                //     data:{setGroup:'FINANCING_CONTRACT_DOWNLOAD',code:banknum},
                //     type:'POST',
                //     dataType:'JSON',
                //     async:false,
                //     success:function(data,args){
                //         if (data.data == '1') {
                            var url = M.interfacePath.bill + 't/downloadFileRZ?applicationId=' + id;
                            var a = document.createElement('a');
                            a.target = '_blank';
                            a.download = decodeURI(decodeURI(id + '.pdf'));
                            a.href = url;
                            $("body").append(a);  // 修复firefox中无法触发click
                            a.click();
                            $(a).remove();
                //         } else {
                //             M.ui.status.init({
                //                 title: "提示",
                //                 html:"请向金融机构索要协议文本",
                //                 hide:false
                //             });
                //         }
                //
                //     },
                //     error:function(msg){}
                // })
            },

            downLoadBill: function(billNO) {

                M.ajaxFn({
                    url: M.interfacePath.bill + 't/transferAgainBillZip',
                    type: 'post',
                    data: {
                        billNo: billNO
                    },
                    dataType: 'json',
                    contentType: 'application/json',
                    success: function (data) {
                        if(data.success){
                            var result = data.data;
                            var zipUrl = result.zipUrl;
                            var zipName = result.zipName;

                            M.downloadFileXhr(zipUrl, zipName)
                        }else{
                            M.ui.waiting.creat({
                                status:false,
                                time:1000,
                                text:data.message,
                                hide:false
                            });
                        }
                    },
                    error: function (res) {
                        console.log(res);
                    }
                });
            },

            getTableData: function (page) {
                var that = this;
                //获得主键
                var id = $.getUrlParam('id');
                M.ajaxFn({
                    url: M.interfacePath.bill+'t/findTransferOutDetails/list',
                    type: 'post',
                    data: {
                        id:id,
                    },
                    dataType: 'json',
                    contentType: 'application/json',
                    success: function (data) {
//                        console.log(data);
                        if(data.success){
                            that.batchNo = data.data.batchNo;
                            if(data.data.hashCode==null){
                                data.data.hashCode = '生成中...';
                            }
                            var strTable = '<div class="g-small-head-title mar-top-10">' +
                                '<span class="col33">转让单号：' + data.data.batchNo + '</span>' +
                                '<a class="col60 g-font12 a-label mar-left-5" href="javascript:;">'+data.data.statusName+'</a>' +
                                '</div>' +
                                '<div class="mar-top-10 g-new-table">'+
                                '<div class="g-list-content">' +
                                '<div class="g-left tit">转出方公司名称</div>' +
                                '<div class="g-left con">' + data.data.transferorName + '</div>' +
                                '<div class="g-left tit">受让方公司名称</div>' +
                                '<div class="g-left con border-right">' + data.data.transfereeName + '</div>' +
                                '</div>' +
                                '<div class="g-list-content">' +
                                '<div class="g-left tit">转出方税号</div>' +
                                '<div class="g-left con">' + data.data.transferorTaxNum + '</div>' +
                                '<div class="g-left tit">受让方税号</div>' +
                                '<div class="g-left con border-right">' + data.data.transfereeTaxNum + '</div>' +
                                '</div>' +
                                '<div class="g-list-content">' +
                                '<div class="g-left tit">转出金额</div>' +
                                '<div class="g-left con max-con border-right">' +
                                '<span class="maincol transferMoney">' + M.getFormatNumber(data.data.transferAmount,2,'.',',') + '</span>&nbsp;&nbsp;( <span class="upper-cn">'+ M.getChineseNumber(data.data.transferAmount) +'</span> )'+
                                '</div>' +
                                '</div>' +
                                '<div class="g-list-content">' +
                                '<div class="g-left tit">转让日期</div>' +
                                '<div class="g-left con max-con border-right">' + M.timetrans(data.data.createDate) + '</div>' +
                                '</div>' +
                                '<div class="g-list-content">' +
                                '<div class="g-left tit">区块链存证编号</div>' +
                                '<div class="g-left con max-con border-right border-bottom">' + data.data.hashCode + '</div>' +
                                '</div>'+
                                '</div>';
                            var str = '';
                            for (var i = 0; i < data.data.listBillTransferDetailDTO.length; i++) {
                                var item = data.data.listBillTransferDetailDTO[i];
                                str += '<tr>' +
                                    '<td class="g-text-center">' +
                                    '<span>' + item.billNo + '</span>' +
                                    '</td>' +
                                    '<td class="g-text-center">' + item.payerName + '</td>' +
                                    '<td class="maincol g-text-center">' + M.getFormatNumber(item.billTransferAmount,2,'.',',') + '</td>' +
                                    '<td class="g-text-center">' + M.timetrans(item.maturityDate) + '</td>' +
                                    '<td class="g-text-center"><a href="javascript:;" class=" bill-download" detail-no="' + item.billNo + '">下载</a></td>' +
                                    '</tr>';
                            };
                            if(data.data.invoiceDTOList != null){
                                var arr = '';
                                for(var j =0; j < data.data.invoiceDTOList.length;j++){
                                    var item = data.data.invoiceDTOList[j];
                                    arr += '<tr>\n' +
                                        '   <td class="g-text-center">'+item.invoiceCode+'</td>\n' +
                                        '      <td class="g-text-center">'+item.invoiceNumber+'</td>\n' +
                                        '        <td class="g-text-center">'+item.billingDate+'</td>\n' +
                                        '         <td class="g-text-center">'+item.taxRate*100+'%</td>\n' +
                                        '         <td class="g-text-center maincol">'+M.getFormatNumber(item.amountTax, 2)+'</td>\n' +
                                        '          <td class="g-text-center">'+item.purchaserName+'<br>\n' +
                                        '             '+item.salesName+'         </td>' +
                                        '          <td class="g-text-center"><a  onclick="M.downloadFileXhr('+"'"+item.fileAddress+"'"+','+"'"+item.fileName+"'"+')"  href="javascript:;">下载</a></td>\n' +
                                        '</tr>'
                                }
                                M('.invoiceDetail').html(arr);
                            }else{
                                // M.ui.waiting.creat({
                                //     status:false,
                                //     time:1000,
                                //     text:'查询不到发票信息！',
                                //     hide:false
                                // });
                            };
                            if(data.data.fileDTOList != null){
                                var fileArr = '';
                                for(var j =0; j < data.data.fileDTOList.length;j++){
                                    var item = data.data.fileDTOList[j];

                                    fileArr += '<a href="javacript:;"  onclick="M.downloadFileXhr('+"'"+item.fileAddress+"'"+','+"'"+item.fileName+"'"+')" >'+item.fileName+'</a>&nbsp;&nbsp;';
                                }
                                M('.upload-wrap').append(fileArr);
                            }


                            M('#g-tab-main-info').html(strTable);
                            M('.g-main-content-info').html(str);
                            $('#remark').html(data.data.businessNum);
                            // if (data.data.status == 30) {
                            //     var btn = '<button id="pdfPrint2" class="ui-button ui-btn-sm ui-btn-grey mar-left-20">凭证打印</button>';
                            //     $('#operation-btn').append(btn);
                            // }
                            M('.bill-download').bind('click', function (e) {
                                var billNO = M(this).attr('detail-no');
                                that.downLoadBill(billNO);
                            });
                        }else{
                            M.ui.waiting.creat({
                                status:false,
                                time:1000,
                                text:data.message,
                                hide:false
                            });
                        }
                    },
                    error: function (res) {
                        console.log(res);
                    }
                });
            },

        })(function () {
            M.billIssue.init();
        });
    }
)
