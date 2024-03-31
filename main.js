import Vue from 'vue'
import App from './App'
// 引入uview前端框架
import uView from "uview-ui";
Vue.use(uView);

import globalUtil from "@/util/util.js";
Vue.prototype.globalUtil = globalUtil;

// vuex管理全局变量 vuex状态交给uview的模式管理
let vuexStore = require("@/store/$u.mixin.js");
Vue.mixin(vuexStore);

import store from '@/store';
Vue.config.productionTip = false

// 全局组件
App.mpType = 'app'
const app = new Vue({
	store,
    ...App
})
// http拦截器，将此部分放在new Vue()和app.$mount()之间，才能App.vue中正常使用
import httpInterceptor from '@/common/http.interceptor.js';
Vue.use(httpInterceptor, app);

// http接口API抽离，免于写url或者一些固定的参数
import httpApi from '@/common/http.api.js';
Vue.use(httpApi, app);

app.$mount()
