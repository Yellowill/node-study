require(['head', 'menu', 'base', 'tab', 'page', 'calendar', 'confirm', 'customDialog', 'status', 'plupload'],
    function () {
        M.define('billIssue', {
            head: M.ui.head.init(),
            init: function () {
                M.ui.menu.init({
                    index: [0, 0],
              //      url: M.getNormalPath('getMenu.json', 4),
                    callback: function () {
                    }
                })

                var menuId = M.getMenuId('../bill/billIssue.html');
                this.getBtnPrivilege(menuId)
                this.hasBatchImport = false;
                this.hasQuickKaili = false;

                this.base = M.static.init();
                this.sortCode = "";
                this.pageSize = 10;
                this.status = 0;
                this.count = 0;
                this.getDate();
                this.getTableData(1);
                this.dateSort = true;
                M('#opens').bind('click',function(){
                    M('#othersc').toggle()
                });
            },

            getBtnPrivilege: function(menuId) {
                M.buttonsPrivilege(menuId, function (data) {
                    if (!data || data.length == 0){
                        return;
                    }
                    for (var i = 0; i<data.length; i++) {
                        if (data[i].btnNo == "PLDR") {
                            M.billIssue.hasBatchImport = true;
                            M('#addBill').before('<a id="quickImp" href="javascript:;" class="ui-button-ghost g-nav-btn ui-btn-red mar-right-10"><i class="iconfont mar-right-5">&#xe67b;</i>批量导入</a>');
                            //批量导入
                            M('#quickImp').click('on', function () {
                                M.billIssue.quickImport();
                            })
                        }
                        if (data[i].btnNo == "KSKL") {
                            M.billIssue.hasQuickKaili = true;
                            M('#addBill').after('<a id="quickKaili" href="addBill.html?isQuick=1" class="ui-button-ghost g-nav-btn ui-btn-red mar-left-10"><i class="iconfont mar-right-5">&#xe608;</i>快速开立</a>');
                        }
                    }
                })
            },
            getDate: function () {

                M(document).on('click', '.js-view', this.view);
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

                M('#addBill').click(function () {
                    var isQuick=$.getUrlParam('isQuick')
                    if (own.fetch('userInfo').cus_caAgreementFlag != '2') {
                        if(isQuick=='1'){
                            window.location.href="billContract.html?isQuick=1";
                        }else{
                            window.location.href="billContract.html";
                        }

                    }else {
                        window.location.href="addBill.html";
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
                    }
                }, this);
                //时间排序
                M('.sort-group .date-sort').click(function(event) {
                    var dateSort = M.billIssue.sortCode;
                    if (M(this).hasClass('active')) {
                        M(this).removeClass('active');
                        M(this).find('i').removeClass('g-180deg');
                        dateSort = "10"
                    }else {
                        M(this).addClass('active');
                        M(this).find('i').addClass('g-180deg');
                        dateSort = "15"
                    }
                    M('.sort-group .price-sort').removeClass('active');
                    M('.sort-group .price-sort').find('i').removeClass('g-180deg');
                    M.billIssue.sortCode = dateSort;
                    M.billIssue.getTableData(1);
                    return false;
                });

                //金额排序
                M('.sort-group .price-sort').click(function(event) {
                    var priceSort = M.billIssue.sortCode;
                    if (M(this).hasClass('active')) {
                        M(this).removeClass('active');
                        M(this).find('i').removeClass('g-180deg');
                        priceSort = "20"
                    }else {
                        M(this).addClass('active');
                        M(this).find('i').addClass('g-180deg');
                        priceSort = "25"
                    }
                    M.billIssue.sortCode = priceSort;
                    M('.sort-group .date-sort').removeClass('active');
                    M('.sort-group .date-sort').find('i').removeClass('g-180deg');
                    M.billIssue.getTableData(1);
                    return false;
                });

                M('.ui-search-button').click(function(event) {
                    M.billIssue.getTableData(1);
                });

                M('.tapAll').click('on', function () {
                    M.billIssue.status = 0;
                    M.billIssue.getTableData(1);
                });

                M('.tapCheck').click('on', function () {
                    M.billIssue.status = 1;
                    M.billIssue.getTableData(1);
                });

                M('.tapPay').click('on', function () {
                    M.billIssue.status = 2;
                    M.billIssue.getTableData(1);
                });

                M('.tapBack').click('on', function () {
                    M.billIssue.status = 3;
                    M.billIssue.getTableData(1);
                });
                M('.tapRevoke').click('on', function () {
                    M.billIssue.status = 4;
                    M.billIssue.getTableData(1);
                });
                M('.finished').click('on', function () {
                    M.billIssue.status = 5;
                    M.billIssue.getTableData(1);
                });
                M('.tapSign').click('on', function () {
                    M.billIssue.status = 6;
                    M.billIssue.getTableData(1);
                });


                $(document).on("change",'select.search-select',function(){

                    M.billIssue.getTableData(1);
                });
            },


            //批量导入
            quickImport: function () {
                M.ui.customDialog.init({
                    drag:false,
                    title:'批量导入',
                    width:480,
                    height:200,
                    autoClose:false,
                    url:'../dialog/dialog-quickImport.html',
                    callback:function(e){

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

                                M.billIssue.quickImportRequest(data.data.fileAddress, e)
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


            quickImportRequest: function(fileUrl, e) {
                M.ajaxFn({
                    url:  $.interfacePath.assets +'t/assets/exportCreateBill',
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
                                            M.billIssue.getTableData(1);
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


            //状态格式化
            statusFormat: function (data) {
                var type = null;
                if (data == '0') {
                    type = '新增';
                } else if (data == 10) {
                    type = '待复核';
                } else if (data == '00') {
                    type = '待初审';
                } else if (data == 20) {
                    type = '待平台审核';
                } else if (data == 25) {
                    type = '待平台复核';
                } else if (data == 2) {
                    type = '复核';
                } else if (data == 28) {
                    type = '待签收';
                } else if (data == 30) {
                    type = '已开立';
                } else if (data == 40) {
                    type = '兑付中';
                } else if (data == 42) {
                    type = '兑付中';
                } else if (data == 45) {
                    type = '兑付中';
                } else if (data == 50) {
                    type = '已兑付';
                } else if (data == 90) {
                    type = '业务驳回';
                } else if (data == 95) {
                    type = '平台驳回';
                } else if (data == 96) {
                    type = '接收方驳回';
                } else if (data == 98) {
                    type = '作废';
                } else if (data == 97) {
                    type = '逾期冻结';
                } else if(data == 99){
                    type = '已撤销';
                }
                return type;
            },

            //撤销
            check: function(id) {
                if (!id) {
                    return;
                }
                // $('body').css('height','100%');
                M.ui.confirm.init({
                    html:'确定撤销吗？',
                    drag: false,
                    button:[
                        {
                            href:null,
                            html:'确认',
                            callback:function(){
                                // $('body').css('height','auto');
                                M.ajaxFn({
                                    url:$.interfacePath.bill+'t/gold/remove',
                                    type: 'post',
                                    data: {
                                        "id": id,
                                        "status": "10",
                                    },
                                    dataType: 'json',
                                    contentType: 'application/json',
                                    success: function (res) {
                                        if (res.success) {
                                            var data = res.data;
                                            if (data) {
                                                // M.billIssue.getTableData(1);
                                                var pageIndex = $('#page').find('span.current').text();
                                                M.billIssue.getTableData(pageIndex);
                                                M.ui.waiting.creat({
                                                    status:true,
                                                    time:3000,
                                                    text:'撤销成功',
                                                    hide:false,
                                                });
                                            }
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
                                        console.log(res);
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

            //新增
            addItem: function () {

            },


            getTableData: function (page) {

                var sortCode = M.billIssue.sortCode;
                var startTime = M('#js-calender-start').val();
                var endTime = M('#js-calender-stop').val();
                var financialInstitutionsName = M('.institution').val();
                var tbNum = M('.tbNum').val();
                var payDate = M('.search-select').val();
                var payDateStart = "";
                var payDateEnd = "";
                var dateFormat =  $('.search-select').val();
                // if(dateFormat != ''){
                //     startTime = $.getDateScope('days',0-dateFormat);
                //     endTime = $.getDateScope('days',0);
                // }
                switch (payDate) {
                    case '1':
                        payDateStart = $.getDateScope('days',0);
                        payDateEnd = $.getDateScope('days',14);
                        break;
                    case '2':
                        payDateStart = $.getDateScope('days',0);
                        payDateEnd = $.getDateScope('days',30);
                        break;
                    case '3':
                        payDateStart = $.getDateScope('days',0);
                        payDateEnd = $.getDateScope('days',90);
                        break;
                    case '4':
                        payDateStart = $.getDateScope('days',0);
                        payDateEnd = $.getDateScope('days',180);
                        break;
                    default:
                        break;
                }


                var status = M.billIssue.status;
                var statusObj = "";

                switch (status) {
                    case 1:
                        statusObj = "10";
                        break;
                    case 2:
                        statusObj = "20";
                        break;
                    case 3:
                        statusObj = "95";
                        break;
                    case 4:
                        statusObj = "99";
                        break;
                    case 5:
                        statusObj = "30";
                        break;
                    case 6:
                        statusObj = "28";
                        break;
                    default:
                        statusObj = "";
                }

                M.ajaxFn({
                    url:$.interfacePath.bill+'t/gold/list',
                    type: 'post',
                    data: {
                        "receivName": financialInstitutionsName,
                        "billNo":tbNum,
                        "releaseDateStart": startTime,
                        "releaseDateEnd": endTime,
                        "statusList": statusObj,
                        "maturityDateStart": payDateStart,
                        "maturityDateEnd": payDateEnd,
                        "orderBy": sortCode,
                        "pageNum": page,
                        "pageSize": M.billIssue.pageSize,

                    },
                    dataType: 'json',
                    contentType: 'application/json',
                    success: function (res) {
                        var data = res.data;
                        if (res.data == null || res.success == false||data.length ==0) {
                            var noData = '<div class="noData"><img src="../../template/res/images/empty.png" alt=""><div class="col60 mar-top-10">暂无记录</div></div>';
                            M('.g-main-content').html(noData);
                            M('.pageTotal').html(res.total);
                            M('.pageCount').html(res.pageCount);
                            M.billIssue.getPage(res, page, M('#page'));
                        }else if(res.success && data.length!=0){
                            var str = '';
                            for (var i = 0; i < data.length; i++) {

                                var item = data[i];

                                var ddd = $.TimeDifference(M.timetrans(item.maturityDate), $.currentDate());
                                if (ddd.length && ddd.substring(1,ddd.length-1) <= 7 && ddd.substring(1,ddd.length-1) > 0) {
                                    var dateHtml = '<i class="iconfont mar-right-5 g-font14">&#xe614;</i><span class="Surplus">' + ddd + '</span>';
                                }else if (ddd.length == 3 && isNaN(parseInt(ddd.substring(1,ddd.length-1)))&& ddd.substring(1,ddd.length-1)>0) {
                                    var dateHtml = '<i class="iconfont mar-right-5 g-font14">&#xe614;</i><span class="Surplus">' + ddd + '</span>';
                                }else {
                                    var dateHtml = '';
                                }

                                if (item.status == '50' || item.status == '90' || item.status == '95' || item.status == '96' || item.status == '99' ) {
                                    dateHtml = '';
                                }
                                var checkHtml = "";
                                var statusOperator = "";
                                if (item.status == 10 ||item.status == '00') {
                                    checkHtml = '<a class="ui-button ui-btn-bt ui-btn-red" href="javascript:;" onclick=\'M.billIssue.check("' + item.id + '");\'>撤销</a>';
                                } else if (item.status == '0') {
                                    checkHtml = '<a class="ui-button ui-btn-bt ui-btn-red" href="javascript:;" onclick=\'M.billIssue.addItem("' + item.id + '");\'>新增</a>';
                                } else if( item.status == 95||item.status ==90){
                                    if(item.refuseReason!=null){
                                        statusOperator = '<i class="iconfont notice-icon">&#xe797;</i><div class="tips tips-icon"><span class="triangle"></span><span class="icon-span">'+item.refuseReason+'</span></div>';
                                    }
                                } else if(item.status=="96"){
                                    if(item.refuseAcceptReason != null){
                                        statusOperator = '<i class="iconfont notice-icon">&#xe797;</i><div class="tips tips-icon"><span class="triangle"></span><span class="icon-span">'+item.refuseAcceptReason+'</span></div>';
                                    }
                                }
                                 if(item.hashCode==null){
                                     item.hashCode = '生成中...';
                                 }
                                str += '<div class="g-tr-content">' +
                                    '<div class="g-top-content">' +
                                    '<div class="g-left col60 le">' +
                                    '<i class="iconfont g-font18 movIcon">&#xe658;</i>通宝编号：' +
                                    '<span class="col33">' + item.billNo + '</span>' +
                                    (item.status == '30' || item.status == '40' || item.status == '45' || item.status == '50' ? '<a href="JavaScript:;" data-id="'+ item.billNo +'" class="mar-left-5 js-view">流转履历</a>' : '') +
                                    '</div>' +
                                    '<div class="g-left col60 ce">' +
                                    '<i class="iconfont mar-right-5  movIcon">&#xe611;</i>' +
                                    '<span class="g-number-dropdown">区块链存证编号</span>' +
                                    '<div class="g-number-dropdown-content">' +
                                    '<span class="triangle"></span>' + item.hashCode + '</div>' +
                                    '</div>' +
                                    '<div class="g-left col60 mar-left-20">' +
                                    '<i class="iconfont mar-right-5 g-font14">&#xe614;</i>' +
                                    '开立日期：' +
                                    '<span class="col33">' + M.timetrans(item.releaseDate) + '</span>' +
                                    '</div>' +
                                    '</div>' +
                                    '<div class="g-bottom-content">' +
                                    '<div class="g-left box1 col33">' +
                                    '<div class="clearBoth">' +
                                    '<div class="g-left top-text">兑付日期</div>' +
                                    '<div class="g-left maincol remaining">' +
                                    dateHtml +
                                    '</div>' +
                                    '</div>' +
                                    '<div class="g-font18 mar2">' + M.timetrans(item.maturityDate) + '</div>' +
                                    '</div>' +
                                    '<div class="g-left box3">' +
                                    '<div class="top-text">开立金额(元)</div>' +
                                    '<div class="g-font18 maincol mar3">' + M.getFormatNumber(item.billAmount, 2, '.', ',') + '</div>' +
                                    '</div>' +
                                    '<div class="g-left box7 ui-line">' +
                                    '<div class="line-green"></div>' +
                                    '<div class="line-line"></div>' +
                                    '<div class="line-red"></div>' +
                                    '</div>' +
                                    '<div class="g-left box2">' +
                                    '<div class="col60 top-text">' +
                                    '<span class="g-left">接收方：</span>' +
                                    '<span class="col33 txt g-left" title="'+ item.receivingName +'">' + item.receivingName + '</span>' +
                                    '</div>' +
                                    '<div class="col60 mar1">' +
                                    '<span class="g-left">兑付方：</span>' +
                                    '<span class="col33 txt g-left" title="'+ item.payerName +'">' + item.payerName + '</span>' +
                                    '</div>' +
                                    '</div>' +
                                    '<div class="g-left box5">' +
                                    '<div class="col60 g-text-center top-text statusName">' + M.billIssue.statusFormat(item.status) + statusOperator+'</div>' +
                                    '<div class="none status">'+item.status+'</div>'+
                                    '<div class="g-text-center mar1">' +
                                    '<a target="_blank" href="billIssueDetail.html?id='+ item.billNo +'">查看详情</a>' +
                                    '</div>' +
                                    '</div>' +
                                    '<div class="g-left box6">' +
                                    '<div class="g-text-center">' +
                                    checkHtml +
                                    '</div>' +
                                    '<div class="g-text-center mar6">' +
                                    // '<a class="maincol upload" href="">上传凭证</a>' +
                                    '</div>' +
                                    '</div>' +
                                    '</div>' +
                                    '</div>';
                            }
                            M.billIssue.getPage(res, page, M('#page'));
                            M('.g-main-content').html(str);
                            M('.pageTotal').html(res.total);
                            M('.pageCount').html(res.pageCount);
                            M(".g-tr-content").each(function () {
                                M(this).find(".g-number-dropdown").hover(function () {
                                    M(this).siblings(".g-number-dropdown-content").show();
                                }, function () {
                                    M(this).siblings(".g-number-dropdown-content").hide();
                                });
                            });
                            $('.notice-icon').mouseover(function(){
                                $(this).siblings('div.tips').addClass('show');
                            }).mouseout(function(){
                                $(this).siblings('div.tips').removeClass('show');
                            });
                            $('.g-tr-content').each(function(){
                                var s = M(this).find('.status').text();
                                if(s == "95"){
                                    M(this).find('.statusName').removeClass('col60').addClass('maincol');
                                };
                            });
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
                    items: M.billIssue.pageSize,
                    number: M.billIssue.pageSize,
                    entries: 2,
                    isInput: true,
                    isText: false,
                    current: page - 1,
                    callback: function (that) {
                        M.billIssue.getTableData(this.ops.current + 1)
                    }
                });
            },
            //流转履历
            view:function(){
                var srcElement = this;
                M.ui.customDialog.init({
                    drag:false,
                    title:'履历详情',
                    width:1000,
                    height:520,
                    autoClose:false,
                    url:'../dialog/dialog-transferDetail.html',
                    callback:function(e){
                        M.ajaxFn({
                            url:  $.interfacePath.bill +'t/getTreeData',
                            type: 'post',
                            data: {
                                billNo: M(srcElement).attr('data-id'),
                            },
                            dataType: 'json',
                            success: function (res) {
                                 if (res.success){
                                     // console.log(res);
                                     var treeData=[],treeLink=[];
                                     var root = res.data;
                                     M.billIssue.traverseTree(root,treeData);
                                     treeLink=root.link;
                                     M.billIssue.treeLink(treeLink,root);
                                     M.billIssue.echart(root,treeData,treeLink);

                                     if(M.billIssue.count === 0){
                                         $('.ui-explain').show()
                                         setTimeout(function(){
                                             $('.ui-explain').hide()
                                         },3000)
                                     }else{
                                         $('.ui-explain').hide()
                                     }
                                     M.billIssue.count = 1;
                                 }else {
                                     return M.ui.waiting.creat({
                                                 status:false,
                                                 time:2000,
                                                 text:res.message,
                                                 hide:false
                                             });
                                 }
                            },
                            error: function (err) {
                                console.log('err+'+err)
                            }
                        });
                        M('.ui-dialog-close').click(function(){
                            e.remove();
                        })
                    }
                })
            },
            treeLink:function(treeLink,root){
                for(var i=0;i<treeLink.length;i++){
                    if(root.link[i].source==='开立方'){
                        treeLink[i].def='开立金额：'+root.link[i].money+'<br>开立日期：'+root.link[i].date
                    }else if(root.link[i].target=='受让方'){
                        treeLink[i].def='转让金额：'+root.link[i].money+'<br>转让日期：'+root.link[i].date
                    }else{
                        treeLink[i].def='融资金额：'+root.link[i].money+'<br>融资日期：'+root.link[i].date
                    }
                    treeLink[i].name='流转履历';
                    treeLink[i].label= {
                        normal: {
                            show: true,
                            formatter:function(params){
                                return params.data.name
                            }
                        }
                    }
                    treeLink[i].source=root.link[i].source+root.link[i].sourceId
                    treeLink[i].target=root.link[i].target+root.link[i].targetId
                }
            },
            traverseNode:function(node,o,treeData){
                o=node;
                var color;
                if(node.name==='开立方'){
                    color='#006699'
                }else if(node.name==='接收方'){
                    color='#4cabce'
                }else if(node.name==='受让方'){
                    color='#576874'
                }else{
                    color='#cc5b58'
                }
                o.itemStyle={
                    color:color
                }
                o.showName = node.name;
                o.name=node.name+node.nameId;
                o.l = (node.children&&node.children.length>0)?node.children.length : 0;
                o.rank = node.rank;
                var str=node.name;
                o.label={
                    normal: {
                        show: true,
                        formatter:function(params){
                            return params.data.showName //此处为label转换
                        }
                    }
                }
                treeData.push(o)
            },
            calPosition:function(treeData){
                var arrEnd=[],maxRank;
                var width=document.getElementById('main').offsetWidth,
                    height=document.getElementById('main').offsetHeight
                for(var i=0;i<treeData.length;i++){
                    if(treeData[i].l===0){
                        arrEnd.push(i);
                        maxRank=(maxRank>treeData[i].rank) ? maxRank : treeData[i].rank
                    }
                }
                var kx=width/maxRank,ky=height/arrEnd.length;
                for(var i=0;i<arrEnd.length;i++){
                    treeData[arrEnd[i]].x=treeData[arrEnd[i]].rank*kx;
                    treeData[arrEnd[i]].y=i*ky;
                }
                treeData.reverse();
                for(var i=0;i<treeData.length;i++){
                    if(!treeData[i].x){
                        var child=treeData[i].children;
                        treeData[i].x=treeData[i].rank*kx;
                        treeData[i].y=(child[child.length-1].y+child[0].y)/2
                    }
                }
            },
            traverseTree:function(node,treeData){
                var that = this;
                if (!node) {
                    return;
                }

                var stack = [];
                stack.push(node);
                var tmpNode;
                while (stack.length > 0) {
                    var o={};
                    tmpNode = stack.pop();
                    that.traverseNode(tmpNode,o,treeData);
                    if (tmpNode.children && tmpNode.children.length > 0) {
                        var i = tmpNode.children.length - 1;
                        for (i = tmpNode.children.length - 1; i >= 0; i--) {
                            stack.push(tmpNode.children[i]);
                        }
                    }
                }
                that.calPosition(treeData);
            },
            echart:function(root,treeData,treeLink){
                var myChart = echarts.init(document.getElementById('main'));
                option = {
                    tooltip: {
                        formatter: function (x) {
                            return x.data.def;
                        }
                    },
                    series: [
                        {
                            type: 'graph',
                            symbolSize: 40,
                            roam: true,
                            edgeSymbol: ['circle', 'arrow'],
                            edgeSymbolSize: [4, 10],
                            edgeLabel: {
                                normal: {
                                    textStyle: {
                                        fontSize: 20
                                    }
                                }
                            },
                            draggable: true,
                            itemStyle: {
                                normal: {
                                    color: '#4b565b'
                                }
                            },
                            lineStyle: {
                                normal: {
                                    width: 2,
                                    color: '#4b565b'

                                }
                            },
                            edgeLabel: {
                                normal: {
                                    show: true,
                                    formatter: function (x) {
                                        return x.data.def;
                                    }
                                }
                            },
                            label: {
                                normal: {
                                    show: true,
                                    textStyle: {
                                    }
                                }
                            },
                            data: treeData,
                            links: treeLink
                        }
                    ]
                };
                myChart.setOption(option);
                var center=''
                $('canvas').unbind('mousedown').bind('mousedown',function(e){
                    e.preventDefault();
                    $('canvas').unbind('mousemove').bind('mousemove',function(ev){
                        center=myChart.getOption().series[0].center;
                    })
                    $('canvas').unbind('mouseup').bind('mouseup',function(ev){
                        $('canvas').unbind('mousemove')

                    })
                });
                $('.js-enlarge').unbind('click').bind('click',function(){
                    var zoom=myChart.getOption().series[0].zoom;
                    zoom+=0.6;
                    option.series[0].zoom=zoom;
                    option.series[0].center=center;
                    myChart.hideLoading()
                    myChart.setOption(option);
                })
                $('.js-reduce').unbind('click').bind('click',function(){
                    var zoom=myChart.getOption().series[0].zoom;
                    zoom-=0.6;
                    option.series[0].zoom=zoom;
                    option.series[0].center=center;
                    myChart.hideLoading()
                    myChart.setOption(option);
                })
                $('.js-restore').unbind('click').bind('click',function(){
                    option.series[0].zoom=1;
                    option.series[0].center=null;
                    myChart.hideLoading()
                    myChart.setOption(option);
                    center='';
                })
            },
        })(function () {
            M.billIssue.init();
        });
    }
)
