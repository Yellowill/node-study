/*
 * start: 2019-02-18 15:24
 * end: 2019-02-18 19:30
 * info: 消息接收页面js
 */
require(['head', 'menu', 'base', 'tab', 'page', 'calendar', 'confirm', 'customDialog', 'status'],
	function(){ 
		M.define('subscibe',{
            head: M.ui.head.init(),
			init:function(){
                M.ui.menu.init({
                    index: [0, 0],
                    //      url: M.getNormalPath('getMenu.json', 4),
                    callback: function () {
                    }
                })

                this.getTableData();
			},


            getTableData: function (page) {
                var that = this;

                M.ajaxFn({
                    url:$.interfacePath.basic+'t/findMessageTemplate/list',
                    type: 'post',
                    data: {},
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

                                var status = item.status == '1' ? ' activated' : ""

                                str += '<tr>' +
                                    '<td class="ui-rcv-tl"><span>' + item.templateName + '</span></td>\n' +
                                    '<td class="ui-rcv-table-icon' + status + '"><span class="ui-rcv-table-icon-wrap"><span class="icon-border attention" detail-code="' + item.templateCode + '" detail-status="' + item.status + '"><i class="iconfont">&#xe74c;</i></span></span></td>' +
                                    '<td class="ui-rcv-edit"><a href="javascript:void(0)" class="js-view" detail-code="' + item.templateCode + '" detail-status="' + item.status + '">编辑</a></td>' +
                                    '</tr>'
                            }
                            M('.g-main-content').html(str);
                            $('.js-view').unbind('click').bind('click', function (e) {
                                var code=$(this).attr('detail-code');
                                // var status = $(this).attr('detail-status');
                                var statusNode = M(this).parent().prev().children();
                                statusNode = M(statusNode).children('.attention');
                                var status = M(statusNode).attr('detail-status');

                                if (status != '1') {
                                    M.ui.waiting.creat({
                                        status:false,
                                        time:1000,
                                        text:'请先订阅哦！',
                                        hide:false,
                                    });
                                    return;
                                }

                                that.view(code);
                            });

                            $('.attention').unbind('click').bind('click', function (e) {

                                var code=$(this).attr('detail-code');
                                var status = $(this).attr('detail-status');

                                M.ajaxFn({
                                    url:$.interfacePath.basic+'t/subscribe/update',
                                    type: 'post',
                                    data:{
                                        templateCode: code,
                                        status: status
                                    },
                                    dataType: 'json',
                                    contentType: 'application/json',
                                    success: function (res) {

                                        // var text = status == '1' ? '取消订阅成功' : '订阅成功';

                                        if(res.success){
                                            M.ui.waiting.creat({
                                                status:true,
                                                time:1000,
                                                text: res.message,
                                                hide:false,
                                            });
                                            var parent = M(e.currentTarget).parent().parent();

                                            if (status == '1') {
                                                M(parent).removeClass('activated');
                                                $(e.currentTarget).attr('detail-status', '0');
                                            } else  {
                                                M(parent).addClass('activated');
                                                $(e.currentTarget).attr('detail-status', '1');
                                            }
                                            // parent.remove();
                                        } else {
                                            M.ui.waiting.creat({
                                                status:false,
                                                time:1000,
                                                text: res.message,
                                                hide:false,
                                            });
                                        }
                                    },
                                    error: function (res) {
                                        console.log(res);
                                    }
                                });

                            });
                        }

                    },
                    error: function (res) {
                        console.log(res);
                    }
                });
            },

			view:function(code){
				M.ui.customDialog.init({
					drag:false,
		            title:'编辑接收人',
		            width:1000,
		            height:520,
		            autoClose:false,
					url:'../dialog/dialog-subscribe.html',
					callback:function(e){

                        M.ajaxFn({
                            url:$.interfacePath.basic+'t/queryMobile/list',
                            type: 'post',
                            data: {
                                templateCode: code
                            },
                            dataType: 'json',
                            contentType: 'application/json',
                            success: function (res) {
                                var data = res.data;
                                // if (res.data == null || res.success == false||data.length ==0) {
                                //     var noData = '<div class="noData"><img src="../../template/res/images/empty.png" alt=""><div class="col60 mar-top-10">暂无记录</div></div>';
                                //     M('.g-main-content').html(noData);
                                // }else
                                if(res.success && data.length!=0){
                                    var str = '';
                                    for (var i = 0; i < data.length; i++) {

                                        var item = data[i];

                                        var status = item.status == '1' ? ' activated' : "";
                                        var createUserName = item.createUserName || '';

                                        str += '<tr>' +
                                            // '\t                    \t<td style="width:8%;" class="ui-rcv-table-icon activated"><span class="ui-rcv-table-icon-wrap"><span class="icon-border"><i class="iconfont">&#xe74c;</i></span></span></td>\n' +
                                            '<td class=""><span class="mobile">' + item.mobile + '</span></td>' +
                                            '<td class="">' + createUserName + '</td>' +
                                            '<td class="">'+ M.timetrans(item.createDate) +'</td>' +
                                            '<td class="ui-rcv-edit"><a href="javascript:void(0)" class="contact-delete" detail-code="' + item.mobile + '">删除</a></td>' +
                                            '</tr>';
                                    }
                                    M('.dialog-content').html(str);
                                    $('.contact-delete').unbind('click').bind('click', function (e) {
                                        var id=$(this).attr('detail-code');

                                        M.ui.confirm.init({
                                            html:'确认删除吗？',
                                            button:[
                                                {
                                                    href:null,
                                                    html:'确认',
                                                    callback:function(){
                                                        M.ajaxFn({
                                                            url:$.interfacePath.basic+'t/deleteMobile/delete',
                                                            type: 'post',
                                                            data:{
                                                                listMessages:[{templateCode: code, mobile: id}]
                                                            },
                                                            dataType: 'json',
                                                            contentType: 'application/json',
                                                            success: function (res) {
                                                                if(res.success){
                                                                    M.ui.waiting.creat({
                                                                        status:true,
                                                                        time:1000,
                                                                        text:'删除成功！',
                                                                        hide:false,
                                                                    });
                                                                    var parent = M(e.currentTarget).parent().parent();
                                                                    parent.remove();
                                                                } else {
                                                                    M.ui.waiting.creat({
                                                                        status:false,
                                                                        time:1000,
                                                                        text: res.message,
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
                                            ]
                                        });
                                    });
                                }

                            },
                            error: function (res) {
                                console.log(res);
                            }
                        });

						M('.ui-dialog-close').click(function(){
				    		e.remove();
				    	});

                        M('#dialog-close').click(function(){
                            e.remove();
                        });

                        M('#addContact').click(function () {
                            var html = '<tr>' +
                                '<td class="ui-rcv-table-input"><input class="mobile-input" type="text" placeholder="手机号"></td>' +
                                '<td class="">&nbsp;</td>' +
                                '<td class="">&nbsp;</td>' +
                                '<td class="ui-rcv-edit"><a href="javascript:void(0)" class="contact-cancle">取消</a></td>' +
                                '</tr>'
                            M('.dialog-content').append(html);

                            M('.contact-cancle').click(function (e) {
                                var parent = M(e.currentTarget).parent().parent();
                                parent.remove();
                            });
                        });

                        M('#dialog-confirm').click(function(){
                            var phoneArr = [];
                            var isPhoneRight = true;

                            $(".mobile-input").each(function(index, e){
                                var phone =  M(e).val();
                                if ( phone && phone.length > 0) {
                                    if (!M.checkPhone(phone)) {
                                        isPhoneRight = false;
                                        return;
                                    }
                                    phoneArr.push(phone);
                                }
                            });

                            if (!isPhoneRight) {
                                M.ui.waiting.creat({
                                    status:false,
                                    time:1000,
                                    text:'请输入正确的手机号！',
                                    hide:false,
                                });
                                return;
                            }

                            if (phoneArr.length == 0) {
                                M.ui.waiting.creat({
                                    status:false,
                                    time:1000,
                                    text:'暂无保存数据！',
                                    hide:false,
                                });
                                return;
                            }

                            var listMessage = [];
                            for (var i = 0; i < phoneArr.length; i++) {
                                listMessage.push({
                                    mobile: phoneArr[i],
                                    templateCode: code
                                })
                            }


                            M.ajaxFn({
                                url:$.interfacePath.basic+'t/addSubscriptionMessage/insert',
                                type: 'post',
                                data:
                                    {listMessages: listMessage}
                                ,
                                dataType: 'json',
                                contentType: 'application/json',
                                success: function (res) {
                                    if(res.success){
                                        M.ui.waiting.creat({
                                            status:true,
                                            time:1000,
                                            text:'操作成功！',
                                            hide:false,
                                        });

                                        e.remove();
                                    } else {
                                        M.ui.waiting.creat({
                                            status:false,
                                            time:1000,
                                            text: res.message,
                                            hide:false,
                                        });
                                    }
                                },
                                error: function (res) {
                                    console.log(res);
                                }
                            });
                        });

					}
				})
			}
		})(function(){
			M.subscibe.init();
		});
	}
)