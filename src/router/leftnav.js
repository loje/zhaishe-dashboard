const leftRoutes = [
  {
    path: '/activity',
    name: '活动管理',
    meta: { menu: true, keepAlive: true },
    component: () => import('@/views/Activity/index'),
    children: [
      {
        path: '/activity/pulish',
        name: '发布活动',
        component: () => import('@/views/Activity/Pulish'),
        meta: { menu: true, keepAlive: true },
      },
      {
        path: '/activity/applicants',
        name: '管理报名人',
        component: () => import('@/views/Activity/Applicants'),
        meta: { menu: true, keepAlive: true },
      },
      {
        path: '/activity/channel',
        name: '渠道',
        meta: { menu: true, keepAlive: true },
      },
      {
        path: '/activity/statistical',
        name: '统计',
        meta: { menu: true, keepAlive: true },
      },
    ],
  },
  {
    path: '/product',
    name: '代理产品',
    meta: { menu: true, keepAlive: true },
    children: [
      {
        path: '/product/item',
        name: '添加产品',
        meta: { menu: true, keepAlive: true },
      },
      {
        path: '/product/buyers',
        name: '管理购买人',
        meta: { menu: true, keepAlive: true },
      },
    ],
  },
  {
    path: '/member',
    name: '会员管理',
    meta: { menu: true, keepAlive: true },
    children: [
      {
        path: '/member/item',
        name: '添加会员',
        meta: { menu: true, keepAlive: true },
      },
    ],
  },
  {
    path: '/material',
    name: '素材管理',
    meta: { menu: true, keepAlive: true },
    children: [],
  },
  {
    path: '/master',
    name: '大咖管理',
    meta: { menu: true, keepAlive: true },
    children: [],
  },
  {
    path: '/system',
    name: '系统管理',
    meta: { menu: true, keepAlive: true },
    component: () => import('@/views/System/index'),
    children: [
      {
        path: '/system/images',
        name: '网站图片',
        component: () => import('@/views/System/Images'),
      },
    ],
  },
];

export default leftRoutes