require(['head','menu','base','tab','page', 'calendar','plupload', 'fuzzy'],
    function(){
        M.define('billTransferOne',{
            head:M.ui.head.init(),
            init:function(){
                M.ui.menu.init({
                    index:[],
                    url:M.getNormalPath('getMenu.json',4),
                    callback: function() {

                    }
                });
                this.base = M.static.init();
                this.getDate();

                //转让通宝业务背景js控制
                // M('#mark').bind('focus',function(){
                //     M('.js-warning-text').hide()
                // })
                // M('#mark').bind('keyup', function () {
                //     $(this).val($(this).val().substring(0,100));
                // });
                // M('#mark').bind('change', function () {
                //     $(this).val($(this).val().substring(0,100));
                // });
                // M('#mark').bind('keydown', function () {
                //     $(this).val($(this).val().substring(0,100));
                // });
                // M('#mark').bind('focus',function(){
                //     M('.js-warning-text').hide()
                // })
                // M('.js-warning-text').bind('click',function(){
                //     M('.js-warning-text').hide();
                //     M('#mark').focus();
                // })
                // M('#mark').bind('blur',function(){
                //     if($('#mark').val().length>0){
                //         M('.js-warning-text').hide()
                //     }else{
                //         M('.js-warning-text').show()
                //     }
                //
                // })
                M('.tradeCode').bind('keyup', function () {
                    $(this).val($(this).val().substring(0,500));
                });
                M('.tradeCode').bind('change', function () {
                    $(this).val($(this).val().substring(0,500));
                });
                M('.tradeCode').bind('keydown', function () {
                    $(this).val($(this).val().substring(0,500));
                });
                M('.tradeName').bind('keyup', function () {
                    $(this).val($(this).val().substring(0,500));
                });
                M('.tradeName').bind('change', function () {
                    $(this).val($(this).val().substring(0,500));
                });
                M('.tradeName').bind('keydown', function () {
                    $(this).val($(this).val().substring(0,500));
                });
            },

            getDate: function(){
                var that = this;
                //根据本地localStorage判断用户是否填写第一步信息
                if ( own.fetch('stff').contracts && own.fetch('stff').twoStep ) {
                    this.payment = own.fetch('stff');
                    var stff = own.fetch('stff');
                    stff.twoStep = false;
                    own.save('stff', stff);
                    M('.company-name').val(stff.receivingName);
                    $('.info-con .tax-num').html(stff.receivingTaxNum);
                    M('#amountNo').val(stff.amountMoney);
                    M('.upper-cn').html(M.getChineseNumber(M('#amountNo').val()));
                    M('.tradeCode').val(stff.businessNum);
                    M('.tradeName').val(stff.contractName);
                    // if(stff.remark!==''){
                    //     M('.js-warning-text').hide()
                    // }
                    that.payment.receivingName = stff.receivingName;
                    that.payment.receivingEnterprisesId = stff.receivingEnterprisesId;
                    that.payment.receivingTaxNum = stff.receivingTaxNum;
                    that.payment.legalRepresentativeOffice = stff.legalRepresentativeOffice;
                    that.payment.contracts = stff.contracts;
                    for(var i=0; i< stff.contracts.length; i++){
                        var file = stff.contracts[i];
                        var file_name = file.fileName; //文件名
                        var file_size = file.size;
                        //构造html来更新UI
                        // M('#uploadBox').addClass('upload-info');
                        var html2 =  '<div class="file-box">'+
                            '<div class="file-name"><a download="" class="download" href="javascript:;">'+file_name+'</a><a href="javascript:;" class="removeItem">删除</a></div>'+
                            '<div class="file-size">'+(file_size/1024).toFixed(2)+'k</div>'+
                            '</div>'
                        $(html2).appendTo('#uploadBox');
                    }
                }else {
                    own.removeKey('stff');
                    this.payment = {};
                    this.payment.contracts = [];
                };
                M('#amountNo').on('keyup', function () {
                    $(this).val($(this).val().replace(/[^\d.]/g,''));
                    this.value = this.value.replace(/^0+/g,'');
                    this.value = this.value.replace(/\.{2,}/g,"."); //只保留第一个. 清除多余的
                    var value = $(this).val();
                    if (value.charAt(0) == '.') {
                        value = $(this).val().substr(1);
                        $(this).val(value);
                    }
                    var array = value.split(".");
                    if((array.length >1 && array[1].length > 2) || array.length >2){
                        value = array[0] + "." +array[1].substr(0,2);
                        $(this).val(value);
                    }
                    var useNo = parseFloat(M('#useNo').text().replace(/,/g, ''));
                    if (useNo === 0) {
                        M('#amountNo').val(M('#useNo').text().replace(/,/g, ''));
                        M.ui.waiting.creat({
                            status:false,
                            time:1000,
                            text:'持有金额为0，不能转让',
                            hide:false,
                        });
                    }else if (parseFloat(M('#amountNo').val()) > useNo) {
                        M('#amountNo').val(M('#useNo').text().replace(/,/g, ''));
                        M.ui.waiting.creat({
                            status:false,
                            time:1000,
                            text:'转让金额不能大于持有金额',
                            hide:false,
                        });
                    }
                    M('.upper-cn').html($.getChineseNumber(M('#amountNo').val()))
                });
                //获取可用额度
                M.ajaxFn({
                    url:  $.interfacePath.bill +'t/myFinanceBillAmount/avail',
                    type: 'post',
                    data: {

                    },
                    dataType: 'json',
                    success: function (res) {
                        // console.log(res);
                        if ( res.success && res.data != 0 ) {
                            M('#useNo').html(M.getFormatNumber(res.data, 2))
                        }else if(res.data == 0) {
                            M('#useNo').html('0');
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
                        console.log('err+'+err)
                    }
                });
                M('.notice-icon').hover(function () {
                    $(this).siblings('div.tips').addClass('show');
                },function () {
                    $(this).siblings('div.tips').removeClass('show');
                });
                 M('#fuzzySearch').bind('input propertychange', function (ev) {

                    var value = M('#fuzzySearch').val();
                    if (value == '') {
                        $('.payer-info .tax-num').html('');
                        // $('#fuzzySearch').removeClass('true');
                    }

                });

                M.ui.fuzzy.init({
                     target:M('#fuzzySearch'),
                     url:M.interfacePath.basic+'/n/user/requestCompanyInfoByBlur',
                     param: {
                         "chineseFullName": "",
                     },
                     tip:false,
                     isClick:false,
                     callback:function(){
                         if(own.fetch('userInfo').taxNum !== this.taxNum){
                             // this.targetElement.addClass('true');
                             that.payment.receivingName = this.name;
                             that.payment.receivingEnterprisesId = this.value;
                             that.payment.receivingTaxNum = this.taxNum;
                             that.payment.legalRepresentativeOffice = this.legalRepresentativeOffice;
                             $('.info-con .tax-num').html(this.taxNum);
                         }else{
                             M('#fuzzySearch').val('');
                             M('#fuzzySearch').removeClass('true');
                             $('.receiving-info .tax-num').html('');
                             M.ui.waiting.creat({
                                 status:false,
                                 time:1000,
                                 text:'转让方和接收方不能是同一个企业',
                                 hide:false,
                             });
                         }
                       //  $('.g-input-select-dropdown').remove();
                     }
                 });

                //上传图片
                var uploader = new plupload.Uploader({ //实例化一个plupload上传对象
                    browse_button : 'browse',//上传ID
                    headers:{
                        'Authorization': own.fetch('userInfo').token,
                    },
                    url : M.interfacePath.assetsUpload,
                    flash_swf_url : '../../../../base/js/core/Moxie.swf',
                    silverlight_xap_url : '../../../../base/js/core/Moxie.xap',
                    filters: {
                      mime_types : [ //只允许上传图片和zip文件
                       { title : "Image files", extensions : "jpg,gif,png" },
                       { title : "Zip files", extensions : "zip,rar" },
                       { title : "Document files", extensions : "doc,pdf,docx,xls,xlsx" }
                                   ],
                      max_file_size : '10485760'//最大只能上传5120kb的文件
                              }
                });
                uploader.init(); //初始化

                uploader.bind('FilesAdded',function(uploader,files){
                    var filesLens = files.length + that.payment.contracts.length;
                    if (that.payment.contracts.length < 5 && filesLens <= 5) {
                        uploader.start();
                    }else{
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
                    if(data.success){
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
                        that.payment.contracts.push(data.data);
                        var file_name = files.name; //文件名
                        var file_size = data.data.size;
                        //构造html来更新UI
                        M('#uploadBox').addClass('upload-info');
                        var html2 =  '<div class="file-box">'+
                            '<div class="file-name"><a class="download" href="javascript:;">'+file_name+'</a><a href="javascript:;" class="removeItem">删除</a></div>'+
                            '<div class="file-size">'+(file_size/1024).toFixed(2)+'k</div>'+
                            '</div>'
                        $(html2).appendTo('#uploadBox');

                    }else{
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
                $('body').on('click','.download',function(){
                    var index = $('#uploadBox .download').index($(this));
                    M.downloadFileXhr(that.payment.contracts[index].fileAddress, that.payment.contracts[index].fileName)
                });
                // 点击删除
                $('body').on('click','.removeItem',function(){
                    var index = $('#uploadBox .removeItem').index($(this));
                    that.payment.contracts.splice(index, 1);
                    $(this).parents('.file-box').remove();
                    if (that.payment.contracts.length == 0) {
                        M('#uploadBox').removeClass('upload-info');
                    }
                });


                M('#amountNo').bind('input propertychange',function(){
                    var num_ipt = parseInt(M(this).val(),10);
                    // console.log(num_ipt);
                    if(num_ipt < 0){
                        M(this).val(0);
                    }
                });
                $('.next-step').click(function () {
                    var payerName = own.fetch('userInfo').comName;
                    var payerEnterprisesId = own.fetch('userInfo').comId;
                    var tax_num = $('#tax-num').text();
                    var receivingName = $('#fuzzySearch').val();
                    var amountMoney = $('#amountNo').val();

                    var contractNumber=$(".tradeCode").val()
                    var contractName=$(".tradeName").val()
                    if (amountMoney == ''){
                        M.ui.waiting.creat({
                            status:false,
                            time:1000,
                            text:'转让金额不能为空！',
                            hide:false
                        });
                        $('#amountNo').focus();
                    }else if(amountMoney==0){
                        M.ui.waiting.creat({
                            status:false,
                            time:1000,
                            text:'转让金额不能为0！',
                            hide:false
                        });
                        $('#amountNo').focus();
                    }else if(receivingName == ''){
                        M.ui.waiting.creat({
                            status:false,
                            time:1000,
                            text:'接受方不能为空！',
                            hide:false
                        });
                        M('#fuzzySearch').focus();
                    }else if(contractNumber == '' || contractNumber =='请输入本次转让对应的贸易合同编号' ){
                        M.ui.waiting.creat({
                            status:false,
                            time:1000,
                            text:'贸易合同编号不能为空！',
                            hide:false
                        });
                        M('#tradeCode').focus();
                    }else if(contractName == '' || contractName =='请输入本次转让对应的贸易合同名称'){
                        M.ui.waiting.creat({
                            status:false,
                            time:1000,
                            text:'贸易合同名称不能为空！',
                            hide:false
                        });
                        M('#tradeName').focus();
                    }else if(tax_num == ''){
                        M.ui.waiting.creat({
                            status:false,
                            time:1000,
                            text:'接收方税号信息有误！',
                            hide:false
                        });
                    }else if(that.payment.contracts.length == 0){
                        M.ui.waiting.creat({
                            status:false,
                            time:1000,
                            text:'附件不能为空！',
                            hide:false
                        });
                        setTimeout(function () {
                            M('#browse').click();
                        },500)
                    }else{
                        that.payment.twoStep = false;
                        that.payment.payerName = payerName;
                        that.payment.payerEnterprisesId = payerEnterprisesId;
                        that.payment.amountMoney = amountMoney;
                        that.payment.businessNum = contractNumber;
                        that.payment.contractName = contractName;
                        own.save('stff', that.payment);
                        window.location.href = 'billTransferTwo.html'

                    }
                })

            },

        })(function(){
            M.billTransferOne.init();
        });
    }
)
