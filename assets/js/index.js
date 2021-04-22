$(function() {
    //调用 getUserInfo 获取用户基本信息
    getUserInfo()

    //点击退出
    var layer = layui.layer
    $('#btnLogOut').on('click', function() {
        //提示是否确认退出
        layer.confirm('确定是否退出登录?', { icon: 3, title: '提示' },
            function(index) {
                //1.清空本地token
                localStorage.removeItem('token')
                    // 2.跳转登录页
                location.href = './login.html'
                layer.close(index);
            });
    })

})




//获取用户的基本信息
function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        //headers 是请求头配置对象
        // headers: {

        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: function(res) {
            console.log(res);
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败！')
            }
            // 调用randerAtavar 渲染用户头像
            randerAtavar(res.data);
        },
        // //控制用户的访问权限
        // complete: function(res) {
        //     if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
        //         // console.log(res);
        //         //1.强制清空token
        //         localStorage.removeItem('token')
        //             // 2.强制跳转登录页
        //         location.href = './login.html'
        //     }
        // }
    })
}

function randerAtavar(user) {
    //1.获取用户名称
    var name = user.nickname || user.username
        //2.设置欢迎文本
    $('#welcome').html('欢迎&nbsp;&nbsp' + name)
        // 3.渲染用户头像
    if (user.user_pic !== null) {
        //3.1 渲染图片头像
        $('.layui-nav-img').attr('src', user.user_pic).show()
        $('.text-avatar').hide()
    } else {
        //3.2渲染文本头像
        $('.layui-nav-img').hide()
        var first = name[0].toUpperCase()
        $('.text-avatar').html(first).show()
    }
}