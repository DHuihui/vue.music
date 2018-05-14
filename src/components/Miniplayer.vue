<template>
	<div class="mini-player" @click="showPlayStage()">
		<!-- 歌曲封面 -->
		<div class="thumb playing">
			<img :src="'https://y.gtimg.cn/music/photo_new/T002R300x300M000'+ getCurSong.musicData.albummid +'.jpg'">
		</div>
		<!-- 歌曲播放信息 -->
		<div class="song-info">
			<h3 v-text="getCurSong.musicData.songname"></h3>
			<span v-text="getCurSong.musicData.singer[0].name"></span>
		</div>
		<!-- 歌曲当前状态 -->
		<div class="song-operator">                        <!-- 阻止事件冒泡 -->
			<a href="javascript:" class="play-pause play" @click.stop="playOrPause()"></a>
			<a href="javascript:" class="song-list"  @click.stop="showSongList()"></a>
		</div>
		<!-- 歌曲列表 -->
		<SongList :showState="slState" @closesonglist="closeSongList"></SongList>
		<!-- 播放歌曲 -->
	    <div class="audio">
		    <audio id="player" :src="getPlaySrc" autoplay="autoplay"></audio>
	    </div>
	</div>
</template>

<script>
// 载入按钮上的歌曲列表
import SongList from '@/components/SongList.vue'
import {mapGetters,mapMutations} from 'vuex';
export default {
	name:'',
	data(){
	    return{
	    	//控制播放列表的状态（显示或隐藏）
	    	slState:false
	    }
    },
    computed:{
	    ...mapGetters([
	        'getPlaySrc',
	        'getCurSong',
	        'getPlayState'
        ])
    },
    methods:{
    	playOrPause(){
			//audio实现当前歌曲的播放与暂停
			let audioNode = document.querySelector("#player");
			let albumNode = document.querySelector(".thumb");
			let opBtnNode = document.querySelector(".play-pause");
			if(!this.getPlayState){
				//播放中
				albumNode.style.animationPlayState='running';
				audioNode.play();
				opBtnNode.setAttribute("class","play-pause play");
			}else{
				//暂停歌曲
				albumNode.style.animationPlayState='paused';
				audioNode.pause();
				opBtnNode.setAttribute("class","play-pause pause");
			}
			this.setPlayState(!this.getPlayState);
		},
		showSongList(){
			this.slState = true;
		},
		closeSongList(){
			this.slState = false;
		},
		//点击mini播放器跳转到播放歌曲页面中
		showPlayStage(){
			// console.log(this.getCurSong);
			let song = this.getCurSong.musicData;
			this.$router.push({path:'/play/'+song.songmid+'/'+song.albummid})
		},
    	...mapMutations({
	    	'setPlayState':'setPlayState'
	    })
    },
    components:{
    	SongList
    }
}
</script>

<style lang="scss" scoped>
.mini-player{
	width: 100%;
	height: 60px;
	position: fixed;
	bottom: 0;
	z-index: 1000;
	background: #101010;
	display: flex;
	align-items: center;
	padding-left:18px;
	box-sizing: border-box;
	.thumb{
		&.playing{
			animation:playCicle 5s linear infinite;
		}
		img{
			width:45px;
	  		height:45px;
	  		border-radius: 50%;
		}
	}
	.song-info{
		flex:1;
	  	margin-left:16px;
	    overflow: hidden;
	    h3{
	    	color: #fff;
	  		font-size:16px;
	  		font-weight: 400;
	        overflow: hidden;
	        white-space:nowrap;
	        text-overflow:ellipsis;
	    }
	    span{
	    	color: #ccc;
	  		font-size:12px;
	    }
	}
	.song-operator{
		margin-right:10px;
		.play-pause,.song-list{
			width:30px;
			height:30px;	
			display: inline-block;
		}
		.play-pause{
			margin-right:16px;
			&.play{
				background:url("../assets/icon/pause.png") no-repeat;
		  		background-size:100% 100%;
			}
			&.pause{
				background:url("../assets/icon/play.png") no-repeat;
		  		background-size:100% 100%;
			}
		}
		.song-list{
			background:url("../assets/icon/list.png") no-repeat;
	  		background-size:100% 100%;
		}
	}
}
@keyframes playCicle{
	from{
	    transform:rotateZ(0deg);
	}
	to{
	    transform:rotateZ(360deg);
	}
}

</style>