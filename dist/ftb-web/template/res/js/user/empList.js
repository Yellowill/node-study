require(['head', 'menu', 'base', 'tab','customDialog','status' ],
    function () {
        M.define('empList', {
            head: M.ui.head.init(),
            init: function () {
                M.ui.menu.init({
                    index: [5, 1],
                    url: M.getNormalPath('getMenu.json', 4),
                    callback: function () {
                    }
                });
                this.base = M.static.init();
                this.getData();
                this.getTableData();
            },

            //状态格式化
            statusFormat: function (data) {
                var statusName = null;
                if(data === '0' ){
                    statusName = '已注册（未审核）';
                }else if(data === '2'){
                    statusName = '已认证（审核通过）';
                }else if(data === '5'){
                    statusName = '已停用';
                }
                return statusName || '';
            },
            getData: function () {
                var that = this;
                $(document).on("click",'.ui-search-button',function(){
                    that.getTableData();
                });
                $(document).on("click",'.userManage',function(){
                    M.ui.customDialog.init({
                        drag:true,
                        title:'',
                        width:1000,
                        height:200,
                        autoClose:false,
                        url:'../dialog/dialog-userManage.html',
                        callback:function(e){
                            var id = own.getHref('id');
                            var name = own.getHref('name');
                            M('#Name').html(decodeURI(name));
                            M('#userId').html(id);
                            M.ajaxFn({
                                url: M.interfacePath.privilege + '/t/rms/roleList4Member',
                                type: 'post',
                                data: {
                                    memberId: id,
                                    isPersonal: '1',
                                    roleSide: '20'
                                },
                                dataType: 'json',
                                contentType: 'application/json',
                                success:function(res){
                                    // console.log(res);
                                    var data = res.data;
                                    that.roleList = data;
                                    if (data.length%2 == 0) {
                                        var index = 0;
                                        for (var i=0;i<data.length/2;i++) {
                                            var $row = M('<div class="g-row"></div>');
                                            var str = '';
                                            for (var k=0;k<2;k++) {
                                                var item = data[index];
                                                if (k==0) {
                                                    if (index == 0) {
                                                        str += '<div class="col-xs-6">'+
                                                            '<label>岗位选择：</label>'+
                                                            '<label>'+
                                                            '<input class="g-form-check" type="checkbox">'+
                                                            '<span class="g-form-lbl"> &nbsp;'+ item.roleName +'</span>'+
                                                            '</label>'+
                                                            '</div>'
                                                    }else {
                                                        str += '<div class="col-xs-6">'+
                                                            '<label class="g-hidden">岗位选择：</label>'+
                                                            '<label>'+
                                                            '<input class="g-form-check" type="checkbox">'+
                                                            '<span class="g-form-lbl"> &nbsp;'+ item.roleName +'</span>'+
                                                            '</label>'+
                                                            '</div>'
                                                    }
                                                }else {
                                                    str += '<div class="col-xs-6">'+
                                                        '<label>'+
                                                        '<input class="g-form-check" type="checkbox">'+
                                                        '<span class="g-form-lbl"> &nbsp;'+ item.roleName +'</span>'+
                                                        '</label>'+
                                                        '</div>'
                                                }
                                                index++;
                                            }
                                            $row.append(str);
                                            M('.ui-form-group').append($row)
                                        }
                                    }else {
                                        var index = 0;
                                        for (var i=0;i<(data.length-1)/2;i++) {
                                            var $row = M('<div class="g-row"></div>');
                                            var str = '';
                                            for (var k=0;k<2;k++) {
                                                var item = data[index];
                                                if (k==0) {
                                                    if (index == 0) {
                                                        str += '<div class="col-xs-6">'+
                                                            '<label>岗位选择：</label>'+
                                                            '<label>'+
                                                            '<input class="g-form-check" type="checkbox">'+
                                                            '<span class="g-form-lbl"> &nbsp;'+ item.roleName +'</span>'+
                                                            '</label>'+
                                                            '</div>'
                                                    }else {
                                                        str += '<div class="col-xs-6">'+
                                                            '<label class="g-hidden">岗位选择：</label>'+
                                                            '<label>'+
                                                            '<input class="g-form-check" type="checkbox">'+
                                                            '<span class="g-form-lbl"> &nbsp;'+ item.roleName +'</span>'+
                                                            '</label>'+
                                                            '</div>'
                                                    }
                                                }else {
                                                    str += '<div class="col-xs-6">'+
                                                        '<label>'+
                                                        '<input class="g-form-check" type="checkbox">'+
                                                        '<span class="g-form-lbl"> &nbsp;'+ item.roleName +'</span>'+
                                                        '</label>'+
                                                        '</div>'
                                                }
                                                index++;
                                            }
                                            $row.append(str)
                                            M('.ui-form-group').append($row)
                                        }
                                        if (data.length > 1) {
                                            var lastStr = '<div class="col-xs-6">'+
                                                '<label class="g-hidden">岗位选择：</label>'+
                                                '<label>'+
                                                '<input class="g-form-check" type="checkbox">'+
                                                '<span class="g-form-lbl"> &nbsp;'+ data[data.length-1].roleName +'</span>'+
                                                '</label>'+
                                                '</div>'
                                        }else if (data.length == 1) {
                                            var lastStr = '<div class="col-xs-6">'+
                                                '<label>岗位选择：</label>'+
                                                '<label>'+
                                                '<input class="g-form-check" type="checkbox">'+
                                                '<span class="g-form-lbl"> &nbsp;'+ data[data.length-1].roleName +'</span>'+
                                                '</label>'+
                                                '</div>'
                                        }
                                        M('.ui-form-group').append(lastStr)
                                    }
                                    for (var i=0;i<data.length;i++) {
                                        var item = data[i];
                                        if (item.checked == true) {
                                            $('.g-form-check')[i].checked = true;
                                        }
                                    }

                                },
                                error:function(){

                                }
                            });
                            M('.cancel-btn').click(function(){
                                e.remove();
                            });
                            M('.confirm-btn').click(function(){
                                // e.remove();
                                that.submit = {};
                                that.submit.memberId = id;
                                that.submit.privilegeList = [];
                                that.select = $('.g-form-check:checked');
                                for (var i=0;i<that.select.length; i++) {
                                    var item = that.select[i];
                                    var index = $('.g-form-check').index(item)
                                    var json = {
                                        "roleCode": that.roleList[index].roleCode,
                                        "roleId": that.roleList[index].roleId,
                                        "roleName": that.roleList[index].roleName,
                                    }
                                    that.submit.privilegeList.push(JSON.stringify(json));
                                }
                                M.ajaxFn({
                                    url:  M.interfacePath.privilege+'/t/rms/allocateRole4Member',
                                    type: 'post',
                                    data: that.submit,
                                    dataType: 'json',
                                    success: function (res) {
                                        if ( res.success ) {
                                            // console.log(res);
                                            M.ui.waiting.creat({
                                                status:true,
                                                time:1000,
                                                text:'授权成功',
                                                hide:false,
                                                callback: function () {
                                                    location.reload();
                                                }
                                            });
                                        }else {
                                            return M.ui.waiting.creat({
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
                                })

                            });

                        }
                    });
                });
            },
            getTableData: function () {
                var userLoginNo = M("#userLoginNo").val();
                var userName = M('#userName').val();
                M.ajaxFn({
                    // url: 'http://testbao.ouyeelf.com/api/bill/t/financeOwnRecord/list',
                    url: M.interfacePath.basic + 'n/user/getUserListByComId',
                    type: 'post',
                    data: {
                        "userLoginNo": userLoginNo,
                        "userName": userName
                    },
                    dataType: 'json',
                    contentType: 'application/json',
                    success: function (data) {
                        // console.log(data);
                        var str = '';
                        if (!data.success) {
                            M.ui.waiting.creat({
                                status:false,
                                time:1000,
                                text:data.message,
                                hide:false,
                            });
                            return ;
                        };
                        if(data.data == null || data.success == false || data.data.length ==0){
                            var noData = '<td colspan="6"><div class="noData"><img src="../../template/res/images/empty.png" alt=""><div class="col60 mar-top-10">暂无记录</div></div></td>';
                            M('.notice-tbody-content').html(noData);
                        }else if(data.success&&data.data.length!=0){
                            for (var i = 0; i < data.data.length; i++) {
                                var item = data.data[i];
                                var isAdmin =  item.isAdm === '1'? '是':'否';
                                var userName = item.userName || '';
                                var opsHtml = '<a href="javascript:;" onclick=\'M.empList.updateCert("' 
                                	+ item.userId + '");\'>更新证书</a> ';
                                if(item.isAdm != '1'){
                                    opsHtml += '<a href="#?id='+item.userId+'&name='+ encodeURI(userName) +'" class="userManage">' +
                                        '权限设置' +
                                        '</a>'
                                }
                                str += '<tr>' +
                                    '<td class="g-text-center">' +
                                    item.userId +
                                    '</td>' +
                                    '<td class="g-text-center nameTxt">' +
                                    userName +
                                    '</td>' +
                                    '<td class="g-text-center nameTxt">' +
                                    item.userLoginNo +
                                    '</td>' +
                                    '<td class="g-text-center nameTxt">' +
                                    isAdmin+
                                    '</td>' +
                                    '<td class="maincol g-text-center">' +
                                    M.empList.statusFormat(item.userauditstatus) +
                                    '</td>' +
                                    '<td class="g-text-center">' +
                                    M.timetrans(item.createDate) +
                                    '</td>' +
                                    '<td class="g-text-center">' +
                                    M.timetrans(item.updateDate) +
                                    '</td>' +
                                    '<td class="g-text-center">' + opsHtml +
                                    '</td>' +
                                    '</tr>';
                            }
                            // M.empList.getPage(data, page, M('#page'))
                            M('.notice-tbody-content').html(str);
                        }

                    },
                    error: function (res) {
                        console.log(res);
                    }
                });
            },
            updateCert:function(id){
                var that = this;
                if (!id) {
                    return;
                }
                M.ajaxFn({
                    url:$.interfacePath.basic+'certificateUpdate',
                    type: 'post',
                    data: {
                        "userId": id,
                    },
                    dataType: 'json',
                    contentType: 'application/json',
                    success: function (data) {
                        M.ui.waiting.creat({
                            status:data.success,
                            time:2000,
                            text:data.message,
                            hide:false
                        });
                        
                    },
                    error: function (res) {
                        console.log(res);
                    }
                });
            },
        })(function () {
            M.empList.init();
        });
    }
)
