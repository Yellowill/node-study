require(['head','menu','base','tab','page', 'calendar', 'customDialog', 'status', 'calculator', 'plupload', 'waiting'],
    function(){
        M.define('billTransferTwo',{
            head:M.ui.head.init(),
            init:function(){
                M.ui.menu.init({
                    index:[],
                    url:M.getNormalPath('getMenu.json',4),
                    callback: function() {
                    }
                });
                this.base = M.static.init();
                this.getcompany()
                this.getData();
                this.getTableData();
                this.getId();
            },
            getId:function(){
                if(!own.fetch('stff')){
                    M.ajaxFn({
                        url: $.interfacePath.basic + 't/basic/queryEntrust',
                        type: 'post',
                        data: {
                            payerId: own.fetch('stff').payerEnterprisesId,
                            receivingId: own.fetch('stff').receivingEnterprisesId,
                        },
                        dataType: 'json',
                        success: function (res) {

                            if(res.success){
                                //购买方
                                var buycom=res.data.payerUsEntrusts
                                //销售方
                                var givecom=res.data.receivingUsEntrusts
                                var buystr='<option value="'+own.fetch('stff').payerEnterprisesId+'">'+own.fetch('stff').payerName+'</option>',givestr='<option value="'+own.fetch('stff').receivingEnterprisesId+'">'+own.fetch('stff').receivingName+'</option>';
                                for (var i = 0; i <buycom.length ; i++) {
                                    buystr+='<option value="'+buycom[i].entrustPartyId+'">'+buycom[i].entrustPartyName+'</option>'
                                }
                                for (var j = 0; j <givecom.length ; j++) {
                                    givestr+='<option value="'+givecom[j].entrustPartyId+'">'+givecom[j].entrustPartyName+'</option>'
                                }
                                $('#buycom').append(buystr)
                                $('#givecom').append(givestr)
                            }else{
                                M.ui.waiting.creat({
                                    status:false,
                                    time:1000,
                                    text: res.message,
                                    hide:false,
                                    callback: function () {

                                    }
                                });
                            }
                        },
                        error: function (err) {
                            console.log(err)
                        }
                    })
                }
            },
            getcompany:function(){
                M.ajaxFn({
                    url: $.interfacePath.basic + 't/basic/queryEntrust',
                    type: 'post',
                    data: {
                        payerId: own.fetch('stff').payerEnterprisesId,
                        receivingId: own.fetch('stff').receivingEnterprisesId,
                    },
                    dataType: 'json',
                    success: function (res) {

                        if(res.success){
                            //购买方
                            var buycom=res.data.payerUsEntrusts
                            //销售方
                            var givecom=res.data.receivingUsEntrusts
                            var buystr='<option value="'+own.fetch('stff').payerEnterprisesId+'">'+own.fetch('stff').payerName+'</option>',givestr='<option value="'+own.fetch('stff').receivingEnterprisesId+'">'+own.fetch('stff').receivingName+'</option>';
                            for (var i = 0; i <buycom.length ; i++) {
                                buystr+='<option value="'+buycom[i].entrustPartyId+'">'+buycom[i].entrustPartyName+'</option>'
                            }
                            for (var j = 0; j <givecom.length ; j++) {
                                givestr+='<option value="'+givecom[j].entrustPartyId+'">'+givecom[j].entrustPartyName+'</option>'
                            }
                            $('#buycom').append(buystr)
                            $('#givecom').append(givestr)
                        }else{
                            M.ui.waiting.creat({
                                status:false,
                                time:1000,
                                text: res.message,
                                hide:false,
                                callback: function () {

                                }
                            });
                        }
                    },
                    error: function (err) {
                        console.log(err)
                    }
                })
            },
            getData: function(){
                M('.next-step').css({
                    'opacity': '1',
                    'cursor': 'pointer'
                })
                var that = this;
                this.payment = own.fetch('stff');
                //转让选择发票时根据系统配置校验是否必填
                M.ajaxFn({
                    url: $.interfacePath.bill + 't/checkInvoice',
                    type: 'post',
                    data: {},
                    dataType: 'json',
                    success: function (res) {
                        if (res.success) {
                            that.selectRequired = res.data;
                            if (res.data === '0') {
                                M('.next-step').css({
                                    'opacity': '1',
                                    'cursor': 'pointer'
                                })
                            }
                        }
                    },
                    error: function (err) {

                    }
                });
                // $(".invoice-wrap").on("change",'.amount',function(){
                //
                //     var needIndex=$(".invoice-wrap").find(".amount").index($(this))
                //     console.log(needIndex)
                //     console.log(that.payment)
                //     that.payment[needIndex].amount=$(this).val()
                //
                // })

                M('.prev-step').click(function () {

                    var stff = own.fetch('stff');
                    stff.twoStep = true;
                    own.save('stff',stff);

                });
                M('.one').click(function () {
                    var stff = own.fetch('stff');
                    stff.twoStep = true;
                    own.save('stff',stff);
                });
                $('.transfer-num').html(M.getFormatNumber(that.payment.amountMoney, 2));
                $('.receiving-com').html(that.payment.receivingName);
                M("#reSubmit").click(function(){
                    window.location.reload();
                });
                //				独立页面弹出框
                M(document).on('click', '#add-newInvoice', function(){
                    M.ui.customDialog.init({
                        drag:true,
                        title:'驳回意见',
                        width:300,
                        height:200,
                        autoClose:false,
                        url:'../dialog/dialog-addInvoice.html',
                        callback:function(e){
                            M.billTransferTwo.initAdd(e);
                            M('.ui-dialog-close').click(function(){
                                e.remove();
                            });
                            M('#buyer').val(own.fetch('stff').payerName);
                            M('#saler').val(own.fetch('stff').receivingName);
                            M('#newInvoice').click(function(){
                                e.remove();
                            });
                        }
                    });
                });

                $(".invoice-wrap").on("keyup",'.amount',function(){

                    var needIndex=$(".invoice-wrap").find(".amount").index($(this))

                    $(this).val($(this).val().replace(/[^\d.]/g,''));
                    this.value = this.value.replace(/\.{2,}/g,"."); //只保留第一个. 清除多余的
                    this.value= this.value.replace(/\.\d{2,}$/,this.value.substr(this.value.indexOf('.'),3));
                    if(parseFloat($(this).val())>$(this).attr('data-id')){

                        $(this).val(M.getFormatNumber($(this).attr('data-id')))

                    }else if(!$(this).val()||$(this).val()==0){
                        $(this).val(0.01)
                    }
                    var value = $(this).val();
                    var array = value.split(".");
                    if((array.length >1 && array[1].length > 2) || array.length >2){
                        value = array[0] + "." +array[1].substr(0,2);
                    }
                    $(this).val(value);
                    var that = this;
                    var select =  $('.invoice-box-wrap').find('li.invoice-box.active');
                    var sum = 0;
                    that.needselectInvoice = [];
                    for(var i=0; i<select.length; i++) {
                        var index = $('.invoice-box-wrap').find('div.invoice-box-holder').index($(select[i]).parent())

                        // sum += parseFloat($(select[i]).find('.amountTax').text().replace(/,/g, ''));
                        // sum = M.arithmeticAdd(sum, parseFloat($(select[i]).find('.amountTax').text().replace(/,/g, '')));
                        sum = M.arithmeticAdd(sum, parseFloat($(select[i]).find('.amount').val().replace(/,/g, '')));
                    };
                    $('.select-num').html($.getFormatNumber(sum, 2));

                    // that.needselectInvoice[needIndex].amount=value
                    // console.log(that.needselectInvoice[needIndex].amount)

                })

                $(document).on("change",'select#invoiceDate',function(){
                    $('#invoiceNo').val('');
                    var n = $(this).val();
                    var purchaserId = $('select#buycom').val();
                    var salesId=$('select#givecom').val();
                    switch (n) {
                        case '0':
                            that.getInvoices('','','',purchaserId,salesId);
                            break;
                        case '1':
                            that.getInvoices($.getDateScope('days',-30), $.getDateScope('days',0),'',purchaserId,salesId );
                            break;
                        case '2':
                            that.getInvoices($.getDateScope('days',-60), $.getDateScope('days',0),'',purchaserId,salesId );
                            break;
                        case '3':
                            that.getInvoices($.getDateScope('days',-90), $.getDateScope('days',0),'',purchaserId,salesId );
                            break;
                        case '4':
                            that.getInvoices('',$.getDateScope('days',-90),'',purchaserId,salesId );
                            break;
                        default:
                            break;
                    }
                });
                $(document).on("click",'#iptSearch',function(){

                    var num = $('#invoiceNo').val();
                    $('select#invoiceDate').val('0');
                    var purchaserId = $('select#buycom').val();
                    var salesId=$('select#givecom').val();
                    that.getInvoices('','',num,purchaserId,salesId);
                });
                $(document).on("click",'#selectAll',function(){
                    $(".invoice-box-wrap .invoice-box").addClass('active')
                    that.selectInvoices()
                    $(this).hide()
                    $('#noselectAll').show()
                });
                $(document).on("click",'#noselectAll',function(){
                    $(".invoice-box-wrap .invoice-box").removeClass('active')
                    that.selectInvoices()
                    $(this).hide()
                    $('#selectAll').show()
                });
                //选择发票
                that.index = 5;
                M('.invoice-box-wrap').on('click', '.invoice-box', function (ev) {
                    var ev = ev || window.event;
                    var target = ev.target || ev.srcElement;
                    if ($(target).hasClass('invoice-down')) {
                        return window.event ? window.event.cancelBubble = true : ev.stopPropagation();
                    }
                    if($(target).hasClass('amount')) {
                        return;
                    }
                    if($(target).hasClass('more-btn')) {
                        if (M(this).hasClass('open')) {
                            M(this).removeClass('open');
                            $(target).html('详情');
                            $(target).siblings('i.arrow').removeClass('g-180deg');
                        } else {
                            // M(this).parent().siblings().children().removeClass('open');
                            // M(this).parent().siblings().children().css('z-index','10');
                            // M(this).parent().siblings().children().find('a.more-btn').html('详情');
                            // M(this).parent().siblings().children().find('i.arrow').removeClass('g-180deg');
                            M(this).addClass('open');
                            M(this).css('z-index', that.index);
                            $(target).html('收拢')
                            $(target).siblings('i.arrow').addClass('g-180deg')
                        }
                    } else {
                        if (M(this).hasClass('active')) {
                            M(this).removeClass('active');
                        } else {
                            M(this).addClass('active');
                        }
                    }
                    that.selectInvoices();
                    that.index++ ;
                });
                M(".next-step").click(function(){
                    M.billTransferTwo.selectValue();
                    var createNo = parseFloat($('.transfer-num').text().replace(/,/g, ''));
                    var selectNo = parseFloat($('.select-num').text().replace(/,/g, ''));
                    if ( selectNo >= createNo || that.selectRequired === '0' ) {

                        M.ajaxFn({
                            url:M.interfacePath.bill+'t/financeTransferAutoMatch',
                            data:{
                                invoiceInfoVOList: that.payment.invoiceInfos,
                                fileVOList:that.payment.contracts,
                                sumTransferAmountStr:that.payment.amountMoney,
                                salesName:that.payment.receivingName,
                                salesId: that.payment.receivingEnterprisesId,
                                businessNum: that.payment.businessNum,
                                contractName: that.payment.contractName,
                                transferApplyId:that.payment.transferApplyId
                            },
                            type:'post',
                            dataType:'json',
                            success:function(res){
//                                console.log(res);
                                if(res.data != null){
                                    that.payment.transferApplyId=res.data.transferApplyId;
                                    that.payment.sumTransferServiceFee=res.data.sumTransferServiceFee;
                                    that.payment.threeStep = false;
                                    own.save('stff',that.payment);

                                    window.location.href = 'billTransferThree.html'
                                }else{
                                    M.ui.waiting.creat({
                                        status:false,
                                        time:1000,
                                        text:res.message,
                                        hide:false
                                    });
                                }

                            },
                            error:function(err){
                                console.log(err);
                            }
                        });
                    } else if ( M('.invoice-box.active').length == 0 ) {
                        M.ui.waiting.creat({
                            status:false,
                            time:1000,
                            text:'请选择发票！',
                            hide:false
                        });
                    } else {
                        M.ui.waiting.creat({
                            status:false,
                            time:1000,
                            text:'已选发票金额不能小于转让金额！',
                            hide:false
                        });
                    }

                });

                // 滚动
                var oDiv = document.getElementById('scrollbox');
                //var oDiv = M('#scrollbox');
                //var scrollDiv = document.getElementById('scroll-ul-content');
                var fanwei=M('#scroll-bar ul').outerHeight(true)-M('#scroll-bar').outerHeight(true);
                var speed = 0;
                function onMouseWheel(ev) {/*当鼠标滚轮事件发生时，执行一些操作*/
                    var ev = ev || window.event;

                    var down = true; // 定义一个标志，当滚轮向下滚时，执行一些操作
                    down = ev.wheelDelta?ev.wheelDelta<0:ev.detail>0;
                    if(down){
                        speed=speed+20;
                        if(speed>90){speed==90}
                        M('#scroll-bar').scrollTop(speed)
                    }else{
                        speed=speed-20;
                        if(speed<0){speed==0}
                        M('#scroll-bar').scrollTop(speed)
                    }
                    if(ev.preventDefault){/*FF 和 Chrome*/
                        ev.preventDefault();// 阻止默认事件
                    }
                    return false;
                }
                addEvent(oDiv,'mousewheel',onMouseWheel);
                addEvent(oDiv,'DOMMouseScroll',onMouseWheel);

                function addEvent(obj,xEvent,fn) {
                    if(obj.attachEvent){
                        obj.attachEvent('on'+xEvent,fn);
                    }else{
                        obj.addEventListener(xEvent,fn,false);
                    }
                }
            },
            selectValue: function () {

                var that = this;
                var select =  $('.invoice-box-wrap').find('li.invoice-box.active');
                that.payment.invoiceInfos = [];
                var sum = 0;
                for(var i=0; i<select.length; i++) {
                    var index = $('.invoice-box-wrap').find('div.invoice-box-holder').index($(select[i]).parent())
                    var amount=$.getFormatNumber($(select[i]).find("input").val(),2);
                        amount=amount.replace(/,/g, '');
                    var invoice = that.invoices[index];
                    invoice.amount = amount;
                    that.payment.invoiceInfos.push(invoice);

                }
                own.save('stff',that.payment);
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

            getTableData:function(){
                var that =this;
                var stff = own.fetch('stff');
                //已存在转让ID重选发票
                if(stff.transferApplyId && that.payment.threeStep){
                    // that.payment.threeStep = false;
                    M.ajaxFn({
                        url:$.interfacePath.bill+'t/backTrackTransfer/list',
                        data: {
                            transferApplyId:stff.transferApplyId
                        },
                        dataType: 'json',
                        success:function(data){
//                            console.log(data);
                            if(data.success){
                                var item = data.data.assetsInvoiceDTOList;
                                that.savedInvoices = item;
                                that.payment.invoiceInfos = item;
                                own.save('stff', that.payment)
                                var str = '';
                                for(var i=0;i<item.length;i++){
                                    var billingDate = item[i].billingDate || '';
                                    var taxRate = !item[i].taxRate ?  item[i].taxRate*100 : ''
                                    var fileAddress = item[i].fileAddress;
                                    var downloadHtml = '';
                                    if (fileAddress && fileAddress.length > 0) {
                                        downloadHtml = '<a href="javascript:;" class="iconfont invoice-down" onclick="M.downloadFileXhr('+"'"+item[i].fileAddress+"'"+','+"'"+item[i].fileName+"'"+')">&#xe67b;</a>';
                                    }
                                    str += '<div class="invoice-box-holder">'+
                                        '<li class="invoice-box active">'+
                                        '<div class="invoice-head">'+
                                        '<i class="iconfont">&#xe62a;</i>发票号码<span class="invoice-num invoice-number">'+item[i].invoiceNumber+'</span><a class="more-btn" href="javascript:;">详情</a><i class="iconfont arrow">&#xe72e;</i>'+
                                        '<div class="check-box iconfont">&#xe74c;</div>'+
                                        '</div>'+
                                        '<div class="invoice-body"><ul>'+
                                        '<div class="stopmp">本次使用金额（元）<input class="amount" data-id="'+item[i].thisAmountTax+ '" value="'+M.getFormatNumber(item[i].thisAmountTax,2,'.',',')+ '" style="width: 80px;height:20px;text-align: right;font-size: 12px;margin-right: 20px;margin-top: 5px;float: right;"  ></div>'+
                                        '<div>剩余可用金额（元）<span class="invoice-date">'+ M.getFormatNumber(item[i].thisAmountTax) +'</span></div>'+
                                        '<div>含税总金额（元）<span class="amountTax  invoice-num">'+ M.getFormatNumber(item[i].amountTax, 2) +'</span></div>'+
                                        '<div>开票日期<span class="invoice-date">'+ billingDate +'</span></div>'+
                                        '<div>发票代码<span class="invoice-code">'+item[i].invoiceCode+'</span></div>'+
                                        '<div>税率<span class="tax-rate">'+taxRate+'%</span></div>'+
                                        '<div>购买方<span title="'+ item[i].purchaserName +'" class="buyer">'+item[i].purchaserName+'</span></div>'+
                                        '<div>销售方<span title="'+ item[i].salesName +'" class="saler">'+item[i].salesName+'</span></div>'+
                                        '<div class="none invoiceTypeCode">'+item[i].invoiceTypeCode+'</div>' +
                                        '<div class="bottom-action">'+
                                        downloadHtml+
                                        '</div>'+
                                        '</ul></div>'+
                                        '</li>'+
                                        '</div>'

                                }
                                $('.invoice-box-wrap').prepend(str);
                                M('.invoice-box-holder').each(function(){
                                    var codeType = M(this).find('.invoiceTypeCode').text();
                                    if(codeType == '007'){
                                        M(this).find('ul').css("background","url(../../template/res/images/pupiao.png) no-repeat 95% 95%");
                                    }else if(codeType == '004'){
                                        M(this).find('ul').css("background","url(../../template/res/images/zhuanpiao.png) no-repeat 95% 95%");
                                    }

                                });
                                var select =  $('.invoice-box-wrap').find('li.invoice-box.active');
                                var sum = 0;
                                for(var i=0; i<select.length; i++) {
                                    sum += parseFloat($(select[i]).find('.amount').val().replace(/,/g, ''));

                                }

                                $('.select-num').html($.getFormatNumber(sum, 2));
                            }else{
                                M.ui.waiting.creat({
                                    status:false,
                                    time:1000,
                                    text:data.message,
                                    hide:false,
                                });
                            }
                        },
                        error:function(){

                        }
                    });
                }else if (stff.transferApplyId && own.fetch('stff').invoiceInfos) {
                    that.savedInvoices = that.payment.invoiceInfos;
                    var item = that.savedInvoices;
                    var str = '';
                    for(var i=0;i<item.length;i++){
                        var billingDate = item[i].billingDate || '';
                        var taxRate = !item[i].taxRate ?  item[i].taxRate*100 : ''
                        var fileAddress = item[i].fileAddress;
                        var downloadHtml = '';
                        if (fileAddress && fileAddress.length > 0) {
                            downloadHtml = '<a href="javascript:;" class="iconfont invoice-down" onclick="M.downloadFileXhr('+"'"+item[i].fileAddress+"'"+','+"'"+item[i].fileName+"'"+')">&#xe67b;</a>';
                        }

                        str += '<div class="invoice-box-holder">'+
                            '<li class="invoice-box">'+
                            '<div class="invoice-head">'+
                            '<i class="iconfont">&#xe62a;</i>发票号码<span class="invoice-num invoice-number">'+item[i].invoiceNumber+'</span><a class="more-btn" href="javascript:;">详情</a><i class="iconfont arrow">&#xe72e;</i>'+
                            '<div class="check-box iconfont">&#xe74c;</div>'+
                            '</div>'+
                            '<div class="invoice-body"><ul>'+
                            '<div class="stopmp">本次使用金额（元）<input class="amount" data-id="'+item[i].thisAmountTax+ '" value="'+M.getFormatNumber(item[i].thisAmountTax,2,'.',',')+ '" style="width: 80px;height:20px;text-align: right;font-size: 12px;margin-right: 20px;margin-top: 5px;float: right;"  ></div>'+
                            '<div>剩余可用金额（元）<span class="invoice-date">'+ M.getFormatNumber(item[i].thisAmountTax) +'</span></div>'+
                            '<div>含税总金额（元）<span class="amountTax  invoice-num">'+ M.getFormatNumber(item[i].amountTax, 2) +'</span></div>'+
                            '<div>开票日期<span class="invoice-date">'+ billingDate +'</span></div>'+
                            '<div>发票代码<span class="invoice-code">'+item[i].invoiceCode+'</span></div>'+
                            '<div>税率<span class="tax-rate">'+taxRate+'%</span></div>'+
                            '<div>购买方<span title="'+ item[i].purchaserName +'" class="buyer">'+item[i].purchaserName+'</span></div>'+
                            '<div>销售方<span title="'+ item[i].salesName +'" class="saler">'+item[i].salesName+'</span></div>'+
                            '<div class="none invoiceTypeCode">'+item[i].invoiceTypeCode+'</div>' +
                            '<div class="bottom-action">'+
                            downloadHtml+
                            '</div>'+
                            '</ul></div>'+
                            '</li>'+
                            '</div>'
                    }
                    $('.invoice-box-wrap').prepend(str);
                    M('.invoice-box-holder').each(function(){
                        var codeType = M(this).find('.invoiceTypeCode').text();
                        if(codeType == '007'){
                            M(this).find('ul').css("background","url(../../template/res/images/pupiao.png) no-repeat 95% 95%");
                        }else if(codeType == '004'){
                            M(this).find('ul').css("background","url(../../template/res/images/zhuanpiao.png) no-repeat 95% 95%");
                        }

                    });
                    var select =  $('.invoice-box-wrap').find('li.invoice-box.active');
                    var sum = 0;
                    for(var i=0; i<select.length; i++) {
                        sum += parseFloat($(select[i]).find('.amount').val().replace(/,/g, ''));

                    }

                    $('.select-num').html($.getFormatNumber(sum, 2));
                }

                if (!own.fetch('stff').receivingEnterprisesId || !own.fetch('stff').payerEnterprisesId) {
                    return;
                }


                M.ajaxFn({
                        url:$.interfacePath.assets + 't/invoice/select',
                        type: 'post',
                        data: {
                            salesId: own.fetch('stff').receivingEnterprisesId,
                            purchaserId: own.fetch('stff').payerEnterprisesId,
                            status: '00',
                            pageSize:1000
                        },
                        dataType: 'json',
                        success:function(data){
//                            console.log(data);
                            if(data.success){

                                var item = data.data;

                                //根据发票id循环过滤
                                var selectInvoices = own.fetch('stff').invoiceInfos || [];
                                for (var k=0;k < selectInvoices.length; k++) {
                                    for(var j=0; j<item.length; j++) {
                                        var invoice = item[j];
                                        if (invoice.id == selectInvoices[k].id) {
                                            item.splice(j ,1)
                                        }
                                    };
                                }

                                if ( that.savedInvoices ) {
                                    that.invoices = that.savedInvoices.concat(item);
                                } else {
                                    that.invoices = item;
                                }

                                var str = '';
                                for(var i=0;i<item.length;i++){
                                    var billingDate = item[i].billingDate || '';
                                    var fileAddress = item[i].fileAddress;
                                    var taxRate = !item[i].taxRate ?  item[i].taxRate*100 : ''
                                    var downloadHtml = '';
                                    if (fileAddress && fileAddress.length > 0) {
                                        downloadHtml = '<a href="javascript:;" class="iconfont invoice-down" onclick="M.downloadFileXhr('+"'"+item[i].fileAddress+"'"+','+"'"+item[i].fileName+"'"+')">&#xe67b;</a>';
                                    }
                                    str += '<div class="invoice-box-holder">'+
                                        '<li class="invoice-box">'+
                                        '<div class="invoice-head">'+
                                        '<i class="iconfont">&#xe62a;</i>发票号码<span class="invoice-num invoice-number">'+item[i].invoiceNumber+'</span><a class="more-btn" href="javascript:;">详情</a><i class="iconfont arrow">&#xe72e;</i>'+
                                        '<div class="check-box iconfont">&#xe74c;</div>'+
                                        '</div>'+
                                        '<div class="invoice-body"><ul>'+
                                        '<div class="stopmp">本次使用金额（元）<input class="amount" data-id="'+item[i].thisAmountTax+ '" value="'+M.getFormatNumber(item[i].thisAmountTax,2,'.',',')+ '" style="width: 80px;height:20px;text-align: right;font-size: 12px;margin-right: 20px;margin-top: 5px;float: right;"  ></div>'+
                                        '<div>剩余可用金额（元）<span class="invoice-date">'+ M.getFormatNumber(item[i].thisAmountTax) +'</span></div>'+
                                        '<div>含税总金额（元）<span class="amountTax  invoice-num">'+ M.getFormatNumber(item[i].amountTax, 2) +'</span></div>'+
                                        '<div>开票日期<span class="invoice-date">'+ billingDate +'</span></div>'+
                                        '<div>发票代码<span class="invoice-code">'+item[i].invoiceCode+'</span></div>'+
                                        '<div>税率<span class="tax-rate">'+taxRate+'%</span></div>'+
                                        '<div>购买方<span title="'+ item[i].purchaserName +'" class="buyer">'+item[i].purchaserName+'</span></div>'+
                                        '<div>销售方<span title="'+ item[i].salesName +'" class="saler">'+item[i].salesName+'</span></div>'+
                                        '<div class="none invoiceTypeCode">'+item[i].invoiceTypeCode+'</div>' +
                                        '<div class="bottom-action">'+
                                        downloadHtml+
                                        '</div>'+
                                        '</ul></div>'+
                                        '</li>'+
                                        '</div>'
                                }
                                var lastDiv = '<li class="new-invoice-box" id="add-newInvoice">\n' +
                                    '                                    <div class="invoice-head">\n' +
                                    '                                    </div>\n' +
                                    '                                    <div class="invoice-body">\n' +
                                    '                                        <div class="iconfont">&#xe608;</div>\n' +
                                    '                                        <div class="">新增发票</div>\n' +
                                    '                                    </div>\n' +
                                    '                                </li>'
                                $('.invoice-box-wrap').append(str);
                                M('.invoice-box-holder').each(function(){
                                    var codeType = M(this).find('.invoiceTypeCode').text();
                                    if(codeType == '007'){
                                        M(this).find('ul').css("background","url(../../template/res/images/pupiao.png) no-repeat 95% 95%");
                                    }else if(codeType == '004'){
                                        M(this).find('ul').css("background","url(../../template/res/images/zhuanpiao.png) no-repeat 95% 95%");
                                    }

                                });
                                $('.invoice-box-wrap').append(lastDiv);
                                that.selectInvoices();
                                /*if(item.length == 0){
                                    M.ui.waiting.creat({
                                        status:false,
                                        time:1000,
                                        text:'查询不到发票数据！',
                                        hide:false,
                                    });
                                }*/
                            }else{
                                M.ui.waiting.creat({
                                    status:false,
                                    time:3000,
                                    text:data.message,
                                    hide:false,
                                });
                                that.selectInvoices();
                            }
                        }
                    });


            },
            getInvoices: function (startTime, endTime, invoiceNumber,purchaserId,salesId) {
                var that = this;
                M.ajaxFn({
                    url: $.interfacePath.assets + 't/invoice/select',
                    type: 'post',
                    data: {
                        salesId:salesId ,
                        purchaserId: purchaserId,
                        status: '00',
                        startTime: startTime,
                        endTime: endTime,
                        invoiceNumber: invoiceNumber,
                        pageSize:1000
                    },
                    dataType: 'json',
                    success: function (res) {
                        var data = res.data;
                        var str = '';
                        if (typeof data.length == 'undefined' || typeof data == 'null' || data.length == 0) {
                            $('.invoice-box').not('.active').parent().remove();
                            that.invoices=own.fetch('stff').invoiceInfos
                            return  M.ui.waiting.creat({
                                status:false,
                                time:1000,
                                text:'未查询到发票！',
                                hide:false
                            });
                        }
                        var select =  $('.invoice-box-wrap').find('li.invoice-box.active');
                        that.newInvoices = [];
                        for(var i=0; i<select.length; i++) {
                            var index = $('.invoice-box-wrap').find('div.invoice-box-holder').index($(select[i]).parent())
                            that.newInvoices.push(that.invoices[index]);
                        }
                       //根据发票id循环过滤
                        var selectInvoices = own.fetch('stff').invoiceInfos || [];
                        for (var k=0;k < selectInvoices.length; k++) {
                            for(var j=0; j<data.length; j++) {
                                var item = data[j];
                                if (item.id == selectInvoices[k].id) {
                                    data.splice(j ,1)
                                }
                            };
                        }
                        that.invoices = that.newInvoices.concat(data);

                        for(var i=0;i<data.length;i++){
                            var item = data[i];
                            var billingDate = item.billingDate || '';
                            var taxRate = !item.taxRate ?  item.taxRate*100 : ''
                            var fileAddress = item.fileAddress;
                            var downloadHtml = '';
                            if (fileAddress && fileAddress.length > 0) {
                                downloadHtml = '<a href="javascript:;" class="iconfont invoice-down" onclick="M.downloadFileXhr('+"'"+item.fileAddress+"'"+','+"'"+item.fileName+"'"+')">&#xe67b;</a>';
                            }
                            str += '<div class="invoice-box-holder">'+
                                '<li class="invoice-box">'+
                                '<div class="invoice-head">'+
                                '<i class="iconfont">&#xe62a;</i>发票号码<span class="invoice-num invoice-number">'+item.invoiceNumber+'</span><a class="more-btn" href="javascript:;">详情</a><i class="iconfont arrow">&#xe72e;</i>'+
                                '<div class="check-box iconfont">&#xe74c;</div>'+
                                '</div>'+
                                '<div class="invoice-body"><ul>'+
                                '<div class="stopmp">本次使用金额（元）<input class="amount" data-id="'+item.thisAmountTax+ '" value="'+M.getFormatNumber(item.thisAmountTax,2,'.',',')+ '" style="width: 80px;height:20px;text-align: right;font-size: 12px;margin-right: 20px;margin-top: 5px;float: right;"  ></div>'+
                                '<div>剩余可用金额（元）<span class="invoice-date">'+ M.getFormatNumber(item.thisAmountTax) +'</span></div>'+
                                '<div>含税总金额（元）<span class="amountTax  invoice-num">'+ M.getFormatNumber(item.amountTax, 2) +'</span></div>'+
                                '<div>开票日期<span class="invoice-date">'+ billingDate +'</span></div>'+
                                '<div>发票代码<span class="invoice-code">'+item.invoiceCode+'</span></div>'+
                                '<div>税率<span class="tax-rate">'+taxRate+'%</span></div>'+
                                '<div>购买方<span title="'+ item.purchaserName +'" class="buyer">'+item.purchaserName+'</span></div>'+
                                '<div>销售方<span title="'+ item.salesName +'" class="saler">'+item.salesName+'</span></div>'+
                                '<div class="none invoiceTypeCode">'+item.invoiceTypeCode+'</div>' +
                                '<div class="bottom-action">'+
                                downloadHtml+
                                '</div>'+
                                '</ul></div>'+
                                '</li>'+
                                '</div>'
                        }

                        $('.invoice-box-wrap li.invoice-box').not('.active').parent().remove();
                        $('#add-newInvoice').before(str);
                        M('.invoice-box-holder').each(function(){
                            var codeType = M(this).find('.invoiceTypeCode').text();
                            if(codeType == '007'){
                                M(this).find('ul').css("background","url(../../template/res/images/pupiao.png) no-repeat 95% 95%");
                            }else if(codeType == '004'){
                                M(this).find('ul').css("background","url(../../template/res/images/zhuanpiao.png) no-repeat 95% 95%");
                            }

                        });
                    },
                    error: function (err) {
                        console.log(err)
                    }
                });
            },
            selectInvoices: function () {
                var that = this;
                var select =  $('.invoice-box-wrap').find('li.invoice-box.active');
                that.payment.invoiceInfos = [];
                var sum = 0;
                for(var i=0; i<select.length; i++) {
                    var index = $('.invoice-box-wrap').find('div.invoice-box-holder').index($(select[i]).parent())
                    that.payment.invoiceInfos.push(that.invoices[index]);
                    sum = M.arithmeticAdd(sum, parseFloat($(select[i]).find('.amount').val().replace(/,/g, '')));
                }

                own.save('stff',that.payment);
                $('.select-num').html($.getFormatNumber(sum, 2));
                if ( sum >= own.fetch('stff').amountMoney || that.selectRequired === '0' ) {
                    M('.next-step').css({
                        'opacity': '1',
                        'cursor': 'pointer'
                    })
                }else {
                    M('.next-step').css({
                        'opacity': '.5',
                        'cursor': 'no-drop'
                    })
                }
            },
        })(function(){
            M.billTransferTwo.init();
        });
    }
)
