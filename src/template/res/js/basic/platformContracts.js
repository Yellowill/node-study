require(['head', 'menu', 'base', 'tab', 'page', 'status'],
    function () {
        M.define('platformContracts', {
            head: M.ui.head.init(),
            init: function () {
                M.ui.menu.init({
                    index: [6, 0],
                    url: M.getNormalPath('getMenu.json', 4),
                    callback: function () {

                    }
                });
                this.base = M.static.init();

                this.getContract();
            },
            getContract:function(){
                M.ajaxFn({
                    url:  $.interfacePath.basic +'t/query/signsAgreement',
                    type: 'post',
                    data: {

                    },
                    dataType: 'json',
                    success: function (res) {

                        if ( res.success ) {
                            console.log(res)
                            var arr=res.data
                            var htmlstr='';
                            var nedstr='';
                            for(var i=0;i<arr.length;i++){
                                console.log(arr[i].bizType)
                                if(arr[i].bizType=='90'){
                                    nedstr+='<div class="g-row">\n' +
                                        '                <div class="contract-name g-left">平台在线规则</div>\n' +
                                        '                <div class="contract-actions g-right">\n' +
                                        '                    <a href="userAgreement.html?id='+arr[i].bizType +'" target="_blank" class="preview">查看</a>\n' +
                                        '                    <a href="javascript:;" data-type="90" onclick=\'M.platformContracts.download("' + arr[i].autographFilePath + '");\'>下载</a>\n' +
                                        '                </div>\n' +
                                        '            </div>'
                                }else if(arr[i].bizType=='92' && arr[i].autographFilePath){
                                    nedstr+='<div class="g-row">\n' +
                                        '                <div class="contract-name g-left">电子签名授权书</div>\n' +
                                        '                <div class="contract-actions g-right">\n' +
                                        '                    <a href="sginAgreement.html?id='+arr[i].bizType +'" target="_blank" class="preview">查看</a>\n' +
                                        '                    <a href="javascript:;"  data-type="92" onclick=\'M.platformContracts.download("' + arr[i].autographFilePath + '");\'>下载</a>\n' +
                                        '                </div>\n' +
                                        '            </div>'
                                }else if(arr[i].bizType=='92' && !arr[i].autographFilePath){
                                    nedstr+='<div class="g-row">\n' +
                                        '                <div class="contract-name g-left">电子签名授权书</div>\n' +
                                        '                <div class="contract-actions g-right">\n' +
                                        '                    <a href="sginAgreement.html?id='+arr[i].bizType +'" target="_blank" class="preview">查看</a>\n' +
                                        '                    <a href="javascript:;"  data-type="92"  class="downloadqm">下载</a>\n' +
                                        '                </div>\n' +
                                        '            </div>'
                                    M.platformContracts.getDate()
                                }else if(arr[i].bizType=='95'){
                                    nedstr+='<div class="g-row">\n' +
                                        '                <div class="contract-name g-left">平台合作协议</div>\n' +
                                        '                <div class="contract-actions g-right">\n' +
                                        '                    <a href="../bill/billContract.html?id='+arr[i].bizType +'" target="_blank" class="previewSign">查看</a>\n' +
                                        '                    <a href="javascript:;" data-type="95" onclick=\'M.platformContracts.download("' + arr[i].autographFilePath + '");\'>下载</a>\n' +
                                        '                </div>\n' +
                                        '            </div>'
                                }else if(arr[i].bizType=='96'){
                                    nedstr+='<div class="g-row">\n' +
                                        '                <div class="contract-name g-left">代付业务服务协议</div>\n' +
                                        '                <div class="contract-actions g-right">\n' +
                                        '                    <a href="../bill/billContract.html?id=96" target="_blank" class="previewServe">查看</a>\n' +
                                        '                    <a href="javascript:;" data-type="95" onclick=\'M.platformContracts.download("' + arr[i].autographFilePath + '");\'>下载</a>\n' +
                                        '                </div>\n' +
                                        '            </div>'
                                };

                            };
                            htmlstr +=nedstr
                            M('.js-con').html(htmlstr)
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
             download:function(addr) {
                if(addr){
                    M.downloadFileXhr(addr, '')
                }
                 M(document).on('click', '.preview', function () {
                     var userInfo = own.fetch('userInfo');
                     userInfo.fromPlatformContracts = true;
                     own.save('userInfo', userInfo);
                 });
            },
            getDate: function () {
                var that = this;

                M(document).on('click', '.downloadqm', function () {
                    M.ajaxFn({
                        url:  $.interfacePath.basic +'t/supp/electronicSign',
                        type: 'post',
                        data: {
                            // bizType: M(this).attr('data-type')
                            bizType:"92"
                        },
                        dataType: 'json',
                        success: function (res) {
                            // console.log(res);
                            if ( res.success ) {
                                M.downloadFileXhr(res.data, '')
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
                });
            },
        })(function () {
            M.platformContracts.init();
        });
    }
)
