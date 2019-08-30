// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import router from './router/index.js'
import App from './App'

import store from './store'
// 引入全局变量组件
import Global from '@/components/Global'
// 引入ajax
import axios from 'axios'
// import VueAxios from 'vue-axios'
import utils from './util/index'
import utilVue from './util/utilVue'
import api from './api/index'
// 引入fastClick，解决点击延迟
import  FastClick  from  'fastclick'
FastClick.attach(document.body);
FastClick.prototype.focus = function(targetElement) {
  var length;
  var ua = navigator.userAgent.toLowerCase();
	var isIOS = (/iphone|ipod|ipad/gi).test(navigator.userAgent);
	var isAndroid = ua.indexOf("android") >= 0;
  if (isIOS && targetElement.setSelectionRange && targetElement.type.indexOf('date') !== 0 && targetElement.type !== 'time' && targetElement.type !== 'month') {
    length = targetElement.value.length;
    targetElement.focus();
    targetElement.setSelectionRange(length, length);
  } else {
      targetElement.focus();
  }
};
// 引入图片懒加载
import VueLazyLoad from 'vue-lazyload'
//引入vconsole调试工具
import Vconsole from 'vconsole';
const vConsole = new Vconsole();
export default vConsole;

Vue.use(VueLazyLoad, {
  loading: require('./assets/image/default.png'),
  error:require('./assets/image/default.png'),
})
// vant组件
import { Button } from 'vant';
import { Tab, Tabs } from 'vant';
import { Tabbar, TabbarItem,DropdownMenu,DropdownItem } from 'vant';
import { Swipe, SwipeItem } from 'vant';
import { Row, Col } from 'vant';
import { Icon,List,Cell,
  CellGroup,Picker,
  DatetimePicker,PasswordInput,
  Field,Dialog,Circle ,Progress,
  Tag,RadioGroup,Radio} from 'vant';
import { NavBar } from 'vant';
import { Toast } from 'vant';
import { Popup } from 'vant';
import { Loading } from 'vant';
Vue.use(Button).use(Tab).use(Tabs).use(Tabbar).use(TabbarItem).use(Swipe).use(SwipeItem).use(Row).use(Col).use(Icon).use(NavBar).use(List).use(Cell).use(CellGroup).use(Popup).use(Picker).use(DatetimePicker).use(PasswordInput).use(Field).use(Dialog).use(Circle).use(Progress).use(Tag).use(RadioGroup).use(Radio).use(Loading).use(DropdownMenu).use(DropdownItem);

// Vue.use(axios);
Vue.prototype.$axios = axios;
// 全局变量
Vue.prototype.Global = Global;
// 公共方法函数
Vue.prototype.utils = utils;
Vue.use(utilVue);
// 接口地址
Vue.prototype.api = api;
// toast提示
Vue.prototype.Toast = Toast;

// 阻止启动生产消息
Vue.config.productionTip = false;
// 引入echarts
let echarts = require('echarts/lib/echarts');
Vue.prototype.$echarts = echarts;
// 引入饼状图
require('echarts/lib/chart/pie');
// 引入柱状图
// require('echarts/lib/chart/bar')
// require('echarts/lib/component/tooltip');
// require('echarts/lib/component/title');

// http request拦截器 添加一个请求拦截器
axios.interceptors.request.use(function (config) {
  if (store.state.token) {
      config.headers.accessToken = store.state.token;
      config.headers.imei = store.state.imei;
      config.headers.project = store.state.project;
  }
  console.log(config.headers,11111);
  return config;
}, function (error) {
  return Promise.reject(error);
});

// 路由切换
// router.beforeEach((to,from,next)=>{
//   if (to.name === "GraduateSummary" || to.name === "RegistrationManual") {
//     if (!store.state.currentDepartment) {
//       Toast("当前没有轮转科室");
//       return;
//     }
//   }
//   next();
// });

// 懒加载报错时,重新加载该页面
router.onError((error) => {
  const pattern = /Loading chunk (d)+ failed/g;
  const isChunkLoadFailed = error.message.match(pattern);
  const targetPath = router.history.pending.fullPath;
  if (isChunkLoadFailed) {
   router.replace(targetPath);
  }
});

// 引入原生交互
import {
  AppCallBacks,
  AppCommendBackHandlers,
  AppCommendKeyboardBounceUp,
  AppMsgHandlers
} from './webApp/AppMsgHandlers'

import webApp from './webApp/index'

Vue.prototype.webApp = webApp;
Vue.prototype.WebBack = AppCommendBackHandlers;
Vue.prototype.Keyboar = AppCommendKeyboardBounceUp;

console.log(store);
new Vue({
  el: '#app',
  components: { App },
  store,
  template: '<App/>',
  router,
});
