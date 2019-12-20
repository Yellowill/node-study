require(['base','menu', 'waiting', 'customDialog'],
	function(){ 
		M.define('transferContract',{
			init:function(){
                this.requestId = M.getUrlParam('requestId');
                this.transferApplyId = M.getUrlParam('transferApplyId');
                // this.requestId = "375260e40ff74095abe86c8e1ea8a680"
                // this.transferApplyId = "42eb69515dd4409f8d49d1a0c249a1b9"
				M('.ui-btn-next').unbind('click').bind('click',this.next);
                M('.agreement').unbind('click').bind('click',this.agreement);
                this.getDate();
			},
            getDate: function(){
				var that = this;
                this.payment = {};
                this.submit = {};
                //pdf Print
                M.ajaxFn({
                    url:  $.interfacePath.bill +'t/transferDownLoad/pdfPrint',
                    type: 'get',
                    data: {
                        id: this.transferApplyId
                    },
                    noLogin: true,
                    dataType: 'json',
                    success: function (res) {
                        if ( res.success ) {
                            that.ptfurl = res.data;
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
                M('#pdfPrint').click(function () {
                    M.downloadFileXhr(that.ptfurl, '')
                });

                M.ajaxFn({
                    url: $.interfacePath.bill + 't/findDebts/list',
                    type: 'post',
                    data: {
                        transferApplyId: this.transferApplyId
                    },
                    noLogin: true,
                    dataType: 'json',
                    success: function (res) {
                        that.info = res.data;
						if(res.success) {
							var bill = res.data;
							$('#batchNo').html(bill.financeTransferApply.batchNo)
                            $('.contractNumber').html(bill.financeTransferApply.contractNumber)
							$('#transferSide').html(bill.financeTransferApply.transferorLegalName)
                            $('.company-name').html(bill.financeTransferApply.transferorLegalName)
							$('#transferCode').html(bill.transferorBusinessCreditNo || '')
							$('#transTaxNum').html(bill.transferotTaxNum || '')
							$('#receiveSide').html(bill.financeTransferApply.transfereeLegalName)
							$('#receiveCode').html(bill.transfereeBusinessCreditNo|| '')
							$('#receiveTaxNum').html(bill.transfereeTaxNum || '')
							$('#transferNum').html(M.getFormatNumber(bill.sumAccpetAmount, 2))
							$('#cn_transferNum').html(M.getChineseNumber(bill.sumAccpetAmount))
							$('#paySign').html(bill.transferorSgin)
							$('#receiveSign').html(bill.transfereeSgin)

							if (bill.debtsBillDTOList && bill.debtsBillDTOList.length !== 0) {
								var str = '';
								for (var i=0; i<bill.debtsBillDTOList.length; i++ ) {
									var item = bill.debtsBillDTOList[i];
									var index = i+1;
									str += '<tr>'+

										'<td align="center">'+ index +'</td>'+
										'<td align="center">'+ item.billNo +'</td>'+
										'<td align="center">'+ item.payerLegalName+'</td>'+
										'<td align="center">'+ M.getFormatNumber(item.holdAmount) +'</td>'+
										'<td align="center">'+ $.getFormatNumber(item.accpetAmount, 2) +'</td>'+
										'<td align="center">'+ $.timetrans(item.maturityDate) +'</td>'+
										'</tr>'
								}
								M('#list-content').append(str);
							}


						}

                    },
                    error: function (err) {
                        console.log(err)
                    }
                });
                //提交
                that.isClick = false;
            },
            ajaxSubmit: function(that, filePath, userId, signNo) {
                M.ajaxFn({
                    url:  $.interfacePath.basic +'nologin/uploadPdf/dfft',
                    type: 'post',
                    data: {
                        requestId: M.transferContract.requestId,
                        pdfFilePath: filePath,
                        userId: userId,
                        bizType: '20',
                        signNo: signNo,
                        bizId: signNo
                    },
                    noLogin: true,
                    dataType: 'json',
                    success: function (res) {
//                        console.log(res)
                        if ( res.success ) {
                            that.viewSign(that, res.data, userId);
                        }else {
                            return M.ui.waiting.creat({
                                status:false,
                                time:1000,
                                text:res.message,
                                hide:false,
                                callback: function () {
                                    that.isClick = false;
                                }
                            });
                        }
                    },
                    error: function (err) {
                        console.log('err+'+err)
                    }
                })
            },
            viewSign: function (that, signNo, userId) {
                M.ajaxFn({
                    url:  $.interfacePath.basic +'nologin/viewSignDfft',
                    type: 'post',
                    data: {
                        signNo: signNo,
                        requestId: M.transferContract.requestId,
                        name: userId,
                        returnUrl: 'pay/payResult.html?id='+that.submit.id,
                        notifyUrl: 'bill/nologin/apply/check/asynchCallback'
                    },
                    noLogin: true,
                    dataType: 'json',
                    success: function (res) {
//                        console.log(res)
                        if ( res.success ) {
                            var formStr = res.data;
                            $('body').append(formStr);
                        }else {
                            return M.ui.waiting.creat({
                                status:false,
                                time:1000,
                                text:res.message,
                                hide:false,
                                callback: function () {
                                    that.isClick = false;
                                }
                            });
                        }
                    },
                    error: function (err) {
                        console.log('err+'+err)
                    }
                })
            },

            //阅读协议
            agreement: function() {
                var isCheck = M(this).hasClass('checked');
                if (isCheck) {
                    M(this).removeClass('checked');
                }
                else {
                    M(this).addClass('checked');
                }
            },

			next:function(){
                var isCheck = M('.agreement').hasClass('checked');
                if (!isCheck) {
                    M.ui.waiting.creat({
                        status:false,
                        time:1000,
                        text: '请确认勾选我已阅读',
                        hide:false,
                        callback: function () {

                        }
                    });
                    return;
                }
				M.ui.customDialog.init({
					drag:false,
		            title:'选择签署操作员',
		            width:1000,
		            height:200,
		            autoClose:false,
					url:'../dialog/dialog-payOperaters.html',
//					position:'fixed',
					callback:function(e){

                        var requestId = M.transferContract.requestId;
                        var transferApplyId = M.transferContract.transferApplyId;

                        M.ajaxFn({
                            url: M.interfacePath.bill + 'nologin/transferSign/userList',
                            type: 'post',
                            data: {
                                "requestId": requestId,
                                "transferApplyId": transferApplyId
                            },
                            noLogin: true,
                            dataType: 'json',
                            contentType: 'application/json',
                            success: function (data) {
                                var success = data.success;
                                if (success) {
									var userList = data.data.userList;
									var str = '';
									for (var i = 0; i < userList.length; i++) {
										var item = userList[i];
										var checked = i == 0 ? "checked":"";
										str += '<li>\n' +
                                            '<label class="radio-box "> \n' +
                                            '<span class="check ' + checked + '">\n' +
                                            '<input type="checkbox" class="ace" checked="checked">\n' +
                                            '</span>\n' +
                                            '<span class="mar-left-5">\n' +
                                            '<em class="user-id">' + item.userId + '</em><em class="mar-left-20">' + item.userName + '</em><em class="mar-left-20">'+ item.phone + '</em>\n' +
                                            '</span>\n' +
                                            '</label>\n' +
                                            '</li>'
									}

									M('.user-list').html(str);

                                    M('.user-list').on('click', 'li', function (ev) {

                                        var isCheck = M(this).find('.check').hasClass('checked');
                                        if (!isCheck) {

                                        	M('.user-list li').each(function (e) {
                                                M(this).find('.check').removeClass('checked');
                                            })

                                            M(this).find('.check').addClass('checked');
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


                        M('.dialog-confirm').unbind('click').bind('click', function (e) {
                        	var userId = '';
                            M('.user-list li').each(function (e) {
                                if (M(this).find('.check').hasClass('checked')) {
                                	userId = M(this).find('.user-id').html();
								};
                            })

							if (userId.length == 0) {
                                M.ui.waiting.creat({
                                    status:false,
                                    time:1000,
                                    text:'请选择操作员',
                                    hide:false,
                                    callback: function () {
                                    }
                                });
                            	return;
							}


                            if (!M.transferContract.isClick) {
                                M.transferContract.submit.id = M.transferContract.info.financeTransferApply.id;
                                var batchNo = M.transferContract.info.financeTransferApply.batchNo;
                                var ptfurl = M.transferContract.ptfurl;
                                M.transferContract.ajaxSubmit(M.transferContract, ptfurl, userId, batchNo);
                                M.ui.waiting.creat({
                                    position:'fixed',
                                    status:'loading',
                                    time:10000,
                                    callback:function(){

                                    }
                                });

                            }
                        })

						M('.ui-dialog-close').click(function(){
				    		e.remove();
				    	})
                        M('.dialog-cancle').click(function(){
                            e.remove();
                        })
					}
				})
			}
		})(function(){
			M.transferContract.init();
		});
	}
)
