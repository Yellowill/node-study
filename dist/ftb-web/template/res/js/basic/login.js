require(['base', 'menu', 'status', 'customDialog'], function() {
  M.define('login', {
    init: function() {
      this.base = M.static.init()
      var errMsg = M.getUrlParam('error')
      if (!errMsg) {
        setTimeout(function() {
          M.login.updatingView()
        }, 1000)
      }
      this.getData()
      // this.login();
      $('#D-login').attr('action', $.interfacePath.remoteLogin)
      $('#remoteLoginPage').val(encodeURIComponent($.interfacePath.loginUrl))
      $('#captcha').attr('src', $.interfacePath.verificationUrl + new Date().getTime())
      $('#capRegUrl').attr('href', $.interfacePath.capRegUrl)
      $('.capRegUrl').attr('href', $.interfacePath.capRegUrl)
      $('#forgetPwd').attr('href', $.interfacePath.forgetPwd)

      this.index = 0
      this.status = true
      this.imgList = {
        bgImgList: [
          {
            imgUrl: 'login_bg3.jpg',
            href: 'http://ism.ouyeelbuy.com/market-cc-mall/ouyeelMall/toTongbaoView',
          },
          { imgUrl: 'login_bg4.jpg', href: 'javascript:;' },
          { imgUrl: 'login_bg2.jpg', href: 'javascript:;' },
        ],
        switchImgList: ['login_pic3.png', 'login_pic4.png', 'login_pic2.png'],
      }
      this.slider() //底图slider
      this.initDOM()
      M('.bg-img-href').attr('href', this.imgList.bgImgList[0].href)
    },
    updatingView: function() {
      $.ajax({
        async: false, //表示请求是否异步处理
        type: 'get', //请求类型
        url: $.interfacePath.basic + 'nologin/query/notice', //请求的 URL地址
        dataType: 'json', //返回的数据类型
        success: function(data) {
          var noticedata = data.data
          if (data.data) {
            M.ui.customDialog.init({
              drag: false,
              title: '正在升级中...',
              width: 800,
              height: 394,
              autoClose: false,
              url: '../dialog/dialog-updating.html',
              callback: function(e) {
                M('.js-title').html(noticedata.title)
                M('.js-releaset').html(M.timetrans_cn(noticedata.releaseDate))
                M('.js-content').html(noticedata.content)
                M('.ui-dialog-close').click(function() {
                  e.remove()
                })
                M('.ui-dia-sure-btn').click(function() {
                  e.remove()
                })
              },
            })
          }
        },
        error: function(data) {
          console.log(data)
        },
      })
    },
    switchImg: function(e) {
      var index = M(this).index(),
        that = e.data.that
      if (!that.status) return
      that.status = false
      that.interval ? clearInterval(that.interval) : ''
      M(this)
        .addClass('active')
        .siblings()
        .removeClass('active')
      M('.login-bg-img,#js-slide-img').fadeOut(500)
      setTimeout(function() {
        M('.login-bg-img')
          .attr('src', '../res/images/login/' + that.imgList.bgImgList[index].imgUrl)
          .fadeIn(500)
        M('.bg-img-href').attr('href', that.imgList.bgImgList[index].href)
        M('#js-slide-img')
          .attr('src', '../res/images/login/' + that.imgList.switchImgList[index])
          .fadeIn(500, function() {
            that.index = index
            that.status = true
            that.slider()
          })
        return false
      }, 500)
    },

    slider: function() {
      var that = this
      this.interval = setInterval(function() {
        that.intervalF(that)
      }, 6000)
    },
    intervalF: function(that) {
      that.index += 1
      if (that.index > that.imgList.switchImgList.length - 1) {
        that.index = 0
      }
      M('.solit span')
        .eq(that.index)
        .addClass('active')
        .siblings()
        .removeClass('active')
      M('.login-bg-img,#js-slide-img').fadeOut(500)

      setTimeout(function() {
        M('.login-bg-img')
          .attr('src', '../res/images/login/' + that.imgList.bgImgList[that.index].imgUrl)
          .fadeIn(500)
        M('#js-slide-img')
          .attr('src', '../res/images/login/' + that.imgList.switchImgList[that.index])
          .fadeIn(500)
        M('.bg-img-href').attr('href', that.imgList.bgImgList[that.index].href)
        return false
      }, 500)
    },
    initDOM: function() {
      M('#slider-img').append(this.creatSpot())
      M('.js-dot')
        .off('click')
        .on('click', { that: this }, this.switchImg)
    },
    creatSpot: function() {
      var that = this
      return M.renderHTML({
        proto: {
          class: 'solit',
        },
        html: that.creatSpan(),
      })
    },
    creatSpan: function() {
      var str = ''
      for (var i = 0; i < this.imgList.switchImgList.length; i++) {
        str += M.renderHTML({
          name: 'span',
          proto: {
            class: 'js-dot ' + (i === 0 ? 'active' : '') + '',
          },
        })
      }
      return str
    },
    getData: function() {
      //                localStorage.clear();
      //页面错误信息
      var userError = 'error.authentication.credentials.bad.usernameorpassword.username'
      var userPwdError = 'error.authentication.credentials.bad.usernameorpassword.password'
      var userImgError = 'error.authentication.validatecode.bad'
      var logError = 'error.authentication.duplicatelogin.bad'
      var lockeduser = 'error.authentication.credentials.bad.lockeduser'
      var errMsg = M.getUrlParam('error')
      if (errMsg == userError) {
        M.ui.status.init({
          html: '用户名不存在',
        })
      } else if (errMsg == userPwdError) {
        M.ui.status.init({
          html: '密码错误',
        })
      } else if (errMsg == userImgError) {
        M.ui.status.init({
          html: '验证码错误',
        })
      } else if (errMsg == logError) {
        M.ui.status.init({
          html: '重复登录',
        })
      } else if (errMsg == lockeduser) {
        M.ui.status.init({
          html: '您的账号已锁定，请24小时后再尝试登录，或咨询4008201688.',
        })
      }

      if (M.cookie.read('login')) {
        if (localStorage.userInfo) {
          var userInfo = own.fetch('userInfo')
          var userRole = userInfo.userRole
          if (!userRole || userRole.length == 0) {
            own.logout()
            return
          }

          if (userRole[0] == 'R55') {
            return (window.location.href =
              M.interfacePath.server + 'privilege/index.html#/platform/user-platform')
          }
          if (userRole[0] == 'R10') {
            window.location.href = '../basic/workbench.html'
          } else {
            window.location.href = '../basic/workbench-supplier.html'
          }
        } else {
          own.logout()
        }
      } else {
        if (localStorage.userInfo) {
          //            			own.logout();
          localStorage.clear()
        }
      }
      $(function() {
        $('.btn_union').click(function() {
          var tempUsername = $('#uname').val()
          var tempPassword = $('#upassdword').val()
          var verification = $('#verification').val()
          if (tempUsername == '') {
            $('#errorUsernameMsg').show()
            $('#errorUsernameMsg').html('用户名不能为空')
            return
          } else {
            $('#errorUsernameMsg').hide()
          }
          if (tempPassword == '') {
            $('#errorPasswordMsg').show()
            $('#errorPasswordMsg').html('密码不能为空')
            return
          } else {
            $('#errorPasswordMsg').hide()
          }
          if (verification == '') {
            $('#errorVerMsg').show()
            $('#errorVerMsg').html('请输入验证码')
            return
          } else {
            $('#errorVerMsg').hide()
          }
          if (tempUsername != '' && tempPassword != '' && verification != '') {
            //  onclick="javascript:document.forms[0].submit();"
            $('form:first').submit()
          }
        })
        $('#uname').blur(function() {
          var tempUsername = $('#uname').val()
          if (tempUsername == '') {
            $('#errorUsernameMsg').show()
            $('#errorUsernameMsg').html('用户名不能为空')
            return
          } else {
            $('#errorUsernameMsg').hide()
          }
        })
        $('#upassdword').blur(function() {
          var tempPassword = $('#upassdword').val()
          if (tempPassword == '') {
            $('#errorPasswordMsg').show()
            $('#errorPasswordMsg').html('密码不能为空')
            return
          } else {
            $('#errorPasswordMsg').hide()
          }
        })
        $(document).keyup(function(event) {
          if (event.keyCode == 13) {
            $('.btn_union').trigger('click')
          }
        })
        $('.unite_login label').click(function() {
          var index = $(this).index()
          $(this)
            .addClass('current')
            .siblings()
            .removeClass('current')
          $(this)
            .closest('.login_frame')
            .find('.infor')
            .eq(index)
            .show()
            .siblings('.infor')
            .hide()
        })
      })

      $('#welcome').keyup(function(e) {
        if (e.keyCode == 9) {
          $('#validateCode').focus()
        }
      })

      $('div#span_ccode>a').click(function() {
        $(this)
          .find('img')
          .attr('src', M.interfacePath.verificationUrl + new Date().getTime())
      })
      $(function() {
        $('.union_code>a').click(function() {
          $('.union_code')
            .find('img')
            .attr('src', M.interfacePath.verificationUrl + new Date().getTime())
        })
      })
    },
    // login:function(){
    //     M(function(){
    //         url:'http://10.60.36.160:8008/api/basic/n/user/login',
    //         M("#btn_login").click(function(){
    //              var data = $("#fm3").serializeObject();
    //             M.ajaxFn({
    //                 url:'http://uatcas.ouyeelf.com/cas/remoteLogin?service=http%3A%2F%2F10.60.36.160:8008%2Frf-basic%2Fn%2Fuser%2FloginApi%3Fsyscode%3DRF%26originalTargetUri%3D%252Fmain%252FhomePageLogin.do',
    //                 data:data,
    //                 type:'post',
    //                 dataType:'json',
    //                 success:function(data){
    //                     console.log(data);
    //                     if (data.success) {   // 登入成功
    //                         // 设置 token 数据
    //                         var userInfo = {};
    //                         userInfo["login"] = true;
    //                         userInfo["userName"] = data.data.user.operateName;
    //                         userInfo["userId"] = data.data.user.operateId;
    //                         userInfo["comId"] = data.data.user.customerId;
    //                         userInfo["comName"] = data.data.user.customerName;
    //                         userInfo["token"] = data.data.token;
    //                         userInfo["userRole"] = data.data.user.userRole;
    //                         var userRole = userInfo.userRole;
    //                         //存token
    //                         own.save('userInfo', userInfo);
    //                         if(userRole == "00"){
    //                             window.location.href="../assets/paymentForMe.html";
    //                         }else if(userRole == "R10"){
    //                             window.location.href="../assets/enterpriseWorkbench.html";
    //                         }else if(userRole == "R20"){
    //                             window.location.href="../assets/supplierWorkbench.html";
    //                         }else{
    //                             window.location.href="../assets/paymentForMe.html";
    //                         }
    //                     }
    //                 },
    //                 error:function(err){
    //                     console.log(err);
    //                 }
    //             });
    //         });
    //     });
    // },
  })(function() {
    M.login.init()
  })
})
