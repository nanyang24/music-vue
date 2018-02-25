<template>
  <div class="music-list">
    <div @click="back" class="back">
      <i class="icon-back"></i>
    </div>
    <h1 class="title">{{title}}</h1>
    <div class="bg-image" :style="bgStyle" ref="bgImage">
      <div class="play-wrapper">
        <div @click="randomPlay" ref="playBtn" v-show="songs.length>0" class="play">
          <i class="icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
      <div class="filter" ref="filter"></div>
    </div>
    <div class="bg-layer" ref="layer"></div>
    <Scroll @scroll="scroll" ref="list" class="list" :click="click" :probeType="probeType" :listenScroll="listenScroll">
      <div class="song-list-wrapper">
        <SongList @select="selectItem" :songs="songs" :rank="rank"></SongList>
      </div>
      <div class="loading-container" v-show="!songs.length">
        <Loading></Loading>
      </div>
    </Scroll>
  </div>
</template>

<script>
  import SongList from 'base/song-list/song-list'
  import Loading from 'base/loading/loading'
  import Scroll from 'base/scroll/scroll'
  import {prefixStyle} from 'common/js/dom'
  import {mapActions} from 'vuex'
  import {playListMixin} from 'common/js/mixin'

  const RESERVED_HEIGHT = 45
  const transform = prefixStyle('transform')
  const backdrop = prefixStyle('backdrop-filter')

  export default {
    mixins: [
      playListMixin
    ],
    props: {
      bgImage: {
        type: String,
        default: ''
      },
      songs: {
        type: Array,
        default: []
      },
      title: {
        type: String,
        default: ''
      },
      rank: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        click: true,
        scrollY: 0
      }
    },
    computed: {
      bgStyle() {
        return `background-image:url(${this.bgImage})`
      }
    },
    created() {
      this.probeType = 3
      this.listenScroll = true
    },
    mounted() {
      this.imageHeight = this.$refs.bgImage.clientHeight
      this.$refs.list.$el.style.top = `${this.imageHeight}px` // 对于 Vue 组件，this.$refs.xxx 拿到的是 Vue 实例，所以需要再通过 $el 拿到真实的 dom
      this.minTransalteY = -this.imageHeight + RESERVED_HEIGHT
    },
    methods: {
      handlePlayList(playList) {
        const bottom = playList.length ? `60px` : ``
        this.$refs.list.$el.style.bottom = bottom
        this.$refs.list.refresh()
      },
      scroll(pos) {
        this.scrollY = pos.y
      },
      back() {
        this.$router.back()
      },
      selectItem(item, index) {
        this.selectToPlay({
          list: this.songs,
          index
        })
      },
      randomPlay() {
        this.randomToPlay({
          list: this.songs
        })
      },
      ...mapActions([
        'selectToPlay',
        'randomToPlay'
      ])
    },
    watch: {
      scrollY(newY) {
        let translateY = Math.max(this.minTransalteY, newY)   // 最远滚动距离就是 minTransalteY
        let zIndex = 0
        let scale = 1
        let blur = 0
        const percent = Math.abs(newY / this.imageHeight)

        this.$refs.layer.style[transform] = `translate3d(0,${translateY}px,0)`
        // 如果向上拉
        if (newY < this.minTransalteY) {
          zIndex = 10
          this.$refs.bgImage.style.paddingTop = 0
          this.$refs.bgImage.style.height = `${RESERVED_HEIGHT}px`
          this.$refs.playBtn.style.display = 'none'
        } else {
          this.$refs.bgImage.style.paddingTop = '70%'
          this.$refs.bgImage.style.height = 0
          this.$refs.playBtn.style.display = ''
        }
        // 如果向下拉，也就是 newY > 0
        if (newY > 0) {
          scale = 1 + percent
          zIndex = 10
        } else {
          blur = Math.min(20 * percent, 20)
        }
        this.$refs.filter.style[backdrop] = `blur(${blur}px)`
        this.$refs.bgImage.style.zIndex = zIndex
        this.$refs.bgImage.style[transform] = `scale(${scale})`
      }
    },
    components: {
      Scroll,
      SongList,
      Loading
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  @import "~common/scss/variable";
  @import "~common/scss/mixin";

  .music-list {
    position: fixed;
    z-index: 100;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: $color-background;
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
    .title {
      position: absolute;
      top: 4px;
      left: 10%;
      z-index: 40;
      width: 80%;
      @include no-wrap();
      text-align: center;
      line-height: 45px;
      font-size: $font-size-large;
      color: $color-text;
    }
    .bg-image {
      position: relative;
      width: 100%;
      height: 0;
      padding-top: 70%;
      transform-origin: top;
      background-size: cover;
      .play-wrapper {
        position: absolute;
        bottom: 20px;
        z-index: 50;
        width: 100%;
        .play {
          box-sizing: border-box;
          width: 135px;
          padding: 7px 0;
          margin: 0 auto;
          text-align: center;
          border: 1px solid $color-theme;
          color: $color-theme;
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
      }
      .filter {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(7, 17, 27, 0.4);
      }
    }
    .bg-layer {
      position: relative;
      height: 100%;
      background: $color-background;
    }
    .list {
      position: absolute;
      top: 0;
      bottom: 0;
      width: 100%;
      background: $color-background;
      /*overflow: hidden;*/
      .song-list-wrapper {
        padding: 20px 30px;
      }
      .loading-container {
        position: absolute;
        width: 100%;
        top: 50%;
        transform: translateY(-50%);
      }
    }
  }
</style>
