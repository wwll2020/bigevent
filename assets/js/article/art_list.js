$(function() {
    var layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage;
    //定义美化时间的过滤器
    template.defaults.imports.dataFormat = function(date) {
            const dt = new Date(date)

            var y = dt.getFullYear()
            var m = padZero(dt.getMonth() + 1)
            var d = padZero(dt.getDate())

            var hh = padZero(dt.getHours())
            var mm = padZero(dt.getMinutes())
            var ss = padZero(dt.getSeconds())
            return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
        }
        //定义补零函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }

    //定义一个查询的参数对象，将来请求数据的时候，需要将请求参数对象提交到服务器
    var q = {
        pagenum: 1, //页码值
        pagesize: 2, //默认每页显示几条数据
        cate_id: '', //文章分类的id
        state: '' //文章发布的动态
    }
    initTable()
    initCate()
        // 获取文章列表数据的方法
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function(res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败！')
                }
                // 使用模板引擎渲染页面的数据
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
                rederPages(res.total)
            }
        })
    }

    //初始化文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg('初始化文章分类失败！')
                }
                //调用模板引擎渲染分类的可选项
                var htmStr = template('tpl-cate', res)
                    // console.log(htmStr);
                $('[name=cate_id]').html(htmStr)
                    //通知layui 希望重新渲染表单 调用 form.render() 方法
                form.render()
            }
        })
    }

    //为筛选表单绑定submit事件
    $('#form-search').on('submit', function(e) {
        e.preventDefault()
            //获取表单选中项的值
        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()
            //为查询参数q中对应的属性赋值
        q.cate_id = cate_id
        q.state = state
            //根据最新的筛选条件，重新渲染页面
        initTable()
    })

    //定义渲染分页的方法
    function rederPages(total) {
        // console.log(total);
        // laypage.render()方法渲染分页结构
        laypage.render({
            elem: 'pageBox', //分页容器的Id
            count: total, //总条数
            limit: q.pagesize, //每页显示几条数据
            curr: q.pagenum, //设置默认被选中的页数
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            //jump 分页发生切换触发回调
            jump: function(obj, first) {
                //obj包含了当前分页的所有参数，比如：
                //console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
                q.pagenum = obj.curr; //最新的页码值
                // console.log(obj.limit) //得到每页显示的条数
                q.pagesize = obj.limit
                    //首次不执行
                if (!first) {
                    initTable()
                }
            }
        });
    }


    //编辑点击事件
    $('tbody').on('click', '#btn-edit', function(e) {
        e.preventDefault()
        location.href = "../article/art_pub.html"


    })


    //通过代理 为删除按钮绑定点击事件
    $('tbody').on('click', '#btn-delete', function() {
        //获取删除按钮的个数，根据按钮个数判断当前页是否有数据
        var len = $('.btn-delete').length
            //  console.log(len);//0
            //获取到文章的id
        var id = $(this).attr('data-id')
            //询问是否确认删除
        layer.confirm('确认删除?', function(index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function(res) {
                    // console.log(res);
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败！')
                    }
                    layer.msg('删除文章成功！');
                    // 当数据删除完成后，需要判断当前这一页中，是否还有剩余的数据,如果没有剩余的据了,则让页码值 -1 之后,再重新调用 initTable 方法
                    if (len === 1) {
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }



                    initTable()
                }
            })
            layer.close(index);
        });










    })










})