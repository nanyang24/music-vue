// getter 接受 state 作为第一个参数
export const singer = state => state.singer
export const playing = state => state.playing
export const fullScreen = state => state.fullScreen
export const playList = state => state.playList
export const currentIndex = state => state.currentIndex
export const sequenceList = state => state.sequenceList
export const mode = state => state.mode

export const currentSong = state => {
  return state.playList[state.currentIndex] || {}
}
