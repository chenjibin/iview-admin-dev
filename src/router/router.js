import Main from '@/views/Main.vue';

// 不作为Main组件的子页面展示的页面单独写，如下
export const loginRouter = {
    path: '/login',
    name: 'login',
    meta: {
        title: 'Login - 登录'
    },
    component: resolve => { require(['@/views/login.vue'], resolve); }
};

export const page404 = {
    path: '/*',
    name: 'error-404',
    meta: {
        title: '404-页面不存在'
    },
    component: resolve => { require(['@/views/error-page/404.vue'], resolve); }
};

export const page403 = {
    path: '/403',
    meta: {
        title: '403-权限不足'
    },
    name: 'error-403',
    component: resolve => { require(['@//views/error-page/403.vue'], resolve); }
};

export const page500 = {
    path: '/500',
    meta: {
        title: '500-服务端错误'
    },
    name: 'error-500',
    component: resolve => { require(['@/views/error-page/500.vue'], resolve); }
};

export const preview = {
    path: '/preview',
    name: 'preview',
    component: resolve => { require(['@/views/form/article-publish/preview.vue'], resolve); }
};

export const locking = {
    path: '/locking',
    name: 'locking',
    component: resolve => { require(['@/views/main-components/lockscreen/components/locking-page.vue'], resolve); }
};

// 作为Main组件的子页面展示但是不在左侧菜单显示的路由写在otherRouter里
export const otherRouter = {
    path: '/',
    name: 'otherRouter',
    redirect: '/home',
    component: Main,
    children: [
        {
            path: 'home',
            title: {i18n: 'home'},
            name: 'home_index',
            component: resolve => { require(['@/pages/home/home.vue'], resolve); }
        },
        {
            path: 'myLog',
            title: '我的日志',
            name: 'myLog',
            component: resolve => { require(['@/pages/logManage/myLog.vue'], resolve); }
        },
        {
            path: 'myAttendance',
            title: '我的考勤',
            name: 'myAttendance',
            component: resolve => { require(['@/pages/myAttendance/myAttendance.vue'], resolve); }
        },
        {
            path: 'myLeave',
            title: '我的请假',
            name: 'myLeave',
            component: resolve => { require(['@/pages/myLeave/myLeave.vue'], resolve); }
        },
        {
            path: 'myArrange',
            title: '我的排班',
            name: 'myArrange',
            component: resolve => { require(['@/pages/myArrange/myArrange.vue'], resolve); }
        },
        {
            path: 'ownspace',
            title: '个人中心',
            name: 'ownspace_index',
            component: resolve => { require(['@/views/own-space/own-space.vue'], resolve); }
        },
        {
            path: 'order/:order_id',
            title: '订单详情',
            name: 'order-info',
            component: resolve => { require(['@/views/advanced-router/component/order-info.vue'], resolve); }
        }, // 用于展示动态路由
        {
            path: 'shopping',
            title: '购物详情',
            name: 'shopping',
            component: resolve => { require(['@/views/advanced-router/component/shopping-info.vue'], resolve); }
        }, // 用于展示带参路由
        { path: 'message', title: '消息中心', name: 'message_index', component: resolve => { require(['@/views/message/message.vue'], resolve); } }
    ]
};

