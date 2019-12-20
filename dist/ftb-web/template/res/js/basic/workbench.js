require(['base','head','menu','calendarTwo','status'],
    function(){
        M.define('workbench',{
            head: M.ui.head.init(),
            init:function(){
                M.ui.menu.init({
                    index: [],
                    url: M.getNormalPath('getMenu.json', 4),
                    callback: function () {
                    }
                });
                this.getData();
                this.calendar();
                this.checkBar();
                this.checkLi();
                this.menuShow();
                $('.ui-menu-item').unbind('click').bind('click',this.showLi)
            },
            getData:function(){
                var that = this;
                M('#addBill').click(function () {
                    var menu = own.fetch('menu');
                    menu.index = that.getIndexByLocal('通宝开立');
                    own.save('menu', menu);
                    if (own.fetch('userInfo').cus_caAgreementFlag == '0') {
                        window.location.href="../bill/billContract.html";
                    }else {
                        window.location.href="../bill/addBill.html";
                    }
                });
                M('#transferNotice').click(function () {
                    var menu = own.fetch('menu');
                    menu.index = that.getIndexByLocal('债权转让通知');
                    own.save('menu', menu);
                });
                M(document).on('click', '.ui-calendar-tips a', function(){
                    var menu = own.fetch('menu');
                    menu.index = that.getIndexByLocal('通宝开立');
                    own.save('menu', menu);
                });
                //债权通知数量
                M.ajaxFn({
                    url: M.interfacePath.bill +'t/transferNoticeCount',
                    type: 'post',
                    data: {},
                    datatype: 'json',
                    success: function (res) {
                        if (res.success) {
                            M('#transferNum').html(res.data);
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
                //近期待兑付
                var periodList = [
                    {"startDate": M.getDateScope('days', 0), "endDate": M.getDateScope('days', 7)},
                    {"startDate": M.getDateScope('days', 0), "endDate": M.getDateScope('days', 14)},
                    {"startDate": M.getDateScope('days', 0), "endDate": M.getDateScope('days', 30)},
                    {"startDate": M.getDateScope('days', 0), "endDate": M.getDateScope('days', 60)},
                    {"startDate": M.getDateScope('days', 0), "endDate": M.getDateScope('days', 90)},
                    {"startDate": M.getDateScope('days', 0), "endDate": M.getDateScope('days', 180)}
                ];
                M.ajaxFn({
                    url: M.interfacePath.bill +'t/recentCashInfo',
                    typ: 'post',
                    data: {
                        periodList: periodList
                    },
                    datatype: 'json',
                    success: function (res) {
                        if (res.success) {
                            that.moneyList = [];
                            that.moneyL=[];
                            that.totalMoneyList = [];
                            for (var i=0;i<res.data.length; i++) {
                                var item = res.data[i];
                                that.moneyList.push(M.getFormatNumber(item.amount));
                                that.moneyL.push(item.amount);
                                that.totalMoneyList.push(M.getFormatNumber(item.totalAmount));
                            }
                            var d={
                                "time":["7天","2周","1月","2月","3月","6月"],
                                "money":that.moneyList,
                                "moneyL":that.moneyL,
                                "totalMoney":that.totalMoneyList,
                                "color":["#622276","#A32C83","#EB4272","#E76B90","#FFA193","#FFC5A3"]
                            }
                            that.bar(d);
                        } else {
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
                //信用额度情况
                M.ajaxFn({
                    url: M.interfacePath.bill +'t/creditInfo',
                    typ: 'post',
                    data: {},
                    datatype: 'json',
                    success: function (res) {
                        if (res.success) {
                            M('#creditAmount').html(M.getFormatNumber(res.data.creditAmount));
                            M('#usedAmount').html(M.getFormatNumber(res.data.usedAmount));
                            M('#remainAmount').html(res.data.remainAmount>=0?M.getFormatNumber(res.data.remainAmount):M.getFormatNumber(0));
                            var percent = (res.data.remainAmount/res.data.creditAmount).toFixed(2)*100;
                            that.ring(percent);
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
                    url: M.interfacePath.bill +'t/analizeItems',
                    typ: 'post',
                    data: {},
                    datatype: 'json',
                    success: function (res) {
                        if (res.success) {
                            // console.log(res);
                            M('#amount').html(M.getFormatNumber(res.data.amount));
                            M('#transferCount').html(res.data.transferCount);
                            M('#financingAmount').html(M.getFormatNumber(res.data.financingAmount));
                            M('#clientCount').html(res.data.clientCount);
                            M('#changeCount').html(res.data.changeCount);
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
            showLi:function(){
                if($(this).find('.ui-menu-detail').is(':hidden')){
                    $(this).find('.ui-menu-detail').stop().slideDown().siblings().find('.ui-menu-arrow').html('&#xe636;');
                    $(this).siblings().find('.ui-menu-detail').stop().slideUp().siblings().find('.ui-menu-arrow').html('&#xe604;');
                }else{
                    $(this).find('.ui-menu-detail').stop().slideUp().siblings().find('.ui-menu-arrow').html('&#xe604;');
                }
            },
            menuShow:function(){
                $('.ui-menu').hover(
                    function(){
                        $('.ui-menu').stop().animate({'width':'200px'},300)
//						if($('.ui-menu-item.active .ui-menu-detail .active').length>0){
//							$('.ui-menu-item.active .ui-menu-detail .active').parent().show().siblings().find('.ui-menu-arrow').html('&#xe636;');
//						}
                    },
                    function(){
                        $('.ui-menu').stop().animate({'width':'50px'},200)
                        $('.ui-menu-item .ui-menu-detail').hide().siblings().find('.ui-menu-arrow').html('&#xe604;');
                    }
                )
            },
            calendar:function(){
                M.ui.calendar.init({
                    target:M('#calendar'),
                    title:'兑付计划',
                    tabList:['Today','待兑','已兑'],
                    date:{
                        format:'YYYY-MM-DD',
                        systemTime:null,//系统时间
                        select:null,
                        min:'2008',
                        max:'2035'
                    },
                    affairCheckCallback:function(obj,a,b){

                        M.workbench.affairSort(obj.ops.target,a);
                    },
                    callback:function(obj,a){
                        M.workbench.affairSort(obj.ops.target,a);
                    },
                    switchMonthCallback:function(obj){

                    }
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
                    url: M.interfacePath.bill +'t/payment/statistics',
                    typ: 'post',
                    data: {
                        startDate: M.timetrans(startDate),
                        endDate: M.timetrans(endDate),
                    },
                    dataType: 'json',
                    success: function (res) {
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
                                                        href:'../bill/billHonour.html?acceptanceDate='+data[i].maturityDate,
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
                                                        href:'../bill/billIssue.html',
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
            checkLi:function(){
                var index=$('.ui-workbench-total-list li').index();
                var t=$('.ui-workbench-total-list').attr('top');
                if(t==0&&(t <=-(index-4)*86)){
                    $('.btn-down').addClass('notClick').removeClass('ui-btn-hover');
                    $('.btn-up').addClass('notClick').removeClass('ui-btn-hover');
                    $('.btn-down,.btn-up').unbind('click')
                }else if(t==0){
                    $('.btn-up').addClass('notClick').removeClass('ui-btn-hover');
                    $('.btn-down').removeClass('notClick').addClass('ui-btn-hover');
                    $('.btn-down').unbind('click').bind('click',M.workbench.moveDown)
                    $('.btn-up').unbind('click')
                }else if(t <= -(index-4)*86){
                    $('.btn-up').removeClass('notClick').addClass('ui-btn-hover');
                    $('.btn-down').addClass('notClick').removeClass('ui-btn-hover');
                    $('.btn-up').unbind('click').bind('click',M.workbench.moveUp)
                    $('.btn-down').unbind('click')
                }else{
                    $('.btn-up').removeClass('notClick').addClass('ui-btn-hover');
                    $('.btn-down').removeClass('notClick').addClass('ui-btn-hover');
                    $('.btn-down').unbind('click').bind('click',M.workbench.moveDown)
                    $('.btn-up').unbind('click').bind('click',M.workbench.moveUp)
                }
            },
            moveUp:function(){
                var t=parseInt($('.ui-workbench-total-list').attr('top'));
                $('.ui-workbench-total-list').attr('top',t+86)
                if(!$('.btn-up').hasClass('notClick')){
                    $('.ui-workbench-total-list li').stop().animate({
                        top:t+86
                    },500)
                }
                M.workbench.checkLi()
            },
            moveDown:function(){
                var t=parseInt($('.ui-workbench-total-list').attr('top'));
                $('.ui-workbench-total-list').attr('top',t-86)
                if(!$('.btn-down').hasClass('notClick')){
                    $('.ui-workbench-total-list li').stop().animate({
                        top:t-86
                    },500)
                }
                M.workbench.checkLi()
            },
            moveLeft:function(){
                var l=parseInt($('#canvas_3').attr('left'))
                $('#canvas_3').attr('left',l+92)
                if($('.spot-btn-left').parent().css('cursor')=='pointer'){
                    $('#canvas_3').stop().animate({
                        left:l+92
                    },500)
                }
                M.workbench.checkBar()
            },
            moveRight:function(){
                var l=parseInt($('#canvas_3').attr('left'))
                $('#canvas_3').attr('left',l-92)
                if($('.spot-btn-right').parent().css('cursor')=='pointer'){
                    $('#canvas_3').stop().animate({
                        left:l-92
                    },500)
                }
                M.workbench.checkBar()
            },
            checkBar:function(){
                var d=$('#canvas_3').attr('left');
                if(d==0&&(d==-($('#canvas_3').attr('barLength')-5)*92)){
                    $('.spot-btn-left').css('color','#ddd').parent().css('cursor','not-allowed');
                    $('.spot-btn-right').css('color','#ddd').parent().css('cursor','not-allowed');
                    $('.spot-btn-left,.spot-btn-right').parent().unbind('click')
                }else if(d==0){
                    $('.spot-btn-right').css('color','#63666b').parent().css('cursor','pointer');
                    $('.spot-btn-left').css('color','#ddd').parent().css('cursor','not-allowed');
                    $('.spot-btn-right').parent().unbind('click').bind('click',M.workbench.moveRight)
                    $('.spot-btn-left').parent().unbind('click')
                }else if(d==-($('#canvas_3').attr('barLength')-5)*92){
                    $('.spot-btn-left').css('color','#63666b').parent().css('cursor','pointer');
                    $('.spot-btn-right').css('color','#ddd').parent().css('cursor','not-allowed');
                    $('.spot-btn-left').parent().unbind('click').bind('click',M.workbench.moveLeft)
                    $('.spot-btn-right').parent().unbind('click')
                }else{
                    $('.spot-btn-right').css('color','#63666b').parent().css('cursor','pointer');
                    $('.spot-btn-left').css('color','#63666b').parent().css('cursor','pointer');
                    $('.spot-btn-left').parent().unbind('click').bind('click',M.workbench.moveLeft)
                    $('.spot-btn-right').parent().unbind('click').bind('click',M.workbench.moveRight)
                }
            },
            bar:function(d){
				var canvas_3 = document.querySelector('#canvas_3');
				var ctx_3 = canvas_3.getContext('2d');
				var w=62+92*(d.time.length-1);
				var m;
				$('#canvas_3').attr({'barLength':d.time.length , 'left':0})
				window.requestAnimationFrame = window.requestAnimationFrame||function (fn) {return setTimeout(fn,1000/60)}
    window.cancelAnimationFrame = window.cancelAnimationFrame ||clearTimeout;
				m=Math.max.apply(null, d.moneyL)
				if(w>430){
					canvas_3.width=w
				}else{
					w=430
				};
				ctx_3.moveTo(0,110);
				ctx_3.lineTo(w,110);
				ctx_3.strokeStyle='#f4f4f4';
				ctx_3.stroke();
				for(var i=0;i<d.time.length;i++){
					ctx_3.fillStyle='#f4f4f4';
					ctx_3.fillRect(10+(92*i),50,38,60);
					ctx_3.fillStyle='#999';
					ctx_3.font="bold 12px microsoft yahei";
					ctx_3.fillText("近"+d.time[i],12+(92*i),130);
					ctx_3.fillStyle='#555';
					ctx_3.font="normal 12px microsoft yahei";
					ctx_3.fillText(d.money[i],15+(92*i),40);
				}
				ctx_3.save();
				var t=0;
				var browser=navigator.appName ;
				var b_version=navigator.appVersion ;
				var version=b_version.split(";"); 
				var trim_Version=version[1]?version[1].replace(/[ ]/g,""):''; 
				(function draw() {
					timer = requestAnimationFrame(draw);
					if(browser=="Microsoft Internet Explorer" && trim_Version=="MSIE8.0"){
						t+=60;
					}else{
						t+=2;
					}
					ctx_3.restore();
					for(var i=0;i<d.time.length;i++){
						ctx_3.fillStyle=d.color[i];
						var p=d.moneyL[i]/m
						ctx_3.fillRect(10+(92*i),(110-p*t),38,p*t);
					}
					if (t>=60) {
						window.cancelAnimationFrame(timer);
					};
				})()
			},
			ring:function(percent){
				var canvas_1 = document.querySelector('#canvas_1');
				var canvas_2 = document.querySelector('#canvas_2');
				var ctx_1 = canvas_1.getContext('2d');
				var ctx_2 = canvas_2.getContext('2d');
				var width=180,height=180;
				window.requestAnimationFrame = window.requestAnimationFrame||function (fn) {return setTimeout(fn,1000/60)}
    window.cancelAnimationFrame = window.cancelAnimationFrame ||clearTimeout;
				ctx_1.lineWidth = 20;
				ctx_1.strokeStyle = "#f4f4f4";
				//画底部的灰色圆环
				ctx_1.beginPath();
				ctx_1.arc(width / 2, height / 2, width / 2 - ctx_1.lineWidth / 2-12, Math.PI * 150/180, Math.PI * 390/180, false);
				ctx_1.stroke();
				ctx_1.translate(100,100);
				ctx_1.rotate(Math.PI*150/180)
				ctx_1.closePath();
				if (percent < 0 || percent > 100) {
					percent=0;
					throw new Error('percent must be between 0 and 100');
					return
				}
				ctx_2.lineWidth = 30;
				ctx_2.lineCap="round"
				var angle = 0;
				var timer;
				var w;
				var browser=navigator.appName ;
				var b_version=navigator.appVersion ;
				var version=b_version.split(";"); 
				var trim_Version=version[1]?version[1].replace(/[ ]/g,""):''; 
				(function draw() {
					timer = requestAnimationFrame(draw);
					ctx_2.clearRect(0, 0, 220, 220)
					//百分比圆环
					ctx_2.beginPath();
					ctx_2.arc(width / 2, height / 2, width / 2 - ctx_2.lineWidth / 2-6, Math.PI * 150/180, (angle+150) * Math.PI / 180, false);
					w=angle/240*180;
					if(w<50){
						w=50
					}
					if(browser=="Microsoft Internet Explorer" && trim_Version=="MSIE8.0"){
						angle+=percent / 100 * 240;
					}else{
						angle+=4;
					}
					var percentAge = parseInt((angle / 240) * 100)
					if (angle > (percent / 100 * 240)) {
						percentAge = percent
						window.cancelAnimationFrame(timer);
					};
					if(browser=="Microsoft Internet Explorer" && trim_Version=="MSIE8.0"){
						var lineargradient='#e56590';
					}else{
						var lineargradient = ctx_2.createLinearGradient(w,0,0,0);
						lineargradient.addColorStop(0,'#fba986');
						lineargradient.addColorStop(1,'#e56590');
					}
					ctx_2.strokeStyle = lineargradient;
					ctx_2.shadowOffsetX = 3;
				    ctx_2.shadowOffsetY = 0;
				    ctx_2.shadowBlur = 10;
				    ctx_2.shadowColor = "rgba(0, 0, 0, 0.1)";
					ctx_2.stroke();
					ctx_2.closePath();
					
				})()
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
            M.workbench.init();
        });
    }
)
