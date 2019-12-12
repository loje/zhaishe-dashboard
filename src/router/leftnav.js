const leftRoutes = [
  {
    path: '/home',
    name: '首页',
    meta: { menu: true, keepAlive: true },
    component: () => import('@/views/Home/index'),
  },
  {
    path: '/activity',
    name: '活动管理',
    meta: { menu: true, keepAlive: true },
    component: () => import('@/components/Black'),
    children: [
      {
        path: '/activity',
        name: '活动列表',
        component: () => import('@/views/Activity/index'),
        meta: { menu: true, keepAlive: true },
      },
      {
        path: '/activity/pulish',
        name: '发布活动',
        component: () => import('@/views/Activity/Pulish'),
        meta: { menu: false },
      },
      {
        path: '/activity/applicants',
        name: '所有报名记录',
        component: () => import('@/views/Activity/Applicants'),
        meta: { menu: false, keepAlive: true },
      },
      {
        path: '/activity/audit',
        name: '审核报名',
        component: () => import('@/views/Activity/Audit'),
        meta: { menu: false },
      },
      {
        path: '/activity/channel',
        name: '渠道',
        component: () => import('@/views/Activity/Channel'),
        meta: { menu: true, keepAlive: true },
      },
      {
        path: '/activity/channel/item',
        name: '渠道',
        component: () => import('@/views/Activity/ChannelView'),
        meta: { menu: false },
      },
      {
        path: '/activity/statistical',
        name: '统计',
        meta: { menu: false, keepAlive: true },
      },
    ],
  },
  {
    path: '/product',
    name: '代理产品',
    meta: { menu: true, keepAlive: true },
    component: () => import('@/components/Black'),
    children: [
      {
        path: '/product/index',
        name: '产品列表',
        component: () => import('@/views/Product/index'),
        meta: { menu: true, keepAlive: true },
      },
      {
        path: '/product/buyers',
        name: '管理购买人',
        meta: { menu: false },
      },
    ],
  },
  {
    path: '/download',
    name: '资源管理',
    meta: { menu: true, keepAlive: true },
    component: () => import('@/components/Black'),
    children: [
      {
        path: '/list',
        name: '资源列表',
        component: () => import('@/views/Download/index'),
        meta: { menu: true },
      },
    ],
  },
  {
    path: '/member',
    name: '会员管理',
    meta: { menu: true, keepAlive: true },
    component: () => import('@/components/Black'),
    children: [
      {
        path: '/member',
        name: '会员列表',
        component: () => import('@/views/Member/index'),
        meta: { menu: true },
      },
      {
        path: '/member/item',
        name: '添加会员',
        component: () => import('@/views/Member/Item'),
        meta: { menu: false },
      },
    ],
  },
  {
    path: '/material',
    name: '素材管理',
    meta: { menu: false, keepAlive: true },
    component: () => import('@/components/Black'),
    children: [],
  },
  {
    path: '/master',
    name: '大咖管理',
    meta: { menu: false, keepAlive: true },
    component: () => import('@/components/Black'),
    children: [],
  },
  {
    path: '/system',
    name: '系统管理',
    meta: { menu: true, keepAlive: true },
    component: () => import('@/components/Black'),
    children: [
      {
        path: '/system/banner',
        name: 'Banner管理',
        component: () => import('@/views/System/Banner'),
        meta: { menu: true, keepAlive: true },
      },
      // {
      //   path: '/system/images',
      //   name: '网站图片',
      //   meta: { menu: true, keepAlive: true },
      //   component: () => import('@/views/System/Images'),
      // },
    ],
  },
];

export default leftRoutes