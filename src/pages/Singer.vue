<template>
	<div class="singer">
		<!-- 头部导航组件 -->
		<HeaderTab></HeaderTab>


		<!-- 利用better-scroll滚动歌手列表 -->
		<div class="singer-wrapper">
			<div class="content">
				<!-- 歌手列表 -->
				<div class="singer-list">
					<div class="singer-item" v-for="(item,k) in singerList" :key="item.index">
						<h2 v-text="item.index"></h2>
						<ul>
							<li v-for="(singer,j) in item.singer" :key="singer.Fsinger_id">
								<img :src="'https://y.gtimg.cn/music/photo_new/T001R150x150M000'+ singer.Fsinger_mid +'.jpg?max_age=2592000'">
								<span v-text="singer.Fsinger_name"></span>
							</li>
						</ul>
					</div>
				</div>
				<!-- 歌手列表结尾 -->
			</div>
			<!-- 侧边导航栏 -->
			<div class="index-tool">
				<ul>
					<li v-for="(index,k) in indexTool" :key="k" :class="{active:curIndex == k}" v-text="index"></li>
				</ul>
			</div>
		</div>

		<!-- 加载中组件 -->
		<Loading :title="'歌手列表加载中'" :state="loadingState"></Loading>
	</div>
</template>

<script>
//引入jsonp
import jsonp from 'jsonp';
//引入headertab组件
import HeaderTab from '@/components/HeaderTab.vue';
//引入loading组件
import Loading from '@/components/base/loading/Loading.vue';
//引入better-scroll滚动插件
import BScroll from 'better-scroll';
//引入api接口地址
import api from '@/api/singerApi';

export default {
  name: '',
  data(){
    return{
    	loadingState:false,
    	singerList:[],
    	indexTool:null,
    	scroll:{},
    	curIndex:0
    }
  },
  mounted(){
  	//通过跨域获取歌手列表信息
  	jsonp(api.singerListApi,{param:'jsonpCallback'},(err,data)=>{
  		//调用整理列表函数
  		this._getOrderSingerList(data.data.list);
  		// console.log(data.data.list);
  		// 实例better-scroll
  		this.scroll = new BScroll('.singer-wrapper',{
  			probeType:3
  		});

  		//获取y轴坐标
  		this.scroll.on('scroll',(pos)=>{
  			let posY = Math.abs(pos.y);
  			let singerList = this.singerList;
  			let indexMax = singerList.length - 1;
  			for(let i = 0;i<=indexMax;i++){
  				if(posY <=singerList[i].distance){
  					this.curIndex = i;
  					break;
  				}
  			}
  		});
  		//调用侧边与内容滚动一致函数
  		this.$nextTick(()=>{
  			this._getDistance();
  		});
  	})
  },
  methods:{
  	// 整理歌手列表结构，将歌手按照“热门、A-Z”的顺序显示
  	_getOrderSingerList(data){
  		//调用生成索引函数
  		this._getIndexTool();
  		//生成热门分类的歌手顺序结构
  		let hotSinger = {index:'热门',singer:data.splice(0,10)};
  		this.singerList.push(hotSinger);

  		//生成A-Z的歌手顺序结构
  		for(let i=1;i<27;i++){
  			let curIndex =this.indexTool[i];
  			let temp = {index:curIndex,singer:[]};
  			data.forEach((singer,k)=>{
  				if(singer.Findex===curIndex){
  					temp.singer.push(singer);
  					data.splice(k,1);
  				}
  			});
  			this.singerList.push(temp);
  		}
  		// console.log(this.singerList);
  		// 清除无歌手信息的index索引
  		this.singerList.map((item,k)=>{
  			if(item.singer.length<=0){
  				this.singerList.splice(k,1);
  				this.indexTool.splice(k,1);
  			}
  		});
  	},
  	_getIndexTool(){
  		let indexArr = ['热'];
  		//利用函数转换字母A-Z的ASCII码值然后进行排序
  		//生成歌曲A-Z的索引
  		for(let code = 65;code<=90;code++){
  			indexArr.push(String.fromCharCode(code));
  		}
  		this.indexTool=indexArr;
  		// console.log(indexArr);
  	},
  	//侧边导航与内容一致
  	_getDistance(){
  		let singerItemNode = document.querySelectorAll('.singer-item');
  		// console.log(singerItemNode);
  		let offset = 0;
  		this.singerList.map((singerItem,i)=>{
  			offset+=singerItemNode[i].offsetHeight;
  			this.singerList[i].distance = offset;
  		});
  	}
  },
  components:{
  	HeaderTab,
  	Loading
  }
}
</script>

<style lang="scss" scoped>
.singer{
	.singer-wrapper{
		height: calc(100vh - 88px);
		overflow: hidden;
	}
	.singer-list{
		.singer-item{
			h2{
				font-size: 15px;
				line-height:30px;
				background: #131313;
				font-weight: 400;
				text-indent: 1em;
				color:#fff;
			}
			ul{
				padding-left:25px;
				padding-bottom: 20px;
				li{
					display: flex;
					line-height: 50px;
					margin-top:20px;
					img{
						width: 50px;
						height:50px;
						border-radius: 50%;
					}
					span{
						color: #fff;
					    flex-grow: 1;
					    margin-left: 20px;
					    white-space: nowrap;
					    overflow: hidden;
					    text-overflow: ellipsis;
					    padding-right: 8px;
					}
				}
			}
		}
	}
	.index-tool{
	    width: 16px;
	    position: fixed;
	    top: 50%;
	    right: 10px;
	    margin-top: -145px;
	    background-color: hsla(0,0%,92%,.1);
	    font-size: 12px;
	    border-radius: 10px;
	    padding: 5px 0;
	    color: #c8c8c8;
		ul{
			li{
			    text-align: center;
			    &.active{
			    	color:#d3442c;
			    }
			}
		}
	}
}
</style>