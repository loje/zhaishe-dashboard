import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'


var AV = require('leancloud-storage');
// var { Realtime } = require('leancloud-realtime'); // 若不使用即时通讯服务，则无需引入

AV.init({
  appId: "vwzM34pywVYeT0lY6G5KlSYM-gzGzoHsz",
  appKey: "3CTYBXJYIGsSrCGSD11E9p63",
  serverURLs: "https://api.zdesigner.cn"
});
Vue.prototype.$AV = AV;

import moment from 'moment'
Vue.prototype.$moment = moment

Vue.config.productionTip = false;

router.beforeEach((to, from, next) => {
  const userInfo = localStorage.getItem('userInfo');
  if (userInfo) {
    store.dispatch('getUser', JSON.parse(userInfo));
    next();
  } else {
    if (!localStorage.getItem('userInfo')) {
      if (to.path === '/login') {
        next();
      } else {
        next('/login');
      }
    } else {
      next();
    }
  } 
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')