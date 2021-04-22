// 每次调用 $.get() 或 $.post() 或 $.ajax()的时候会先调用 ajaxPrefilter 这个函数。在这个函数中，可以拿到我们给Ajax提供的配置对象
$.ajaxPrefilter(function(options) {
    // console.log(options.url);

    // 在发起真正的Ajax 请求之前，统一拼接请求的根路径
    options.url = 'http://api-breakingnews-web.itheima.net' + options.url
        // options.url = options.url
        // console.log(options.url);

    //统一为有权限接口设置headers请求头
    if (options.url.indexOf('/my') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }

    //全局统一挂载complete 回调函数
    //控制用户的访问权限
    options.complete = function(res) {
        if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            // console.log(res);
            //1.强制清空token
            localStorage.removeItem('token')
                // 2.强制跳转登录页
            location.href = './login.html'
        }
    }

})