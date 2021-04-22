$(function() {
    //去注册的点击事件
    $('#link_reg').on('click', function() {
        $('.login-box').hide();
        $('.reg-box').show();
    });
    //去登录的点击事件
    $('#link_login').on('click', function() {
        $('.reg-box').hide();
        $('.login-box').show();
    });
    // 从 LayUI 中获取 form 对象
    var form = layui.form;
    var layer = layui.layer;
    form.verify({
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
        repwd: function(value) {
            var pwd = $('.reg-box [name = password]').val();
            if (pwd !== value) {
                return '两次密码不一致！'
            }
        }
    });
    // 监听注册页面
    $('#form_reg').on('submit', function(e) {
            e.preventDefault();
            var data = { username: $('#form_reg [name=username]').val(), password: $('#form_reg [name=password]').val() }
            $.post('/api/reguser', data, function(res) {
                if (res.status !== 0) {
                    // return console.log(res.message)
                    return layer.msg(res.message);
                } else {
                    // console.log('注册成功！');
                    layer.msg('注册成功，请登录！');
                    // 模拟人的点击事件
                    $('#link_login').click();
                }
            })
        })
        //监听登陆页面
    $('#form_login').submit(function(e) {
        e.preventDefault();
        $.ajax({
            url: '/api/login',
            method: 'POST',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('登录失败！')
                }
                layer.msg('登录成功！')
                    // console.log(res.token);
                    // 将登录成功返回的 token 字符串，保存到locaStorage 中
                localStorage.setItem('token', res.token)
                    //跳转后台主页
                location.href = './index.html'
            }
        })
    })
})