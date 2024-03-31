<template>
	<view class="wrapper">
		<view class="head">
			<view class="head-search">
				<input type="text" 
				v-model="keyword" 
				:class="['head-search-input', 'focus']" 
				:placeholder="placeholder" 
				confirm-type="search" 
				@confirm="search" />
				<view class="head-search-btn" @click="initSearch()">
					搜一下
				</view>
			</view>
			<view class="head-tab">
				
			</view>
		</view>
		<view class="result">
			<view class="result-list">
				<view class="result-list-item" 
				v-for="(item, index) in listData" 
				:key="index" 
				@click="goDetail(item)">
					<view class="result-list-item-title">
						{{item.name}}
					</view>
					<view class="result-list-item-content">
						<view class="result-list-item-content-left">
							<view class="result-list-item-content-left-name">
								资源链接
							</view>
							<view class="result-list-item-content-left-value" style="display: flex;align-items: center">
								<image :src="globalUtil.getFromLogo(item.from_type)" mode="" class="result-list-item-info-from-logo"></image>
								{{item.from_name}}
							</view>
						</view>
						<view class="result-list-item-content-right">
							<view class="result-list-item-content-right-name">
								更新时间
							</view>
							<view class="result-list-item-content-right-value">
								{{item.update_time}}
							</view>
						</view>
					</view>
					<image src="/static/icon/more.png" mode="" class="result-list-item-more"></image>
				</view>
			</view>
			<view class="result-empty" v-if="listData.length == 0">
				<view class="result-empty-null">
					暂无资源
				</view>
				<view class="result-empty-comment">
					请
					<view class="result-empty-comment-con" @click="save()">
						点此提交
					</view>
					，会自动补充该资源
				</view>
			</view>
		</view>
		
		<view style="padding: 20rpx;" v-if="listData.length != 0">
			<u-loadmore :status="status" :load-text="contentText" @loadmore="getList()"/>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				placeholder: '请输入剧名',
				keyword: '',
				
				listData: [],
				lastId: 0,
				maxNumber: 1, //最后一页
				reload: false,
				
				status: 'loadmore',
				contentText: {
					loadmore: '点击或上拉加载更多',
					loading: '加载中',
					nomore: '没有更多了'
				},
			};
		},
		onLoad(e) {
			if(e.keyword){
				this.keyword = decodeURIComponent(e.keyword)
				this.search()
			}
			console.log('搜索，',e)
		},
		// 加载更多
		onReachBottom() {
			console.log('加载更多~~')
			this.status = 'more';
			this.search();
		},
		methods: {
			initSearch(){
				this.listData = [];
				this.status = 'loadmore';
				this.lastId = 0;
				this.maxNumber = 1; //最后一页
				this.reload = false;
				this.search();
			},
			search(){
				// 是否最后一页
				if (this.lastId >= this.maxNumber){
					console.log('最后一页了',this.lastId,this.maxNumber)
					this.status = 'nomore';
					this.reload = false;
					return;
				}
				
				//说明已有数据，目前处于上拉加载
				if (this.reload) {
					console.log('上拉加载中~~')
					this.status = 'loading';
					return;
				}
				// 开始加载数据
				this.reload = true;
				let page  = this.lastId + 1;
				
				let that = this;
				that.$u.api.sys.getSearch({"page":page,"keyword": this.keyword}).then(res => {
					//console.log('getSearch success',res);
					res = res.data;
					let list = res.data;
					that.listData = that.listData.concat(list);
					that.lastId = res.current_page;
					that.reload = false;
					that.maxNumber = res.last_page;
					
					// 判断是否还有下一页
					if(page >= res.last_page){
						that.status = 'nomore';
					}
					
					if(that.listData.length == 0){
						that.contentText.loadmore = '暂无记录';
					}
				});
			},
			goDetail(detail){
				uni.navigateTo({
					url: `/pages/search/detail?id=${detail.id}` 
				})
			},
			save(){
				let that = this;
				that.$u.api.sys.save({"keyword": this.keyword}).then(res => {
					uni.showToast({
						title: res.msg,
						icon : 'none'
					})
					return false;
				});
			}
		},
		onShareAppMessage(){
			return this.globalUtil.getSettingShare()
		},
		onShareTimeline(){
			return this.globalUtil.getSettingShare()
		},
	}
</script>

<style lang="scss">
	page {
		background-color: #f7f7f7;
	}
	.wrapper{
		.head{
			background-color: #ffffff;
			padding-top: 30rpx;
			&-search{
				display: flex;
				align-items: center;
				justify-content: center;
				width: 690rpx;
				height: 80rpx;
				margin: 0 auto;
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
			&-tab{
				margin: 0 30rpx;
				margin-top: 10rpx;
				display: flex;
				&-item{
					height: 80rpx;
					display: flex;
					align-items: center;
					justify-content: center;
					position: relative;
					font-size: 32rpx;
					margin-right: 30rpx;
					&.active{
						font-weight: 700;
						&::after{
							border-bottom: 2px solid #38f;
							content: "";
							width: 100%;
							position: absolute;
							bottom: -1px;
							left: 0;
							width: 100%;
						}
					}
				}
			}
		}
		.result{
			&-list{
				margin: 30rpx;
				&-item{
					padding: 20rpx;
					background-color: #ffffff;
					margin-bottom: 30rpx;
					border-radius: 18rpx;
					position: relative;
					&-content{
						display: flex;
						margin-top: 20rpx;
						&-left{
							width: calc(50% - 5px);
							margin-right: 10px;
							&-name{
								font-size: 30rpx;
								color: #646a73;
							}
							&-value{
								width: 100%;
								overflow:hidden;
								white-space: nowrap;
								text-overflow: ellipsis;
								margin-top: 10rpx;
								font-size: 30rpx;
								color: #1e80ff;
							}
						}
						&-right{
							width: calc(50% - 5px);
							&-name{
								font-size: 30rpx;
								color: #646a73;
							}
							&-value{
								width: 100%;
								overflow:hidden;
								white-space: nowrap;
								text-overflow: ellipsis;
								margin-top: 10rpx;
								font-size: 30rpx;
								color: #1f2329;
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
					&-more{
						position: absolute;
						right: 30rpx;
						top: 50%;
						transform: translateY(-50%);
						width: 30rpx;
						height: 30rpx;
						display: block;
					}
				}
			}
			&-empty{
				margin: 30rpx;
				height: 400rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				flex-direction: column;
				&-comment{
					margin-top: 30rpx;
					display: flex;
					align-items: center;
					&-con{
						color: #42b983;
					}
				}
			}
		}
	}
</style>
