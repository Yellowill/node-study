require(['menu', 'base', 'calculator', 'waiting'],
	function(){ 
		M.define('tbSelect',{
			init:function(){

                this.requestId = M.getUrlParam('requestId');
				// this.requestId = "a1e6b8f097cb47cdbb4325e29170d371";

				$('.ui-order-details-operate').unbind('click').bind('click',this.operate);
				M('.check-all').bind('click', function () {
                    var isCheck = M(this).find('.check').hasClass('checked');
                    if (isCheck) {
                        M(this).find('.check').removeClass('checked');
                    }
                    else {
                        M(this).find('.check').addClass('checked');
                    }
                    M.tbSelect.selectAll(!isCheck);
                });
				M('.ui-btn-next').unbind('click').bind('click',this.submit);
                this.getTableData();
			},
			edit:function(e){
				$(this).parent().addClass('operating');
				var value=$(this).prev().text();
				$(this).hide().prev().hide();
				$(this).parent().append('<input class="ui-table-input" value="'+value+'"><a href="javascript:;" class="ui-table-comfirm">确定</a>');
				$('.ui-table-comfirm').unbind('click').bind('click',M.tbSelect.confirm);
				e.preventDefault();
			},
			confirm:function(e){
				var v=$(this).siblings('input').val();
				$(this).parent().removeClass('operating');
				$(this).siblings('span').text(M.getFormatNumber(v)).show();
				$(this).siblings('.ui-table-edit').show();
				$(this).siblings('input').remove();
				$(this).remove();
                e.preventDefault();
                M.tbSelect.getSelectAmount();
			},
			operate:function(){
				if($('.ui-order-details-more').is(':hidden')){
					$('.ui-order-details-more').slideDown()
					$(this).find('i').html('&#xe637;')
				}else{
					$('.ui-order-details-more').slideUp()
					$(this).find('i').html('&#xe636;')
				}
			},
            //撤销
            revoke: function(transferApplyId,requestId) {
                M.ajaxFn({
                    url: M.interfacePath.bill + 'nologin/revokeTransferApply/update',
                    type: 'post',
                    data: {
                        "transferApplyId": transferApplyId,
                        "requestId": requestId
                    },
                    noLogin: true,
                    dataType: 'json',
                    contentType: 'application/json',
                    success: function (data) {
                        debugger;
                        var success = data.success;
                        if (success) {
                            M.ui.waiting.creat({
                                status:true,
                                time:1000,
                                text:data.message,
                                hide:false,
                                callback: function () {
                                    // if (opener) {
                                    //     opener.location.reload();
                                    // }
                                    // window.close();
                                    // window.reload();
                                    M.tbSelect.requestId = data.data.requestId;
                                    M.tbSelect.getTableData();
                                }
                            });
                        } else {
                            M.ui.waiting.creat({
                                status:false,
                                time:1000,
                                text: data.message,
                                hide:false,
                            });
                        }

                    },
                    error: function (res) {
                        console.log(res);
                    }
                });
            },
			//点击事件
			tableClick: function() {
                M('.table').on('click', '.table-row', function (ev) {
                    var ev = ev || window.event;
                    var target = ev.target || ev.srcElement;

                    if($(target).hasClass('iconfont') || $(target).hasClass('ui-table-input')) {
						return;
                    }

                    var isCheck = M(this).find('.check').hasClass('checked');
                    if (isCheck) {
                        M(this).find('.check').removeClass('checked');
					}
                    else {
                        M(this).find('.check').addClass('checked');
					}

					M.tbSelect.getSelectAmount();
                });
			},
			//输入时候过虑
			filterInput: function() {
                M(document).on('keyup', '.ui-table-input', function () {
                    $(this).val($(this).val().replace(/[^\d.]/g,''));
                    this.value = this.value.replace(/\.{2,}/g,"."); //只保留第一个. 清除多余的
                    this.value= this.value.replace(/\.\d{2,}$/,this.value.substr(this.value.indexOf('.'),3));
                    var value = $(this).val();
                    var array = value.split(".");
                    if((array.length >1 && array[1].length > 2) || array.length >2){
                        value = array[0] + "." +array[1].substr(0,2);
                        $(this).val(value);
                    }

                    var s = parseFloat(M(this).parent().parent().siblings('.hold-amount').text().replace(/,/g, ''));
                    var num_ipt = parseFloat(value);
                    if(num_ipt > s){
                        $(this).val(s);
                    }
                });
			},

            //设置选中全部
            selectAll: function(flag) {
                M('.table-row').each(function (e) {
                    if (flag) {
                        M(this).find('.check').addClass('checked');
                    } else {
                        M(this).find('.check').removeClass('checked');
					}
                })
				M.tbSelect.getSelectAmount();
            },

			//获取选中的金额
			getSelectAmount: function() {
				var totalAmount = 0;
				var total = 0;
				var billArray = [];
				M('.table-row').each(function (e) {
					if (M(this).find('.check').hasClass('checked')) {
                        var amount = $(this).find('.ui-trans-input').text();
                        totalAmount = M.arithmeticAdd(totalAmount, parseFloat(amount.replace(/,/g, '')));
                        total++;
                        var id = $(this).attr('data-id');
                        billArray.push({'id': id, "amount": amount.replace(/,/g, '')});
					}
                })
                M('.already-check').html(total);
				M('.total-amount').html(M.getFormatNumber(totalAmount));
				return billArray;
			},

			statusFormat: function(stauts) {
				//状态 00:待提交 10:待平台审核  20:待签收 30:已签收  40:平台驳回 45:下家驳回   99:终止'
				var name = '';
				switch (stauts) {
                    case "00":
                    	name = "待提交";
                    	break;
                    case "10":
                        name = "待平台审核";
                        break;
                    case "20":
                        name = "待签收";
                        break;
                    case "30":
                        name = "已签收";
                        break;
                    case "40":
                        name = "平台驳回";
                        break;
                    case "45":
                        name = "下家驳回";
                        break;
                    case "99":
                        name = "终止";
                        break;
				}
				return name;
			},

            getTableData: function () {
                var that = this;

                M.ajaxFn({
                    url: M.interfacePath.bill + 'nologin/toBillPayPage',
                    type: 'post',
                    data: {
                        "requestId": M.tbSelect.requestId
                    },
                    noLogin: true,
                    dataType: 'json',
                    contentType: 'application/json',
                    success: function (data) {
                        var resData = data.data;
                        if (data.success) {
                            var applyExistsFlag = resData.applyExistsFlag;

                            if (applyExistsFlag == "1") {
                                M(".content1").hide();
                                M(".content2").show();

                                var status = resData.applyInfo.status;
                                if (status == "00") {
                                    M(".re-submit").addClass('btn-02');
                                    M(".revoke").addClass('btn-01');
                                    M(".re-submit").removeClass('btn-022');
                                    M(".revoke").removeClass('btn-011');
                                    M(".re-submit").unbind('click').bind('click', function () {
                                        var requestId = data.data.requestId;
                                        var transferApplyId = data.data.applyInfo.id;
                                        var url = 'transferContract.html?requestId=' + requestId + '&transferApplyId=' + transferApplyId;
                                        window.location = url;
                                    });

                                    $('.revoke').unbind('click').bind('click', function () {
                                        var requestId = data.data.requestId;
                                        var transferApplyId = data.data.applyInfo.id;
                                        M.tbSelect.revoke(transferApplyId, requestId);
                                    });
                                } else {
                                    M(".re-submit").addClass('btn-022');
                                    M(".revoke").addClass('btn-011');
                                    M(".re-submit").removeClass('btn-02');
                                    M(".revoke").removeClass('btn-01');
                                    M(".re-submit").unbind('click');
                                    $('.revoke').unbind('click');
                                }

                                var applyInfo = resData.applyInfo;
                                M('.businessNum').html(applyInfo.businessNum);
                                M('.billAmount').html(M.getFormatNumber(applyInfo.transferAmount));
                                M('.batchNo').html(applyInfo.batchNo);
                                M('.transferAmount').html(M.getFormatNumber(applyInfo.transferAmount));
                                M('.createDate').html(M.timetrans(applyInfo.createDate));
                                M('.transferorName').html(applyInfo.transferorName);
                                M('.transfereeName').html(applyInfo.transfereeName);
                                M('.status').html(M.tbSelect.statusFormat(applyInfo.status));
                            } else {
                                M(".content1").show();
                                M(".content2").hide();
                                var result = data.data.billList;
                                var transferNum = parseFloat(resData.transferAmount);
                                var str = "";
                                for (var i = 0; i < result.length; i++) {
                                    var item = result[i];
                                    var ddd = M.timetrans(item.maturityDate);
                                    if ( transferNum > item.amount ) {
                                        transferNum = M.arithmeticSub(transferNum, item.amount);
                                        str += '<tr class="table-row" data-id="'+ item.id +'"><td>' +
                                            '<label class="check-box "> \n' +
                                            '<span class="check checked">\n' +
                                            '<input type="checkbox" class="ace">\n' +
                                            '</span>\n' +
                                            '</label>\n' +
                                            '</td>\n' +
                                            '<td>'+item.billHoldNo+'</td>\n' +
                                            '<td>'+item.payerName+'</td>\n' +
                                            '<td>\n' +
                                            '<div class="ui-table-operate">\n' +
                                            '<span class="ui-trans-input">'+M.getFormatNumber(item.amount)+'</span>\n' +
                                            '<a href="JavaScript:;" class="ui-table-edit"><i class="iconfont">&#xe6be;</i></a>\n' +
                                            '</div>\n' +
                                            '</td>\n' +
                                            '<td>'+ ddd + '</td>\n' +
                                            '<td class="red hold-amount">'+M.getFormatNumber(item.amount)+'</td></tr>';
                                    } else if ( transferNum > 0 && transferNum !== 0 ) {
                                        str += '<tr class="table-row" data-id="'+ item.id +'"><td>' +
                                            '<label class="check-box "> \n' +
                                            '<span class="check checked">\n' +
                                            '<input type="checkbox" class="ace">\n' +
                                            '</span>\n' +
                                            '</label>\n' +
                                            '</td>\n' +
                                            '<td>'+item.billHoldNo+'</td>\n' +
                                            '<td>'+item.payerName+'</td>\n' +
                                            '<td>\n' +
                                            '<div class="ui-table-operate">\n' +
                                            '<span class="ui-trans-input">'+M.getFormatNumber(transferNum)+'</span>\n' +
                                            '<a href="JavaScript:;" class="ui-table-edit"><i class="iconfont">&#xe6be;</i></a>\n' +
                                            '</div>\n' +
                                            '</td>\n' +
                                            '<td>'+ ddd + '</td>\n' +
                                            '<td class="red hold-amount">'+M.getFormatNumber(item.amount)+'</td></tr>';
                                        transferNum = 0;
                                    } else {
                                        str += '<tr class="table-row" data-id="'+ item.id +'"><td>' +
                                            '<label class="check-box "> \n' +
                                            '<span class="check">\n' +
                                            '<input type="checkbox" class="ace">\n' +
                                            '</span>\n' +
                                            '</label>\n' +
                                            '</td>\n' +
                                            '<td>'+item.billHoldNo+'</td>\n' +
                                            '<td>'+item.payerName+'</td>\n' +
                                            '<td>\n' +
                                            '<div class="ui-table-operate">\n' +
                                            '<span class="ui-trans-input">'+M.getFormatNumber(item.amount)+'</span>\n' +
                                            '<a href="JavaScript:;" class="ui-table-edit"><i class="iconfont">&#xe6be;</i></a>\n' +
                                            '</div>\n' +
                                            '</td>\n' +
                                            '<td>'+ ddd + '</td>\n' +
                                            '<td class="red hold-amount">'+M.getFormatNumber(item.amount)+'</td></tr>';
                                    }
                                }
                                M('.table-body').html(str);
                                M('.ui-table-edit').unbind('click').bind('click',that.edit);
                                M('.ui-order-details-amount').html(M.getFormatNumber(resData.transferAmount));
                                M('.otherBizNum').html(resData.otherBizNum);
                                M('.transfereeName').html(resData.transfereeName);
                                M('.transferorName').html(resData.transferorName);

                                // var returnUrl = resData.returnUrl;
                                // own.save('payReturnUrl', returnUrl);

                                that.filterInput();
                                that.tableClick();
                                M.tbSelect.getSelectAmount();
                            }
                            M('.company-name').html(resData.transferorName);
                        } else {
                            M.ui.waiting.creat({
                                status:false,
                                time:1000,
                                text: data.message,
                                hide:false,
                            });
                        }

                    },
                    error: function (res) {
                        console.log(res);
                    }
                });
            },

			//提交
            submit: function () {
				var billList = M.tbSelect.getSelectAmount();
				var total = parseFloat(M('.ui-order-details-amount').html().replace(/,/g, ''));
				var selectTotal = parseFloat(M('.total-amount').html().replace(/,/g, ''));
				if (total != selectTotal) {
                    M.ui.waiting.creat({
                        status:false,
                        time:1000,
                        text:'所选金额必须等于订单金额',
                        hide:false,
                    });
                    return;
				}

                M.ajaxFn({
                    url: M.interfacePath.bill + 'nologin/transferApply/submit',
                    type: 'post',
                    data: {
                        "requestId": M.tbSelect.requestId,
						"billList": billList
                    },
                    noLogin: true,
                    dataType: 'json',
                    contentType: 'application/json',
                    success: function (data) {
						debugger;
                        var success = data.success;
                        if (success) {
                        	var requestId = data.data.requestId;
                            var transferApplyId = data.data.transferApplyId;
                            var url = 'transferContract.html?requestId=' + requestId + '&transferApplyId=' + transferApplyId;
							window.location = url;
						} else {
                            M.ui.waiting.creat({
                                status:false,
                                time:1000,
                                text: data.message,
                                hide:false,
                            });
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
