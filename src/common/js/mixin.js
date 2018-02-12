import {mapGetters, mapMutations, mapActions} from 'vuex'
import {playMode} from 'common/js/config'
import {shuffle} from 'common/js/util'

export const playListMixin = {
  computed: {
    ...mapGetters([
      'playList'
    ])
  },
  mounted() {
    this.handlePlayList(this.playList)
  },
  activated() {
    this.handlePlayList(this.playList)
  },
  watch: {
    playList(newVal) {
      this.handlePlayList(newVal)
    }
  },
  methods: {
    handlePlayList() {
      throw new Error('component must implement handlePlayList method')
    }
  }
}

export const playerMixin = {
  computed: {
    iconMode() {
      return this.mode === playMode.sequence ? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop' : 'icon-random'
    },
    ...mapGetters([
      'sequenceList',
      'currentSong',
      'mode',
      'playList'
    ])
  },
  methods: {
    changeMode() {
      this.setPlayMode((this.mode + 1) % 3)
      let list
      if (this.mode === playMode.random) {
        list = shuffle(this.sequenceList)
      } else {
        list = this.sequenceList
      }
      this.resetCurrentIndex(list)
      this.setPlayList(list) // 启用新的播放列表
    },
    resetCurrentIndex(list) { // 打乱播放列表后 将当前播放的歌曲 index 设置成 打乱后列表中这首歌的 index
      let index = list.findIndex((item) => {
        return item.id === this.currentSong.id
      })
      this.setCurrentIndex(index)
    },
    ...mapMutations({
      setPlayingState: 'SET_PLAYING_STATE',
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setPlayMode: 'SET_PLAY_MODE',
      setPlayList: 'SET_PLAYLIST'
    })
  }
}

export const searchMixin = {
  data() {
    return {
      query: ''
    }
  },
  computed: {
    ...mapGetters([
      'searchHistory'
    ])
  },
  methods: {
    blurInput() {
      this.$refs.searchBox.blur()
    },
    saveSearch() {
      this.saveSearchHistory(this.query)
    },
    onQueryChange(query) {
      this.query = query
    },
    addQuery(query) {
      this.$refs.searchBox.setQuery(query)
    },
    ...mapActions([
      'saveSearchHistory',
      'deleteSearchHistory'
    ])
  }
}

export const favoriteMixin = {
  computed: {
    favoriteIcon() {
      return this.getFavoriteIcon(this.currentSong)
    },
    ...mapGetters([
      'favoriteList',
      'currentSong'
    ])
  },
  methods: {
    getFavoriteIcon(song) {
      return this.isFavorite(song) ? 'icon-favorite' : 'icon-not-favorite'
    },
    toggleFavorite(song) {
      return this.isFavorite(song) ? this.deleteFavoriteList(song) : this.saveFavoriteList(song)
    },
    isFavorite(song) {
      const index = this.favoriteList.findIndex((item) => {
        return item.id === song.id
      })
      return index > -1
    },
    ...mapActions([
      'saveFavoriteList',
      'deleteFavoriteList'
    ])
  }
}
