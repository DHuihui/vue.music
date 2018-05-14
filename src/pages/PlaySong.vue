<template>
	<transition name="playsong">
		<div class="play-song">
		   	<div class="header">
		   		<h1><i @click="back"></i>{{getCurSong.musicData.singer[0].name}}</h1>
		   		<span>{{getCurSong.musicData.songname}}</span>
		   	</div>
		   	<div class="thumb playing">
		   		<img :src="'http://y.gtimg.cn/music/photo_new/T002R300x300M000'+getCurSong.musicData.albummid+'.jpg?max_age=2592000'">
		   	</div>
		  	<div class="opt-btn">
		  		<a href="javascript:void(0)" class="mode"></a>
		  		<a href="javascript:void(0)" class="prev" @click="playPrev()"></a>
		  		<a href="javascript:void(0)" class="playPause play" @click="playOrPause()"></a>
		  		<a href="javascript:void(0)" class="next" @click="playNext()"></a>
		  		<a href="javascript:void(0)" class="like"></a>
		  	</div>
		  	<div class="bg-album">
		  		<img :src="'http://y.gtimg.cn/music/photo_new/T002R300x300M000'+getCurSong.musicData.albummid+'.jpg?max_age=2592000'">
		  	</div>	  	
		</div>
	</transition>
</template>

<script>
//引入api接口地址
import api from '@/api/songApi';
//引入jsonp
import jsonp from 'jsonp';
//引入animate.css
import '@/assets/css/animate.css';

import {mapGetters,mapMutations} from 'vuex';
export default {
	name: '',
	data(){
	    return {
	    	smid:'',
	    	mid:'',
	    	src:'',
	    }
	},
	computed:{
		...mapGetters([
			'getCurSong',
			'getPlayState',
			'getPlayList',
			'getCurSongIndex',
		])
	},
	created(){
		// 获取路由参数smid 歌曲mid 专辑封面mid
		this.smid = this.$route.params.smid;
		// console.log(api.vKeyApi)
		this.mid = this.$route.params.mid;
		this._getSongSrc(this.smid,this.mid);
	},
	methods:{
		back(){
			this.$router.go(-1);
		}, 
		playOrPause(){
			//audio实现当前歌曲的播放与暂停
			let audioNode = document.querySelector("#player");
			let albumNode = document.querySelector(".thumb");
			let opBtnNode = document.querySelector(".playPause");
			if(!this.getPlayState){
				//播放中
				albumNode.style.animationPlayState='running';
				audioNode.play();
				opBtnNode.setAttribute("class","playPause play");
			}else{
				//暂停歌曲
				albumNode.style.animationPlayState='paused';
				audioNode.pause();
				opBtnNode.setAttribute("class","playPause pause");
			}
			this.setPlayState(!this.getPlayState);
		},
		//切换上一首
		playPrev(){
			let curIndex = this.getCurSongIndex;
			let maxIndex = this.getPlayList.length - 1;
			let prevIndex = curIndex - 1;
			prevIndex = prevIndex >= 0 ? prevIndex : 0;
			this.setCurSongIndex(prevIndex);
			this.setCurSong(this.getPlayList[prevIndex]);
			let songData = this.getPlayList[prevIndex].musicData;
			this._getSongSrc(songData.songmid,songData.albummid);
		},
		//切换到下一首
		playNext(){
			let curIndex = this.getCurSongIndex;
			let maxIndex = this.getPlayList.length - 1;
			let nextIndex = curIndex + 1;
			nextIndex = nextIndex <= maxIndex ? nextIndex : maxIndex;
			this.setCurSongIndex(nextIndex);
			this.setCurSong(this.getPlayList[nextIndex]);
			let songData = this.getPlayList[nextIndex].musicData;
			this._getSongSrc(songData.songmid,songData.albummid);
		},
		_getSongSrc(smid,amid){
			// 获取路由参数smid 歌曲mid 专辑封面mid
			this.smid = smid;
			// console.log(api.vKeyApi)
			this.mid = amid;
			//1、获取vKey
		  	let url = api.vKeyApi + `&songmid=${this.smid}&filename=C400${this.smid}.m4a`;
		  	// console.log(url);
		  	jsonp(url,{param:'callback'},(err,data)=>{
		  		// console.log(data);
		  		let vkey = data.data.items[0].vkey;
		  		
		  		//2、使用 smid和vKey取得歌曲播放地址
		  		this.src = `http://dl.stream.qqmusic.qq.com/C400${this.smid}.m4a?vkey=${vkey}&guid=7120953682&uin=0&fromtag=66`;
		  		// 添加播放地址到vuex
		  		this.setSrc(this.src);
		  		// console.log(this.src);
			});
		},
		...mapMutations({
			'setSrc':'setPlaySrc',
			'setCurSong':'setCurSong',
			'setPlayState':'setPlayState',
			'setCurSongIndex':'setCurSongIndex'
		})
	}
}
</script>

