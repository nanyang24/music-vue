<template>
  <transition name="slide">
    <div class="user-center">
      <div @click="back" class="back">
        <div class="icon-back"></div>
      </div>
      <div class="switches-wrapper">
        <Switches @switch="switchItem" :currentIndex="currentIndex" :switches="switches"></Switches>
      </div>
      <div @click="randomPlay" class="play-btn" ref="playBtn">
        <i class="icon-play"></i>
        <span class="text">随机播放全部</span>
      </div>
      <div class="list-wrapper" ref="listWrapper">
        <Scroll v-if="currentIndex === 0" ref="favoriteList" class="list-scroll" :click="click">
          <div class="list-inner">
            <SongList @select="selectSong" :songs="favoriteList"></SongList>
          </div>
        </Scroll>
        <Scroll v-if="currentIndex === 1" ref="playList" class="list-scroll" :click="click">
          <div class="list-inner">
            <SongList @select="selectSong" :songs="playHistory"></SongList>
          </div>
        </Scroll>
      </div>
      <div class="no-result-wrapper" v-show="noResult">
        <NoResult :title="noResultTitle"></NoResult>
      </div>
    </div>
  </transition>
</template>

<script>
  import Switches from 'base/switches/switches'
  import {mapGetters, mapMutations, mapActions} from 'vuex'
  import Scroll from 'base/scroll/scroll'
  import SongList from 'base/song-list/song-list'
  import {playListMixin} from 'common/js/mixin'
  import NoResult from 'base/no-result/no-result'

  export default {
    mixins: [
      playListMixin
    ],
    data() {
      return {
        click: true,
        currentIndex: 0,
        switches: [
          {name: '我喜欢的'},
          {name: '最近听过'}
        ]
      }
    },
    computed: {
      noResult() {
        return this.currentIndex === 0 ? !this.favoriteList.length : !this.playHistory.length
      },
      noResultTitle() {
        return this.currentIndex === 0 ? '暂无收藏歌曲' : '你还没听过歌曲'

      },
      ...mapGetters([
        'favoriteList',
        'playHistory'
      ])
    },
    methods: {
      handlePlayList(playList) {
        const bottom = playList.length ? `60px` : ``
        this.$refs.listWrapper.style.bottom = bottom
        this.$refs.favoriteList && this.$refs.favoriteList.refresh()
        this.$refs.playList && this.$refs.playList.refresh()
      },
      switchItem(index) {
        this.currentIndex = index
      },
      selectSong(song) {
        this.insertSong(song)
      },
      back() {
        this.$router.back()
      },
      randomPlay() {
        let list = this.currentIndex === 0 ? this.favoriteList : this.playHistory
        if (list.length === 0) return

        this.randomToPlay({list})
      },
      ...mapActions([
        'insertSong',
        'randomToPlay'
      ])
    },
    components: {
      Switches,
      Scroll,
      SongList,
      NoResult
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  @import '~common/scss/variable';

  .user-center {
    position: fixed;
    top: 0;
    bottom: 0;
    z-index: 100;
    width: 100%;
    background: $color-background;
    &.slide-enter-active, &.slide-leave-active {
      transition: all .3s;
    }
    &.slide-enter, &.slide-leave-to {
      transform: translate3d(100%, 0, 0);
    }
    .back {
      position: absolute;
      top: 6px;
      left: 6px;
      z-index: 50;
      .icon-back {
        display: block;
        padding: 10px;
        font-size: $font-size-large-x;
        color: $color-theme-custom1;
      }
    }
    .switches-wrapper {
      margin: 10px 0 30px 0
    }
    .play-btn {
      box-sizing: border-box;
      width: 135px;
      padding: 7px 0;
      margin: 0 auto;
      text-align: center;
      border: 1px solid $color-text-l;
      color: $color-text-l;
      border-radius: 100px;
      font-size: 0;
      .icon-play {
        display: inline-block;
        vertical-align: middle;
        margin-right: 6px;
        font-size: $font-size-medium-x;
        color: $color-theme-custom1;
      }
      .text {
        display: inline-block;
        vertical-align: middle;
        font-size: $font-size-small;
      }
    }
    .list-wrapper {
      position: absolute;
      top: 110px;
      bottom: 0;
      width: 100%;
      .list-scroll {
        height: 100%;
        overflow: hidden;
        .list-inner {
          padding: 20px 30px;
        }
      }
    }
    .no-result-wrapper {
      position: absolute;
      width: 100%;
      top: 50%;
      transform: translateY(-50%);
    }
  }
</style>
