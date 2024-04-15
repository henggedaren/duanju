<template>
	<view class="wrapper">
		<view class="detail">
			<view class="detail-item">
				<view class="detail-item-name">
					资源名称
				</view>
				<view class="detail-item-value">
					<text >{{detail.name}}</text>
				</view>
			</view>
			<view class="detail-item">
				<view class="detail-item-name">
					资源链接
					<text v-if="detail.type == 1">（长按可复制）</text>
				</view>
				<view class="detail-item-value url">
					<view v-if="detail.type == 0">
						<!-- #ifdef MP-WEIXIN -->
						<button type="primary" :plain="false" size="mini" @click="showModel()">
							点击免费获取
						</button>
						<!-- #endif -->
						<!-- #ifndef MP-WEIXIN -->
						<button type="primary" :plain="false" size="mini" @click="showModel()">
							点击免费获取
						</button>
						<!-- #endif -->
					</view>
					<view v-if="detail.type == 1" @longtap="globalUtil.copy(detail.url,false)">
						<!-- #ifdef H5 -->
						<a :href= "detail.url" target="_blank" >{{detail.url}}</a>
						<!-- #endif -->
						<!-- #ifndef H5 -->
						<text >{{detail.url}}</text>
						<!-- #endif -->
					</view>
				</view>
			</view>
			<view class="detail-item">
				<view class="detail-item-name">
					分享日期
				</view>
				<view class="detail-item-value">
					<text >{{detail.share_time}}</text>
				</view>
			</view>
			<view class="detail-info">
				<view class="detail-info-from">
					<image :src="globalUtil.getFromLogo(detail.from_type)" mode="" class="detail-info-from-logo"></image>
					{{detail.from_name}}
				</view>
			</view>
		</view>
		<view class="copyright">
			<view class="component">
				本信息来源于网络，如有侵权请
				<view class="component-con" @click="contact">
					点击反馈
				</view>
			</view>
		</view>
		<view class="func">
			<!-- #ifdef MP -->
			<button plain class="func-share" open-type="share">
				分享给好友
			</button>
			<!-- #endif -->
			<!-- #ifdef H5 -->
			<button plain class="func-share" @click="copyUrl()">
				分享给好友
			</button>
			<!-- #endif -->
			
		</view>
		
		<u-modal @confirm="showAdModel()" 
		v-model="show" 
		:content="content" 
		:show-cancel-button="true"
		></u-modal>
		
		<u-modal @confirm="endAd()" 
		v-model="adShow" 
		title="请使用手机微信扫码观看广告" 
		confirm-text="我已看完并关闭广告"
		:async-close="true"
		ref="uModal"
		>
			<view class="slot-content" style="margin: 20px;">
				<rich-text :nodes="adContent"></rich-text>
			</view>
		</u-modal>
	</view>
</template>

