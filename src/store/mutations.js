// 设置播放地址
export const setPlaySrc=(state,src)=>{
	state.playSrc=src;
}
//设置当前歌曲信息
export const setCurSong = (state,song)=>{
	state.CurSong = song;
}
//设置当前歌曲播放状态
export const setPlayState = (state,status)=>{
	state.playState = status;
}
//将播放的歌曲push进mini播放器的播放列表中
export const setPlayList = (state,song)=>{
	state.playList.push(song);
}
//获取mini播放器中歌曲列表的当前播放歌曲索引
export const setCurSongIndex = (state,i)=>{
	state.curSongIndex=i;
}