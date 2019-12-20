require(['base','head','menu','calendarTwo','status'],
	function(){ 
		M.define('workbenchSupplier',{
            head: M.ui.head.init(),
			init:function(){
				this.checkLi();
				M.ui.menu.init({
					index:[],
					url:M.getNormalPath('getMenu.json',4),
					callback:function(){}
				})
				this.getData();
				this.calendar();
			},
			getData: function() {
                var that = this;
                M('#view-btn').click(function () {
                   var userInfo = own.fetch('userInfo');
                   userInfo.fromWorkbench = true;
                   own.save('userInfo', userInfo);
                });
                M('#assigneeBill').click(function () {
                    var menu = own.fetch('menu');
                    menu.index = that.getIndexByLocal('通宝受让');
                    own.save('menu', menu);
                });
                M('#financing').click(function () {
                    var menu = own.fetch('menu');
                    menu.index = that.getIndexByLocal('融资申请列表');
                    own.save('menu', menu);
                });M('#transferBill').click(function () {
                    var menu = own.fetch('menu');
                    menu.index = that.getIndexByLocal('通宝转让');
                    own.save('menu', menu);
                });
                M(document).on('click', '.ui-calendar-tips a', function(){
                    var menu = own.fetch('menu');
                    menu.index = that.getIndexByLocal('我的通宝');
                    own.save('menu', menu);
                });
                //统计项
                M.ajaxFn({
                    url: M.interfacePath.bill +'t/transferApplyNums',
                    typ: 'post',
                    data: {},
                    datatype: 'json',
                    success: function (res) {
                        if (res.success) {
                            // console.log(res);
                            M('#transferNum').html(res.data+'条');
                        }else {
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
                });
                //统计项
                M.ajaxFn({
                    url: M.interfacePath.bill +'t/supplier/analizeItems',
                    typ: 'post',
                    data: {},
                    datatype: 'json',
                    success: function (res) {
                        if (res.success) {
                            // console.log(res);
                            M('#transferCount').html(res.data.transferCount);
                            M('#holdAmount').html(M.getFormatNumber(res.data.holdAmount));
                            M('#financingAmount').html(M.getFormatNumber(res.data.financingAmount));
                        }else {
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
                });
			},
			checkLi:function(){
				var index=$('.ui-workbench-total-list li').index();
				var t=$('.ui-workbench-total-list').attr('top');
				if(t==0&&(t <= -((index+1)*86-290))){
					$('.btn-down').addClass('notClick').removeClass('ui-btn-hover');
					$('.btn-up').addClass('notClick').removeClass('ui-btn-hover');
					$('.btn-down,.btn-up').unbind('click')
				}else if(t==0){
					$('.btn-up').addClass('notClick').removeClass('ui-btn-hover');
					$('.btn-down').removeClass('notClick').addClass('ui-btn-hover');
					$('.btn-down').unbind('click').bind('click',M.workbenchSupplier.moveDown)
					$('.btn-up').unbind('click')
				}else if(t <= -((index+1)*86-290)){
					$('.btn-up').removeClass('notClick').addClass('ui-btn-hover');
					$('.btn-down').addClass('notClick').removeClass('ui-btn-hover');
					$('.btn-up').unbind('click').bind('click',M.workbenchSupplier.moveUp)
					$('.btn-down').unbind('click')
				}else{
					$('.btn-up').removeClass('notClick').addClass('ui-btn-hover');
					$('.btn-down').removeClass('notClick').addClass('ui-btn-hover');
					$('.btn-down').unbind('click').bind('click',M.workbenchSupplier.moveDown)
					$('.btn-up').unbind('click').bind('click',M.workbenchSupplier.moveUp)
				}
			},
			moveUp:function(){
				var t=parseInt($('.ui-workbench-total-list').attr('top'));
				if(!$('.btn-up').hasClass('notClick')){
					if(t==-140){
						$('.ui-workbench-total-list').attr('top',t+140)
						$('.ui-workbench-total-list li').stop().animate({
							top:t+140
						},500)
					}else{
						$('.ui-workbench-total-list').attr('top',t+86)
						$('.ui-workbench-total-list li').stop().animate({
							top:t+86
						},500)
					}
				}
				M.workbenchSupplier.checkLi()
			},
			moveDown:function(){
				var t=parseInt($('.ui-workbench-total-list').attr('top'));
//				console.log(t)
				if(!$('.btn-down').hasClass('notClick')){
					if(t==0){
						$('.ui-workbench-total-list').attr('top',t-140)
						$('.ui-workbench-total-list li').stop().animate({
							top:t-140
						},500)
					}else{
						$('.ui-workbench-total-list').attr('top',t-86)
						$('.ui-workbench-total-list li').stop().animate({
							top:t-86
						},500)
					}
				}
				M.workbenchSupplier.checkLi()
			},
			calendar:function(){
				M.ui.calendar.init({
					target:M('#calendar'),
					title:'收款计划',
					tabList:['Today','待兑','已兑'],
					date:{
						format:'YYYY-MM-DD',
						systemTime:null,//系统时间
						select:null, 
						min:'2008',
						max:'2035' 
					},
					affairCheckCallback:function(obj,a,b){
						M.workbenchSupplier.affairSort(obj.ops.target,a);
					},
					callback:function(obj,a){
						M.workbenchSupplier.affairSort(obj.ops.target,a);
					},
					switchMonthCallback:function(obj){}
				})
			},
			affairSort:function(obj,parem){
                // var flag = '';
                // if(parem === undefined || parem.length === 0){
                //     flag = 'empty'
                // }else if(M.inArray('0',parem) >= 0 && M.inArray('1',parem) >= 0){
                //     flag = 'all'
                // }else if(M.inArray('0',parem) < 0 && M.inArray('1',parem) >= 0){
                //     flag = 'used'
                // }else if(M.inArray('0',parem) >= 0 && M.inArray('1',parem) < 0){
                //     flag = 'unused'
                // }
                // console.log(flag);
                var flag = M('.calender-tab.active').attr('status');
                // console.log(flag);
                var days = M('.ui-workbench-widget').not('.ui-other-month').parent();
                var startDate = days.eq(0).attr('date');
                var endDate = days.eq(days.length -1).attr('date');
                M.ajaxFn({
                    url: M.interfacePath.bill +'t/supplier/statistics',
                    typ: 'post',
                    data: {
                        startDate: startDate,
                        endDate: endDate,
                    },
                    dataType: 'json',
                    success: function (res) {
                        // console.log(res)
                        if (res.success) {
                            M('.ui-calendar-tips').remove();
                            var data = res.data;
                            if (flag == '0') {
                                for(var i=0,str=''; i<data.length; i++){
                                    if(data[i].maturityDate.replace(/\-/,'') < M.currentDate().replace(/\-/,'') ){
                                        if (data[i].toCashAmount != 0) {
                                            str = M.renderHTML({
                                                proto:{
                                                    'class':'ui-calendar-tips ui-last-tips'
                                                },
                                                html:M.renderHTML({
                                                    name:'p',
                                                    html:'待兑付'
                                                })+M.renderHTML({
                                                    name:'p',
                                                    html:M.getFormatNumber(data[i].toCashAmount) +'万元'
                                                })
                                            })
                                            // M('td[date='+data[i].maturityDate+']',obj).children().append(str)
                                            if(M('td[date="'+data[i].maturityDate+'"]',obj).length > 0){
                                                M('td[date="'+data[i].maturityDate+'"]',obj).children().append(str)
                                                // console.log(data[i].time)
                                            }else{
                                                var reg = new RegExp("-","g")
                                                var s = (data[i].maturityDate).replace(reg,"/");
                                                // console.log(s)
                                                if(M('td[date="'+s+'"]',obj).length > 0){
                                                    M('td[date="'+s+'"]',obj).children().append(str)
                                                }
                                            }
                                        }
                                    }else{
                                        if (data[i].toCashAmount != 0) {
                                            str = M.renderHTML({
                                                proto:{
                                                    'class':'ui-calendar-tips ui-future-tips'
                                                },
                                                html:M.renderHTML({
                                                    name:'a',
                                                    proto:{
                                                        'class':'',
                                                        href:'myCurrency.html',
                                                        style:{
                                                            color:'#e4ad57'
                                                        }
                                                    },
                                                    html:M.renderHTML({
                                                        name:'p',
                                                        html:'待兑付'
                                                    })+M.renderHTML({
                                                        name:'p',
                                                        html:M.getFormatNumber(data[i].toCashAmount)+'万元'
                                                    })
                                                })
                                            })
                                            // M('td[date='+data[i].maturityDate+']',obj).children().append(str)
                                            if(M('td[date="'+data[i].maturityDate+'"]',obj).length > 0){
                                                M('td[date="'+data[i].maturityDate+'"]',obj).children().append(str)
                                                // console.log(data[i].time)
                                            }else{
                                                var reg = new RegExp("-","g")
                                                var s = (data[i].maturityDate).replace(reg,"/");
                                                // console.log(s)
                                                if(M('td[date="'+s+'"]',obj).length > 0){
                                                    M('td[date="'+s+'"]',obj).children().append(str)
                                                }
                                            }
                                        }
                                    }

                                }
                            } else if ( flag == '1') {
                                for(var i=0,str=''; i<data.length; i++){
                                    if(data[i].maturityDate.replace(/\-/,'') < M.currentDate().replace(/\-/,'') ){
                                        if (data[i].cashedAmount != 0) {
                                            str = M.renderHTML({
                                                proto:{
                                                    'class':'ui-calendar-tips ui-last-tips'
                                                },
                                                html:M.renderHTML({
                                                    name:'p',
                                                    html:'已兑付'
                                                })+M.renderHTML({
                                                    name:'p',
                                                    html:M.getFormatNumber(data[i].cashedAmount) +'万元'
                                                })
                                            })
                                            // M('td[date='+data[i].maturityDate+']',obj).children().append(str)
                                            if(M('td[date="'+data[i].maturityDate+'"]',obj).length > 0){
                                                M('td[date="'+data[i].maturityDate+'"]',obj).children().append(str)
                                                // console.log(data[i].time)
                                            }else{
                                                var reg = new RegExp("-","g")
                                                var s = (data[i].maturityDate).replace(reg,"/");
                                                // console.log(s)
                                                if(M('td[date="'+s+'"]',obj).length > 0){
                                                    M('td[date="'+s+'"]',obj).children().append(str)
                                                }
                                            }
                                        }
                                    }else{
                                        if (data[i].cashedAmount != 0) {
                                            str = M.renderHTML({
                                                proto:{
                                                    'class':'ui-calendar-tips ui-future-tips'
                                                },
                                                html:M.renderHTML({
                                                    name:'a',
                                                    proto:{
                                                        'class':'',
                                                        href:'myCurrency.html',
                                                        style:{
                                                            color:'#e4ad57'
                                                        }
                                                    },
                                                    html:M.renderHTML({
                                                        name:'p',
                                                        html:'已兑付'
                                                    })+M.renderHTML({
                                                        name:'p',
                                                        html:M.getFormatNumber(data[i].cashedAmount)+'万元'
                                                    })
                                                })
                                            })
                                            // M('td[date='+data[i].maturityDate+']',obj).children().append(str)
                                            if(M('td[date="'+data[i].maturityDate+'"]',obj).length > 0){
                                                M('td[date="'+data[i].maturityDate+'"]',obj).children().append(str)
                                                // console.log(data[i].time)
                                            }else{
                                                var reg = new RegExp("-","g")
                                                var s = (data[i].maturityDate).replace(reg,"/");
                                                // console.log(s)
                                                if(M('td[date="'+s+'"]',obj).length > 0){
                                                    M('td[date="'+s+'"]',obj).children().append(str)
                                                }
                                            }
                                        }
                                    }

                                }
                            }
                        }else {
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
                });
			},
            getIndexByLocal: function (name) {
                var menu = own.fetch('menu').menu;
                for (var i=0; i<menu.length; i++) {
                    var menuItem = menu[i];
                    if (menu[i].sub && menuItem.sub.length > 0) {
                        for(var k=0;k<menuItem.sub.length; k++) {
                            var subItem = menuItem.sub[k];
                            if (subItem.name == name) {
                                return [i, k]
                            }


                        }

                    }
                }
            }
		})(function(){
			M.workbenchSupplier.init();
		});
	}
)
