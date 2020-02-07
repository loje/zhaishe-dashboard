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
      // {
      //   path: '/activity/applicants',
      //   name: '所有报名记录',
      //   component: () => import('@/views/Activity/Applicants'),
      //   meta: { menu: false, keepAlive: true },
      // },
      {
        path: '/activity/audit',
        name: '审核报名',
        component: () => import('@/views/Activity/Audit'),
        meta: { menu: false },
      },
      {
        path: '/activity/channel',
        name: '渠道优惠',
        component: () => import('@/views/Activity/ActChannel'),
        meta: { menu: false },
      },
      // {
      //   path: '/activity/channel',
      //   name: '渠道',
      //   component: () => import('@/views/Activity/Channel'),
      //   meta: { menu: true, keepAlive: true },
      // },
      // {
      //   path: '/activity/channel/item',
      //   name: '渠道',
      //   component: () => import('@/views/Activity/ChannelView'),
      //   meta: { menu: false },
      // },
      // {
      //   path: '/activity/statistical',
      //   name: '统计',
      //   meta: { menu: false, keepAlive: true },
      // },
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
        path: '/product/item',
        name: '产品详情',
        component: () => import('@/views/Product/Item'),
        meta: { menu: false },
      },
      {
        path: '/product/buyers',
        name: '管理购买人',
        meta: { menu: false },
      },
      {
        path: '/product/order',
        name: '产品订单列表',
        component: () => import('@/views/Product/Order'),
        meta: { menu: true, keepAlive: true },
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
        path: '/download',
        name: '资源列表',
        component: () => import('@/views/Download/index'),
        meta: { menu: true, keepAlive: true },
      },
      {
        path: '/download/item',
        name: '添加资源',
        component: () => import('@/views/Download/Item'),
        meta: { menu: false },
      },
    ],
  },
  {
    path: '/designer',
    name: '严选人管理',
    meta: { menu: true, keepAlive: true },
    component: () => import('@/components/Black'),
    children: [
      {
        path: '/designer',
        name: '严选人列表',
        component: () => import('@/views/Designer/index'),
        meta: { menu: true, keepAlive: true },
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
        name: 'Banner广告管理',
        component: () => import('@/views/System/Banner'),
        meta: { menu: true, keepAlive: true },
      },
      {
        path: '/system/friend',
        name: '友情链接',
        component: () => import('@/views/System/FriendLink'),
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