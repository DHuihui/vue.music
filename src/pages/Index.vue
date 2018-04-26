<template>
	<div class="index">
		<!-- 头部导航 -->
		<HeaderTab></HeaderTab>
		<!-- 利用better-scroll滚动轮播图和歌曲列表 -->
		<div class="index-wrapper">
			<div class="content">
				<!-- 轮播图 -->
				<div class="sliders">
					<div class="swiper-container">
					    <div class="swiper-wrapper">
					        <div class="swiper-slide" v-for="(s,i) in slider" :key="i">
					        	<img :src="s.picUrl">
					        </div>
					    </div>
					    <div class="swiper-pagination"></div>
					</div>
				</div>
				<!-- 轮播图结束 -->
				<!-- 歌曲排行榜榜单 -->
				<div class="top-list">
					<h2 class="title">歌曲排行榜</h2>
					<div class="song-list">
						<ul>
							<li v-for="(song,k) in toplist" :key="song.data.songid">
								<div class="thumb">
									<img :src="'https://y.gtimg.cn/music/photo_new/T002R90x90M000'+song.data.albummid+'.jpg?max_age=2592000'">
								</div>
								<div class="info">
									<h3 v-text="song.data.songname"></h3>
									<span v-text="song.data.singer[0].name"></span>
								</div>
								<div class="time">{{song.data.interval | getTime}}</div>
							</li>
						</ul>
					</div>
				</div>
				<!-- 排行榜榜单结束 -->
			</div>
		</div>
		<!-- 加载中组件 -->
		<Loading :title="'歌曲推荐列表加载中'" :state="loadingState"></Loading>
	</div>
</template>
<script>
//引入loading组件
import Loading from '@/components/base/loading/Loading.vue';
//引入jsonp
import jsonp from 'jsonp';
//引入headertab组件
import HeaderTab from '@/components/HeaderTab.vue';
//引入轮播图swiper插件
import Swiper from 'swiper';
//引入better-scroll滚动插件
import BScroll from 'better-scroll';
//载入轮播图样式
import 'swiper/dist/css/swiper.min.css';
//引入api接口地址
import api from '@/api/indexApi';
	export default{
		name:'',
		data(){
			return{
				slider:[],
				toplist:[],
				scroll:null,
				loadingState:true
			}
		},
		mounted:function(){
			//调用函数显示轮播图
			this._getSlider();
			//调用函数显示歌曲排行榜榜单
			this._getTopList();
			//实例better-scroll加载一次减少性能
			this.$nextTick(function(){
				this.scroll = new BScroll('.index-wrapper',{
					pullUpLoad:{
						threshold:50
					}
				});
				this.scroll.on('pullingUp',()=>{
					this.loadingState=true;
					this._getTopList();
					// console.log('加载');
					this.scroll.finishPullUp();
					this.scroll.refresh();
				});
			});
		},
		methods:{
			_getSlider(){
				//调用接口动态显示轮播图和小圆点
				jsonp(api.bannerApi,{param:'jsonpCallback'},(err,data)=>{
					this.slider = data.data.slider;
					this.$nextTick(function(){
						let mySwiper = new Swiper('.swiper-container',{
							pagination:{
								el:'.swiper-pagination',
								type:'bullets',
								bulletClass:'bullet',
								bulletActiveClass:'bullet-active'
							},
						});
					});
				});
			},
			//调用接口显示歌曲榜单
			_getTopList(){
				let songBengin = this.toplist.length;
				let url = api.topListApi + songBengin;
				jsonp(url,{param:'jsonpCallback'},(err,data)=>{
					this.toplist = this.toplist.concat(data.songlist);
					// console.log(this.toplist);
					this.loadingState = false;
				});
			},
		},
		filters:{
			getTime:function(t){
				let m = parseInt(t/60);
				let s = t%60;
				s = (s<10) ? ('0'+s) : s;
				return m+'分'+ s;
			}
		},
		components:{
			HeaderTab,
			Loading
		}
	}
</script>
<style lang="scss">
.sliders{
	img{
		width:100%;
	}
	.swiper-pagination{
        height:30px;
        text-align:center;
        .bullet{
         	width:8px;
         	height:8px;
         	display:inline-block;
         	margin:0 4px;
         	border-radius: 100%;
         	background: #000;
         	opacity:0.2;
        }
        .bullet-active{
        	width:15px;
        	background: #fff;
        	opacity: 0.3;
        	border-radius: 5px;
        }
	}
}
.index{
	.top-list{
		padding:0px 5px;
		.title{
			font-size:16px;
			color:#d33a31;
			text-align: center;
			line-height:64px;
		}
		.song-list{
			ul{
				li{
					display:flex;
					margin-bottom: 20px;
					padding:0px 10px;
					.thumb{
						img{
							width:60px;
							height:60px;
						}
					}
					.info{
						margin-left: 20px;
						padding-top: 15px;
						color:#fff;
						flex-grow:1;
						h3{
							font-size:15px;
							margin-bottom: 5px;
							font-weight: normal;
						}
						span{
							font-size:12px;
						}
					}
					.time{
						color: #999;
						padding-top: 15px;
						width:60px;
					}
				}
			}
		}
	}
}
.index{
	.index-wrapper{
		height:calc(100vh - 88px);
		overflow: hidden;
	}
}
</style>