$(function() {
    var layer = layui.layer;
    var form = layui.form;
    form.verify({
        nickname: function(value) {
            if (value.length > 6) {
                return '请输入1-6个字符！'
            }
        }
    })
    initUserInfo();

    function initUserInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function(res) {
                if (res.status !== 0) {
                    return layui.layer.msg('初始化用户信息失败')
                }
                // console.log(res);

                //调用form.val 快速给表单赋值
                form.val("formUserInfo", res.data)

            }
        })

        //重置表单数据
        $('#btnReset').on('click', function(e) {
            e.preventDefault();
            initUserInfo();
        })


        //监听表单提交事件
        $('.layui-form').on('submit', function(e) {
            e.preventDefault();
            // 发起ajax请求
            $.ajax({
                method: 'POST',
                url: '/my/userinfo',
                data: $(this).serialize(),
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('更新用户信息失败！')
                    }
                    // console.log(res);
                    layer.msg('更新用户信息成功！')
                        //调用父页面的方法，重新渲染用户头像和信息
                    window.parent.getUserInfo();
                }
            })
        })

    }
























})