require(['head','menu','base','tab','page', 'customDialog', 'calendar', 'calculator', 'status', 'plupload','fuzzy', 'waiting'],
    function(){
        M.define('addBillTwo',{
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
                this.getDate(100);
                this.payment = own.fetch('bill');
                this.invoices='';
                this.pageNum = 1;
                if(this.payment.neednum==1){

                    $('#noselectAll').show()
                    $('#selectAll').hide()
                }else{
                    $('#selectAll').show()
                    $('#noselectAll').hide()
                }

            },
            getcompany:function(){
                M.ajaxFn({
                    url: $.interfacePath.basic + 't/basic/queryEntrust',
                    type: 'post',
                    data: {
                        payerId: own.fetch('bill').payerEnterprisesId,
                        receivingId: own.fetch('bill').receivingEnterprisesId,
                    },
                    dataType: 'json',
                    success: function (res) {

                        if(res.success){
                            //购买方
                            var buycom=res.data.payerUsEntrusts
                            //销售方
                            var givecom=res.data.receivingUsEntrusts
                            var buystr='<option value="'+own.fetch('bill').payerEnterprisesId+'">'+own.fetch('bill').payerName+'</option>',givestr='<option value="'+own.fetch('bill').receivingEnterprisesId+'">'+own.fetch('bill').receivingName+'</option>';
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
            getDate: function(pageSize){
                var that = this;
                var bill = own.fetch('bill');
                // bill.invoiceInfos = [];
                // own.save('bill',bill);
                M('.prevStep').click(function () {

                    var bill = own.fetch('bill');
                    bill.saveFlag = true;
                    own.save('bill',bill);
                });
                $('.createNo').html($.getFormatNumber(own.fetch('bill').amountMoney, 2));
                $('.createNo-cn').html($.getChineseNumber(own.fetch('bill').amountMoney));
                // $('#titCompany').html(own.fetch('bill').legalRepresentativeOffice);
                // $('#payerName').html(own.fetch('bill').payerName);
                // $('.cashDate').html(own.fetch('bill').expirationTimeStr);
                $(document).on("change",'select#invoiceDate',function(){
                       that.pageNum = 1;
                       that.isbool = true;
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
                    that.pageNum = 1;
                    that.isbool = true;
                    var num = $('#invoiceNo').val();
                    var purchaserId = $('select#buycom').val();
                    var salesId=$('select#givecom').val();
                    $('select#invoiceDate').val('0');
                    that.getInvoices('','',num,purchaserId,salesId);

                    // console.log($('.invoice-box-wrap li.invoice-box').not('.active').parent().remove())
                });
                $(document).on("click",'#selectAll',function(){

                    that.payment.neednum=0
                    that.payment.neednum=that.payment.neednum+1
                    $(".invoice-box-wrap .invoice-box").addClass('active')

                    that.selectInvoices();
                    $(this).hide()
                    $('#noselectAll').show()
                });
                $(document).on("click",'#noselectAll',function(){
                    that.payment.neednum=that.payment.neednum-1
                    $(".invoice-box-wrap .invoice-box").removeClass('active')
                    that.selectInvoices();
                    $(this).hide()
                    $('#selectAll').show()

                });
                M.ajaxFn({
                    url: $.interfacePath.assets + 't/invoice/select',
                    type: 'post',
                    data: {
                        salesId: own.fetch('bill').receivingEnterprisesId,
                        purchaserId: own.fetch('bill').payerEnterprisesId,
                        status: '00',
                        pageNum: '1',
                        pageSize: '100',
                    },
                    dataType: 'json',
                    success: function (res) {

                        that.invoices = res.data;
                        var data = res.data;
                        if (data.length == 0) {
                            return M.ui.waiting.creat({
                                    status:false,
                                    time:1000,
                                    text: '未查询到数据',
                                    hide:false,
                                    callback: function () {

                                    }
                            });
                        }
                        // that.sum(data)
                        //根据发票id循环过滤
                        var selectInvoices = own.fetch('bill').invoiceInfos;
                        if (selectInvoices && selectInvoices.length > 0) {
                            var str = '';
                            for(var i=0; i<selectInvoices.length; i++) {
                                var billingDate = selectInvoices[i].billingDate || '';

                                var taxRate =  selectInvoices[i].taxRate ?  selectInvoices[i].taxRate*100 : 0;

                                var fileAddress = selectInvoices[i].fileAddress;
                                var downloadHtml = '';
                                if (fileAddress && fileAddress.length > 0) {
                                    downloadHtml = '<a href="javascript:;" class="iconfont invoice-down" onclick="M.downloadFileXhr('+"'"+selectInvoices[i].fileAddress+"'"+','+"'"+selectInvoices[i].fileName+"'"+')">&#xe67b;</a>';
                                }

                                str += '<div class="invoice-box-holder">'+
                                    '<li class="invoice-box active">'+
                                    '<div class="invoice-head">'+
                                    '<i class="iconfont">&#xe62a;</i>发票号码<span class="invoice-num">'+selectInvoices[i].invoiceNumber+'</span><a class="more-btn" href="javascript:;">详情</a><i class="iconfont arrow">&#xe72e;</i>'+
                                    '<div class="check-box iconfont">&#xe74c;</div>'+
                                    '</div>'+
                                    '<div class="invoice-body"><ul>'+
                                    '<div class="stopmp">本次使用金额（元）<input class="amount" data-id="'+selectInvoices[i].thisAmountTax+ '" value="'+M.getFormatNumber(selectInvoices[i].thisAmountTax,2,'.',',')+ '" style="width: 80px;height:20px;text-align: right;font-size: 12px;margin-right: 20px;margin-top: 5px;float: right;"  ></div>'+
                                    '<div>剩余可用金额（元）<span class="invoice-date">'+ M.getFormatNumber(selectInvoices[i].thisAmountTax) +'</span></div>'+
                                    '<div>含税总金额（元）<span class="amountTax  invoice-num">'+ M.getFormatNumber(selectInvoices[i].amountTax, 2) +'</span></div>'+
                                    '<div>开票日期<span class="invoice-date">'+ billingDate +'</span></div>'+
                                    '<div>发票代码<span class="invoice-code">'+selectInvoices[i].invoiceCode+'</span></div>'+
                                    '<div>税率<span class="tax-rate">'+taxRate+'%</span></div>'+
                                    '<div>购买方<span title="'+ selectInvoices[i].purchaserName +'" class="buyer">'+selectInvoices[i].purchaserName+'</span></div>'+
                                    '<div>销售方<span title="'+ selectInvoices[i].salesName +'" class="saler">'+selectInvoices[i].salesName+'</span></div>'+
                                    '<div class="none invoiceTypeCode">'+selectInvoices[i].invoiceTypeCode+'</div>' +
                                    '<div class="bottom-action">'+
                                    downloadHtml+
                                    '</div>'+
                                    '</ul></div>'+
                                    '</li>'+
                                    '</div>'
                            }
                            $('.invoice-box-wrap').append(str);
                            for (var k=0;k < selectInvoices.length; k++) {
                                for(var j=0; j<data.length; j++) {
                                    var item = data[j];
                                    if (item.id == selectInvoices[k].id) {
                                        data.splice(j ,1)
                                    }
                                };
                            }
                            that.invoices = selectInvoices.concat(data);
                            that.selectInvoices();
                        }


                        var str = '';
                        for(var i=0; i<data.length; i++) {
                            var billingDate = data[i].billingDate || '';

                            var taxRate =  data[i].taxRate ?  data[i].taxRate*100 : '0';

                            var fileAddress = data[i].fileAddress;
                            var downloadHtml = '';
                            if (fileAddress && fileAddress.length > 0) {
                                downloadHtml = '<a href="javascript:;" class="iconfont invoice-down" onclick="M.downloadFileXhr('+"'"+data[i].fileAddress+"'"+','+"'"+data[i].fileName+"'"+')">&#xe67b;</a>';
                            }
                            str += '<div class="invoice-box-holder">'+
                                '<li class="invoice-box">'+
                                '<div class="invoice-head">'+
                                '<i class="iconfont">&#xe62a;</i>发票号码<span class="invoice-num">'+data[i].invoiceNumber+'</span><a class="more-btn" href="javascript:;">详情</a><i class="iconfont arrow">&#xe72e;</i>'+
                                '<div class="check-box iconfont">&#xe74c;</div>'+
                                '</div>'+
                                '<div class="invoice-body"><ul>'+
                                '<div class="stopmp">本次使用金额（元）<input class="amount" data-id="'+data[i].thisAmountTax+ '" value="'+M.getFormatNumber(data[i].thisAmountTax,2,'.',',')+ '" style="width: 80px;height:20px;text-align: right;font-size: 12px;margin-right: 20px;margin-top: 5px;float: right;"  ></div>'+
                                '<div>剩余可用金额（元）<span class="invoice-date">'+ M.getFormatNumber(data[i].thisAmountTax) +'</span></div>'+
                                '<div>含税总金额（元）<span class="amountTax  invoice-num">'+ M.getFormatNumber(data[i].amountTax, 2) +'</span></div>'+
                                '<div>开票日期<span class="invoice-date">'+ billingDate +'</span></div>'+
                                '<div>发票代码<span class="invoice-code">'+data[i].invoiceCode+'</span></div>'+
                                '<div>税率<span class="tax-rate">'+taxRate+'%</span></div>'+
                                '<div>购买方<span title="'+ data[i].purchaserName +'" class="buyer">'+data[i].purchaserName+'</span></div>'+
                                '<div>销售方<span title="'+ data[i].salesName +'" class="saler">'+data[i].salesName+'</span></div>'+
                                '<div class="none invoiceTypeCode">'+data[i].invoiceTypeCode+'</div>' +
                                '<div class="bottom-action">'+
                                downloadHtml+
                                '</div>'+
                                '</ul></div>'+
                                '</li>'+
                                '</div>'

                        }
                        $('.invoice-box-wrap').append(str);
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
                //获取发票总额
                M.ajaxFn({
                    url: $.interfacePath.assets + 't/invoice/sumNotUseInvoice',
                    type: 'post',
                    data: {
                        salesId: own.fetch('bill').receivingEnterprisesId,
                        purchaserId: own.fetch('bill').payerEnterprisesId,
                        status: '00'
                    },
                    dataType: 'json',
                    success: function (res) {
                        if (res.data == null) {
                            $('.totalNo').html(M.getFormatNumber(0, 2));
                            $('.totalNo-cn').html('零元整');
                        }else if (res.success) {
                            $('.totalNo').html(M.getFormatNumber(res.data.sumAmountTax, 2));
                            $('.totalNo-cn').html(M.getChineseNumber(res.data.sumAmountTax));
                        }else {
                            M.ui.waiting.creat({
                                status:false,
                                time:1000,
                                text:res.message,
                                hide:false,
                            });
                        }
                    },
                    error: function (err) {
                        M.ui.waiting.creat({
                            status:false,
                            time:1000,
                            text:res.message,
                            hide:false,
                        });
                    }
                });

                M.ui.tab.init({
                    index:0,
                    button:$('.g-nav-tabs-li'),
                    panel:$('.g-tab-main'),
                    event:'click',
                    currentClass:'active',
                    url:null,
                    data:null,
                    callback:function(){},
                    error:function(){}
                });
                M.ui.page.init({
                    container:M('#page')[0],
                    total:50,
                    items:10,
                    number:4,
                    entries:1,
                    isInput:true,
                    isText:false,
                    current:0,
                    callback:function(that){}
                });
                M("#reSubmit").click(function(){
                    window.location.reload();
                });
                //				独立页面弹出框
                M('#add-invoice').click(function(){
                    M.ui.customDialog.init({
                        drag:true,
                        title:'驳回意见',
                        width:300,
                        height:200,
                        autoClose:false,
                        url:'../dialog/dialog-addInvoice.html',
                        callback:function(e){
                            M.addBillTwo.initAdd(e);
                            M('.ui-dialog-close').click(function(){
                                e.remove();
                            });
                            M('#buyer').val(own.fetch('bill').payerName);
                            M('#saler').val(own.fetch('bill').receivingName);
                            M('#newInvoice').click(function(){
                                // var i = {};
                                // i.invoiceCode = $('#invoiceCode').val();
                                // i.invoiceNumber = $('#invoiceNum').val();
                                // i.billingDate = $('#createDate').val();
                                // i.totalAmount = $('#invoiceAmount').val();
                                // i.checkCode = $('#invoiceCheckCode').val();
                                // i.receivingId = own.fetch('bill').receivingEnterprisesId;
                                // i.payerId = own.fetch('bill').payerEnterprisesId;
                                // M.ajaxFn({
                                //     url:  $.interfacePath.assets +'t/invoice/checkInvoicePurchaserAndSales',
                                //     type: 'post',
                                //     data: i,
                                //     dataType: 'json',
                                //     success: function (res) {
                                //
                                //         if (res.success) {
                                //
                                //             M.ui.waiting.creat({
                                //                 status:true,
                                //                 time:1000,
                                //                 text:res.message,
                                //                 hide:false,
                                //                 callback: function () {
                                //                     e.remove();
                                //                     window.location.reload();
                                //                 }
                                //             });
                                //         }else {
                                //             M.ui.waiting.creat({
                                //                 status:false,
                                //                 time:1000,
                                //                 text:res.message,
                                //                 hide:false,
                                //                 callback: function () {
                                //                     // e.remove();
                                //                     // window.location.reload();
                                //                 }
                                //             });
                                //         }
                                //     },
                                //     error: function (err) {
                                //         console.log('err+'+err)
                                //     }
                                // })
                                e.remove();
                            });


                        }
                    });
                });
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
                            // M(this).parent().siblings().children().css('z-index','5');
                            // M(this).parent().siblings().children().find('a.more-btn').html('详情');
                            // M(this).parent().siblings().children().find('i.arrow').removeClass('g-180deg');
                            M(this).css('z-index', that.index);
                            M(this).addClass('open');
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
                    that.index++;
                });
                //滚动加载更多
                that.isbool=true;//触发开关，防止多次调用事件
                $('#scroll-bar').scroll(function(){

                    var scrollTop = $(this).scrollTop();    //滚动条距离顶部的高度
                    var scrollHeight = $(this).find('ul').innerHeight();   //当前页面的总高度
                    var clientHeight = $(this).innerHeight();    //当前可视的页面高度
                    if(scrollTop + clientHeight >= scrollHeight && that.isbool==true ){   //距离顶部+当前高度 >=文档总高度 即代表滑动到底部
                        //滚动条到达底部
                        that.isbool=false;

                        that.pageNum++;
                        var num = $('#invoiceNo').val();
                        var n = $('select#invoiceDate').val();
                        switch (n) {
                            case '0':
                                that.scrollGetInvoices('','',num, that.pageNum);
                                break;
                            case '1':
                                that.scrollGetInvoices($.getDateScope('days',-30), $.getDateScope('days',0), num, that.pageNum);
                                break;
                            case '2':
                                that.scrollGetInvoices($.getDateScope('days',-60), $.getDateScope('days',0) ,num, that.pageNum);
                                break;
                            case '3':
                                that.scrollGetInvoices($.getDateScope('days',-90), $.getDateScope('days',0), num, that.pageNum);
                                break;
                            case '4':
                                that.scrollGetInvoices('',$.getDateScope('days',-90), num, that.pageNum);
                                break;
                            default:
                                break;
                        }
                    }
                });



                // 滚动
                var oDiv = document.getElementById('scrollbox');
                var speed = 0;
                function onMouseWheel(ev) {/*当鼠标滚轮事件发生时，执行一些操作*/
                    var ev = ev || window.event;
                    var down = true; // 定义一个标志，当滚轮向下滚时，执行一些操作
                    down = ev.wheelDelta?ev.wheelDelta<0:ev.detail>0;
                    if(down){
                        speed=speed+30;
                        // console.log(speed);
                        if(speed>90){speed==90}
                        M('#scroll-bar').scrollTop(speed)
                    }else{
                        speed=speed-30;
                        // console.log(speed);
                        if(speed<0){speed==0}
                        // console.log(speed)
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
                    $('.selectNum').html($.getFormatNumber(sum, 2));
                    $('.selectNum-cn').html($.getChineseNumber(sum));
                    if ( sum >= own.fetch('bill').amountMoney ) {
                        M('#billSubmit').css({
                            'opacity': '1',
                            'cursor': 'pointer'
                        })
                    }else {
                        M('#billSubmit').css({
                            'opacity': '.5',
                            'cursor': 'no-drop'
                        })
                    }

                })
                $('#billSubmit').click(function () {
                    var submitBtn = $(this);
                    var createNo = parseFloat($('.createNo').text().replace(/,/g, ''));
                    var selectNo = parseFloat($('.selectNum').text().replace(/,/g, ''));

                    if ( selectNo >= createNo ) {

                        M.addBillTwo.selectValue();

                        window.location.href = 'billConfirm.html';

                    }else if ( M('.invoice-box.active').length == 0 ) {
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
                            text:'已选金额不能小于开立金额！',
                            hide:false
                        });
                    }

                });

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
                own.save('bill',that.payment);
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

            scrollGetInvoices: function(startTime, endTime, invoiceNumber, pageNum) {
                var that = this;
                M.ajaxFn({
                    url: $.interfacePath.assets + 't/invoice/select',
                    type: 'post',
                    data: {
                        salesId: own.fetch('bill').receivingEnterprisesId,
                        purchaserId: own.fetch('bill').payerEnterprisesId,
                        status: '00',
                        startTime: startTime,
                        endTime: endTime,
                        invoiceNumber: invoiceNumber,
                        pageNum: pageNum,
                        pageSize: 100,
                    },
                    dataType: 'json',
                    success: function (res) {
                        var data = res.data;
                        if (data.length == 0) {
                            return  M.ui.waiting.creat({
                                        status:false,
                                        time:1000,
                                        text:'已经到底了！',
                                        hide:false
                                    });
                        }
                        var str = '';

                        //根据发票id循环过滤
                        var selectInvoices = own.fetch('bill').invoiceInfos;
                        for (var k=0;k < selectInvoices.length; k++) {
                            for(var j=0; j<data.length; j++) {
                                var item = data[j];
                                if (item.id == selectInvoices[k].id) {
                                    data.splice(j ,1)
                                }
                            };
                        }


                        for(var i=0; i<data.length; i++) {
                            var billingDate =  data[i].billingDate || '';

                            var taxRate =  data[i].taxRate ?  data[i].taxRate*100 : 0;

                            var fileAddress = data[i].fileAddress;
                            var downloadHtml = '';
                            if (fileAddress && fileAddress.length > 0) {
                                downloadHtml = '<a href="javascript:;" class="iconfont invoice-down" onclick="M.downloadFileXhr('+"'"+data[i].fileAddress+"'"+','+"'"+data[i].fileName+"'"+')">&#xe67b;</a>';
                            }
                            str += '<div class="invoice-box-holder">'+
                                '<li class="invoice-box">'+
                                '<div class="invoice-head">'+
                                '<i class="iconfont">&#xe62a;</i>发票号码<span class="invoice-num">'+data[i].invoiceNumber+'</span><a class="more-btn" href="javascript:;">详情</a><i class="iconfont arrow">&#xe72e;</i>'+
                                '<div class="check-box iconfont">&#xe74c;</div>'+
                                '</div>'+
                                '<div class="invoice-body"><ul>'+
                                '<div class="stopmp">本次使用金额（元）<input class="amount" data-id="'+data[i].thisAmountTax+ '" value="'+M.getFormatNumber(data[i].thisAmountTax,2,'.',',')+ '" style="width: 80px;height:20px;text-align: right;font-size: 12px;margin-right: 20px;margin-top: 5px;float: right;"  ></div>'+
                                '<div>剩余可用金额（元）<span class="invoice-date">'+ M.getFormatNumber(data[i].thisAmountTax) +'</span></div>'+
                                '<div>含税总金额（元）<span class="amountTax  invoice-num">'+ M.getFormatNumber(data[i].amountTax, 2) +'</span></div>'+
                                '<div>开票日期<span class="invoice-date">'+ billingDate +'</span></div>'+
                                '<div>发票代码<span class="invoice-code">'+data[i].invoiceCode+'</span></div>'+
                                '<div>税率<span class="tax-rate">'+taxRate+'%</span></div>'+
                                '<div>购买方<span title="'+ data[i].purchaserName +'" class="buyer">'+data[i].purchaserName+'</span></div>'+
                                '<div>销售方<span title="'+ data[i].salesName +'" class="saler">'+data[i].salesName+'</span></div>'+
                                '<div class="none invoiceTypeCode">'+data[i].invoiceTypeCode+'</div>' +
                                '<div class="bottom-action">'+
                                downloadHtml+
                                '</div>'+
                                '</ul></div>'+
                                '</li>'+
                                '</div>'
                        }
                        $('.invoice-box-wrap').append(str);
                        M('.invoice-box-holder').each(function(){
                            var codeType = M(this).find('.invoiceTypeCode').text();
                            if(codeType == '007'){
                                M(this).find('ul').css("background","url(../../template/res/images/pupiao.png) no-repeat 95% 95%");
                            }else if(codeType == '004'){
                                M(this).find('ul').css("background","url(../../template/res/images/zhuanpiao.png) no-repeat 95% 95%");
                            }

                        });
                        that.invoices = that.invoices.concat(data);
                        // that.sum(that.invoices)
                        that.isbool = true;
                    },
                    error: function (err) {
                        console.log(err)
                    }
                });
            },
            getInvoices: function (startTime, endTime, invoiceNumber,purchaserId,salesId) {
                var that = this;
                if (!own.fetch('bill').receivingEnterprisesId || !own.fetch('bill').payerEnterprisesId) {
                    return;
                }

                M.ajaxFn({
                    url: $.interfacePath.assets + 't/invoice/select',
                    type: 'post',
                    data: {
                        salesId:salesId,
                        purchaserId: purchaserId,
                        status: '00',
                        startTime: startTime,
                        endTime: endTime,
                        invoiceNumber: invoiceNumber,
                        pageSize: 100,
                    },
                    dataType: 'json',
                    success: function (res) {
                        // that.invoices = res.data;
                        var data = res.data;
                        if (typeof data.length == 'undefined' || typeof data == 'null' || data.length == 0) {
                            $('.invoice-box').not('.active').parent().remove();
                            that.invoices=own.fetch('bill').invoiceInfos
                            return M.ui.waiting.creat({
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
                        var selectInvoices = own.fetch('bill').invoiceInfos;
                        for (var k=0;k < selectInvoices.length; k++) {
                            for(var j=0; j<data.length; j++) {
                                var item = data[j];
                                if (item.id == selectInvoices[k].id) {
                                    data.splice(j ,1)
                                }
                            };
                        }

                        that.invoices =that.newInvoices.concat(data);
                        // that.sum(that.invoices)
                        var str = '';
                        for(var i=0; i<data.length; i++) {
                            var billingDate = data[i].billingDate || '';

                            var taxRate =  data[i].taxRate ?  data[i].taxRate*100 : 0;

                            var fileAddress = data[i].fileAddress;
                            var downloadHtml = '';
                            if (fileAddress && fileAddress.length > 0) {
                                downloadHtml = '<a href="javascript:;" class="iconfont invoice-down" onclick="M.downloadFileXhr('+"'"+data[i].fileAddress+"'"+','+"'"+data[i].fileName+"'"+')">&#xe67b;</a>';
                            }

                            str += '<div class="invoice-box-holder">'+
                                '<li class="invoice-box">'+
                                '<div class="invoice-head">'+
                                '<i class="iconfont">&#xe62a;</i>发票号码<span class="invoice-num">'+data[i].invoiceNumber+'</span><a class="more-btn" href="javascript:;">详情</a><i class="iconfont arrow">&#xe72e;</i>'+
                                '<div class="check-box iconfont">&#xe74c;</div>'+
                                '</div>'+
                                '<div class="invoice-body"><ul>'+
                                '<div class="stopmp">本次使用金额（元）<input class="amount" data-id="'+data[i].thisAmountTax+ '" value="'+M.getFormatNumber(data[i].thisAmountTax,2,'.',',')+ '" style="width: 80px;height:20px;text-align: right;font-size: 12px;margin-right: 20px;margin-top: 5px;float: right;"  ></div>'+
                                '<div>剩余可用金额（元）<span class="invoice-date">'+ M.getFormatNumber(data[i].thisAmountTax) +'</span></div>'+
                                '<div>含税总金额（元）<span class="amountTax  invoice-num">'+ M.getFormatNumber(data[i].amountTax, 2) +'</span></div>'+
                                '<div>开票日期<span class="invoice-date">'+ billingDate +'</span></div>'+
                                '<div>发票代码<span class="invoice-code">'+data[i].invoiceCode+'</span></div>'+
                                '<div>税率<span class="tax-rate">'+taxRate+'%</span></div>'+
                                '<div>购买方<span title="'+ data[i].purchaserName +'" class="buyer">'+data[i].purchaserName+'</span></div>'+
                                '<div>销售方<span title="'+ data[i].salesName +'" class="saler">'+data[i].salesName+'</span></div>'+
                                '<div class="none invoiceTypeCode">'+data[i].invoiceTypeCode+'</div>' +
                                '<div class="bottom-action">'+
                                downloadHtml+
                                '</div>'+
                                '</ul></div>'+
                                '</li>'+
                                '</div>'
                        }

                        $('.invoice-box-wrap li.invoice-box').not('.active').parent().remove();
                        $('.invoice-box-wrap').append(str);
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
                    // sum += parseFloat($(select[i]).find('.amountTax').text().replace(/,/g, ''));
                    sum = M.arithmeticAdd(sum, parseFloat($(select[i]).find('.amount').val().replace(/,/g, '')));
                }
                // console.log(that.payment);
                own.save('bill',that.payment);
                $('.selectNum').html($.getFormatNumber(sum, 2));
                $('.selectNum-cn').html($.getChineseNumber(sum));
                if ( sum >= own.fetch('bill').amountMoney ) {
                    M('#billSubmit').css({
                        'opacity': '1',
                        'cursor': 'pointer'
                    })
                }else {
                    M('#billSubmit').css({
                        'opacity': '.5',
                        'cursor': 'no-drop'
                    })
                }
            },
            // sum: function (arr) {
            //     var totalNum = 0;
            //     var noTaxNum = 0;
            //     for (var i=0; i<arr.length; i++) {
            //         totalNum = M.arithmeticAdd(totalNum, arr[i].amountTax);
            //         noTaxNum = M.arithmeticAdd(noTaxNum, arr[i].totalAmount);
            //     }
            //     $('.totalNo').html(M.amount(totalNum, 2));
            //     $('.noTaxNo').html(M.amount(noTaxNum, 2));
            // }


        })(function(){
            M.addBillTwo.init();
        });
    }
);
