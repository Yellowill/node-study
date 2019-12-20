require(['head','menu','base','tab','page', 'calendar', 'calculator'],
    function(){
        M.define('financingOne',{
            head:M.ui.head.init(),
            init:function(){
                M.ui.menu.init({
                    index:[],
                    url:M.getNormalPath('getMenu.json',4),
                    callback: function() {

                    }
                });
                this.base = M.static.init();
                this.getDate();
                this.getTableData();
                this.selectItems = [];
            },

            getDate: function(){

                M('.table').on('mouseenter', '.table-tr', function (ev) {

                    if ( $(this).find('a.change-confirm').css('display') !== 'block' ) {

                        M(this).find('i.change-icon').css('display','block');
                    }
                });
                M('.table').on('mouseleave', '.table-tr', function (ev) {

                    M(this).find('i.change-icon').css('display','none');
                });

                M(document).on('keyup', '.num-ipt', function () {
                    $(this).val($(this).val().replace(/[^\d.]/g,''));
                    this.value = this.value.replace(/\.{2,}/g,"."); //只保留第一个. 清除多余的
                    this.value= this.value.replace(/\.\d{2,}$/,this.value.substr(this.value.indexOf('.'),3));
                    var value = $(this).val();
                    var array = value.split(".");
                    if((array.length >1 && array[1].length > 2) || array.length >2){
                        value = array[0] + "." +array[1].substr(0,2);
                        $(this).val(value);
                    }
                });


                M('.table').on('click', '.table-tr', function (ev) {
                    var ev = ev || window.event;
                    var target = ev.target || ev.srcElement;

                    if($(target).hasClass('change-icon')) {

                        var ipt = $(target).siblings('input');
                        ipt.css('border','1px solid #e6e6e6');
                        ipt.removeAttr("disabled");
                        ipt.val( ipt.val().replace(/,/g, '') );
                        $(target).css('display', 'none');
                        $(target).siblings('a').css('display', 'block');

                    } else if ( $(target).hasClass('change-confirm') ) {


                        var ipt = $(target).siblings('input');
                        if (parseFloat(ipt.val()).toString() !== "NaN" && parseFloat(ipt.val()) !== 0 ) {
                            ipt.val($.getFormatNumber(ipt.val(), 2)).css('border','none').attr("disabled", true);
                            $(target).css('display', 'none')
                        }else if ( parseFloat(ipt.val()) == 0 ) {
                            ipt.val($(target).parent().siblings('.have-num').text()).css('border','none').attr("disabled", true);
                            $(target).css('display', 'none')
                            M.ui.waiting.creat({
                                status:false,
                                time:1000,
                                text:'转让金额不能为零',
                                hide:false,
                            });
                        }else if (ipt.val() == '') {
                            ipt.val($(target).parent().siblings('.have-num').text()).css('border','none').attr("disabled", true);
                            $(target).css('display', 'none')
                            M.ui.waiting.creat({
                                status:false,
                                time:1000,
                                text:'转让金额不能为空',
                                hide:false,
                            });
                        }

                    } else if ( !$(target).hasClass('num-ipt') && !$(target).hasClass('change-confirm') ) {

                        if (M(this).hasClass('active')) {
                            M(this).removeClass('active');
                        } else {
                            M(this).addClass('active');
                        }
                    }
                    M.financingOne.selectPrice();
                });

                //全部选中
                M('.all-check a').on('click', function (ev) {

                    if( M(this).attr('checkd') === 'true' ) {
                        M('.table-con').find('.table-tr').removeClass('active');
                        M(this).attr('checkd','false');
                    }else {
                        M('.table-con').find('.table-tr').addClass('active');
                        M(this).attr('checkd','true');
                    }

                    M.financingOne.selectPrice();
                });

                //上一步
                M('.prev-step').on('click', function () {
                    window.history.back(-1);
                });

                //下一步
                M('.next-step').on('click', function () {

                    var selected = M.financingOne.selectPrice();

                    if (selected.listFinancing.length == 0) {
                        M.ui.waiting.creat({
                            status:false,
                            time:1000,
                            text:'请选择融资通宝',
                            hide:false,
                        });
                        return;
                    }

                    own.save('finacingOne',selected)

                    var params = "financingTwo.html";

                    window.location.href = params;
                });

            },

            selectPrice: function () {
                var payment = {};
                payment.listFinancing = [];
                var select =  $('.table').find('div.table-tr.active');
                var sum = 0;
                for(var i=0; i<select.length; i++) {
                    sum = M.arithmeticAdd(sum, parseFloat($(select[i]).find('.num-ipt').val().replace(/,/g, '')));
                    var financeId =$(select[i]).find('.financeId').text();
                    var financeNum = $(select[i]).find('.num-ipt').val().replace(/,/g, '');
                    payment.listFinancing.push({id:financeId,applyAmount: financeNum});
                    payment.sum = $.getFormatNumber(sum, 2);
                }
                $('.select-num').html($.getFormatNumber(sum, 2));
                return payment;
            },

            getTableData: function () {
                var that = this;

                M.ajaxFn({
                    url: M.interfacePath.bill + 't/financing/admit',
                    type: 'post',
                    data: {
                        "pageSize": 100
                    },
                    dataType: 'json',
                    contentType: 'application/json',
                    success: function (data) {
                        // console.log(data);
                        M.financingOne.selectItems = [];
                        var totalPrice = 0;

                        var str =   '<div class="table-th">' +
                                        '<div class="check-box"></div>' +
                                        '<div class="bill-num">通宝编号</div>' +
                                        '<div class="create-side">开立方</div>' +
                                        '<div class="cash-date">兑付日期</div>' +
                                        '<div class="have-num">持有金额</div>' +
                                        '<div class="fin-num">融资金额</div>' +
                                    '</div>';
                        str += '<div id="scroll-bar" class="table-con">';
                        for (var i = 0; i < data.data.length; i++) {
                            var item = data.data[i];
                            // var ddd = $.TimeDifference(M.timetrans(item.maturityDate),$.currentDate());
                            var ddd = M.timetrans(item.maturityDate);
                            str += '<div class="table-tr">' +
                                        '<div class="financeId none">'+item.id+'</div>'+
                                        '<div class="check-box">' +
                                            '<span>' + '<i class="iconfont">' + '&#xe74c;' + '</i>' + '</span>' +
                                        '</div>' +
                                        '<div class="bill-num">'+ item.billHoldNo +'</div>' +
                                        '<div class="create-side">' + item.payerName + '</div>' +
                                        '<div class="cash-date">' + ddd + '</div>' +
                                        '<div class="have-num">' + M.getFormatNumber(item.amount) + '</div>' +
                                        '<div class="fin-num"><input class="num-ipt" disabled="disabled" type="text" maxlength="12" value="'+M.getFormatNumber(item.amount,2,'.',',')+ '" /><i class="iconfont change-icon">&#xe6be;</i><a class="change-confirm" href="javascript:;">确定</a></div>' +
                                    '</div>';

                            M.financingOne.selectItems.push(item);
                            totalPrice += item.amount;
                        }
                        str += '</div>';
                        M('.table').html(str);
                        M('.data-num').html(data.total);
                        M('.total-num').html(M.getFormatNumber(totalPrice));
                        M('.table-tr').each(function(){
                            M(this).find('.num-ipt').bind('input propertychange',function(){

                                var s = parseFloat(M(this).parent().siblings('.have-num').text().replace(/,/g, ''));
                                var num_ipt = parseInt(M(this).val(),10);
                                if(num_ipt > s){
                                    M(this).val(s);
                                }
                            });
                        });
                    },
                    error: function (res) {
                        console.log(res);
                    }
                });
            },

        })(function(){
            M.financingOne.init();
        });
    }
)
