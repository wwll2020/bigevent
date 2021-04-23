$(function() {
    var layer = layui.layer;
    var form = layui.form;
    initArtCateList()
        //获取文章分类列表
    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                console.log(res);
                var htmStr = template('tpl-table', res)
                    // console.log(htmStr);
                $('tbody').html(htmStr)
            }
        })
    }
    //添加类别点击事件
    var indexAdd = null
    $('#btnAddCate').on('click', function() {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog-add').html()
        });
    })

    //通过代理为表单绑定事件
    $('body').on('submit', '#form-add', function(e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function(res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg('res.message')
                }
                initArtCateList()
                    //根据索引 提交后关闭弹出层
                layer.close(indexAdd)
            }
        })
    })

    //通过代理绑定编辑功能
    var indexEdit = null
    $('tbody').on('click', '#btn-edit', function() {
        indexEdit = layer.open({
                type: 1,
                area: ['500px', '250px'],
                title: '修改文章分类',
                content: $('#dialog-edit').html()
            })
            //自定义属性获取id
        var id = $(this).attr('data-id')
            // console.log(id);
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function(res) {
                // console.log(res);
                form.val('form-edit', res.data)
            }
        })
    })

    //通过代理， 为修改绑定 submit 事件
    $('body').on('submit', '#form-edit', function(e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function(res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg('更新数据失败！')
                }
                layer.msg('更新数据成功！')
                layer.close(indexEdit)
                initArtCateList()
            }
        })
    })

    //通过代理绑定删除功能
    $('tbody').on('click', '.btn-delete', function() {
        //自定义属性获取id
        var id = $(this).attr('data-id')
            // console.log(id);
            //提示是否删除
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            //do something
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        // console.log(res);
                        return layer.msg(res.message)
                    }
                    layer.msg('删除成功！')
                    layer.close(index);
                    initArtCateList()

                }
            })

        });
    })




})