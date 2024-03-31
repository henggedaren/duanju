import config from '@/common/environment.js';

// 这里的vm，就是我们在vue文件里面的this，所以我们能在这里获取vuex的变量，比如存放在里面的token
// 同时，我们也可以在此使用getApp().globalData，如果你把token放在getApp().globalData的话，也是可以使用的
const install = (Vue, vm) => {
	Vue.prototype.$u.http.setConfig({
		method: 'POST',
		dataType: 'json',
		showLoading: true,
		loadingText: '请求中...', // 请求loading中的文字提示
		loadingTime: 800, // 在此时间内，请求还没回来的话，就显示加载中动画，单位ms
		loadingMask: true, // 展示loading的时候，是否给一个透明的蒙层，防止触摸穿透
		// 如果将此值设置为true，拦截回调中将会返回服务端返回的所有数据response，而不是response.data
		// 设置为true后，就需要在this.$u.http.interceptor.response进行多一次的判断，请打印查看具体值
		 originalData: true, 
		// 设置自定义头部content-type
		header: {
			"content-type": "application/json;charset=UTF-8",
			"Accept" : "application/json,text/x-json,application/jsonrequest,text/json",
			"X-Requested-With" : "xmlhttprequest",
		}
	});
	// 请求拦截，配置Token等参数
	Vue.prototype.$u.http.interceptor.request = (config) => {
		config.header.UserToken = vm.vuex_token;
		//console.log("config",config);
		return config; 
	}
	// 响应拦截，判断状态码是否通过
	Vue.prototype.$u.http.interceptor.response = (res) => {
		// 如果把originalData设置为了true，这里得到将会是服务器返回的所有的原始数据
		// 判断可能变成了res.statueCode，或者res.data.code之类的，请打印查看结果
		// console.log("响应体response",res);
		let responseCode = res.statusCode;
		if(responseCode == 200) {
			return res.data;  
		}
		else{
			console.log("响应失败response:",res);
			vm.globalUtil.utilAlert('请求失败');
			return false;
		} 
	}
}

export default {
	install
}