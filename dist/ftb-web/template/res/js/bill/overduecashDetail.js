require(['head','menu','base','tab','page'],
    function(){
        M.define('overduecashDetail',{
            head:M.ui.head.init(),
            init:function(){
                M.ui.menu.init({
                    index:[],
                    url:M.getNormalPath('getMenu.json',4),
                    callback: function() {

                    }
                });
                this.base = M.static.init();
                this.noticeId = M.getUrlParam('noticeId');

                this.getTableData();
            },



            getTableData: function (page) {

                var id = M.overduecashDetail.noticeId;

                M.ajaxFn({
                    url: M.interfacePath.bill + 't/queryBussinNotice/details',
                    type: 'post',
                    data: {
                        "id": id,
                    },
                    dataType: 'json',
                    contentType: 'application/json',
                    success: function (data) {

                        var res = data.data;

                        if (!res) {
                            return;
                        }
                        if(res.status=='00') {
                            M.ajaxFn({
                                url: M.interfacePath.bill + 't/bussinNotice/update',
                                type: 'POST',
                                data: {
                                    "id": M.overduecashDetail.noticeId,
                                },
                                dataType: 'json',
                                contentType: 'application/json',
                                success: function (data) {

                                },
                                error: function (res) {
                                    console.log(res);
                                }
                            });
                        }



                        var date = new Date(res.releaseDate);
                        var YY = date.getFullYear();
                        var MM = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
                        var DD = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate());
                        var dfdate = new Date(res.maturityDate);
                        var YYY = dfdate.getFullYear();
                        var MMM = (dfdate.getMonth() + 1 < 10 ? '0' + (dfdate.getMonth() + 1) : dfdate.getMonth() + 1);
                        var DDD = (dfdate.getDate() < 10 ? '0' + (dfdate.getDate()) : dfdate.getDate());


                        M('.creater').html(res.payerLegalName);
                        M('.billNo').html(res.billNo)
                        M('.year').html(YY);
                        M('.month').html(MM);
                        M('.day').html(DD);
                        M('.yeardf').html(YYY);
                        M('.monthdf').html(MMM);
                        M('.daydf').html(DDD);
                        M('.billAmount').html(M.getFormatNumber(res.billAmount,2,'.',','));

                        M('.notice-date').html(M.timetrans_cn(res.createDate));
                        M('.noticeDetailDownload').click(function(event) {
                            M.downloadFileXhr(res.noticeFile,null);
                        });
                    },
                    error: function (res) {
                        console.log(res);
                    }
                });
            },

        })(function(){
            M.overduecashDetail.init();
        });
    }
)
