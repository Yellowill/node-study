require(['menu', 'base', 'calculator','waiting'],
	function(){ 
		M.define('tbSelect',{
			init:function(){
                this.getTableData();
			},

            getTableData: function () {
                var that = this;
                var id = M.getUrlParam('id');

                M.ajaxFn({
                    url:  $.interfacePath.bill +'nologin/sginfo/originalData',
                    type: 'post',
                    data: {
                        status: '00',
                        id: id
                    },
                    noLogin: true,
                    dataType: 'json',
                    async: false,
                    success: function (res) {
                        if ( res.success ) {
                            M.ui.waiting.creat({
                                status:true,
                                time:1000,
                                text:res.message,
                                hide:false,
                                callback: function () {

                                }
                            });

                            that.getListData();

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
            },

            getListData: function () {
			    var that = this;

                var id = M.getUrlParam('id');
                M.ajaxFn({
                    url: M.interfacePath.bill + 't/findTransferOutDetails/list',
                    type: 'post',
                    data: {
                        "id": id
                    },
                    noLogin: true,
                    dataType: 'json',
                    contentType: 'application/json',
                    success: function (data) {
                        var resData = data.data;
                        if (data.success) {
                            M('.otherBizNum').html(resData.otherBizNum);
                            M('.transferAmount').html( M.getFormatNumber(resData.transferAmount)+'元');
                            M('.transferorName').html(resData.transferorName);
                            M('.company-name').html(resData.transferorName);
                            M('.transfereeName').html(resData.transfereeName);
                            M('.close').unbind('click').bind('click', function () {
                                window.close();
                            });

                            if (resData.status == "10" || resData.status == "20" || resData.status == "30") {
                                M('.success').show();
                                M('.fail').hide();
                            } else {
                                M.ui.waiting.creat({
                                    status:false,
                                    time:1000,
                                    text: '支付失败',
                                    hide:false
                                });
                                M('.success').hide();
                                M('.fail').show();
                            }

                            // if (!resData.returnUrl || resData.returnUrl.length == 0) {
                            //     M('.backToMall').hide();
                            // } else {
                            //     M('.backToMall').attr('href', resData.returnUrl);
                            // }
                        }

                    },
                    error: function (res) {
                        console.log(res);
                    }
                });
            }


		})(function(){
			M.tbSelect.init();
		});
	}
)
