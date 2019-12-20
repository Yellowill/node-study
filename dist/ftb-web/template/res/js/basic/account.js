require(['head', 'menu', 'base', 'tab', 'page', 'status'],
    function () {
        M.define('account', {
            head: M.ui.head.init(),
            init: function () {
                M.ui.menu.init({
                    index: [5, 0],
                    url: M.getNormalPath('getMenu.json', 4),
                    callback: function () {

                    }
                });
                this.base = M.static.init();
                this.getDate();
            },

            getDate: function () {
                var that = this;
                M('#company').attr('href', $.interfacePath.capUrl +'company/CompanyDetail')
                M('#personal').attr('href', $.interfacePath.capUrl +'company/queryCompayUser')
                M('#operator').attr('href', $.interfacePath.capUrl +'company/compOperator')
                M('#addAccount').attr('href', $.interfacePath.capUrl +'company/compNewUser?sysCode=RZ')
                M('#pwChange').attr('href', $.interfacePath.capUrl +'company/companychangePwd')
            },



        })(function () {
            M.account.init();
        });
    }
)
