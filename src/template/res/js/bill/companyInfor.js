require(['head', 'menu', 'base', 'tab', 'page', 'calendar', 'confirm', 'customDialog', 'status', 'plupload'],
    function () {
        M.define('companyInfo', {
            head: M.ui.head.init(),
            init: function () {
                M.ui.menu.init({
                    index: [0, 0],
                    callback: function () {
                    }
                })

                this.base = M.static.init();

                var applicationId =  M.getUrlParam('applicationId');
                this.applicationId = applicationId;

                this.rulesFile = null;
                this.licenceFile = null;
                this.reportFile = null;
                this.legalFile = null;
                this.operatorFile = null;

                this.getDate();
                this.getTableData();

                this.getBankInfo();
                this.bankConfig = {};  //金融机构配置
            },

            getBankInfo: function() {
                $.ajaxFn({
                    url:$.interfacePath.bill+'t/nologin/getFinanceOrgConfigByAcceptCode',
                    data:{acceptCode:M.companyInfo.applicationId},
                    type:'POST',
                    dataType:'JSON',
                    success:function(data,args){
                        if (data.success) {
                            M.companyInfo.bankConfig = data.data;
                        } else {
                            M.ui.waiting.creat({
                                status:false,
                                time:1000,
                                text:data.message,
                                hide:false,
                            });
                        }
                    },
                    error:function(msg){
                        console.log(msg)
                    }
                })
            },

            getDate: function () {

                var that = this;

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

                var calenderStart1 = M.ui.calendar.init({
                    target: M('#js-calender-start1'),
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
                    fast: true,
                    tool: {
                        clear: true,
                        today: true
                    },
                    callback: function (that) {
                        M.delay(100, function () {
                            this.ops.relative.point = calenderStop1;
                        }, this);
                    },
                    choose: function () {
                    }
                }, this);
                var calenderStop1 = M.ui.calendar.init({
                    target: M('#js-calender-end1'),
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
                    fast: true,
                    tool: {
                        clear: true,
                        today: true
                    },
                    callback: function (that) {
                        M.delay(100, function () {
                            this.ops.relative.point = calenderStart1;
                            this.ops.date.min = calenderStart1.ops.date.select;
                        }, this);
                    },
                    choose: function () {
                    }
                }, this);

                var calenderStart2 = M.ui.calendar.init({
                    target: M('#js-calender-start2'),
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
                    fast: true,
                    tool: {
                        clear: true,
                        today: true
                    },
                    callback: function (that) {
                        M.delay(100, function () {
                            this.ops.relative.point = calenderStop2;
                        }, this);
                    },
                    choose: function () {
                    }
                }, this);
                var calenderStop2 = M.ui.calendar.init({
                    target: M('#js-calender-end2'),
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
                    fast: true,
                    tool: {
                        clear: true,
                        today: true
                    },
                    callback: function (that) {
                        M.delay(100, function () {
                            this.ops.relative.point = calenderStart2;
                            this.ops.date.min = calenderStart2.ops.date.select;
                        }, this);
                    },
                    choose: function () {
                    }
                }, this);

                this.uploadInit("rules", "2", function (data) {
                    that.setRulesFile(data);
                });

                this.uploadInit("rerules", "2", function (data) {
                    that.setRulesFile(data);
                });

                this.uploadInit("licence", "1", function (data) {
                    that.setLicenceFile(data);
                });

                this.uploadInit("relicence", "1", function (data) {
                    that.setLicenceFile(data);
                });

                this.uploadInit("report", "3", function (data) {
                    that.setReportFile(data);
                });

                this.uploadInit("rereport", "3", function (data) {
                    that.setReportFile(data);
                });

                this.uploadInit("legal", "4", function (data) {
                    that.setLegalFile(data)
                });

                this.uploadInit("relegal", "4", function (data) {
                    that.setLegalFile(data)
                });

                this.uploadInit("operator", "5", function (data) {
                    that.setOperatorFile(data)
                });

                this.uploadInit("reoperator", "5", function (data) {
                    that.setOperatorFile(data)
                });

                //上一步
                // $('#js-prev').off('click').on('click',this.prev.bind(this));

                M('#save').unbind('click').bind('click', function (e) {
                    that.save();
                })

                //撤销
                $('#js-revoke').off('click').on('click',function () {
                    M.ui.confirm.init({
                        html:'确定撤销吗？',
                        drag: false,
                        button:[
                            {
                                href:null,
                                html:'确认',
                                callback:function(){
                                    that.revoke();
                                }
                            },
                            {
                                href:null,
                                html:'关闭',
                                callback:function(){

                                }
                            }
                        ],
                        close: function () {
                        }
                    });
                });
            },

            //上一步
            // prev:function(){
            //     var url = "financingConfirm.html?applicationId=" + this.applicationId;
            //     location.href = url;
            // },

            //撤销
            revoke:function(){
                var reqData = this.applicationId;
//                console.log(reqData);
                $.ajaxFn({
                    url:$.interfacePath.bill+'t/factorselectapplyinfo/update',
                    data:{acceptCode:reqData},
                    type:'POST',
                    dataType:'JSON',
                    success:function(data,args){
                        var data = M.parseJSON(data.data);
                        if (!data) {
                            return;
                        }
                        if(data.status === '1'){
                            M.ui.waiting.creat({
                                status:true,
                                time:1000,
                                text:'撤销成功',
                                hide:false,
                                callback: function () {
                                    location.href = "financingList.html";
                                }
                            });
                        }else{
                            M.ui.waiting.creat({
                                status:true,
                                time:1000,
                                text:data.message,
                                hide:false
                            });
                        }
                    },
                    error:function(msg){
                        console.log(msg)
                    }
                })
            },

            setRulesFile: function(data){
                if (!data) {
                    return;
                }

                M.companyInfo.rulesFile = data;

                M('#rules-uploaded').show();
                M('#rules-upload').hide();

                M('#rules-name').val(data.fileName)
                M('#rules-download').unbind('click').bind('click', function (e) {
                    M.downloadFileXhr(data.fileAddress, data.fileName)
                })
            },

            setLicenceFile: function(data){

                if (!data) {
                    return;
                }

                M.companyInfo.licenceFile= data;

                M('#licence-uploaded').show();
                M('#licence-upload').hide();

                M('#licence-name').val(data.fileName)
                M('#licence-download').unbind('click').bind('click', function (e) {
                    M.downloadFileXhr(data.fileAddress, data.fileName)
                })
            },

            setReportFile: function(data){

                if (!data) {
                    return;
                }

                M.companyInfo.reportFile= data;

                M('#report-uploaded').show();
                M('#report-upload').hide();

                M('#report-name').val(data.fileName)
                M('#report-download').unbind('click').bind('click', function (e) {
                    M.downloadFileXhr(data.fileAddress, data.fileName)
                })
            },

            setLegalFile: function(data){

                if (!data) {
                    return;
                }

                M.companyInfo.legalFile = data;

                M('#legal-uploaded').show();
                M('#legal-upload').hide();

                M('#legal-name').val(data.fileName)
                M('#legal-download').unbind('click').bind('click', function (e) {
                    M.downloadFileXhr(data.fileAddress, data.fileName)
                })
            },

            setOperatorFile: function(data){

                if (!data) {
                    return;
                }

                M.companyInfo.operatorFile = data;

                M('#operator-uploaded').show();
                M('#operator-upload').hide();

                M('#operator-name').val(data.fileName)
                M('#operator-download').unbind('click').bind('click', function (e) {
                    M.downloadFileXhr(data.fileAddress, data.fileName)
                })
            },

            //保存
            save: function() {
                var errMsg = '';

                var rulesFile = M.companyInfo.rulesFile;
                var licenceFile = M.companyInfo.licenceFile;
                var reportFile = M.companyInfo.reportFile;

                var legalType = M('#legal-select').val();
                var legalNo = M('#legal-no').val();
                var legalName = M('#legal-uname').val();
                var legalStart = M('#js-calender-start1').val();
                var legalEnd = M('#js-calender-end1').val();
                var legalFile = M.companyInfo.legalFile;

                var operatorType = M('#operator-select').val();
                var operatorNo = M('#operator-no').val();
                var operatorName = M('#operator-uname').val();
                var operatorStart = M('#js-calender-start2').val();
                var operatorEnd = M('#js-calender-end2').val();
                var operatorFile = M.companyInfo.operatorFile;

                if (!rulesFile) {
                    errMsg = '请上传公司章程';
                    return M.ui.waiting.creat({
                        status:false,
                        time:1000,
                        text: errMsg,
                        hide:false,
                    });
                }

                if (!licenceFile) {
                    errMsg = '请上传开户许可证';
                    return M.ui.waiting.creat({
                        status:false,
                        time:1000,
                        text: errMsg,
                        hide:false,
                    });
                }

                if (!reportFile) {
                    errMsg = '请上传财务报表';
                    return M.ui.waiting.creat({
                        status:false,
                        time:1000,
                        text: errMsg,
                        hide:false,
                    });
                }

                if (!legalType || legalType.length == 0) {
                    errMsg = '请选择法定代表人证件类型';
                    return M.ui.waiting.creat({
                        status:false,
                        time:1000,
                        text: errMsg,
                        hide:false,
                    });
                }

                if (!legalNo || legalNo.length == 0) {
                    errMsg = '请输入法定代表人证件号码';
                    return M.ui.waiting.creat({
                        status:false,
                        time:1000,
                        text: errMsg,
                        hide:false,
                    });
                }

                if (!legalName|| legalName.length == 0) {
                    errMsg = '请输入法定代表人姓名';
                    return M.ui.waiting.creat({
                        status:false,
                        time:1000,
                        text: errMsg,
                        hide:false,
                    });
                }

                if (!legalStart || legalStart.length == 0) {
                    errMsg = '请选择法定代表人证件注册日';
                    return M.ui.waiting.creat({
                        status:false,
                        time:1000,
                        text: errMsg,
                        hide:false,
                    });
                }

                if (!legalEnd || legalEnd.length == 0) {
                    errMsg = '请选择法定代表人证件到期日';
                    return M.ui.waiting.creat({
                        status:false,
                        time:1000,
                        text: errMsg,
                        hide:false,
                    });
                }

                if (!legalFile) {
                    errMsg = '请上传法定代表人附件';
                    return M.ui.waiting.creat({
                        status:false,
                        time:1000,
                        text: errMsg,
                        hide:false,
                    });
                }

                if (!operatorType || operatorType.length == 0) {
                    errMsg = '请选择经办人证件类型';
                    return M.ui.waiting.creat({
                        status:false,
                        time:1000,
                        text: errMsg,
                        hide:false,
                    });
                }

                if (!operatorNo || operatorNo.length == 0) {
                    errMsg = '请输入经办人证件号码';
                    return M.ui.waiting.creat({
                        status:false,
                        time:1000,
                        text: errMsg,
                        hide:false,
                    });
                }

                if (!operatorName || operatorName.length == 0) {
                    errMsg = '请输入经办人姓名';
                    return M.ui.waiting.creat({
                        status:false,
                        time:1000,
                        text: errMsg,
                        hide:false,
                    });
                }

                if (!operatorStart || operatorStart.length == 0) {
                    errMsg = '请选择经办人证件注册日';
                    return M.ui.waiting.creat({
                        status:false,
                        time:1000,
                        text: errMsg,
                        hide:false,
                    });
                }

                if (!operatorEnd || operatorEnd.length == 0) {
                    errMsg = '请选择经办人证件到期日';
                    return M.ui.waiting.creat({
                        status:false,
                        time:1000,
                        text: errMsg,
                        hide:false,
                    });
                }

                if (!operatorFile) {
                    errMsg = '请上传经办人附件';
                    return M.ui.waiting.creat({
                        status:false,
                        time:1000,
                        text: errMsg,
                        hide:false,
                    });
                }

                var param = {

                    "attInfoList":[    //附件清单
                        {
                            "enclosureLargeClass":"1",  //附件大类   固定传1
                            "enclosureSubClass":"1", //附件细类   开户许可证:1 	  公司章程:2   财务报表:3   法人身份证:4  经办人身份证:5
                            "path":rulesFile.fileAddress  //附件地址
                        },
                        {
                            "enclosureLargeClass":"1",
                            "enclosureSubClass":"2",
                            "path":licenceFile.fileAddress
                        },
                        {
                            "enclosureLargeClass":"1",
                            "enclosureSubClass":"3",
                            "path":reportFile.fileAddress
                        },
                        {
                            "enclosureLargeClass":"1",
                            "enclosureSubClass":"4",
                            "path":legalFile.fileAddress
                        },
                        {
                            "enclosureLargeClass":"1",
                            "enclosureSubClass":"5",
                            "path":operatorFile.fileAddress
                        }
                    ],
                    "contactInfoList":[  //联系人信息
                        {
                            "relation_type":"0",  //关系类别 固定传：0
                            "relation_name":"5",  //关系类型   法人传:5     经办人传:6
                            "b_entity_name":legalName,  //姓名
                            "b_entity_type":"1",  //企业或个人类型 固定传1
                            "b_cert_type":legalType,    //证件类型
                            "b_cert_no":legalNo,  //证件号码
                            "register_date":legalStart,  //证件注册日期 yyyyMMdd
                            "due_date":legalEnd  //证件到期日期 yyyyMMdd
                        },
                        {
                            "relation_type":"0",
                            "relation_name":"6",
                            "b_entity_name":operatorName,
                            "b_entity_type":"1",
                            "b_cert_type":operatorType,
                            "b_cert_no":operatorNo,
                            "register_date":operatorStart,
                            "due_date":operatorEnd
                        }
                    ]
                };

                M.ajaxFn({
                    url:$.interfacePath.basic+'n/reg/addOrUpdateCompanycap',
                    type: 'post',
                    data: param,
                    dataType: 'json',
                    contentType: 'application/json',
                    success: function (res) {
                        var data = res.data;
                        if(res.success){
                            M.ui.waiting.creat({
                                status:true,
                                time:1000,
                                text: '保存成功!',
                                hide:false,
                                callback: function () {
                                    var url = M.companyInfo.bankConfig.next02Page + "?applicationId=" + M.companyInfo.applicationId;
                                    window.location.href = url;
                                    // location.href='noRecourse.html?applicationId=' + M.companyInfo.applicationId;
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

            setRespData: function(data) {


                var fileList = data.list;
                
                if (fileList) {
                    for (var i = 0; i < fileList.length; i++) {
                        var file = fileList[i];
                        if (!file.path || file.path.length=="0") {
                            continue;
                        }
                        if (file.enclosureSubClass == '1') {
                            var index=file.path.lastIndexOf("/");
                            if (index >= 0) {
                                var fileName = file.path.substring(index+1,file.path.length);
                                var fileAddress = file.path;
                                M.companyInfo.setRulesFile({
                                    fileName: fileName,
                                    fileAddress: fileAddress
                                });
                            }
                        } else if (file.enclosureSubClass == '2') {
                            var index=file.path.lastIndexOf("/");
                            if (index >= 0) {
                                var fileName = file.path.substring(index+1,file.path.length);
                                var fileAddress = file.path;
                                M.companyInfo.setLicenceFile({
                                    fileName: fileName,
                                    fileAddress: fileAddress
                                });
                            }
                        } else if (file.enclosureSubClass == '3') {
                            var index=file.path.lastIndexOf("/");
                            if (index >= 0) {
                                var fileName = file.path.substring(index+1,file.path.length);
                                var fileAddress = file.path;
                                M.companyInfo.setReportFile({
                                    fileName: fileName,
                                    fileAddress: fileAddress
                                });
                            }
                        } else if (file.enclosureSubClass == '4') {
                            var index=file.path.lastIndexOf("/");
                            if (index >= 0) {
                                var fileName = file.path.substring(index+1,file.path.length);
                                var fileAddress = file.path;
                                M.companyInfo.setLegalFile({
                                    fileName: fileName,
                                    fileAddress: fileAddress
                                });
                            }
                        } else if (file.enclosureSubClass == '5') {
                            var index=file.path.lastIndexOf("/");
                            if (index >= 0) {
                                var fileName = file.path.substring(index+1,file.path.length);
                                var fileAddress = file.path;
                                M.companyInfo.setOperatorFile({
                                    fileName: fileName,
                                    fileAddress: fileAddress
                                });
                            }
                        }
                    }   
                }

                var relationsList =  data.relationsList;
                
                if (relationsList) {
                    for (var i = 0; i < relationsList.length; i++) {
                        var relation = relationsList[i]; 
                        if (relation.relation_name == "5") {
                            var legalType = relation.b_cert_type || '';
                            var legalNo = relation.b_cert_no || '';
                            var legalName = relation.b_entity_name || '';
                            var legalStart = relation.register_date || '';
                            var legalEnd = relation.due_date || '';

                            M('#legal-select').val(legalType);
                            M('#legal-no').val(legalNo);
                            M('#legal-uname').val(legalName);
                            M('#js-calender-start1').val(legalStart);
                            M('#js-calender-end1').val(legalEnd);
                        } else if (relation.relation_name == "6") {
                            var operatorType = relation.b_cert_type || '';
                            var operatorNo = relation.b_cert_no || '';
                            var operatorName = relation.b_entity_name || '';
                            var operatorStart = relation.register_date || '';
                            var operatorEnd = relation.due_date || '';

                            M('#operator-select').val(operatorType);
                            M('#operator-no').val(operatorNo);
                            M('#operator-uname').val(operatorName);
                            M('#js-calender-start2').val(operatorStart);
                            M('#js-calender-end2').val(operatorEnd);
                        }
                    }
                }
            },

            getTableData: function (page) {

                M.ajaxFn({
                    url:$.interfacePath.basic+'n/reg/queryCompanycap',
                    type: 'post',
                    data: {

                    },
                    dataType: 'json',
                    contentType: 'application/json',
                    success: function (res) {
                        var data = res.data;
                        if(res.success){
                            M.companyInfo.setRespData(data);
                        }
                    },
                    error: function (res) {
                        console.log(res);
                    }
                });
            },


            uploadInit: function(id, index, success) {

                // 上传图片
                var uploader = new plupload.Uploader({ //实例化一个plupload上传对象
                    browse_button : id,//上传ID
                    headers:{
                        'Authorization': own.fetch('userInfo').token,
                    },
                    url : M.interfacePath.server + 'zuul/api/assets/t/uploadFile/tea',
                    runtimes: 'gears,html5,html4,silverlight,flash',
                    flash_swf_url : '../../../../base/js/core/Moxie.swf',
                    silverlight_xap_url : '../../../../base/js/core/Moxie.xap',
                    multipart_params: {
                        'Authorization': own.fetch('userInfo').token,
                        'fileType': index,
                        'customerId':own.fetch('userInfo').comId
                    },
                    filters: {
                        mime_types : [ //只允许上传图片和zip文件
                            { title : "Image files", extensions : "jpg,png" },
                            { title : "Document files", extensions : "pdf" }
                        ],
                        max_file_size : '10485760' //最大只能上传5120kb的文件
                    }
                });
                uploader.init(); //初始化

                uploader.bind('FilesAdded',function(uploader,files){
                    var filesLens = files.length;
                    if (filesLens == 1 ) {
                        uploader.start();
                    } else {
                        for (var i=0; i<files.length; i++) {
                            uploader.removeFile(files[i])
                        }
                        M.ui.waiting.creat({
                            status:false,
                            time:1000,
                            text:'只能上传1个附件',
                            hide:false,
                        });
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
                        success && success(data.data);
                        // that.payment.contracts.push(data.data);
                        // var file_name = files.name; //文件名
                        // var file_size = data.data.size;
                        // //构造html来更新UI
                        // // M('#uploadBox').addClass('upload-info');
                        // var html2 =  '<div class="file-box">'+
                        //     '<div class="file-name"><a class="download" href="javascript:;">'+file_name+'</a><a href="javascript:;" class="removeItem">删除</a></div>'+
                        //     '<div class="file-size">'+(file_size/1024).toFixed(2)+'k</div>'+
                        //     '</div>'
                        // $(html2).appendTo('#uploadBox');

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
            }

        })(function () {
            M.companyInfo.init();
        });
    }
)
