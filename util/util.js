function utilAlert(msg, iconType = 'none') {
    uni.showToast({
        title: msg == null ? "" : msg,
        icon: iconType,
        duration: 1500
    });
    return;
};

function utilLoading(tip,mask){
    uni.showLoading({
        title: tip ? tip : '加载中',
        mask : mask ? mask : false
    });

    setTimeout(function (){
		uni.hideLoading();
    },10000)
};

function clearVuex(that){
	console.log("清除缓存");
	that.$u.vuex('vuex_token','');
	uni.clearStorageSync();
};

function clearStorageVuex(that){
	utilAlert("清除成功");
};

// 复制方法
function copy(content, display = true){
	// 复制内容，必须字符串，数字需要转换为字符串
	content = typeof content === 'string' ? content : content.toString();
	//#ifndef H5
	uni.setClipboardData({
		data: content,
		success: function() {
			display ? utilAlert(`复制成功 ${content}`) : utilAlert('复制成功');
		},
		fail:function(){
			utilAlert('复制失败');
		}
	});
	//#endif
	// #ifdef H5
	if (!document.queryCommandSupported('copy')) {
		utilAlert('浏览器不支持');
	}
	let textarea = document.createElement("textarea")
	textarea.value = content
	textarea.readOnly = "readOnly"
	document.body.appendChild(textarea)
	textarea.select() // 选择对象
	textarea.setSelectionRange(0, content.length) //核心
	let result = document.execCommand("copy") // 执行浏览器复制命令
	if(result){
		display ? utilAlert(`复制成功 ${content}`) : utilAlert('复制成功');
	}else{
		utilAlert('复制失败');
	}	
	textarea.remove()
	// #endif
};

// 解析链接中的参数
function getQueryString(url, name) {
	var reg = new RegExp('(^|&|/?)' + name + '=([^&|/?]*)(&|/?|$)', 'i')
	var r = url.substr(1).match(reg);
	if (r != null) {
		return r[2]
	}
	return null;
}

// 设置本地缓存
function setStorage(_key,t){
	// 写入缓存
	const currentTime = new Date().getTime();
	uni.setStorage({
		key: _key,
		data: currentTime + (10 * 60 * 1000),
		expires: currentTime + t,
		success: function () {
			console.log('cache success');
		}
	});
}

function getFromLogo(type){
	switch(type){
		case 0:
			return '/static/icon/quark.png';
			break;
		case 1:
			return '/static/icon/baidu.png';
			break;
		case 2:
			return '/static/icon/aliyun.png';
			break;
		case 3:
			return '/static/icon/xunlei.png';
			break;
		case 4:
			return '/static/icon/uc.png';
			break;		
		default:
			return '';
	}
}

function getSettingShare(payload) {
	var pages = getCurrentPages();
	var page = pages[pages.length - 1];
	var share = {
		title: '爱看短剧，搜一下，全都有',
		path:  '/pages/index/index'
	}
	switch (page.route){
		case 'pages/search/detail':
			share.title = `「${payload.name}」`
			share.path = "/pages/index/index?path=" + encodeURIComponent(`/pages/search/detail?id=${page.options.id}`)
			break;
		default:
			break;
	}
	return share
}

module.exports = {
	utilAlert: function (msg, iconType) {
		return utilAlert(msg, iconType);
	},
	utilLoading:function (tip,mask){
	    return utilLoading(tip, mask);
	},
	clearVuex:function(that){
		return clearVuex(that);
	},
	clearStorageVuex:function(that){
		return clearStorageVuex(that);
	},
	copy:function(content, display = true){
		copy(content, display);
	},
	getQueryString:function(url, name){
		return getQueryString(url, name);
	},
	setStorage:function(key,t){
		return setStorage(key,t);
	},
	getFromLogo:function(type){
		return getFromLogo(type)
	},
	getSettingShare: function(payload){
		return getSettingShare(payload)
	}
}	
