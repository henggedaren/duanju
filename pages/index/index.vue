<template>
	<view class="wrapper">
		<view class="logo">
			<image src="/static/icon/logo.png" mode="" class="logo-img"></image>
			{{name}}
		</view>
		<view class="search">
			<input 
			type="text" 
			v-model="keyword" 
			:class="['search-input', focus ? 'focus' : '']" 
			:placeholder="placeholder" 
			confirm-type="search" 
			@click="searchFocus" 
			@focus="searchFocus" 
			@blur="searchBlur"
			@confirm="search" />
			<view class="search-btn" @click="search">
				搜 剧
			</view>
		</view>
		<view class="rank">
			<view class="rank-header">
				<view class="rank-header-num">
					排名
				</view>
				<view class="rank-header-name">
					剧名
				</view>
				<view class="rank-header-score">
					热度
				</view>
			</view>
			<view class="rank-list" :style="{height:scroll_view_height+'px'}" v-if="ranks.length == 0" >
				<u-empty text="暂无推荐热剧" mode="search"></u-empty>
			</view>
			<view v-if="ranks.length > 0">
				<scroll-view
				scroll-y="true" 
				:style="{height:scroll_view_height+'px'}" 
				:refresher-enabled="false">
					<view class="rank-list">
						<view class="rank-list-item" 
						v-for="(item,index) in ranks" 
						:key="index" 
						@click="rankSearch(item)">
							<view class="rank-list-item-num">
								{{item.ranking}}
							</view>
							<view class="rank-list-item-name">
								<view class="rank-list-item-name-title">{{item.name}}</view>
								<view class="rank-list-item-name-tag">{{item.tags}}</view>
							</view>
							<view class="rank-list-item-score">
								{{scoreFormat(item.hots)}}
							</view>
						</view>
					</view>
				</scroll-view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				name: '爱看短剧',
				placeholder: '请输入剧名',
				focus: false,
				keyword: '',
				ranks: [],
				
				scroll_view_height: 546,
			};
		},
		computed:{
			scoreFormat() {
				return (value) => {
					return (value / 10000).toFixed(1) + 'w';
				}
			},
		},
		onLoad(option) {
			if (option.path) {
				this.jumpTo(option.path);
			}
			
			let that = this;
			uni.getSystemInfo({
				success(res) {
					let phone_height = res.windowHeight
					let scroll_view_height = phone_height - 90;
					
					// #ifdef H5
					scroll_view_height = scroll_view_height - 30;
					// #endif
					
					let v = uni.createSelectorQuery().selectAll(".logo,.search,.rank-header");
					setTimeout(()=>{
						let dom = 0;
						v.boundingClientRect(data =>{
							for(var i=0;i<data.length;i++){
								dom += data[i].height;
							}
							that.scroll_view_height = scroll_view_height - dom;
						}).exec();
					},100)
				}
			})
			
			this.getRankList()
		},
		onShow() {
			
		},
		onReady() {
			
		},
		onUnload() {
			
		},
		methods: {
			searchFocus(){
				this.focus = true
			},
			searchBlur(){
				this.focus = false
			},
			search(){
				if(this.keyword == ''){
					uni.showToast({
						title: '请输入搜索词~',
						icon: 'none',
					})
					return
				}
				uni.navigateTo({
					url: "/pages/search/search?keyword=" + encodeURIComponent(this.keyword)
				})
				this.keyword = ''
			},
			async jumpTo(payload) {
				console.log(payload)
				try {
					const path = decodeURIComponent(payload);
					uni.navigateTo({
						url: path
					});
				} catch (e) {}
			},
			getRankList(){
				let that = this;
				that.$u.api.sys.getRankList({}).then(res => {
					console.log('getRankList接口返回值:',res);
					if(res.code === 0){
						uni.showToast({
							title: res.msg,
							icon : 'none'
						})
						return false;
					}
						
					that.ranks = res.data;
				});
			},
			rankSearch(rank){
				uni.navigateTo({
					url: "/pages/search/search?keyword=" + encodeURIComponent(rank.name)
				})
			},
		},
		onShareAppMessage(){
			return this.globalUtil.getSettingShare()
		},
		onShareTimeline(){
			return this.globalUtil.getSettingShare()
		},
	};
</script>

<style lang="scss">
	page {
		background-color: #f7f7f7;
	}
	.wrapper {
		
		/* #ifdef H5 */
		padding-top: 60rpx;
		/* #endif */
		
		.logo{
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 36rpx;
			font-weight: 700;
			color: #333333;
			margin-top: 60rpx;
			&-img{
				width: 45rpx;
				height: 45rpx;
				display: block;
				border-radius: 100%;
				margin-right: 10rpx;
			}
		}
		.search{
			display: flex;
			align-items: center;
			justify-content: center;
			width: 630rpx;
			height: 100rpx;
			margin: 30rpx auto;
			margin-bottom: 60rpx;
			box-sizing: border-box;
			&-input{
				flex: 1;
				box-sizing: border-box;
				padding: 20rpx;
				height: 100%;
				background-color: #ffffff;
				border-radius: 18rpx 0 0 18rpx;
				border: 1px solid #ffffff;
				font-size: 36rpx;
				&.focus{
					border-color: #4e6ef2;
				}
			}
			&-btn{
				display: flex;
				align-items: center;
				justify-content: center;
				height: 100%;
				width: 150rpx;
				background-color: #4e6ef2;
				color: #ffffff;
				font-size: 32rpx;
				font-weight: 700;
				border-radius: 0 18rpx 18rpx 0;
			}
		}
		.rank{
			margin: 30rpx;
			margin-top: 80rpx;
			background-color: #ffffff;
			border-radius: 18rpx;
			&-header{
				display: flex;
				align-items: center;
				height: 100rpx;
				font-weight: 700;
				font-size: 30rpx;
				&-num{
					height: 100%;
					width: 100rpx;
					display: flex;
					align-items: center;
					justify-content: center;
				}
				&-name{
					height: 100%;
					flex: 1;
					display: flex;
					align-items: center;
					justify-content: center;
				}
				&-score{
					height: 100%;
					width: 150rpx;
					display: flex;
					align-items: center;
					justify-content: center;
				}
				&-op{
					height: 100%;
					width: 100rpx;
					display: flex;
					align-items: center;
					justify-content: center;
				}
			}
			&-list{
				&-item{
					display: flex;
					align-items: center;
					height: 100rpx;
					border-top: 1px solid #f5f5f5;
					&-num{
						height: 100%;
						width: 100rpx;
						display: flex;
						align-items: center;
						justify-content: center;
					}
					&-name{
						flex: 1;
						line-height: 20px;
						
						&-title{
							font-size: 14px;
							font-weight: 600;
							color: rgba(0,0,0,.86);
							flex: 1;
						}
						&-tag{
							flex: 1;
							font-size: 12px;
							color: rgba(0, 0, 0, .6);
							font-weight: 400;
						}
					}
					&-score{
						height: 100%;
						width: 150rpx;
						display: flex;
						align-items: center;
						justify-content: center;
						color: #E44D26;
					}
					&-op{
						height: 100%;
						width: 100rpx;
						display: flex;
						align-items: center;
						justify-content: center;
						color: #0969da;
					}
				}
			}
		}
	}
</style>
