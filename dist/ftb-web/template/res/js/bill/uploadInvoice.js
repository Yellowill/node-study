require(['head','menu','base','tab','page', 'customDialog', 'calendar', 'calculator', 'status', 'plupload', 'waiting'],
    function (signMessage) {
        M.define('uploadInvoice', {
            head: M.ui.head.init(),
            init: function () {
                M.ui.menu.init({
                    index:[],
                    url:M.getNormalPath('getMenu.json',4),
                    callback: function() {

                    }
                });
                $('#invoiceCode').blur(function () {
                    var a = $('#invoiceCode').val();
                    if ( checkInvoice(a) == '04' || checkInvoice(a) == '10' ) {
                        $(this).parent().siblings('div.invoice-num').addClass('g-hide');
                        $(this).parent().siblings('div.check-code').removeClass('g-hide');
                    }else {
                        $(this).parent().siblings('div.invoice-num').removeClass('g-hide');
                        $(this).parent().siblings('div.check-code').addClass('g-hide');
                    }
                });
                this.initAdd()
                function checkInvoice(a) {
                    var code = ["144031539110", "131001570151", "133011501118", "111001571071"];
                    var b, c;
                    if (a.length == 12) {
                        b = a.substring(7, 8)
                        for (var i = 0; i < code.length; i++) {
                            if (a == code[i]) {
                                c = "10";
                                break;
                            }else {
                                c = "99";
                            }
                        }
                        if (c == "99") {
                            if (a.charAt(0) == '0' && a.substring(10, 12) == '11') {
                                c = "10"
                            }
                            if (a.charAt(0) == '0' && (a.substring(10, 12) == '04' || a.substring(10, 12) == '05')) {
                                c = "04"
                            }
                            if (a.charAt(0) == '0' && (a.substring(10, 12) == '06' || a.substring(10, 12) == '07')) {
                                c = "11"
                            }
                            if (a.charAt(0) == '0' && a.substring(10, 12) == '12') {
                                c = "14"
                            }
                            if (a.substring(10, 12) == '17' && a.charAt(0) == '0') {
                                c = "15"
                            }
                            if (c == "99" && b == 2 && a.charAt(0) != '0') {
                                c = "03"
                            }
                        }
                    } else if (a.length == 10) {
                        b = a.substring(7, 8)
                        if (b == 1 || b == 5) {
                            c = "01"
                        } else if (b == 6 || b == 3) {
                            c = "04"
                        } else if (b == 7 || b == 2) {
                            c = "02"
                        }
                    }
                    return c;
                }

            },
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










        })(function () {
            M.uploadInvoice.init();
        });
    }
)
