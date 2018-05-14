<template>
	<div class="search">
		<!-- 头部导航 -->
		<HeaderTab></HeaderTab>
		<div class="search-wrap">
			<div class="search-form">
				<input placeholder="搜索歌曲、歌手" v-model="keywords" @input="search">
				<i class="delete" @click="delKeywords()"></i>
			</div>
			<div class="hotkey" v-if="!showState">
				<h2>热门搜索</h2>
				<div class="hotkey-list">
					<span v-for="(key,i) in hotkey" v-text="key.k" :key="key.n" @click="searchHotKey(key.k)"></span>
				</div>
			</div>
			<div class="song-wrapper" v-if="showState">
				<div class="content">
					<div class="song-list">
						<ul>
							<!-- 跳转歌手详情页 -->
							<router-link :to="'/singer/'+songList.zhida.singermid">
							<li class="singer" v-if="songList.zhida.type">{{songList.zhida.singername}}</li>
							</router-link>
							<!-- 跳转歌曲详情页 -->
							<router-link :to="'/play/'+ song.songmid + '/' +song.albummid" v-for="(song,k) in songList.song.list" :key="song.songid" @click.native="addSong(s)" >
							<li v-text="song.songname+'-'+song.singer[0].name"></li>
							</router-link>
							<!-- <li v-for="(song,k) in songList.song.list" :key="song.songid" v-text="song.songname+'-'+song.singer[0].name"></li> -->
						</ul>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
//引入jsonp
import jsonp from 'jsonp';
//引入headertab组件
import HeaderTab from '@/components/HeaderTab.vue';
//载入热门搜索api接口
import api from '@/api/searchApi';
//引入better-scroll滚动插件
import BScroll from 'better-scroll';

import {mapGetters,mapMutations} from 'vuex';

export default {
	data(){
		return {
			hotkey:[],
			keywords:'',
			songList:[],
			scroll:{}
		}
	},
	computed:{
		...mapGetters([
	        'getPlayList'
	    ]),
		showState:function(){
			return this.keywords == '' ? false : true;
		}
	},
	watch:{
		keywords:function(newVal,oldVal){
			this.search();
		}
	},
	created(){
		jsonp(api.hotkeyApi,{param:'jsonpCallback'},(err,data)=>{
			console.log(data);
			this.hotkey=data.data.hotkey.slice(0,12);
			// console.log(this.hotkey);
		});
	},
	mounted(){
		// 实例better-scroll
  		this.$nextTick(()=>{
  			this.scroll = new BScroll('.song-wrapper',{
	  			click:true
	  		});
  		})
	},
	methods:{
		searchHotKey(keywords){
			this.keywords=keywords;
		},
		delKeywords(){
			this.keywords='';
		},
		search(){
			let url=api.searchApi+this.keywords;
			jsonp(url,{param:'jsonpCallback'},(err,data)=>{
				// console.log(data);
				this.songList=data.data;
			})
		},
		addSong(song){
			song = {musicData:song};
			this.setCurSong(song);

			//防止添加
			let listArr = this.getPlayList;
			let numFlag = 0;
			listArr.forEach((item,i)=>{
			if(song.musicData.songid == item.musicData.songid){
			  numFlag++;
			}
			});

			if(numFlag <= 0){
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
		HeaderTab
	}
}
</script>

<style lang="scss" scoped>
.search{
	.search-wrap{
		padding:0px 15px;
		margin:0px auto;
		.search-form{
			padding:8px 0px;
			text-align: center;
			background-color:#121212;
			margin:0px 5px;
			margin-top:25px;
			border-radius: 8px;
			position: relative;
			margin-bottom: 20px;
			&::before{
				content: "";
				background: url("../assets/icon/search.png") no-repeat;
				display: inline-block;
				width: 22px;
				height: 22px;
				background-size: 100% 100%;
			    vertical-align: middle;
			    margin-right: 5px;
			}
			input{
				width: 220px;
				height: 20px;
				font-size: 14px;
				line-height: 20px;
				border: 0;
				outline: 0;
				color: #676767;
				background-color: transparent;
			}
			i{
				background: url("../assets/icon/delete.png") no-repeat;
				width: 22px;
			    height: 22px;
			    background-size: 100% 100%;
			    vertical-align: middle;
			    position: absolute;
			    right: 10px;
			}
		}
		.hotkey{
			margin-top: 30px;
			h2{
			    color: #676767;
			    font-size: 15px;
			    text-indent: 5px;
			}
			.hotkey-list{
				color: #676767;
				display: flex;
				flex-wrap: wrap;
				span{
					padding: 4px 6px;
					background-color: #121212;
					margin: 5px;
					border-radius: 8px;
				    font-size: 14px;
				}
			}
		}
		.song-wrapper{
			height:calc(100vh - 188px);
			overflow: hidden;
			.content{
				.song-list{
					ul{
						li{
							padding:6px 5px;
							color: #676767;
							&::before{
								content: "";
								background: url("../assets/icon/music.png") no-repeat;
								display: inline-block;
								width: 22px;
								height: 22px;
								background-size: 100% 100%;
							    vertical-align: middle;
							    margin-right: 5px;
							}
						}
						.singer{
							&::before{
								content: "";
								background: url("../assets/icon/singer.png") no-repeat;
								display: inline-block;
								width: 22px;
								height: 22px;
								background-size: 100% 100%;
							    vertical-align: middle;
							    margin-right: 5px;
							}
						}
					}
				}
			}
		}
	}
}
</style>