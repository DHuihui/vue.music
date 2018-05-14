// 获取当前播放地址
export const getPlaySrc = (state)=>{
	return state.playSrc;
}
//获取当前歌曲的完整信息
export const getCurSong = (state)=>{
	return state.CurSong;
}
//获取当前歌曲的播放状态
export const getPlayState = (state)=>{
	return state.playState;
}
//获取mini播放器中的歌曲列表
export const getPlayList = (state)=>{
	return state.playList;
}
//获取mini播放器中歌曲列表的当前播放歌曲索引
export const getCurSongIndex = (state)=>{
	return state.curSongIndex;
}