<template>
	<transition name="song-datail">
		<div class="singer-detail">
			<div class="header">
				<h1><a href="javascript:void(0)" @click="back"></a>{{singer.singer_name}}</h1>
			</div>
			<!-- 歌手图片 -->
			<div class="thumb" v-html="thumb">
			</div>
			<!-- 歌手图片结束 -->
			<div class="song-wrapper">
				<div class="content">
					<!-- 歌曲列表 -->
					<div class="list">
						<ul>
							<router-link :to="'/play/'+ song.musicData.songmid+'/'+song.musicData.albummid" tag="div" v-for="(song,k) in singer.list" :key="song.musicData.songid" @click.native="addSong(song)">
								<li >
									<h2 v-text="song.musicData.songname"></h2>
									<span>{{singer.singer_name}}-{{song.musicData.albumname}}</span>
								</li>
							</router-link>
						</ul>
					</div>
					<!-- 歌曲列表结束 -->
				</div>
			</div>
			<!-- 加载中组件 -->
			<Loading :title="'歌曲列表加载中'" :state="loadingState"></Loading>
		</div>
	</transition>
</template>

<script>
//引入api接口地址
import api from '@/api/singerApi';
//引入jsonp
import jsonp from 'jsonp';
//引入better-scroll滚动插件
import BScroll from 'better-scroll';
//引入loading组件
import Loading from '@/components/base/loading/Loading.vue';
//引入animate.css
import '@/assets/css/animate.css';

import {mapGetters,mapMutations} from 'vuex'

export default {
    name: '',
    data(){
	    return{
	    	singer:{},
	    	thumb:'',
	    	loadingState:true
	    }
	},
	computed:{
		...mapGetters([
			'getCurSong',
			'getPlayList'
		])
	},
	mounted(){
		this._getData();
	},
	methods:{
		// 动态获取数据
		_getData(){
			let url=api.singerDetailApi + this.$route.params.sid;
			// console.log(url);
			jsonp(url,{param:'jsonpCallback'},(err,data)=>{
				// console.log(data.data);
				this.singer=data.data;
				this.loadingState=false;
				this.thumb=`<img src="https://y.gtimg.cn/music/photo_new/T001R300x300M000${this.singer.singer_mid}.jpg" style="width:100%">`
				this.$nextTick(()=>{
					// 实例better-scroll
			  		this.scroll = new BScroll('.song-wrapper',{
			  			click:true,
			  		});
				});
			});
		},
		back(){
			this.$router.go(-1);
		},
		addSong(song){
			this.setCurSong(song);
			// console.log(song);
			// 防止添加相同的歌曲到mini播放器的列表中
			let listArr = this.getPlayList;
			let numFlag = 0;
			listArr.forEach((item,i)=>{
				if(song.musicData.songid ==item.musicData.songid){
					numFlag++;
					this.setCurSongIndex(i);
				}
			});
			if(numFlag<=0){
				this.setCurSongIndex(listArr.length);
				this.setPlayList(song);
			}
		},
		...mapMutations({
			'setCurSong':'setCurSong',
			'setPlayList':'setPlayList',
			'setCurSongIndex':'setCurSongIndex'
		})
	},
	components:{
		Loading
	}
}

</script>

<style lang="scss" scoped>
.singer-detail{
	height:100vh;
	overflow: hidden;
	.header{
		text-align: center;
	    line-height: 55px;
	    color: #fff;
	    position: fixed;
	    width: 100%;
		h1{
			padding: 0 10px;
		    margin: 0 auto;
    	    font-size: 20px;
    	    font-weight: 400;
			a{
			    display: inline-block;
			    width: 25px;
			    height: 25px;
			    padding: 15px;
			    background: url('../assets/icon/back.png') no-repeat;
			    background-size: 25px 25px;
			    background-position: 50%;
			    position: absolute;
			    left: 0;
			}
		}
	}
	.song-wrapper{
	    width: 100vw;
	    height: 340px;
	    position: fixed;
	    bottom: 0;
	    z-index: 99;
	    background-color: #060506;
	    color: #fff;
	    overflow: hidden;
	    ul{
	    	li{
    		    padding: 0 10px;
			    padding-top: 10px;
			    h2{
		    	    font-weight: 400;
				    font-size: 18px;
			    }
			    span{
		    	    font-size: 16px;
			    }
	    	}
	    }
	}
	.thumb{
		img{
		    width: 100%;
		}
	}
}
.song-datail-enter-active{
	animation: fadeInRight  0.5s;
}
</style>