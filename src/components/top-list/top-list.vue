<template>
  <transition name="slide">
    <MusicList :rank="rank" :songs="songs" :title="title" :bgImage="bgImage"></MusicList>
  </transition>
</template>

<script>
  import MusicList from 'components/music-list/music-list'
  import {mapGetters} from 'vuex'
  import {getDetailToplist} from 'api/rank'
  import {ERR_OK} from 'api/config'
  import {createSong} from 'common/js/song'

  export default {
    data() {
      return {
        songs: [],
        rank: true
      }
    },
    computed: {
      title() {
        return this.topList.topTitle
      },
      bgImage() {
        if (this.songs.length) {
          return this.songs[0].image
        }
        return ''
      },
      ...mapGetters([
        'topList'
      ])
    },
    created() {
      this._getDetailToplist()
    },
    methods: {
      _getDetailToplist() {
        if(!this.topList.id){
          this.$router.push('/rank')
          return
        }
        getDetailToplist(this.topList.id)
          .then(res => {
            if (res.code === ERR_OK) {
              this.songs = this._normalizeSongs(res.songlist)
            }
          })
      },
      _normalizeSongs(list) {
        let ret = []
        list.forEach(item => {
          const musicData = item.data
          if (musicData.songid && musicData.albumid) {
            ret.push(createSong(musicData))
          }
        })
        return ret
      }
    },
    components: {
      MusicList
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  .slide-enter-active, .slide-leave-active {
    transition: all 0.3s;
  }

  .slide-enter, .slide-leave-to {
    transform: translate3d(100%, 0, 0); // 100% 移动到屏幕右边
  }
</style>