// 作为Main组件的子页面展示并且在左侧菜单显示的路由写在appRouter里
export const appRouter = [
    {
        path: '/logManage',
        icon: 'compose',
        name: 'logManage',
        title: '工作日志管理',
        component: Main,
        children: [
            {
                path: 'elogManage',
                icon: 'compose',
                name: 'elogManage',
                title: '员工日志管理',
                component: resolve => { require(['@/pages/logManage/logManage.vue'], resolve); }
            },
            {
                path: 'logTotal',
                icon: 'compose',
                name: 'logTotal',
                title: '日志统计',
                component: resolve => { require(['@/pages/logManage/logTotal.vue'], resolve); }
            }
        ]
    },
    {
        path: '/personnelManage',
        icon: 'ios-folder-outline',
        name: 'personnelManage',
        title: '人事档案管理',
        component: Main,
        children: [
            {
                path: 'attendanceManage',
                icon: 'compose',
                name: 'attendanceManage',
                title: '考勤管理',
                component: resolve => { require(['@/pages/attendanceManage/attendanceManage.vue'], resolve); }
            },
            {
                path: 'employeeLeave',
                icon: 'compose',
                name: 'employeeLeave',
                title: '请假审批',
                component: resolve => { require(['@/pages/employeeLeave/employeeLeave.vue'], resolve); }
            },
            {
                path: 'leaveManage',
                icon: 'compose',
                name: 'leaveManage',
                title: '请假管理',
                component: resolve => { require(['@/pages/leaveManage/leaveManage.vue'], resolve); }
            },
            {
                path: 'depAttendance',
                icon: 'compose',
                name: 'depAttendance',
                title: '部门考勤',
                component: resolve => { require(['@/pages/depAttendance/depAttendance.vue'], resolve); }
            },
            {
                path: 'depArrange',
                icon: 'compose',
                name: 'depArrange',
                title: '部门排班信息',
                component: resolve => { require(['@/pages/depArrange/depArrange.vue'], resolve); }
            },
            {
                path: 'employeeFile',
                icon: 'compose',
                name: 'employeeFile',
                title: '员工档案',
                component: resolve => { require(['@/pages/employeeFile/employeeFile.vue'], resolve); }
            }
        ]
    },
    {
        path: '/systemManage',
        icon: 'ios-gear',
        name: 'systemManage',
        title: '系统管理',
        component: Main,
        children: [
            {
                path: 'organizationManage',
                icon: 'compose',
                name: 'organizationManage',
                title: '组织管理',
                component: resolve => { require(['@/pages/organizationManage/organizationManage.vue'], resolve); }
            },
            {
                path: 'roleManage',
                icon: 'compose',
                name: 'roleManage',
                title: '角色管理',
                component: resolve => { require(['@/pages/roleManage/roleManage.vue'], resolve); }
            },
            {
                path: 'levelManage',
                icon: 'compose',
                name: 'levelManage',
                title: '职级管理',
                component: resolve => { require(['@/pages/levelManage/levelManage.vue'], resolve); }
            },
            {
                path: 'employeeManage',
                icon: 'compose',
                name: 'employeeManage',
                title: '用户管理',
                component: resolve => { require(['@/pages/employeeManage/employeeManage.vue'], resolve); }
            },
            {
                path: 'postManage',
                icon: 'compose',
                name: 'postManage',
                title: '岗位管理',
                component: resolve => { require(['@/pages/postManage/postManage.vue'], resolve); }
            },
            {
                path: 'noticeManage',
                icon: 'compose',
                name: 'noticeManage',
                title: '公告管理',
                component: resolve => { require(['@/pages/noticeManage/noticeManage.vue'], resolve); }
            }
        ]
    },
    {
        path: '/access',
        icon: 'key',
        name: 'access',
        title: '权限管理',
        component: Main,
        children: [
            { path: 'index', title: '权限管理', name: 'access_index', component: resolve => { require(['@/views/access/access.vue'], resolve); } }
        ]
    },
    {
        path: '/access-test',
        icon: 'lock-combination',
        title: '权限测试页',
        name: 'accesstest',
        access: 0,
        component: Main,
        children: [
            { path: 'index', title: '权限测试页', name: 'accesstest_index', access: 0, component: resolve => { require(['@/views/access/access-test.vue'], resolve); } }
        ]
    },
    {
        path: '/international',
        icon: 'earth',
        title: {i18n: 'international'},
        name: 'international',
        component: Main,
        children: [
            { path: 'index', title: {i18n: 'international'}, name: 'international_index', component: resolve => { require(['@/views/international/international.vue'], resolve); } }
        ]
    },
    {
        path: '/component',
        icon: 'social-buffer',
        name: 'component',
        title: '组件',
        component: Main,
        children: [
            {
                path: 'text-editor',
                icon: 'compose',
                name: 'text-editor',
                title: '富文本编辑器',
                component: resolve => { require(['@/views/my-components/text-editor/text-editor.vue'], resolve); }
            },
            {
                path: 'md-editor',
                icon: 'pound',
                name: 'md-editor',
                title: 'Markdown编辑器',
                component: resolve => { require(['@/views/my-components/markdown-editor/markdown-editor.vue'], resolve); }
            },
            {
                path: 'image-editor',
                icon: 'crop',
                name: 'image-editor',
                title: '图片预览编辑',
                component: resolve => { require(['@/views/my-components/image-editor/image-editor.vue'], resolve); }
            },
            {
                path: 'draggable-list',
                icon: 'arrow-move',
                name: 'draggable-list',
                title: '可拖拽列表',
                component: resolve => { require(['@/views/my-components/draggable-list/draggable-list.vue'], resolve); }
            },
            {
                path: 'area-linkage',
                icon: 'ios-more',
                name: 'area-linkage',
                title: '城市级联',
                component: resolve => { require(['@/views/my-components/area-linkage/area-linkage.vue'], resolve); }
            },
            {
                path: 'file-upload',
                icon: 'android-upload',
                name: 'file-upload',
                title: '文件上传',
                component: resolve => { require(['@/views/my-components/file-upload/file-upload.vue'], resolve); }
            },
            {
                path: 'count-to',
                icon: 'arrow-graph-up-right',
                name: 'count-to',
                title: '数字渐变',
                component: resolve => { require(['@/views/my-components/count-to/count-to.vue'], resolve); }
            }
        ]
    },
    {
        path: '/form',
        icon: 'android-checkbox',
        name: 'form',
        title: '表单编辑',
        component: Main,
        children: [
            { path: 'artical-publish', title: '文章发布', name: 'artical-publish', icon: 'compose', component: resolve => { require(['@/views/form/article-publish/article-publish.vue'], resolve); } },
            { path: 'workflow', title: '工作流', name: 'workflow', icon: 'arrow-swap', component: resolve => { require(['@/views/form/work-flow/work-flow.vue'], resolve); } }
        ]
    },
    {
        path: '/tables',
        icon: 'ios-grid-view',
        name: 'tables',
        title: '表格',
        component: Main,
        children: [
            { path: 'dragableTable', title: '可拖拽排序', name: 'dragable-table', icon: 'arrow-move', component: resolve => { require(['@/views/tables/dragable-table.vue'], resolve); } },
            { path: 'editableTable', title: '可编辑表格', name: 'editable-table', icon: 'edit', component: resolve => { require(['@/views/tables/editable-table.vue'], resolve); } },
            { path: 'searchableTable', title: '可搜索表格', name: 'searchable-table', icon: 'search', component: resolve => { require(['@/views/tables/searchable-table.vue'], resolve); } },
            { path: 'exportableTable', title: '表格导出数据', name: 'exportable-table', icon: 'code-download', component: resolve => { require(['@/views/tables/exportable-table.vue'], resolve); } },
            { path: 'table2image', title: '表格转图片', name: 'table-to-image', icon: 'images', component: resolve => { require(['@/views/tables/table-to-image.vue'], resolve); } }
        ]
    },
    {
        path: '/advanced-router',
        icon: 'ios-infinite',
        name: 'advanced-router',
        title: '高级路由',
        component: Main,
        children: [
            { path: 'mutative-router', title: '动态路由', name: 'mutative-router', icon: 'link', component: resolve => { require(['@/views/advanced-router/mutative-router.vue'], resolve); } },
            { path: 'argument-page', title: '带参页面', name: 'argument-page', icon: 'android-send', component: resolve => { require(['@/views/advanced-router/argument-page.vue'], resolve); } }
        ]
    },
    {
        path: '/error-page',
        icon: 'android-sad',
        title: '错误页面',
        name: 'errorpage',
        component: Main,
        children: [
            { path: 'index', title: '错误页面', name: 'errorpage_index', component: resolve => { require(['@/views/error-page/error-page.vue'], resolve); } }
        ]
    }
];

// 所有上面定义的路由都要写在下面的routers里
export const routers = [
    loginRouter,
    otherRouter,
    preview,
    locking,
    // ...appRouter,
    page500,
    page403
    // page404
];
