require(['head','menu','base','tab','page', 'waiting', 'calendar','plupload', 'calculator', 'fuzzy', 'confirm', 'customDialog'],
    function(){
        M.define('financingSupplement',{
            head:M.ui.head.init(),
            init:function(){
                M.ui.menu.init({
                    index:[],
                    url:M.getNormalPath('getMenu.json',4),
                    callback: function() {

                    }
                });
                this.acceptCode = M.getUrlParam('applicationId');
                this.getBankInfo();
                this.bankSettings = {};  //金融机构配置

                var id=  M.getUrlParam('id');
                var applicationId =  M.getUrlParam('bizId');
                var bizNo =  M.getUrlParam('bizNo');
                var type =  M.getUrlParam('type');

                this.id = id;
                this.applicationId = applicationId;

                this.bizNo = bizNo;
                this.type = type;
                this.addInvoiceObj = null;
                this.contracts = [];
                this.canGoNext = false;
                this.tradeAmount = 0;
                $('.prev').off('click').on('click',this.prev.bind(this));
                $('.next').off('click').on('click',this.next.bind(this));
                $(document).on('click','.js-verification',this.removeError);
                $(document).on('keyup','.js-verification',this.check);
                $(document).on('change','.js-verification',this.check);
                this.uploadInit();

                M('.addInvoice').unbind('click').bind('click', function () {

                    var addInvoice = M.financingSupplement.addInvoiceObj;
                    var type = M.financingSupplement.type == "T" ? "00" : "10";

                    var id;

                    if(M.financingSupplement.type == 'T') {
                        id = M.financingSupplement.bizNo;
                    } else {
                        id = M.financingSupplement.applicationId;
                    }

                    var url = "addnewInvoice.html?transferAmount=" + addInvoice.transferAmount
                        +"&transferorName=" + encodeURIComponent(encodeURIComponent(addInvoice.transferorName))
                        +"&transferorId=" + addInvoice.transferorId
                        +"&transfereeName=" + encodeURIComponent(encodeURIComponent(addInvoice.transfereeName))
                        +"&transfereeId=" + addInvoice.transfereeId
                        +"&type=" + type
                        +"&id=" + id
                        +"&tradeAmount=" + M.financingSupplement.tradeAmount;

                    var el = document.createElement("a");
                    document.body.appendChild(el);
                    el.href = url; //url 是你得到的连接
                    el.target = '_blank'; //指定在新窗口打开
                    el.click();
                    // document.body.removeChild(el);
                });
                M('#mark').bind('keyup', function () {
                    $(this).val($(this).val().substring(0,100));
                });
                M('#mark').bind('change', function () {
                    $(this).val($(this).val().substring(0,100));
                });
                M('#mark').bind('keydown', function () {
                    $(this).val($(this).val().substring(0,100));
                });
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

                M('.tocheck-invoice').click(function(){
                    M.ui.customDialog.init({
                        drag:true,
                        title:'驳回意见',
                        width:300,
                        height:200,
                        autoClose:false,
                        url:'../dialog/dialog-addInvoice.html',
                        callback:function(e){
                            M.financingSupplement.initAdd(e);
                            M('.ui-dialog-close').click(function(){
                                e.remove();
                            });
                            M('#newInvoice').click(function(){
                                e.remove();
                            });
                        }
                    });
                });
            },

            //初始化新增发票
            initAdd: function(e) {

                var contract = [];

                var uploader = new plupload.Uploader({ //实例化一个plupload上传对象
                    browse_button : 'browse',//上传ID
                    headers:{
                        'Authorization': own.fetch('userInfo').token,
                    },
                    url :  M.interfacePath.assetsUpload,
                    runtimes: 'gears,html5,html4,silverlight,flash',
                    flash_swf_url : '../../../../base/js/core/Moxie.swf',
                    silverlight_xap_url : '../../../../base/js/core/Moxie.xap',
                    multipart_params: {
                        'Authorization': own.fetch('userInfo').token
                    },
                    filters: {
                        mime_types : [ //只允许上传图片和zip文件
                            { title : "Image files", extensions : "jpg,gif,png" },
                            { title : "Zip files", extensions : "zip" },
                            { title : "Document files", extensions : "pdf" }
                        ],
                        max_file_size : '10485760' //最大只能上传5120kb的文件
                    }
                });
                uploader.init(); //初始化
                uploader.bind('FilesAdded',function(uploader,files){
                    var filesLens = files.length + contract.length;
                    if (contract.length < 1000 && filesLens <= 1000 ) {
                        uploader.start();
                    } else {
                        for (var i=0; i<files.length; i++) {
                            uploader.removeFile(files[i])
                        }
                        // M.ui.waiting.creat({
                        //     status:false,
                        //     time:1000,
                        //     text:'最多只能上传五个附件',
                        //     hide:false,
                        // });
                    }
                });
                uploader.bind('Error',function(uploader,errObject){
                    // console.log(errObject);
                    if(errObject.code == -602){
                        M.ui.waiting.creat({
                            status:false,
                            time:1000,
                            text:'不能选择相同文件！',
                            hide:false,
                        });
                    }
                    if(errObject.code == -601){
                        M.ui.waiting.creat({
                            status:false,
                            time:1000,
                            text:'不支持该文件类型上传，请重新选择！',
                            hide:false,
                        });
                    }
                    if(errObject.code == -600){
                        M.ui.waiting.creat({
                            status:false,
                            time:1000,
                            text:'单个文件不能超过10M，请压缩后上传！',
                            hide:false,
                        });
                    }
                });
                uploader.bind('FileUploaded',function(uploader,files,res){
                    var response = res.response.replace("<pre>", "").replace("</pre>", "").replace("<PRE>", "").replace("</PRE>", "").replace(/<[^>]+>/g, "")
                    var data = JSON.parse(response);
                    // console.log(data);
                    if( data.success ) {
                        M.ui.waiting.creat({
                            position:'fixed',
                            status:'loading',
                            time:500,
                            callback:function(){
                                M.ui.waiting.creat({
                                    status:true,
                                    time:1000,
                                    text:data.message,
                                    hide:false,
                                });
                            }
                        });
                        var invoice = data.data;
                        contract.push({
                            picPath: invoice.fileAddress,
                            fileName: invoice.fileName,
                            fileFormat: invoice.format,
                            fileSize: invoice.size
                        });
                        var file_name = files.name; //文件名
                        var file_size = data.data.size;
                        //构造html来更新UI
                        M('.uploadBox').addClass('upload-info');
                        var html2 =  '<div class="file-box">'+
                            '<div class="file-name"><a class="download" href="javascript:;">'+file_name+'</a><a href="javascript:;" class="removeItem">删除</a></div>'+
                            '<div class="file-size">'+(file_size/1024).toFixed(2)+'k</div>'+
                            '</div>'
                        $(html2).appendTo('.uploadBox');

                    } else {
                        M.ui.waiting.creat({
                            status:false,
                            time:3000,
                            text:data.message,
                            hide:false,
                            callback: function () {
                                if(data.code.indexOf('TK')>=0){
                                    var codeStr=data.code;
                                    var cod=Number(codeStr.substring(codeStr.indexOf('TK')+2));

                                    if(cod<5){  // 登录超时
                                        own.logout();
                                    }
                                    else if(cod==5){
                                        own.logout();
                                    }
                                    else if(cod==6 || cod==7){  // 无权限
                                        return window.location.href='../basic/500.html';
                                    }
                                }
                            }
                        });
                    }
                });
                // 点击删除
                $(document).off('click','.removeItem').on('click','.removeItem',function(){
                    var index = $('.uploadBox .removeItem').index($(this));
                    contract.splice(index, 1);
                    $(this).parents('.file-box').remove();
                    if (contract.length == 0) {
                        M('.uploadBox').removeClass('upload-info');
                    }
                });
                var flag=false;
                M("#trueSubmit").on("click",function(){
                    if (contract.length == 0) {

                        M.ui.waiting.creat({
                            status:false,
                            time:1000,
                            text:'附件不能为空',
                            hide:false,
                        });
                        return;
                    }
                    if(!flag){
                        flag = true;
                        var params = contract
                        M.ajaxFn({
                            url:M.interfacePath.assets+'t/baidu/webOcrCheckFile',
                            type: 'post',
                            data: params,
                            dataType: 'json',
                            async:false,
                            success: function (data) {
                                if (data.success) {
                                    var url = "checkInvoice.html";
                                    var el = document.createElement("a");
                                    document.body.appendChild(el);
                                    el.href = url; //url 是你得到的连接
                                    el.target = '_blank'; //指定在新窗口打开
                                    el.click();
                                    document.body.removeChild(el);

                                    M.ui.waiting.creat({
                                        status:true,
                                        time:1000,
                                        text:data.message,
                                        hide:false,
                                        callback: function () {
                                            flag=false;
                                            e.remove();
                                            contract=[];
                                        }
                                    });
                                } else {
                                    flag=false
                                    M.ui.waiting.creat({
                                        status:false,
                                        time:1000,
                                        text:data.message,
                                        hide:false,
                                    });
                                }
                            },
                            error: function (err) {
                                console.log(err)
                            }
                        })
                    }
                })
            },

            //获取金融机构配置
            getBankInfo: function() {
                $.ajaxFn({
                    url:$.interfacePath.bill+'t/nologin/getFinanceOrgConfigByAcceptCode',
                    data:{acceptCode:M.financingSupplement.acceptCode},
                    type:'POST',
                    dataType:'JSON',
                    success:function(data,args){
                        if (data.success) {
                            M.financingSupplement.getTableData(false);
                            M.financingSupplement.setArgs(data.data);

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

            setArgs: function(bankConfig) {
                var needContract;
                var needReceipt;
                var needReceiptUpload;
                var needInvoiceCheck;

                if (M.financingSupplement.type == "T") {
                    needContract = bankConfig.contractForTongbao == '1';
                    needReceipt = bankConfig.invoiceDataForTongbao == '1';
                    needReceiptUpload = bankConfig.invoiceFileForTongbao == '1';
                    needInvoiceCheck = bankConfig.invoiceCheckForTongbao == '1';
                } else {
                    needContract = bankConfig.contractForTransfer == '1';
                    needReceipt = bankConfig.invoiceDataForTransfer == '1';
                    needReceiptUpload = bankConfig.invoiceFileForTransfer == '1';
                    needInvoiceCheck = bankConfig.invoiceCheckForTransfer == '1';
                }

                M.financingSupplement.setNeedContract(needContract);

                M.financingSupplement.bankSettings = {
                    needContract: needContract,
                    needReceipt: needReceipt,
                    needReceiptUpload: needReceiptUpload,
                    needInvoiceCheck: needInvoiceCheck
                }
            },

            setNeedContract: function(needContract) {
                if (!needContract) {
                    M('.need-contract').hide();
                }
            },


            getTableData: function (isReload) {

                if (isReload) {
                    M('.js-money-container').hide();
                }

                if(this.type == 'T') {
                    this.getKailiData(isReload);
                } else {
                    this.getTransData(isReload);
                }

            },

            getTransData: function(isReload) {

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
                                var invoiceIds = [];
                                var uploadIndexs = [];
                                var uploadCanDelete = [];
                                var uploadInvoiceCode = [];
                                var uploadInvoiceNumber = [];
                                if (data.invoiceDTOList.length > 0) {
                                    for (var j = 0; j < data.invoiceDTOList.length; j++) {
                                        var item = data.invoiceDTOList[j];
                                        var downloadTag = '';
                                        var deleteTag = '';

                                        if (item.fileAddress != null && M.trim(item.fileAddress) !== '') {
                                            var id = 'invoice' + j;
                                            downloadTag = '<a class="js-download" href="javascript:;" onclick="M.downloadFileXhr(' + "'" + item.fileAddress + "'" + ','  + "'" + item.fileName + "'" + ')">下载</a>';
                                            downloadTag += '<span class="centerLine">|</span><a class="js-uploadAttachments" href="javascript:;" id="' + id + '">重新上传</a>';
                                            uploadIds.push(id);
                                            uploadIndexs.push(j);
                                            invoiceIds.push(item.id);
                                            uploadCanDelete.push(item.canDelete);
                                            uploadInvoiceCode.push(item.invoiceCode);
                                            uploadInvoiceNumber.push(item.invoiceNumber);
                                        } else {
                                            var id = 'invoice' + j;

                                            var color = 'red';

                                            if (!M.financingSupplement.bankSettings.needReceiptUpload) {
                                                color = '#00c1de';
                                            }

                                            downloadTag = '<a class="js-uploadAttachments" href="javascript:;" id="' + id + '" style="color: '+ color + '">上传附件</a>';
                                            uploadIds.push(id);
                                            uploadIndexs.push(j);
                                            invoiceIds.push(item.id);
                                            uploadCanDelete.push(item.canDelete);
                                            uploadInvoiceCode.push(item.invoiceCode);
                                            uploadInvoiceNumber.push(item.invoiceNumber);
                                        }
                                        
                                        if (item.canDelete == '1') {
                                            deleteTag = '<span class="centerLine">|</span><a class="js-delete" href="javascript:;" data-id="' + item.id + '">删除</a>';
                                        }


                                        var billingDate = item.billingDate  || " ";

                                        var taxRate = item.taxRate ? M.arithmeticTim(item.taxRate, 100) : '0';

                                        var checkHtml = item.isCheck == '1' ? '已通过':'未通过';
                                        var checkClase = item.isCheck == '1' ? 'invoice-checked':'invoice-ncheck';

                                        str +=
                                            '<div class="table-needtr">' +
                                            '<div class="g-left invoice-code">' + item.invoiceCode + '</div>' +
                                            '<div class="g-left invoice-num">' + item.invoiceNumber + '</div>' +
                                            '<div class="g-left invoice-date">' + billingDate + '</div>' +
                                            '<div class="g-left invoice-rate">' + taxRate + '%</div>' +
                                            '<div class="g-left invoice-check-text ' + checkClase + '">' + checkHtml + '</div>' +
                                            '<div class="g-left invoice-money">' + M.getFormatNumber(item.thisAmountTax, 2) + '</div>' +
                                            '<div class="g-left invoice-buy">\n' +
                                            '    <p>' + item.purchaserName + '</p>\n' +
                                            '     <p>' + item.salesName + '</p>\n' +
                                            '</div>' +
                                            '<div class="g-left enclosure">' + 
                                                downloadTag + deleteTag +
                                            '</div>' +
                                            '</div>'
                                        $('.table-tr').html(str);

                                        totalPrice = M.arithmeticAdd(totalPrice, parseFloat(item.thisAmountTax));
                                    }
                                    for (var i = 0; i < uploadIds.length; i++) {
                                        M.financingSupplement.uploadInvoiceInit(uploadIds[i], invoiceIds[i], uploadInvoiceNumber[i], uploadInvoiceCode[i], uploadIndexs[i], uploadCanDelete[i]);
                                    }
                                }
                            } else {
                                var noData = '<div class="invoiceData"><div class="col60 mar-top-10">暂无发票数据</div></div>';
                                $('.table-tr').html(noData);
                            }

                            if (data.fileDTOList != null && !isReload) {
                                var fileArr = '';
                                for (var j = 0; j < data.fileDTOList.length; j++) {
                                    var item = data.fileDTOList[j];

                                    var canDelete = item.canDelete == '1' ? '<a href="javascript:;" class="removeItem">删除</a>' : '<a href="javascript:;" style="display:none" class="removeItem">删除</a>';

                                    uploadStr += '<div class="file-box">' +
                                        '<div class="file-name"><a class="download" href="javascript:;">' + item.fileName + '</a>' + canDelete + '</div>' +
                                        '</div>'
                                    // uploadStr += '<div class="upload-wrap g-left mar-right-20 mar-top-5"><i class="iconfont upload"></i><a href="javascript:;" onclick="M.downloadFileXhr(' + "'" + invoice.fileAddress + "'" + ',' + "'" + invoice.fileName + "'" + ')">' + invoice.fileName + '</a></div>'
                                    var item = {
                                        fileId: item.fileId,
                                        fileAddress: item.fileAddress,
                                        fileName: item.fileName,
                                        format: item.fileFormat,
                                        size: item.fileSize
                                    }

                                    M.financingSupplement.contracts.push(item);
                                }
                                $('#uploadBox').html(uploadStr);
                            }

                            var transferAmount = data.transferAmount;

                            if (parseFloat(transferAmount) > totalPrice) {
                                //显示新增发票按钮
                                M('.addInvoice').show();
                                if (!M.financingSupplement.bankSettings.needReceipt) {
                                    M('.addInvoice').addClass('addInvoice-new');
                                }

                                //新增发票参数
                                var transferorName = data.transferorName;
                                var transferorId = data.transferorId;
                                var transfereeName = data.transfereeLegalName;
                                var transfereeId = data.transfereeId;

                                var transferAmount1 = M.arithmeticAdd(parseFloat(transferAmount), -totalPrice);

                                M.financingSupplement.addInvoiceObj = {
                                    transferAmount: transferAmount1,
                                    transferorName: transferorName,
                                    transferorId: transferorId,
                                    transfereeName: transfereeName,
                                    transfereeId: transfereeId
                                }
                            }

                            if (totalPrice > 0) {
                                M('.js-money-container').show();
                                M('.js-totalmoney').html(M.getFormatNumber(totalPrice, 2));
                            }

                            if (data.businessNum) {
                                M('.description').html(data.businessNum)
                                M('.js-warning-text').hide()
                            }

                            M('.js-fp-address').val(data.contractNumber);
                            M('.js-fp-phone').val(data.contractName);


                            var source = M.financingSupplement.type == 'T' ? '通宝开立' : '通宝转让';

                            M('.js-source').val(source);
                            M('.js-jynum').val(data.batchNo);
                            M('.js-jyobject').val(data.transferorName);
                            M('.js-jymoney').val(M.getFormatNumber(data.transferAmount, 2));

                            M.financingSupplement.tradeAmount = data.transferAmount;

                            M('.js-delete').unbind('click').bind('click', function (e) {
                                var invoiceId=$(this).attr('data-id');
                                M.financingSupplement.deleteInvoice(invoiceId);
                            })

                            M.financingSupplement.setNeedCheckInvoices();
                            M.financingSupplement.setInputStatus();
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

            getKailiData: function(isReload) {
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
                            var invoiceIds = [];
                            var uploadIndexs = [];
                            var uploadCanDelete = [];
                            var uploadInvoiceCode = [];
                            var uploadInvoiceNumber = [];

                            var str =  '';

                            var isNoData = true;

                            if (invoices && invoices.length>0) {
                                for (var i = 0; i < invoices.length; i++) {
                                    var invoice = invoices[i];
                                    var billingDate = invoice.billingDate || ' ';
                                    var downloadTag = '';
                                    var deleteTag = '';


                                    if (invoice.fileAddress != null && M.trim(invoice.fileAddress) !== '') {
                                        if (invoice.certificateType == '1') {
                                            var id = 'invoice' + i;
                                            downloadTag = '<a class="js-download" href="javascript:;" onclick="M.downloadFileXhr(' +  "'"  + invoice.fileAddress  + "'" + ',' + "'" + invoice.fileName + "'" + ')">下载</a>';
                                            downloadTag += '<span class="centerLine">|</span><a class="js-uploadAttachments" href="javascript:;" id="' + id + '">重新上传</a>';
                                            uploadIds.push(id);
                                            invoiceIds.push(invoice.invoiceId);
                                            uploadIndexs.push(i);
                                            uploadCanDelete.push(invoice.canDelete);
                                            uploadInvoiceCode.push(invoice.invoiceCode);
                                            uploadInvoiceNumber.push(invoice.invoiceNumber);
                                        }
                                    } else {
                                        var id = 'invoice' + i;

                                        var color = 'red';

                                        if ((!M.financingSupplement.bankSettings.needReceiptUpload) || invoice.bizType == "W" || invoice.bizType == "Y") {
                                            color = '#00c1de';
                                        }

                                        downloadTag = '<a class="js-uploadAttachments" href="javascript:;" id="' + id + '" style="color:' + color + '">上传附件</a>';
                                        uploadIds.push(id);
                                        invoiceIds.push(invoice.invoiceId);
                                        uploadIndexs.push(i);
                                        uploadCanDelete.push(invoice.canDelete);
                                        uploadInvoiceCode.push(invoice.invoiceCode);
                                        uploadInvoiceNumber.push(invoice.invoiceNumber);
                                    }

                                    if (invoice.canDelete == '1') {
                                        deleteTag = '<span class="centerLine">|</span><a class="js-delete" href="javascript:;" data-id="' + invoice.invoiceId + '">删除</a>';
                                    }

                                    if (invoice.certificateType == '1') {
                                        var taxRate = invoice.taxRate ? M.arithmeticTim(invoice.taxRate, 100) : '0';

                                        var checkHtml = '';
                                        var checkClase = 'invoice-checked';

                                        if (invoice.bizType == "W" || invoice.bizType == "Y") {

                                        } else {
                                            checkHtml = invoice.isCheck == '1' ? '已通过' : '未通过';
                                            checkClase = invoice.isCheck == '1' ? 'invoice-checked' : 'invoice-ncheck';
                                        }

                                        str +=
                                            '<div class="table-needtr">' +
                                            '<div class="g-left invoice-code">' + invoice.invoiceCode + '</div>' +
                                            '<div class="g-left invoice-num">' + invoice.invoiceNumber + '</div>' +
                                            '<div class="g-left invoice-date">' + billingDate + '</div>' +
                                            '<div class="g-left invoice-rate">' + taxRate + '%</div>' +
                                            '<div class="g-left invoice-check-text ' + checkClase + '">' + checkHtml + '</div>' +
                                            '<div class="g-left invoice-money">' + M.getFormatNumber(invoice.thisAmountTax, 2) + '</div>' +
                                            '<div class="g-left invoice-buy">\n' +
                                            '    <p>' + invoice.purchaserName + '</p>\n' +
                                            '     <p>' + invoice.salesName + '</p>\n' +
                                            '</div>' +
                                            '<div class="g-left enclosure">' +
                                                downloadTag+deleteTag +
                                            '</div>' +
                                            '</div>'
                                            totalPrice = M.arithmeticAdd(totalPrice, parseFloat(invoice.thisAmountTax));

                                        isNoData = false;
                                    } else if (!isReload){
                                        if (invoice.fileAddress != null && invoice.fileAddress !== '') {

                                            var canDelete = invoice.canDelete == '1' ? '<a href="javascript:;" class="removeItem">删除</a>' : '<a href="javascript:;" style="display:none" class="removeItem">删除</a>';

                                            uploadStr += '<div class="file-box">'+
                                                '<div class="file-name"><a class="download" href="javascript:;">'+invoice.fileName+'</a>' + canDelete + '</div>'+
                                                '<div class="file-size">'+(invoice.fileSize/1024).toFixed(2)+'k</div>'+
                                                '</div>'
                                            // uploadStr += '<div class="upload-wrap g-left mar-right-20 mar-top-5"><i class="iconfont upload"></i><a href="javascript:;" onclick="M.downloadFileXhr(' + "'" + invoice.fileAddress + "'" + ',' + "'" + invoice.fileName + "'" + ')">' + invoice.fileName + '</a></div>'
                                            var item = {
                                                fileId: invoice.fileId,
                                                fileAddress: invoice.fileAddress,
                                                fileName: invoice.fileName,
                                                format: invoice.fileFormat,
                                                size: invoice.fileSize
                                            }
                                            M.financingSupplement.contracts.push(item);
                                        }
                                        $('#uploadBox').html(uploadStr);
                                    }
                                }

                                $('.table-tr').html(str);
                            }

                            if (isNoData) {
                                var noData = '<div class="invoiceData"><div class="col60 mar-top-10">暂无发票数据</div></div>';
                                $('.table-tr').html(noData);
                            }


                            var assetsAmount = data.assetsAmount;

                            if (parseFloat(assetsAmount) > totalPrice) {
                                //显示新增发票按钮
                                M('.addInvoice').show();
                                if (!M.financingSupplement.bankSettings.needReceipt) {
                                    M('.addInvoice').addClass('addInvoice-new');
                                }

                                //新增发票参数
                                var payerId = data.payerId;
                                var payerName = data.payerName;
                                var receivingId = data.receivingId;
                                var receivingName = data.receiverLegalName;

                                var transferAmount = M.arithmeticAdd(parseFloat(assetsAmount), -totalPrice);

                                M.financingSupplement.addInvoiceObj = {
                                    transferAmount:transferAmount,
                                    transferorName:payerName,
                                    transferorId:payerId,
                                    transfereeName:receivingName,
                                    transfereeId:receivingId
                                }
                            }

                            if (totalPrice > 0) {
                                M('.js-money-container').show();
                                M('.js-totalmoney').html(M.getFormatNumber(totalPrice, 2));
                            }

                            for (var i = 0; i<uploadIds.length; i++) {
                                M.financingSupplement.uploadInvoiceInit(uploadIds[i], invoiceIds[i],  uploadInvoiceNumber[i], uploadInvoiceCode[i], i, uploadCanDelete[i]);
                            }


                            M('.js-fp-address').val(data.contractNumber)
                            M('.js-fp-phone').val(data.contractName)
                            if (data.remark) {
                                M('.description').html(data.remark)
                                M('.js-warning-text').hide()
                            }

                            var source = M.financingSupplement.type == 'T' ? '通宝开立' : '通宝转让';

                            M('.js-source').val(source);
                            M('.js-jynum').val(data.billNo);
                            M('.js-jyobject').val(data.payerName);
                            M('.js-jymoney').val(M.getFormatNumber(data.billAmount, 2));

                            M.financingSupplement.tradeAmount = data.billAmount;

                            M('.js-delete').unbind('click').bind('click', function (e) {
                                var invoiceId=$(this).attr('data-id');
                                M.financingSupplement.deleteInvoice(invoiceId);
                            })

                            M.financingSupplement.setNeedCheckInvoices();
                            M.financingSupplement.setInputStatus();

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

            setNeedCheckInvoices: function() {
                var needCheck = M.financingSupplement.bankSettings.needInvoiceCheck;

                if (needCheck != "1") return;

                var hasUncheck = false;
                M('.table-tr .table-needtr .invoice-check-text').each(function () {
                    if (M(this).html() == "未通过") {
                        hasUncheck = true;
                        return false;
                    };
                })

                if (hasUncheck) {
                    M('.check-invoice').show();
                }
            },

            setInputStatus: function () {

                if (!M.financingSupplement.bankSettings.needContract) {return;}

                M.financingSupplement.setSingleInputStatus('.js-fp-address');
                M('.js-fp-address').bind('change',function(){
                    M.financingSupplement.setSingleInputStatus('.js-fp-address');
                })
                M('.js-fp-address').bind('keyup',function(){
                    M.financingSupplement.setSingleInputStatus('.js-fp-address');
                })

                M.financingSupplement.setSingleInputStatus('.js-fp-phone');
                M('.js-fp-phone').bind('change',function(){
                    M.financingSupplement.setSingleInputStatus('.js-fp-phone');
                })
                M('.js-fp-phone').bind('keyup',function(){
                    M.financingSupplement.setSingleInputStatus('.js-fp-phone');
                })

                M.financingSupplement.setSingleInputStatus('#mark');
                M('#mark').bind('change',function(){
                    M.financingSupplement.setSingleInputStatus('#mark');
                })
                M('#mark').bind('keyup',function(){
                    M.financingSupplement.setSingleInputStatus('#mark');
                })

                M.financingSupplement.setUploadStatus();
            },

            setSingleInputStatus: function(name) {
                var address = M(name).val();

                if (!address || address.length == 0) {
                    M(name).css('borderColor','red');
                } else {
                    M(name).css('borderColor','#e6e6e6');
                }
            },


            setUploadStatus: function() {
                var contracts = M.financingSupplement.contracts;
                if (contracts && contracts.length>0) {
                    M('#uploadBox').css('border','none');
                } else {
                    M('#uploadBox').css('border','1px solid red');
                }
            },


            //删除发票
            deleteInvoice: function(invoiceId) {
                M.ui.confirm.init({
                    html:'确定删除发票吗？',
                    drag: false,
                    button:[
                        {
                            href:null,
                            html:'确认',
                            callback:function(){
                                M.ajaxFn({
                                    url:$.interfacePath.assets+'t/orderdeleteInvoice',
                                    type: 'post',
                                    data: {
                                        "type": M.financingSupplement.type,
                                        "invoiceId": invoiceId,
                                        "bizId": M.financingSupplement.applicationId,
                                        "bizNo": M.financingSupplement.bizNo
                                    },
                                    dataType: 'json',
                                    contentType: 'application/json',
                                    success: function (res) {
                                        if (res.success) {
                                            M.ui.waiting.creat({
                                                status:true,
                                                time:1000,
                                                text:res.message,
                                                hide:false,
                                                callback: function () {
                                                    M.financingSupplement.getTableData(true);
                                                    if (opener) {
                                                        opener.location.reload();
                                                    }
                                                }
                                            });
                                        }else {
                                            return  M.ui.waiting.creat({
                                                status:false,
                                                time:3000,
                                                text:res.message,
                                                hide:false,
                                            });
                                        }
                                    },
                                    error: function (res) {
                                    }
                                });
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
            },

            uploadInvoiceInit: function(id, invoiceId,invoiceNum, invoiceCode, index, canDelete) {
                var userId = own.fetch('userInfo').userId;

                //上传图片
                var uploader = new plupload.Uploader({ //实例化一个plupload上传对象
                    browse_button : id,//上传ID
                    headers:{
                        'Authorization': own.fetch('userInfo').token,
                        // 'Authorization': "eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiJkNDFmNzUxZGNmMjI0ZTZhOGEyNDNmODYzMWU3NzM5NyIsImlhdCI6MTU0NTgxMTU1Miwic3ViIjoiRjEwMDUxMDhDMSIsImRhdGEiOnsiY2FGbGFnIjoiMSIsIm9wZXJhdGVJZCI6IkYxMDA1MTA4QzEiLCJjdXN0b21lcklkIjoiRjEwMDUxMDgiLCJjYURyaXZlclR5cGUiOiIiLCJjYUFncmVlbWVudEZsYWciOiIxIiwiY3VzX2NhQWdyZWVtZW50RmxhZyI6IjEiLCJ0YXhOdW0iOiIxMjM0NTY3ODk5ODc2NTQzMjEiLCJvcGVyYXRlTmFtZSI6IuWFtOS-r-a1i-ivlSIsInVzZXJSb2xlIjpbIlIxMCIsIlIyMCJdLCJjdXN0b21lck5hbWUiOiLkuIrmtbflhbTkvq_kv6Hmga_np5HmioDmnInpmZDlhazlj7giLCJtYXJrZXRJZCI6IkJHR0MifSwiZXhwIjoxNTQ1ODEzMzUyfQ.7-u8B8yUhCfoNuhL1bOCIJhLRiz9UPBOhngym1zetHVyTg_15nucpXMAcWbktapM00vTEbvUw-iXFOUFjPCfeA"
                    },
                    url :  M.interfacePath.serviceUploadUrl + 'assets/t/invoice/supplyAttachment?invoiceCode='+invoiceCode+"&invoiceNumber="+invoiceNum + '&userId=' + userId,
                    flash_swf_url : '../../../../base/js/core/Moxie.swf',
                    silverlight_xap_url : '../../../../base/js/core/Moxie.xap',
                    filters: {
                        mime_types : [ //只允许上传图片和zip文件
                            { title : "Image files", extensions : "jpg,gif,png" }
                            // { title : "Zip files", extensions : "zip" },
                            // { title : "Document files", extensions : "pdf"}
                        ],
                        max_file_size : '10485760' //最大只能上传5120kb的文件
                    },
                    multi_selection:false,
                    multiple_queues:false
                });
                uploader.init(); //初始化

                // uploader.bind('BeforeUpload', function (uploader, files) {
                //     uploader.setOption("multipart_params",{reqData:JSON.stringify(reqData)});
                // });

                uploader.bind('FilesAdded',function(uploader,files){
                    uploader.start();
                });

                uploader.bind('Error',function(uploader,errObject){
                    if(errObject.code == -601){
                        M.ui.waiting.creat({
                            status:false,
                            time:1000,
                            text:'不支持该文件类型上传，请重新选择！',
                            hide:false,
                        });
                    }

                    if(errObject.code == -600){
                        M.ui.waiting.creat({
                            status:false,
                            time:1000,
                            text:'单个文件不能超过10M，请压缩后上传！',
                            hide:false,
                        });
                    }
                });
                uploader.bind('FileUploaded',function(uploader,files,res){
                    var response = res.response.replace("<pre>", "").replace("</pre>", "").replace("<PRE>", "").replace("</PRE>", "").replace(/<[^>]+>/g, "")
                    var data = JSON.parse(response);
                    if( data.success ) {
                        M.ui.waiting.creat({
                            status:true,
                            time:1000,
                            text:'上传成功！',
                            hide:false,
                            callback: function () {
                                // M.financingSupplement.getTableData(true);
                                var tr = M(".table-tr .table-needtr").eq(index);
                                var downloadTag = '<a class="js-download" href="javascript:;" onclick="M.downloadFileXhr(' +  "'"  + data.data.fileAddress  + "'" + ',' + "'" + data.data.fileName + "'" + ')">下载</a>';
                                var reUploadTag = '<span class="centerLine">|</span><a class="js-uploadAttachments" href="javascript:;" id="' + id + '">重新上传</a>';
                                var deleteTag = '';
                                if (canDelete == '1') {
                                    deleteTag = '<span class="centerLine">|</span><a class="js-delete" href="javascript:;" data-id="' + invoiceId + '">删除</a>';
                                }
                                tr.children('.enclosure').html(downloadTag+reUploadTag+deleteTag);
                                tr.children('.enclosure').children('.js-uploadAttachments').unbind('click');
                                if (canDelete == "1") {
                                    tr.children('.enclosure').children('.js-delete').unbind('click').bind('click', function () {
                                        var invoiceId=$(this).attr('data-id');
                                        M.financingSupplement.deleteInvoice(invoiceId);
                                    });
                                }

                                M.financingSupplement.uploadInvoiceInit(id, invoiceId, invoiceNum, invoiceCode, index, canDelete);
                            }
                        });
                    } else {
                        M.ui.waiting.creat({
                            status:false,
                            time:3000,
                            text:data.message,
                            hide:false,
                            callback: function () {
                                if(data.code.indexOf('TK')>=0){
                                    var codeStr=data.code;
                                    var cod=Number(codeStr.substring(codeStr.indexOf('TK')+2));

                                    if(cod<5){  // 登录超时
                                        own.logout();
                                    }
                                    else if(cod==5){
                                        own.logout();
                                    }
                                    else if(cod==6 || cod==7){  // 无权限
                                        return window.location.href='../basic/500.html';
                                    }
                                }
                            }
                        });
                    }
                });
            },

            uploadInit:function(){
                var that = this;
                var reqData = {applicationId:this.applicationId};

                var url = M.interfacePath.assetsUpload;
                //上传图片
                var uploader = new plupload.Uploader({ //实例化一个plupload上传对象
                    browse_button : 'browse1',//上传ID
                    headers:{
                        'Authorization': own.fetch('userInfo').token,
                        // 'Authorization': "eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiJkNDFmNzUxZGNmMjI0ZTZhOGEyNDNmODYzMWU3NzM5NyIsImlhdCI6MTU0NTgxMTU1Miwic3ViIjoiRjEwMDUxMDhDMSIsImRhdGEiOnsiY2FGbGFnIjoiMSIsIm9wZXJhdGVJZCI6IkYxMDA1MTA4QzEiLCJjdXN0b21lcklkIjoiRjEwMDUxMDgiLCJjYURyaXZlclR5cGUiOiIiLCJjYUFncmVlbWVudEZsYWciOiIxIiwiY3VzX2NhQWdyZWVtZW50RmxhZyI6IjEiLCJ0YXhOdW0iOiIxMjM0NTY3ODk5ODc2NTQzMjEiLCJvcGVyYXRlTmFtZSI6IuWFtOS-r-a1i-ivlSIsInVzZXJSb2xlIjpbIlIxMCIsIlIyMCJdLCJjdXN0b21lck5hbWUiOiLkuIrmtbflhbTkvq_kv6Hmga_np5HmioDmnInpmZDlhazlj7giLCJtYXJrZXRJZCI6IkJHR0MifSwiZXhwIjoxNTQ1ODEzMzUyfQ.7-u8B8yUhCfoNuhL1bOCIJhLRiz9UPBOhngym1zetHVyTg_15nucpXMAcWbktapM00vTEbvUw-iXFOUFjPCfeA"
                    },
                    url : url,
                    flash_swf_url : '../../../../base/js/core/Moxie.swf',
                    silverlight_xap_url : '../../../../base/js/core/Moxie.xap',
                    filters: {
                        mime_types : [ //只允许上传图片和zip文件
                            { title : "Image files", extensions : "jpg,gif,png" },
                            { title : "Zip files", extensions : "zip,rar" },
                            { title : "Document files", extensions : "doc,pdf,docx,xls,xlsx" }
                        ],
                        max_file_size : '10485760' //最大只能上传5120kb的文件
                    }
                });
                uploader.init(); //初始化

                // uploader.bind('BeforeUpload', function (uploader, files) {
                //     uploader.setOption("multipart_params",{reqData:JSON.stringify(reqData)});
                // });

                uploader.bind('BeforeUpload', function (uploader, files) { //传入表单参数
                    uploader.setOption("multipart_params", {
                        reqData:JSON.stringify(reqData)
                    });
                });

                uploader.bind('FilesAdded',function(uploader,files){
                    var filesLens = files.length + M.financingSupplement.contracts.length;
                    if (M.financingSupplement.contracts.length < 5 && filesLens <= 5 ) {
                        uploader.start();
                    } else {
                        for (var i=0; i<files.length; i++) {
                            uploader.removeFile(files[i])
                        }
                        M.ui.waiting.creat({
                            status:false,
                            time:1000,
                            text:'最多只能上传五个附件',
                            hide:false,
                        });
                    }
                });

                uploader.bind('Error',function(uploader,errObject){
                    // console.log(errObject);
                    if(errObject.code == -602){
                        M.ui.waiting.creat({
                            status:false,
                            time:1000,
                            text:'不能选择相同文件！',
                            hide:false,
                        });
                    }
                    if(errObject.code == -601){
                        M.ui.waiting.creat({
                            status:false,
                            time:1000,
                            text:'不支持该文件类型上传，请重新选择！',
                            hide:false,
                        });
                    }

                    if(errObject.code == -600){
                        M.ui.waiting.creat({
                            status:false,
                            time:1000,
                            text:'单个文件不能超过10M，请压缩后上传！',
                            hide:false,
                        });
                    }
                });
                uploader.bind('FileUploaded',function(uploader,files,res){
                    var response = res.response.replace("<pre>", "").replace("</pre>", "").replace("<PRE>", "").replace("</PRE>", "").replace(/<[^>]+>/g, "")
                    var data = JSON.parse(response);
                    // console.log(data);
                    if( data.success ) {
                        M.ui.waiting.creat({
                            position:'fixed',
                            status:'loading',
                            time:500,
                            callback:function(){
                                M.ui.waiting.creat({
                                    status:true,
                                    time:1000,
                                    text:data.message,
                                    hide:false,
                                });
                            }
                        });
                        var invoice = data.data;
                        M.financingSupplement.contracts.push({
                            fileAddress: invoice.fileAddress,
                            fileName: invoice.fileName,
                            format: invoice.format,
                            size: invoice.size
                        });
                        var file_name = files.name; //文件名
                        var file_size = data.data.size;
                        //构造html来更新UI
                        M('#uploadBox').addClass('upload-info');
                        var html2 =  '<div class="file-box">'+
                            '<div class="file-name"><a class="download" href="javascript:;">'+file_name+'</a><a href="javascript:;" class="removeItem">删除</a></div>'+
                            '<div class="file-size">'+(file_size/1024).toFixed(2)+'k</div>'+
                            '</div>'
                        $(html2).appendTo('#uploadBox');

                        M.financingSupplement.setUploadStatus();

                    } else {
                        M.ui.waiting.creat({
                            status:false,
                            time:3000,
                            text:data.message,
                            hide:false,
                            callback: function () {
                                if(data.code.indexOf('TK')>=0){
                                    var codeStr=data.code;
                                    var cod=Number(codeStr.substring(codeStr.indexOf('TK')+2));

                                    if(cod<5){  // 登录超时
                                        own.logout();
                                    }
                                    else if(cod==5){
                                        own.logout();
                                    }
                                    else if(cod==6 || cod==7){  // 无权限
                                        return window.location.href='../basic/500.html';
                                    }
                                }
                            }
                        });
                    }
                });
                // 点击下载
                $(document).on('click','.download',function(){
                    var index = $('#uploadBox .download').index($(this));
                    M.downloadFileXhr(M.financingSupplement.contracts[index].fileAddress, M.financingSupplement.contracts[index].fileName)
                });
                // 点击删除
                $(document).on('click','.removeItem',function(e){
                    var target = e.currentTarget;
                    var index = $('#uploadBox .removeItem').index($(target));
                    var deleteFileArr = M.financingSupplement.contracts.splice(index, 1);
                    var deleteFile = deleteFileArr[0];
                    that.deleteFile(deleteFile);
                    $(target).parents('.file-box').remove();
                    M.financingSupplement.setUploadStatus();
                }.bind(that));
            },

            deleteFile: function(file) {

                // var fileId = file.fileId;
                // var fileAddress = file.fileAddress;
                //
                // M.ajaxFn({
                //     url:$.interfacePath.assets+'t/deleteFileRz',
                //     data:{
                //         fileId: fileId,
                //         fileAddress: fileAddress
                //     },
                //     type:'POST',
                //     dataType:'JSON',
                //     success:function(data,args){
                //
                //     },
                //     error:function(msg){
                //         console.log(msg)
                //     }
                // })

            },

            check:function(){
                var pattern = new RegExp("[~'!@#$￥()（）%^&*()-+_=:]");
                if($(this).val().length >500 || pattern.test($(this).val())){
                    var str = $(this).val().substring(0,500)
                    $(this).val(str)
                }
            },
            next:function(){
                var url;
                if(this.type == 'T') {
                    url = $.interfacePath.assets + 't/register/supplyTradeBg';
                } else {
                    url = $.interfacePath.bill + 't/transfer/supplyTradeBg';
                }


                var contractNumber = $('.js-fp-address').val();
                var contractName = $('.js-fp-phone').val();
                var remark = $('#mark').val();

                var contracts = this.contracts;

                if (M.financingSupplement.bankSettings.needContract) {
                    if ( contractNumber== '') {
                        M.ui.waiting.creat({
                            status:false,
                            time:1000,
                            text:'请输入贸易合同编号',
                            hide:false,
                        });
                        M('.js-fp-address').focus();
                        return;
                    }

                    if ( contractName== '') {
                        M.ui.waiting.creat({
                            status:false,
                            time:1000,
                            text:'请输入贸易合同名称',
                            hide:false,
                        });
                        M('.js-fp-phone').focus();
                        return;
                    }

                    if ( remark== '') {
                        M.ui.waiting.creat({
                            status:false,
                            time:1000,
                            text:'请输入贸易背景描述',
                            hide:false,
                        });
                        M('#mark').focus();
                        return;
                    }

                    if (contracts.length == 0) {
                        M.ui.waiting.creat({
                            status:false,
                            time:1000,
                            text:'附件不能为空',
                            hide:false,
                        });
                        return;
                    }
                }

                if (M.financingSupplement.bankSettings.needReceipt && M('.addInvoice').css('display') != "none") {
                    M.ui.waiting.creat({
                        status:false,
                        time:1000,
                        text:'请先补充发票!',
                        hide:false,
                    });
                    return;
                }

                if (M.financingSupplement.bankSettings.needInvoiceCheck && M('.check-invoice').css('display') != "none") {
                    M.ui.waiting.creat({
                        status:false,
                        time:1000,
                        text:'请先去验票!',
                        hide:false,
                    });
                    return;
                }

                var id;

                if(M.financingSupplement.type == 'T') {
                    id = M.financingSupplement.bizNo;
                } else {
                    id = M.financingSupplement.applicationId;
                }

                var params = {
                    "id": id,
                    "contractNumber": contractNumber,
                    "contractName": contractName,
                    "remark": remark,
                    "documentList":contracts
                }

                //贸易背景
                M.ajaxFn({
                    url: url,
                    type: 'post',
                    data: params,
                    dataType: 'json',
                    success: function (data) {
                        if (data.success) {
                            M.ui.waiting.creat({
                                status:true,
                                time:1000,
                                text:data.message,
                                hide:false,
                                callback: function () {
                                    if (opener) {
                                        opener.location.reload();
                                    }
                                    window.close();
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
                    error: function (err) {
                        console.log(err)
                    }
                })
            },
            removeError:function(){
                if($(this).hasClass('error')){
                    $(this).removeClass('error').next('p').remove();
                }
            },
            prev:function(){
                // var url = "financingAdd.html?applicationId=" + this.applicationId;
                // location.href = url;
                M.closeCurrentPage();
            },
            creatError:function(str){
                return '<p class="error-tips">请填写'+str+'</p>';
            },

        })(function(){
            M.financingSupplement.init();
        });
    }
)
