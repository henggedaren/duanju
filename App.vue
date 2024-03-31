<script>
	export default {
		onLaunch: function() {
			// #ifdef MP
				this.updateManager();
			// #endif
			let sys = uni.getSystemInfoSync();
			let deviceId = sys.deviceId;
			this.$u.vuex('vuex_token', deviceId);
		},
		onShow: function(option) {
			console.log('global App Show',option);
		},
		onHide: function() {
			console.log('App Hide')
		},
		created() {
			
		},
		methods:{
			updateManager(){
				const updateManager = uni.getUpdateManager();
				if(!updateManager){
					return;
				}
				
				updateManager.onCheckForUpdate(function (res) {
				  // 请求完新版本信息的回调
				  console.log("是否有新版本",res.hasUpdate);
				});
				
				updateManager.onUpdateReady(function (res) {
				  uni.showModal({
				    title: '更新提示',
				    content: '新版本已经准备好，是否重启应用？',
				    success(res) {
				      if (res.confirm) {
				        // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
				        updateManager.applyUpdate();
				      }
				    }
				  });
				
				});
				
				updateManager.onUpdateFailed(function (res) {
					console.log('更新失败');
				});
			},
		}
	}
</script>

<style lang="scss">
	/* 注意要写在第一行，同时给style标签加入lang="scss"属性 */
	@import "uview-ui/index.scss";
</style>
