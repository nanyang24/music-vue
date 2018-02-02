import {playMode} from 'common/js/config'

const state = {
  singer: {},
  playing: false, // 正在播放
  fullScreen: false, // 播放器是否全屏
  playList: [], // 歌曲列表
  currentIndex: -1, // 当前播放歌曲索引
  sequenceList: [], // 顺序歌曲列表
  mode: playMode.sequence, // 播放模式

  disc: {}
}

export default state
