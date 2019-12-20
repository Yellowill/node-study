require(['head','menu','base','tab','page', 'waiting', 'calendar','plupload', 'calculator', 'fuzzy'],
    function(){
        M.define('financingSupplementread',{
            head:M.ui.head.init(),
            init:function(){
                M.ui.menu.init({
                    index:[],
                    url:M.getNormalPath('getMenu.json',4),
                    callback: function() {

                    }
                });
                this.banknum = '';

                var id=  M.getUrlParam('id');
                var applicationId =  M.getUrlParam('bizId');
                var bizNo =  M.getUrlParam('bizNo');
                var type =  M.getUrlParam('type');
                this.id = id;
                this.applicationId = applicationId;
                this.bizNo = bizNo;
                this.type = type;
                this.contracts = [];

                this.getTableData();

                M('#mark').bind('focus',function(){
                    M('.js-warning-text').hide()
                })
                M('.js-warning-text').bind('click',function(){
                    M('.js-warning-text').hide();
                    M('#mark').focus();
                })
                M('#mark').bind('blur',function(){
                    if($('#mark').val().length>0){
                        M('.js-warning-text').hide()
                    }else{
                        M('.js-warning-text').show()
                    }

                })
                M('.close-read').bind('click',function(){
                    M.closeCurrentPage();
                })

            },


            getTableData: function () {


                if(this.type == 'T') {
                    this.getKailiData();
                } else {
                    this.getTransData();
                }

            },

            getTransData: function() {

                //贸易背景
                M.ajaxFn({
                    url: $.interfacePath.bill + 't/findTransferOutDetails/list',
                    type: 'post',
                    data: {
                        id: this.applicationId,
                    },
                    dataType: 'json',
                    success: function (res) {
//                        console.log(res)
                        if (res.success) {
                            var str = '';
                            var data = res.data;
                            var uploadStr = '';
                            var str = '';

                            var totalPrice = 0;

                            if (data.invoiceDTOList != null) {
                                var arr = '';

                                var uploadIds = [];
                                var uploadInvoiceCode = [];
                                var uploadInvoiceNumber = [];
                                if (data.invoiceDTOList.length > 0) {
                                    for (var j = 0; j < data.invoiceDTOList.length; j++) {
                                        var item = data.invoiceDTOList[j];

                                        var downloadTag = '<div class="enclosure"><a class="js-download" href="javascript:;" onclick="M.downloadFileXhr(' + "'" + item.fileAddress + "'" + ',' + "'" + item.fileName + "'" + ')">下载</a></div>';


                                        str +=
                                            '<div class="invoice-code">' + item.invoiceCode + '</div>' +
                                            '<div class="invoice-num">' + item.invoiceNumber + '</div>' +
                                            '<div class="invoice-date">' + item.billingDate + '</div>' +
                                            '<div class="invoice-rate">' + item.taxRate * 100 + '%</div>' +
                                            '<div class="invoice-money">' + M.getFormatNumber(item.amountTax, 2) + '</div>' +
                                            '<div class="invoice-buy">\n' +
                                            '    <p>' + item.purchaserName + '</p>\n' +
                                            '     <p>' + item.salesName + '</p>\n' +
                                            '</div>' +
                                            downloadTag

                                        $('.table-tr').html(str);

                                        totalPrice += M.arithmeticAdd(totalPrice, parseFloat(item.amountTax));

                                        // for (var i = 0; i < uploadIds.length; i++) {
                                        //     M.financingSupplementread.uploadInvoiceInit(uploadIds[i], uploadInvoiceNumber[i], uploadInvoiceCode[i]);
                                        // }
                                    }
                                } else {
                                    var noData = '<div class="noData"><img src="../../template/res/images/empty.png" alt=""><div class="col60 mar-top-10">暂无记录</div></div>';
                                    $('.table-tr').html(noData);
                                }
                                if (data.fileDTOList != null) {
                                    var fileArr = '';
                                    for (var j = 0; j < data.fileDTOList.length; j++) {
                                        var item = data.fileDTOList[j];

                                        uploadStr += '<div class="file-box">' +
                                            '<div class="file-name"><a class="download" href="javascript:;">' + item.fileName + '</a></div>' +
                                            '</div>'
                                        // uploadStr += '<div class="upload-wrap g-left mar-right-20 mar-top-5"><i class="iconfont upload"></i><a href="javascript:;" onclick="M.downloadFileXhr(' + "'" + invoice.fileAddress + "'" + ',' + "'" + invoice.fileName + "'" + ')">' + invoice.fileName + '</a></div>'
                                        var item = {
                                            fileAddress: item.fileAddress,
                                            fileName: item.fileName,
                                            format: item.fileFormat,
                                            size: item.fileSize
                                        }

                                        M.financingSupplementread.contracts.push(item);
                                    }
                                    $('#uploadBox').html(uploadStr);
                                }
                            }
                            var transferAmount = data.transferAmount;



                            if (data.businessNum) {
                                M('.description').html(data.businessNum)
                                M('.js-warning-text').hide()
                            }

                            M('.js-fp-address').val(data.contractName);
                            M('.js-fp-phone').val(data.contractNumber);
                        } else {
                            M.ui.waiting.creat({
                                status: false,
                                time: 1000,
                                text: res.message,
                                hide: false,
                            });
                        }
                    },
                    error: function (err) {
                        console.log(err)
                    }
                })
            },

            getKailiData: function() {
                //贸易背景
                M.ajaxFn({
                    url: $.interfacePath.bill + 't/myFinanceBillOne/query',
                    type: 'post',
                    data: {
                        billNo: this.bizNo,
                    },
                    dataType: 'json',
                    success: function (res) {
//                        console.log(res)
                        if (res.success) {
                            var str = '';
                            var data = res.data;
                            var invoices = data.invoiceContentFileDTOS;
                            var uploadStr = '';
                            var totalPrice = 0;

                            var uploadIds = [];
                            var uploadInvoiceCode = [];
                            var uploadInvoiceNumber = [];

                            var str =  '';

                            if (invoices && invoices.length>0) {
                                for (var i = 0; i < invoices.length; i++) {
                                    var invoice = invoices[i];
                                    var billingDate = invoice.billingDate || '';
                                    var downloadTag = '';


                                    var downloadTag = '<div class="enclosure"><a class="js-download" href="javascript:;" onclick="M.downloadFileXhr(' + "'" + invoices.fileAddress + "'" + ',' + "'" + invoices.fileName + "'" + ')">下载</a></div>';

                                    if (invoice.certificateType == '1') {
                                        str +=
                                            '<div class="invoice-code">' + invoice.invoiceCode + '</div>' +
                                            '<div class="invoice-num">' + invoice.invoiceNumber + '</div>' +
                                            '<div class="invoice-date">' + billingDate + '</div>' +
                                            '<div class="invoice-rate">' + invoice.taxRate * 100 + '</div>' +
                                            '<div class="invoice-money">' + M.getFormatNumber(invoice.amountTax, 2) + '</div>' +
                                            '<div class="invoice-buy">\n' +
                                            '    <p>' + invoice.purchaserName + '</p>\n' +
                                            '     <p>' + invoice.salesName + '</p>\n' +
                                            '</div>' +
                                            downloadTag

                                            totalPrice += M.arithmeticAdd(totalPrice, parseFloat(invoice.amountTax));
                                    } else {
                                        if (invoice.fileAddress != null && invoice.fileAddress !== '') {
                                            uploadStr += '<div class="file-box">'+
                                                '<div class="file-name"><a class="download" href="javascript:;">'+invoice.fileName+'</a></div>'+
                                                '<div class="file-size">'+(invoice.fileSize/1024).toFixed(2)+'k</div>'+
                                                '</div>'
                                            // uploadStr += '<div class="upload-wrap g-left mar-right-20 mar-top-5"><i class="iconfont upload"></i><a href="javascript:;" onclick="M.downloadFileXhr(' + "'" + invoice.fileAddress + "'" + ',' + "'" + invoice.fileName + "'" + ')">' + invoice.fileName + '</a></div>'
                                            var item = {
                                                fileAddress: invoice.fileAddress,
                                                fileName: invoice.fileName,
                                                format: invoice.fileFormat,
                                                size: invoice.fileSize
                                            }
                                            M.financingSupplementread.contracts.push(item);
                                        }
                                        $('#uploadBox').html(uploadStr);
                                    }
                                }

                                $('.table-tr').html(str);
                            }else{
                                var noData = '<div class="noData"><img src="../../template/res/images/empty.png" alt=""><div class="col60 mar-top-10">暂无记录</div></div>';
                                $('.table-tr').html(noData);
                            }
                            var assetsAmount = data.assetsAmount;

                            // for (var i = 0; i<uploadIds.length; i++) {
                            //     M.financingSupplementread.uploadInvoiceInit(uploadIds[i],  uploadInvoiceNumber[i], uploadInvoiceCode[i]);
                            // }


                            M('.js-fp-address').val(data.contractName)
                            M('.js-fp-phone').val(data.contractNumber)
                            if (data.remark) {
                                M('.description').html(data.remark)
                                M('.js-warning-text').hide()
                            }


                        } else {
                            M.ui.waiting.creat({
                                status:false,
                                time:1000,
                                text:res.message,
                                hide:false,
                            });
                        }
                    },
                    error: function (err) {
                        console.log(err)
                    }
                })
            },




        })(function(){
            M.financingSupplementread.init();
        });
    }
)
