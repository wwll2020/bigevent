$(function() {
    var layer = layui.layer
    var form = layui.form

    initCate()
        // 初始化富文本编辑器
    initEditor()
        //选择文章分类
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg('初始化文章分类失败！')
                }

                //调用模板引擎渲染下拉菜单
                var htmStr = template("tpl-cate", res)
                $('[name=cate_id]').html(htmStr)
                    //一定要记得调用form.render() 
                form.render()
            }
        })
    }

    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    //为选择封面，绑定点击事件处理函数
    $('#btnChooseImage').on('click', function() {
            $('#coverFile').click()
        })
        //监听coverFile 的change 事件， 拿到用户选择的文件
    $('#coverFile').on('change', function(e) {
        var files = e.target.files
        if (files.length === 0) {
            return layer.msg('请选择需要上传的图片！')
        }
        //根据选择的文件，创建一个对应的 URL 地址：
        var newImgURL = URL.createObjectURL(files[0])
            // 先`销毁`旧的裁剪区域，再`重新设置图片路径`，之后再`创建新的裁剪区域`：
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })

    //定义文章的状态
    var art_state = '已发布'
        //为存为草稿，绑定点击处理函数
    $('#btnSave2').on('click', function() {
        art_state = '草稿'
    })

    //为表单绑定submin 事件
    $('#form_pub').on('submit', function(e) {
            e.preventDefault();
            //基于form 表单，快速创建一个FormData对象
            var fd = new FormData($(this)[0]);
            //将文章的发布状态存到 fd 中
            fd.append('state', art_state)
                // fd.forEach(function(v, k) {
                //     console.log(k, v);
                // })
                //将裁剪后的图片，输出为文件
            $image
                .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                    width: 400,
                    height: 280
                })
                .toBlob(function(blob) {
                    // 将 Canvas 画布上的内容，转化为文件对象
                    // 得到文件对象后，进行后续的操作
                    //  将文件对象，存储到 fd 中
                    fd.append('cover_img', blob)
                        //  发起 ajax 数据请求
                    publishArticle(fd)
                })
        })
        //发布文章的方法
    function publishArticle(fd) {
        //发起Ajax请求
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            //注意：如果向服务器提交的是FormData 格式的数据，必须添加以下两个配置
            contentType: false,
            processData: false,
            success: function(res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg('发布文章失败！')
                }
                layer.msg('发布文章成功！')
                    //发布文章成功后，跳转到文章列表页面
                location.href = '../article/art_list.html'
            }
        })

    }

})