<script>
	// #ifdef MP-WEIXIN
	import config from '@/common/environment.js';
	const  VIDEO_AD_ID = config.VIDEO_AD_ID;
	let videoAd = null;
	// #endif
	
	let timer = null;
	export default {
		data() {
			return {
				id: '',
				detail: {},
				
				show: false,
				content: '根据分享者设置，查看链接需要使用手机微信扫码观看激励视频广告后方可显示，是否继续？',
				adShow: false,
				adDesc: `
						<p style="font-size:12px">1.激励视频广告需播放完毕才能得到激励。播放时长由微信控制。</p>
						<p style="font-size:12px">2.广告填充由微信设定。短时间看太多广告会造成无填充，此时请稍后再看或换个微信来扫码。</p>
						<p style="font-size:12px">3.每个资源观看广告完一次可于24小时内免看广告。</p>
				`,
				adContent: '',
				request_id: '',
				
				rewardedVideoAdLoaded: false,
				videoAdOption: {},
			};
		},
		onLoad(e) {
			this.id = e.id || ''
			this.getDetail()
		},
		onReady() {
			// #ifdef MP-WEIXIN
			if(VIDEO_AD_ID){
				let that = this;
				// 延迟执行
				setTimeout(function(){
					that.videoAdOption = {
					   adUnitId: VIDEO_AD_ID
					};
					that.createVideoAd();
				}, 500)
			}
			// #endif
		},
		methods:{
			getDetail(){
				let that = this;
				that.$u.api.sys.getDetail({"id":this.id}).then(res => {
					console.log('getDetail success',res);
					if(res.code === 0){
						uni.showToast({
							title: res.msg,
							icon : 'none'
						})
						return false;
					}
					
					that.detail = res.data;
				});
			},
			showModel(){
				// #ifdef MP-WEIXIN
				if(VIDEO_AD_ID && this.rewardedVideoAdLoaded === true){
					this.showVideoAd();
				}else{
					this.show = true;
				}
				// #endif
				// #ifndef MP-WEIXIN
				this.show = true;
				// #endif
			},
			showAdModel(){
				uni.showLoading({
					title: '拉取中~',
					mask: true
				})
				
				let that = this;
				that.$u.api.sys.createAd({"join_id": this.id}).then(res => {
					uni.hideLoading();
					
					console.log('createAd success',res);
					if(res.code === 0){
						uni.showToast({
							title: res.msg,
							icon : 'none'
						})
						return false;
					}
					
					// 显示图片
					that.adShow = true;
					that.request_id = res.data.request_id;
					let content = `<div style="text-align: center;"> <img style="width:200px;height:200px" src="` + res.data.img +`" /> </div>` + that.adDesc;
					that.adContent = content;
					
					// 定时检测
					timer = setInterval(() => {
						that.endAd(false);
					}, 1000);
				});
			},
			async checkAd(){
				let res = await this.$u.api.sys.checkAd({"request_id": this.request_id});
				return res;
			},
			endAd(is_msg = true){
				let that = this;
				this.checkAd().then(res => {
					if(res.code == 0){
						if(is_msg){
							uni.showToast({
								title: '您尚未完成观看奖励广告，请先使用手机微信扫码打开微信小程序并观看广告',
								icon : 'none'
							})
							that.$refs.uModal.clearLoading();
						}
						return false;
					}
					
					uni.showToast({
						title: res.msg,
						icon : 'none'
					})
					that.clearTimer();
					that.adShow = false;
					that.getDetail();
				});
			},
			contact(){
				this.$u.api.sys.contact({"id":this.id}).then(res => {
					uni.showToast({
						title: res.msg,
						icon : 'none'
					})
					return false;
				});
			},
			clearTimer() {
				if (timer) {
					clearInterval(timer);
					timer = null;
				}
			},
			createVideoAd(){
				let that = this;
				videoAd = uni.createRewardedVideoAd(this.videoAdOption)
				videoAd.onLoad(() => {
					that.rewardedVideoAdLoaded = true;
					uni.hideLoading();
					console.log('激励 视频加载成功');
				})
				videoAd.onError((err) => {
					// 广告组件出现错误
					that.rewardedVideoAdLoaded = false;
					that.globalUtil.utilAlert("激励广告填充失败");
					console.log('激励 视频加载失败',err)
				})
				videoAd.onClose((res) => {
					if (res && res.isEnded || res === undefined) {
						// 正常播放结束，下发奖励
						console.log('正常播放结束，下发奖励');
						that.completeAd();
					} else {
						// 播放中途退出，进行提示
						console.log('中途退出')
						that.globalUtil.utilAlert("请完整观看哦");
					}
					uni.hideLoading();
					console.log('激励 视频关闭')
				})
			},
			showVideoAd(){
				videoAd.show()
				.catch(() => {
					console.log('重新加载广告');
				    videoAd.load()
				    .then(() => videoAd.show())
				    .catch(err => {
						console.log('激励视频 广告显示失败');
						this.globalUtil.utilAlert("广告拉取失败,请稍后重试~");
				    })
				})
			},
			completeAd(){
				this.$u.api.sys.completeAd({"join_id":this.id}).then(res => {
					uni.showToast({
						title: res.msg,
						icon : 'none'
					})
					if(res.code == 1){
						this.getDetail();
					}
					return false;
				});
			},
			copyUrl(){
				this.globalUtil.copy(window.location.href,false)
			}
		},
		onUnload(){
			this.clearTimer();
			// #ifdef MP-WEIXIN
			if(videoAd){
				videoAd.destroy();
			}
			// #endif
		},
		onShareAppMessage(){
			return this.globalUtil.getSettingShare(this.detail)
		},
		onShareTimeline(){
			return this.globalUtil.getSettingShare(this.detail)
		},
	}
</script>

<style lang="scss">
	page {
		background-color: #f7f7f7;
	}
	.wrapper{
		.detail{
			margin: 30rpx;
			padding: 20rpx;
			background-color: #ffffff;
			border-radius: 18rpx;
			position: relative;
			&-item{
				margin-bottom: 30rpx;
				&-name{
					font-size: 30rpx;
					color: rgba(43, 63, 104, 0.75);
				}
				&-value{
					margin-top: 20rpx;
					display: flex;
					align-items: center;
					padding: 30rpx;
					border-radius: 18rpx;
					background-color: #F5F6F5;
					word-break: break-all;
					&.url{
						color: #1e80ff;
					}
				}
			}
			&-info{
				margin-top: 20rpx;
				&-from{
					display: flex;
					align-items: center;
					color: #95969c;
					font-size: 30rpx;
					&-logo{
						width: 30rpx;
						height: 30rpx;
						border-radius: 100%;
						margin-right: 10rpx;
						display: block;
					}
				}
			}
		}
		.func{
			&-share{
				color: #ffffff;
				background-color: #07c160;
				width: 300rpx;
				height: 80rpx;
				border-radius: 100rpx;
				margin: 30rpx auto;
				font-size: 34rpx;
				padding: 0;
				border: none;
				display: flex;
				align-items: center;
				justify-content: center;
				font-weight: 700;
				&::after{
					content:none;
				}
			}
		}
	}
	
	.component{
		color: #a1a3a5;
		font-size: 28rpx;
		text-align: center;
		display: flex;
		align-items: center;
		justify-content: center;
		&-con{
			color: #42b983;
		}
	}
</style>
