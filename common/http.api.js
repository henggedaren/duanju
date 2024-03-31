/*
接口统一管理配置
*/
import config from '@/common/environment.js';
const  BASE_API = config.BASE_API;
const install = (Vue, vm) => {
	// 将各个定义的接口名称，统一放进对象挂载到vm.$u.api(因为vm就是this，也即this.$u.api)下
	const sys = {
		getRankList: (params = {}) => vm.$u.post(BASE_API + 'search/getRankList', params),
		
		getSearch: (params = {}) => vm.$u.post(BASE_API + 'search/search', params),
		getDetail: (params = {}) => vm.$u.post(BASE_API + 'search/getDetail', params),
		contact: (params = {}) => vm.$u.post(BASE_API + 'search/contact', params),
		save: (params = {}) => vm.$u.post(BASE_API + 'search/save', params),
		
		createAd: (params = {}) => vm.$u.post(BASE_API + 'ad/createAd', params),
		checkAd: (params = {}) => vm.$u.post(BASE_API + 'ad/checkAd', params),
		completeAd: (params = {}) => vm.$u.post(BASE_API + 'ad/completeAd', params),
	}
	vm.$u.api = {sys};
}

export default {
	install
}