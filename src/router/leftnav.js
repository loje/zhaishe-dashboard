const leftRoutes = [
  {
    path: '',
    name: '活动管理',
    meta: { menu: true, keepAlive: true },
    children: [
      {
        path: '',
        name: '审核报名',
        meta: { menu: true, keepAlive: true },
      },
      {
        path: '',
        name: '管理报名人',
        meta: { menu: true, keepAlive: true },
      },
    ],
  },
  {
    path: '',
    name: '代理产品',
    meta: { menu: true, keepAlive: true },
    children: [
      {
        path: '',
        name: '添加产品',
        meta: { menu: true, keepAlive: true },
      },
      {
        path: '',
        name: '管理购买人',
        meta: { menu: true, keepAlive: true },
      },
    ],
  },
  {
    path: '',
    name: '会员管理',
    meta: { menu: true, keepAlive: true },
    children: [
      {
        path: '',
        name: '添加会员',
        meta: { menu: true, keepAlive: true },
      },
    ],
  },
  {
    path: '',
    name: '素材管理',
    meta: { menu: true, keepAlive: true },
    children: [],
  },
  {
    path: '',
    name: '大咖管理',
    meta: { menu: true, keepAlive: true },
    children: [],
  },
];

export default leftRoutes