<style lang="scss" scoped>
.play-song{
	overflow-x: hidden;
	position: relative;
	z-index:1010;
	height:100vh;
	transition:all .5s cubic-bezier(0.77, 0.63, 0.57, 0.95);;
	.header{
	    text-align: center;
	    color: #fff;
	    position: relative;
	    z-index: 999;
	    h1{
	    	font-weight: 400;
		    font-size: 22px;
		    line-height: 55px;
		    i{
	    	    display: inline-block;
			    width: 25px;
			    height: 25px;
			    padding: 15px;
			    background: url("../assets/icon/arrow_down.png") no-repeat;
			    background-size: 25px 25px;
			    background-position: 50%;
			    position: absolute;
			    left: 0;
		    }
	    }
	    span{
	    	font-size: 15px;
	    }
	}
	.thumb{
		text-align: center;
	    margin-top: 15px;
	    position: relative;
	    z-index: 999;
	    img{
	    	width:250px;
	    	height:250px;
	    	border-radius: 50%;
	    	border:10px solid #000;
	    }
	    &.playing{
	    	animation:playCicle 5s linear infinite;
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
	.opt-btn{
		display: flex;
	    position: fixed;     
	    z-index: 999;
	    bottom: 50px;
	    width: 100%;
	    justify-content: space-around;
	    a{
	    	width:30px;
	    	height:30px;
	    }
	    .mode{
	    	background: url("../assets/icon/mode.png") no-repeat;
	    	background-size:100% 100%;
	    }
	    .prev{
	    	background: url("../assets/icon/prev.png") no-repeat;
	    	background-size:100% 100%;
	    }
	    .playPause{
	    	&.play{
	    		background: url("../assets/icon/pause.png") no-repeat;
		    	background-size:100% 100%;
	    	}
	    	&.pause{
	    	background: url("../assets/icon/play.png") no-repeat;
	    	background-size:100% 100%;
		    }
	    }
	    .next{
	    	background: url("../assets/icon/next.png") no-repeat;
	    	background-size:100% 100%;
	    }
	    .like{
	    	background: url("../assets/icon/like.png") no-repeat;
	    	background-size:100% 100%;
	    }
	}
	.bg-album{
	    background: #000;
	    height: 100vh;
	    position: fixed;
	    top: 0;
	    width: 100%;
	    transform-origin: center center;
	    img{
	    	width: 100%;
		    height: 100vh;
		    position: absolute;
		    top: 0;
		    filter: blur(20px);
	    }
	}
}
// .playsong-enter-active,.playsong-leave{
// 	transform:translate3d(0,0,0);
// }
// .playsong-enter,.playsong-leave-to{
// 	transform:translate3d(0,100vh,0)
// }

.header{
	transition:all 1s cubic-bezier(0.42, 0.75, 0.82, 0.99);
}
.opt-btn{
	transition:all .8s cubic-bezier(0.42, 0.75, 0.82, 0.99);
}
.thumb{
	transition:all .6s cubic-bezier(0.51, 0.36, 0.64, 0.9);
	img{
		transition:all .6s cubic-bezier(0.51, 0.36, 0.64, 0.9);
	}
}
.playsong-enter-active{
	.header{
		top:0px;
	}
	.opt-btn{
		bottom: 50px;
	}
	.thumb{
		left:0px;
		top:0px;
		img{
			height:250px;
			width:250px;
		}
	}
}

.playsong-enter{
	.header{
		top:-80px;
	}
	.opt-btn{
		bottom: -30px;
	}
	.thumb{
		top:400px;
		left:-100px;
		img{
			height: 45px;
			width:45px;
		}
	}
}

</style>