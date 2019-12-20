require(['head', 'menu', 'base', 'tab', 'page', 'customDialog','plupload', 'common', 'confirm'],
    function () {
        M.define('InvoiceManagement', {
            head: M.ui.head.init(),
            init: function () {
                M.ui.menu.init({
                    index: [4, 0],
                 //   url: M.interfacePath.privilege+'/t/rms/getMenuListByMemberForRf',
                 //   url:M.getNormalPath('getMenu.json',4),
                    callback: function () {

                    }
                });
                var menuId = M.getMenuId('../basic/InvoiceManagement.html');
                this.getBtnPrivilege(menuId)
                this.base = M.static.init();
                this.pageSize = 10;
                this.status = '';
                this.getData();
                this.getTableData(1);
            },

            getBtnPrivilege: function(menuId) {
                M.buttonsPrivilege(menuId, function (data) {
                    if (!data || data.length == 0){
                        return;
                    }
                    for (var i = 0; i<data.length; i++) {
                        if (data[i].btnNo == "DRFP") {
                            M('#nav-title').after('<div style="width:49%;float:left;padding-right:10px;" class="g-text-right g-nav-content">\n' +
                                '                <a class="addExcel ui-button-ghost g-nav-btn ui-btn-red"><i\n' +
                                '                        class="iconfont mar-right-5">&#xe608;</i>Excel导入</a>\n' +
                                '            </div>');
                            //导入发票
                            M('.addExcel').on('click', function () {
                                M.InvoiceManagement.addExcel();
                            })
                        }
                    }
                })
            },

            getData: function () {
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
                M('.in-tabs li').click(function(){
                    M(this).find('a').addClass('active');
                    M(this).siblings().find('a').removeClass('active');
                });

                M('.tabAll').click('on', function () {
                    M.InvoiceManagement.status = '';
                    M.InvoiceManagement.getTableData(1);
                });
                M('.notUsed').click('on', function () {
                    M.InvoiceManagement.status = '00';
                    M.InvoiceManagement.getTableData(1);
                });
                M('.used').click('on', function () {
                    M.InvoiceManagement.status = '10';
                    M.InvoiceManagement.getTableData(1);
                });

                M('.alldate').click('on', function () {
                    M('#dateFormat').val('');
                    M.InvoiceManagement.getTableData(1);
                });
                M('.onemonth').click('on', function () {
                    M('#dateFormat').val('30');
                    M.InvoiceManagement.getTableData(1);
                });
                M('.threemonth').click('on', function () {
                    M('#dateFormat').val('90');
                    M.InvoiceManagement.getTableData(1);
                });
                M('.oneyear').click('on', function () {
                    M('#dateFormat').val('365');
                    M.InvoiceManagement.getTableData(1);
                });

                //----------------添加查询事件--------------------
                M('.ui-search-button').click(function(event) {
                    M.InvoiceManagement.getTableData(1);
                });
            },
            //导入Excel
            addExcel: function () {
                M.ui.customDialog.init({
                    drag:false,
                    title:'导入Excel',
                    width:480,
                    height:200,
                    autoClose:false,
                    url:'../dialog/dialog-excelImport.html',
                    callback:function(e){
                        var title="快捷导入"
                        $('.ui-dialog-title').html(title)
                        $('#loadNeed').attr('href',"../res/data/invoiceExcelImport.xlsx")
                        //上传图片
                        var uploader = new plupload.Uploader({ //实例化一个plupload上传对象
                            browse_button : 'browse',//上传ID
                            headers:{
                                'Authorization': own.fetch('userInfo').token
                            },
                            url :  M.interfacePath.assetsUpload,
                            runtimes: 'gears,html5,html4,silverlight,flash',
                            flash_swf_url : '../../../../base/js/core/Moxie.swf',
                            silverlight_xap_url : '../../../../base/js/core/Moxie.xap',
                            multi_selection: false,
                            filters: {
                                mime_types : [ //只允许上传图片和zip文件
                                    { title : "Document files", extensions : "xls,xlsx" }
                                ],
                                max_file_size : '10485760' //最大只能上传5120kb的文件
                            }
                        });
                        uploader.init(); //初始化

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
                            // console.log(data);
                            if( data.success ) {

                                M.InvoiceManagement.addExcelRequest(data.data.fileAddress, e)
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

                        M('.ui-dialog-close').click(function(){
                            e.remove();
                        })
                    }
                })
            },

            addExcelRequest: function(fileUrl, e) {
                M.ajaxFn({
                    url:  $.interfacePath.assets +'t/exportInvoice',
                    type: 'post',
                    data: {
                        excelPath: fileUrl
                    },
                    dataType: 'json',
                    success: function (res) {
                        if (res.success){
                            M('.ui-dialog-close').click();
                            M.ui.waiting.creat({
                                position:'fixed',
                                status:'loading',
                                time:500,
                                callback:function(){
                                    M.ui.waiting.creat({
                                        status:true,
                                        time:2000,
                                        text:res.message,
                                        hide:false,
                                        callback:function(){
                                            e.remove();
                                            M.InvoiceManagement.getTableData(1);
                                        }
                                    });
                                }
                            });
                        }else {
                            var message = res.message;
                            M('.ui-dialog-upload').hide();
                            M('.ui-dialog-errortips').show();
                            M('.ui-dialog-errortips-p').html(message);
                            M('.ui-errortips-btn').bind('click', function () {
                                M('.ui-dialog-upload').show();
                                M('.ui-dialog-errortips').hide();
                            })
                        }

                    },
                    error: function (err) {
                        M('.ui-dialog-close').click();
                        console.log('err+'+err)
                    }
                });
            },
            //发票删除
            deleteInvoice: function(id,thisAmountTax) {

                var id =id;
                var thisAmountTax=thisAmountTax;
                M.ui.confirm.init({
                    html:'确定删除发票吗？',
                    drag: false,
                    button:[
                        {
                            href:null,
                            html:'确认',
                            callback:function(){
                                M.ajaxFn({
                                    url:$.interfacePath.assets+'t/unusedDeleteInvoice',
                                    type: 'post',
                                    data: {
                                        "id":id,
                                        "thisAmountTax":thisAmountTax
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
                                                    var pageIndex = $('#page').find('span.current').text();
                                                    M.InvoiceManagement.getTableData(pageIndex);
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

            //状态格式化
            statusFormat: function (data) {
                var type = null;
                if (data == '00') {
                    type = '未使用';
                } else if (data != '00') {
                    type = '已使用';
                }
                return type;
            },

            getTableData: function (page,status) {
                var statusObj = M.InvoiceManagement.status;
                var dateFormat =  M('#dateFormat').val();
                var customerName = M('#customerName').val();
                var startTime;
                var endTime;
                if(dateFormat != ''){
                 startTime = $.getDateScope('days',0-dateFormat);
                 endTime = $.getDateScope('days',0);
                }

                M.ajaxFn({
                    url: M.interfacePath.assets + 't/invoice/invoiceManager',
                    type: 'post',
                    data: {
                        "customerName":customerName,
                        "startTime":startTime,
                        "endTime":endTime,
                        "status": statusObj,
                        "pageNum": page,
                        "pageSize":  M.InvoiceManagement.pageSize,
                    },
                    dataType: 'json',
                    contentType: 'application/json',
                    success: function (data) {
                        if (data.data == null || data.success == false||data.data.length ==0){
                            var noData = '<td colspan="10"><div class="noData"><img src="../../template/res/images/empty.png" alt=""><div class="col60 mar-top-10">暂无记录</div></div></td>';
                            M('.invoice-tbady-content').html(noData);
                            M('.pageTotal').html(data.total);
                            M('.pageCount').html(data.pageCount);
                            M.InvoiceManagement.getPage(data, page, M('#page'));
                        }else if(data.success && data.data.length!=0){
                            var str = '';
                            for (var i = 0; i < data.data.length; i++) {
                                var item = data.data[i];
                                var taxRate = item.taxRate || 0;
                                var filePath = item.fileAddress;
                                var fileName = item.fileName;
                                var canDelete=item.status;
                                var billingDate = item.billingDate || '';
                                var downloadTag ='';
                                var deleteTag="";
                                var id =item.id;
                                var tag='';
                                var thisAmountTax = item.status == "00" ? item.thisAmountTax : 0;

                                if(filePath != null && filePath !== ''){
                                    downloadTag='<a href="javascript:;" onclick="M.downloadFileXhr('+"'"+filePath+"'"+','+"'"+fileName+"'"+')">下载</a>'
                                }



                                if (canDelete == '00') {
                                    deleteTag = '<a class="js-delete"  href="javascript:;" id="' + id + '"thisAmountTax="' + thisAmountTax + '">删除</a>';
                                }
                                if (downloadTag!==''&&deleteTag!=''){
                                    tag ='<span class="centerLine">&nbsp|&nbsp</span>'
                                }
                                str += '<tr>' +
                                    '<td class="g-text-center">' + item.invoiceNumber + '<br>' +
                                    item.invoiceCode +
                                    '</td>' +
                                    '<td class="maincol g-text-center">' +
                                    M.getFormatNumber(item.amountTax, 2, '.', ',') +
                                    '</td>' +
                                    '<td class="g-text-center">' +
                                    M.getFormatNumber(thisAmountTax, 2, '.', ',') +
                                    '</td>' +
                                    '<td class="g-text-center">' +
                                    billingDate +
                                    '</td>' +
                                    '<td class="g-text-center">' +
                                    (taxRate*100)+'%' +
                                    '</td>' +
                                    '<td class="g-text-center">' +
                                    '<div class="nameTxt" title="'+ item.purchaserName +'">'+item.purchaserName+'</div>'+
                                    '<div class="nameTxt" title="'+ item.salesName +'">'+ item.salesName +'</div>'+
                                    '</td>' +
                                    '<td class="g-text-center">' +
                                    M.InvoiceManagement.statusFormat(item.status) +
                                    '</td>' +
                                    '<td class="g-text-center">' +
                                    '&nbsp;' +

                                    downloadTag +
                                    tag+
                                    deleteTag+
                                    '</td>' +
                                    '</tr>';
                            }
                            M.InvoiceManagement.getPage(data, page, M('#page'))
                            M('.invoice-tbady-content').html(str);
                            M('.pageTotal').html(data.total);
                            M('.pageCount').html(data.pageCount);

                            M('.js-delete').unbind('click').bind('click', function (e) {
                                var id=$(this).attr('id');
                                var thisAmountTax=$(this).attr('thisAmountTax');
                                M.InvoiceManagement.deleteInvoice(id,thisAmountTax);
                            })
                        }

                    },
                    error: function (res) {
                        console.log(res);
                    }
                });
            },
            //分页
            getPage: function (data, page, obj) {
                M.ui.page.init({
                    container: obj[0],
                    total: data.total,
                    items: M.InvoiceManagement.pageSize,
                    number: 5,
                    entries: 3,
                    isInput: true,
                    isText: false,
                    current: page - 1,
                    callback: function (that) {
                        M.InvoiceManagement.getTableData(this.ops.current + 1)
                    }
                });
            }

        })(function () {
            M.InvoiceManagement.init();
        });
    }
)
