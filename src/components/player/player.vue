<template>
  <div class="player" v-show="playList.length>0">
    <transition name="normal"
                @enter="enter"
                @after-enter="afterEnter"
                @leave="leave"
                @after-leave="afterLeave">
      <div class="normal-player" v-show="fullScreen">
        <div class="background">
          <img width="100%" height="100%" :src="currentSong.image">
        </div>
        <!-- 顶部 标题-->
        <div class="top">
          <div @click="back" class="back">
            <i class="icon-back"></i>
          </div>
          <h1 class="title" v-html="currentSong.name"></h1>
          <h2 class="subtitle" v-html="currentSong.singer"></h2>
        </div>
        <!-- 中部 唱片 和 歌词 -->
        <div class="middle"
             @touchstart.prevent="middleTouchStart"
             @touchmove.prevent="middleTouchMove"
             @touchend="middleTouchEnd">
          <div class="middle-l" ref="middleL" @touchstart="cdTouchStart" @touchmove="cdTouchMove">
            <div class="cd-wrapper" ref="cdWrapper">
              <div class="cd" ref="imageCdWrapper">
                <img ref="image" :class="cdCls" class="image" :src="currentSong.image">
              </div>
            </div>
            <div class="playing-lyric-wrapper" ref="playingLyricWrapper">
              <div class="playing-lyric">{{playingLyric}}</div>
            </div>
          </div>
          <Scroll class="middle-r" ref="lyricList">
            <div class="lyric-wrapper">
              <div v-if="currentLyric">
                <p class="text"
                   ref="lyricLine"
                   :class="{'current': currentLineNum === index}"
                   v-for="(line,index) in currentLyric.lines">{{line.txt}}</p>
              </div>
              <div class="pure-music" v-show="isPureMusic">
                <p>{{pureMusicLyric}}</p>
              </div>
            </div>
          </Scroll>
        </div>
        <!-- 底部 操作区-->
        <div class="bottom">
          <div class="dot-wrapper">
            <span class="dot" :class="{'active': currentShow === 'cd'}"></span>
            <span class="dot" :class="{'active': currentShow === 'lyric'}"></span>
          </div>
          <div class="progress-wrapper">
            <span class="time time-l">{{formatTime(currentTime)}}</span>
            <div class="progress-bar-wrapper">
              <ProgressBar ref="progressBar" :percent="percent" @percentChange="onProgressBarChange"
                           @percentChanging="onProgressBarChanging"></ProgressBar>
            </div>
            <span class="time time-r">{{formatTime(currentSong.duration)}}</span>
          </div>
          <div class="operators">
            <div @click="changeMode" class="icon i-left i-small">
              <i :class="iconMode"></i>
            </div>
            <div class="icon i-left" :class="disableCls">
              <i @click="prev" class="icon-prev"></i>
            </div>
            <div class="icon i-center" :class="disableCls">
              <i @click="togglePlaying" :class="playIcon"></i>
            </div>
            <div class="icon i-right" :class="disableCls">
              <i @click="next" class="icon-next"></i>
            </div>
            <div class="icon i-right i-small">
              <i @click="toggleFavorite(currentSong)" class="icon" :class="favoriteIcon"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <transition name="mini">
      <div @click="open" class="mini-player" v-show="!fullScreen">
        <div class="mini-progress-bar">
          <ProgressBar :percent="percent" :canClick="false" :showBtn="false"></ProgressBar>
        </div>
        <div class="icon">
          <div class="imgWrapper" ref="miniWrapper">
            <img ref="miniImage" :class="cdCls" width="40" height="40" :src="currentSong.image">
          </div>
        </div>
        <div class="text">
          <h2 class="name" v-html="currentSong.name"></h2>
          <p class="desc" v-html="currentSong.singer"></p>
        </div>
        <div class="control">
          <ProgressCircle :percent="percent" :radius="radius">
            <i @click.stop.prevent="togglePlaying" :class="miniPlayIcon" class="icon-mini"></i>
          </ProgressCircle>
        </div>
        <div @click.stop="showPlaylist" class="control">
          <i class="icon-playlist"></i>
        </div>
      </div>
    </transition>
    <Playlist ref="playlist"></Playlist>
    <audio ref="audio"
           @playing="ready"
           @error="error"
           @timeupdate="updateTime"
           @ended="end"
           @pause="paused"></audio>
  </div>
</template>

<script>
  import ProgressBar from 'base/progress-bar/progress-bar'
  import ProgressCircle from 'base/progress-circle/progress-circle'
  import Scroll from 'base/scroll/scroll'
  import {mapGetters, mapMutations, mapActions} from 'vuex'
  import animations from 'create-keyframe-animation'
  import {prefixStyle} from 'common/js/dom'
  import {playMode} from 'common/js/config'
  import {isIphoneX} from 'common/js/util'
  import Lyric from 'lyric-parser'
  import Playlist from 'components/playlist/playlist'
  import {playerMixin, favoriteMixin} from 'common/js/mixin'

  const transform = prefixStyle('transform')
  const transitionDuration = prefixStyle('transitionDuration')
  const timeExp = /\[(\d{2}):(\d{2}):(\d{2})]/g

  export default {
    mixins: [
      playerMixin,
      favoriteMixin
    ],
    data() {
      return {
        songReady: false,
        currentTime: 0,
        radius: 32,
        currentLyric: null,
        currentLineNum: 0,
        currentShow: 'cd',
        playingLyric: '',
        isPureMusic: false,
        pureMusicLyric: ''
      }
    },
    computed: {
      playIcon() {
        return this.playing ? 'icon-pause' : 'icon-play'
      },
      miniPlayIcon() {
        return this.playing ? 'icon-pause-mini' : 'icon-play-mini'
      },
      cdCls() {
        return this.playing ? 'play' : ''
      },
      disableCls() {
        return this.songReady ? '' : 'disable'
      },
      percent() {
        return this.currentTime / this.currentSong.duration
      },
      ...mapGetters([
        'fullScreen',
        'playing',
        'currentIndex'
      ])
    },
    created() {
      this.touch = {}
      this.cdTouch = {} // 作用是为 cdmove 的 touch 事件传递共享数据
    },
    mounted() {
      // 适配 iPhoneX
      this.$refs.cdWrapper.style.top = isIphoneX() ? `25px` : 0
      this.$refs.playingLyricWrapper.style.marginTop = isIphoneX() ? `100px` : `30px`
    },
    methods: {
      back() {
        this.setFullScreen(false)
      },
      open() {
        this.setFullScreen(true)
      },
      // 下滑 CD图片 关闭 normal player
      cdTouchStart(e) {
        this.cdTouch.startY = e.touches[0].pageY
      },
      cdTouchMove(e) {
        const deltaY = e.touches[0].pageY - this.cdTouch.startY
        if (deltaY > 120) {
          this.back()
        }
      },
      enter(el, done) {
        const {x, y, scale} = this._getPosAndScale()
        //定义动画关键帧
        let animation = {
          0: {
            transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`
          },
          60: {
            transform: `translate3d(0, 0, 0) scale(1.1)`
          },
          100: {
            transform: `translate3d(0, 0, 0) scale(1)`
          }
        }
        // 注册动画
        animations.registerAnimation({
          name: 'move',
          animation,
          presets: {
            duration: 400,
            easing: 'linear'
          }
        })
        // 运行动画，参数 1.作用的DOM，2.选择的动画 3.执行的回调
        animations.runAnimation(this.$refs.cdWrapper, 'move', done)
      },
      afterEnter(el) {
        animations.unregisterAnimation('move')
        this.$refs.cdWrapper.style.animation = ''
      },
      leave(el, done) {
        this.$refs.cdWrapper.style.transition = 'all 0.4s'
        const {x, y, scale} = this._getPosAndScale()
        this.$refs.cdWrapper.style[transform] = `translate3d(${x}px,${y}px,0) scale(${scale})`
        // 执行动画
        this.$refs.cdWrapper.addEventListener('transitionend', () => {
          done()
        })
      },
      afterLeave(el) {
        this.$refs.cdWrapper.style.transition = ''
        this.$refs.cdWrapper.style[transform] = ''
      },
      _getPosAndScale() {
        const targetWidth = 40  // mini 图的大小
        const paddingLeft = 40  // mini 图的 padding
        const paddingBottom = 30
        const paddingTop = 80   // normal 图的 padding
        const width = window.innerWidth * 0.8 // normal 图 宽度
        const scale = targetWidth / width
        const x = -(window.innerWidth / 2 - paddingLeft)
        const y = window.innerHeight - paddingTop - paddingBottom - width / 2
        return {
          x,
          y,
          scale
        }
      },
      togglePlaying() {
        if (!this.songReady) return
        this.setPlayingState(!this.playing)
        if (this.currentLyric) {
          this.currentLyric.togglePlay()
        }
      },
      prev() {
        if (!this.songReady) return
        if (this.playList.length === 1) {
          this.loop()
          return // 如果只有一首，切换直接返回，不执行后续的 songReady 为 false
        } else {
          let index = this.currentIndex - 1
          if (index === -1) {
            index = this.playList.length - 1
          }
          this.setCurrentIndex(index)
          if (!this.playing) {
            this.togglePlaying()
          }
        }
        this.songReady = false
      },
      next() {
        if (!this.songReady) return
        if (this.playList.length === 1) {
          this.loop()
          return // 如果只有一首，切换直接返回，不执行后续的 songReady 为 false
        } else {
          let index = this.currentIndex + 1
          if (index === this.playList.length) {
            index = 0
          }
          this.setCurrentIndex(index)
          if (!this.playing) {
            this.togglePlaying()
          }
        }
        this.songReady = false
      },
      ready() {
        clearTimeout(this.timer)
        // 监听 playing 这个事件可以确保慢网速或者快速切换歌曲导致的 DOM Exception
        this.songReady = true
        this.canLyricPlay = true // 增加一个标识位处理当歌曲加载晚于歌词的情况
        this.savePlayHistory(this.currentSong)
        // 如果歌曲的播放晚于歌词的出现，播放的时候需要同步歌词
        if (this.currentLyric && !this.isPureMusic) {
          this.currentLyric.seek(this.currentTime * 1000)
        }
      },
      paused() {
        this.setPlayingState(false)
        if (this.currentLyric) {
          this.currentLyric.stop()
        }
      },
      // 保证 在 当前歌曲链接 错误的情况下，用户可以点击下一首播放
      error() {
        clearTimeout(this.timer)
        this.songReady = true
      },
      updateTime(e) {  // 参数是 event 对象
        this.currentTime = e.target.currentTime
      },
      formatTime(interval) {
        interval = interval | 0
        const minute = this._pad(interval / 60 | 0)
        const second = this._pad(interval % 60)
        return `${minute}:${second}`
      },
      _pad(num, n = 2) {  // 补零函数
        let len = num.toString().length
        while (len < n) {
          num = '0' + num
          len++
        }
        return num
      },
      showPlaylist() {
        this.$refs.playlist.show()
      },
      onProgressBarChange(percent) {
        const currentTime = this.currentSong.duration * percent
        this.currentTime = this.$refs.audio.currentTime = currentTime  // 设置当前播放歌曲时间
        if (!this.playing) this.togglePlaying() // 判断是否现在是暂停状态，如果是，继续播放
        if (this.currentLyric) {
          this.currentLyric.seek(currentTime * 1000)  // 设置当前播放歌曲的歌词
        }
      },
      onProgressBarChanging(percent) {
        this.currentTime = this.currentSong.duration * percent
        if (this.currentLyric) {
          this.currentLyric.seek(this.currentTime * 1000)  // 设置当前播放歌曲的歌词
        }
      },
      end() {
        if (this.mode === playMode.loop) {
          this.loop()
        } else {
          this.next()
        }
      },
      loop() {
        this.$refs.audio.currentTime = 0
        this.$refs.audio.play()
        if (this.currentLyric) {
          this.currentLyric.seek(0)  // 重新开始这首歌的歌词
        }
      },
      getLyric() {
        this.currentSong.getLyric()
          .then(lyric => {
            if (this.currentSong.lyric !== lyric) return // 防止歌词不对应
            this.currentLyric = new Lyric(lyric, this.handleLyric)
            // 有可能为纯音乐
            this.isPureMusic = !this.currentLyric.lines.length
            if (this.isPureMusic) {
              this.pureMusicLyric = this.currentLyric.lrc.replace(timeExp, '').trim()
              this.playingLyric = this.pureMusicLyric
            } else {
              if (this.playing && this.canLyricPlay) {
                // 这个时候有可能用户已经播放了歌曲，要切到对应位置
                this.currentLyric.seek(this.currentTime * 1000)
              }
            }
          })
          .catch(() => {
            this.currentLyric = null
            this.playingLyric = ''
            this.currentLineNum = 0
          })
      },
      handleLyric({lineNum, txt}) {
        this.currentLineNum = lineNum
        // 使当前高亮歌词保持最中间
        let middleLine = isIphoneX() ? 7 : 5
        if (lineNum > middleLine) {
          let lineEl = this.$refs.lyricLine[lineNum - middleLine]
          this.$refs.lyricList.scrollToElement(lineEl, 1000)
        } else {
          this.$refs.lyricList.scrollTo(0, 0, 1000)
        }
        this.playingLyric = txt
      },
      middleTouchStart(e) {
        this.touch.initiated = true
        // 用来判断是否是一次移动，比如忽略点击
        this.touch.moved = false
        this.touch.startX = e.touches[0].pageX
        this.touch.startY = e.touches[0].pageY
      },
      middleTouchMove(e) {
        if (!this.touch.initiated) return
        const deltaX = e.touches[0].pageX - this.touch.startX
        const deltaY = e.touches[0].pageY - this.touch.startY
        if (Math.abs(deltaY) > Math.abs(deltaX)) {
          return
        }
        if (!this.touch.moved) {
          this.touch.moved = true
        }
        const left = this.currentShow === 'cd' ? 0 : -window.innerWidth
        const offsetWidth = Math.min(0, Math.max(-window.innerWidth, left + deltaX))
        this.touch.percent = Math.abs(offsetWidth / window.innerWidth)
        this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetWidth}px,0,0)`
        this.$refs.lyricList.$el.style[transitionDuration] = 0
        this.$refs.middleL.style.opacity = 1 - this.touch.percent
        this.$refs.middleL.style[transitionDuration] = 0
      },
      middleTouchEnd() {
        if (!this.touch.moved) {
          return
        }
        let offsetWidth, opacity
        // 从右向左滑 的情况
        if (this.currentShow === 'cd') {
          if (this.touch.percent > 0.2) {
            offsetWidth = -window.innerWidth
            opacity = 0
            this.currentShow = 'lyric'
          } else {
            offsetWidth = 0
            opacity = 1
          }
        } else {
          //  从左向右滑 的情况
          if (this.touch.percent < 0.8) {
            offsetWidth = 0
            opacity = 1
            this.currentShow = 'cd'
          } else {
            offsetWidth = -window.innerWidth
            opacity = 0
          }
        }
        const durationTime = 300
        this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetWidth}px,0,0)`
        this.$refs.lyricList.$el.style[transitionDuration] = `${durationTime}ms`
        this.$refs.middleL.style.opacity = opacity
        this.$refs.middleL.style[transitionDuration] = `${durationTime}ms`
      },
      /**
       * 计算内层Image的transform，并同步到外层容器
       * @param wrapper
       * @param inner
       */
      syncWrapperTransform(wrapper, inner) {
        if (!this.$refs[wrapper]) return

        let imageCdWrapper = this.$refs[wrapper]
        let image = this.$refs[inner]
        let wTransform = getComputedStyle(imageCdWrapper)[transform]
        let iTransform = getComputedStyle(image)[transform]
        imageCdWrapper.style[transform] = wTransform === 'none' ? iTransform : iTransform.concat(' ', wTransform)
      },
      ...mapMutations({
        setFullScreen: 'SET_FULL_SCREEN'
      }),
      ...mapActions([
        'savePlayHistory'
      ])
    },
    watch: {
      currentSong(newSong, oldSong) {
        if (!newSong.id || !newSong.url || newSong.id === oldSong.id) return
        this.songReady = false
        this.canLyricPlay = false
        // 清除歌词计时器
        if (this.currentLyric) {
          this.currentLyric.stop()
          // 重置为null，否则进下首歌歌词会跳动
          this.currentLyric = null
          this.currentTime = 0
          this.playingLyric = ''
          this.currentLineNum = 0
        }
        this.$refs.audio.src = newSong.url
        this.$refs.audio.play()
        clearTimeout(this.timer)
        this.timer = setTimeout(() => {
          this.songReady = true
        }, 5000)
        this.getLyric()
        // 切到后台的时候 JS 是停止的，切换到后台才会重新执行，触发了 end 函数执行 currentSong 的变化，currentSong 改变会影响 audio 的 src 的变化，这个时候如果没有延时立即播放，会导致歌曲还没有准备好就立马调用 play 导致不能播放的问题。
      },
      playing(newFlag) {
        if (!this.songReady) return
        const audio = this.$refs.audio
        this.$nextTick(() => {
          newFlag ? audio.play() : audio.pause()
        })
        if (!newFlag) {
          if (this.fullScreen) {
            this.syncWrapperTransform('imageCdWrapper', 'image')
          } else {
            this.syncWrapperTransform('miniWrapper', 'miniImage')
          }
        }
      },
      // 迷你播放器暂停状态，进入全屏，按钮在进度条最左边
      fullScreen(newVal) {
        if (newVal) {
          setTimeout(() => {
            this.$refs.lyricList.refresh()
            this.$refs.progressBar.setProgressOffset(this.percent)
          }, 20)
        }
      }
    },
    components: {
      ProgressBar,
      ProgressCircle,
      Scroll,
      Playlist
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  @import "~common/scss/variable";
  @import "~common/scss/mixin";

  .player {
    .normal-player {
      position: fixed;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      z-index: 150;
      background: $color-background;
      .background {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        z-index: -1;
        opacity: 0.6;
        filter: blur(20px);
      }
      .top {
        position: relative;
        margin-bottom: 25px;
        .back {
          position: absolute;
          top: 0;
          left: 6px;
          z-index: 50;
          .icon-back {
            display: block;
            padding: 9px;
            font-size: $font-size-large-x;
            color: $color-theme-custom1;
            transform: rotate(-90deg);
          }
        }
        .title {
          width: 70%;
          margin: 0 auto;
          line-height: 40px;
          text-align: center;
          @include no-wrap();
          font-size: $font-size-large;
          color: $color-text;
        }
        .subtitle {
          line-height: 20px;
          text-align: center;
          font-size: $font-size-medium;
          color: $color-text;
        }
      }
      .middle {
        position: fixed;
        width: 100%;
        top: 80px;
        bottom: 170px;
        white-space: nowrap;
        font-size: 0;
        .middle-l {
          display: inline-block;
          vertical-align: top;
          position: relative;
          width: 100%;
          height: 0;
          padding-top: 80%;
          .cd-wrapper {
            position: absolute;
            left: 10%;
            top: 0;
            width: 80%;
            box-sizing: border-box;
            height: 100%;
            .cd {
              width: 100%;
              height: 100%;
              border-radius: 50%;
              .image {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                box-sizing: border-box;
                border-radius: 50%;
                border: 10px solid rgba(255, 255, 255, 0.1);
              }
              .play {
                animation: rotate 20s linear infinite;
              }
            }
          }
          .playing-lyric-wrapper {
            width: 80%;
            margin: 50px auto 0 auto;
            overflow: hidden;
            text-align: center;
            .playing-lyric {
              height: 20px;
              line-height: 20px;
              font-size: $font-size-medium;
              color: $color-text-l;
            }
          }
        }
        .middle-r {
          display: inline-block;
          vertical-align: top;
          width: 100%;
          height: 100%;
          overflow: hidden;
          .lyric-wrapper {
            width: 80%;
            margin: 0 auto;
            overflow: hidden;
            text-align: center;
            .text {
              line-height: 32px;
              color: $color-text-l;
              font-size: $font-size-medium;
              &.current {
                color: $color-text;
              }
            }
            .pure-music {
              padding-top: 50%;
              line-height: 32px;
              color: $color-text-l;
              font-size: $font-size-medium;
            }
          }
        }
      }
      .bottom {
        position: absolute;
        bottom: 50px;
        width: 100%;
        .dot-wrapper {
          text-align: center;
          font-size: 0;
          .dot {
            display: inline-block;
            vertical-align: middle;
            margin: 0 4px;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: $color-text-l;
            &.active {
              width: 20px;
              border-radius: 5px;
              background: $color-bg-custom;
            }
          }
        }
        .progress-wrapper {
          display: flex;
          align-items: center;
          width: 85%;
          margin: 0px auto;
          padding: 10px 0;
          .time {
            color: $color-text;
            font-size: $font-size-small;
            flex: 0 0 35px;
            width: 30px;
            line-height: 30px;
            &.time-l {
              text-align: left;
              margin-right: 5px;
            }
            &.time-r {
              text-align: right;
              margin-left: 5px;
            }
          }
          .progress-bar-wrapper {
            flex: 1;
          }
        }
        .operators {
          display: flex;
          align-items: center;
          .icon {
            flex: 1;
            color: $color-theme-custom1;
            &.disable {
              color: $color-theme-custom2;
            }
            i {
              font-size: 30px;
            }
          }
          .i-small {
            i {
              font-size: 25px;
            }
          }
          .i-left {
            text-align: right;
          }
          .i-center {
            padding: 0 20px;
            text-align: center;
            i {
              font-size: 50px;
            }
          }
          .i-right {
            text-align: left;
          }
          .icon-favorite {
            color: $color-sub-theme;
          }
        }
      }
      &.normal-enter-active, &.normal-leave-active {
        transition: all .4s;
        .top, .bottom {
          transition: all .4s cubic-bezier(0.86, 0.18, 0.82, 1.32);
        }
      }
      &.normal-enter, &.normal-leave-to {
        opacity: 0;
        .top {
          transform: translate3d(0, -100px, 0);
        }
        .bottom {
          transform: translate3d(0, 100px, 0);
        }
      }
    }
    .mini-player {
      display: flex;
      align-items: center;
      position: fixed;
      left: 0;
      bottom: 0;
      z-index: 180;
      width: 100%;
      height: 60px;
      background: $color-highlight-background;
      &.mini-enter-active, &.mini-leave-active {
        transition: all 0.4s;
      }
      &.mini-enter, &.mini-leave-to {
        opacity: 0;
      }
      .mini-progress-bar {
        position: absolute;
        width: 100%;
        bottom: 47px;
      }
      .icon {
        flex: 0 0 40px;
        width: 40px;
        height: 40px;
        padding: 0 10px 0 20px;
        .imgWrapper {
          height: 100%;
          width: 100%;
          img {
            border-radius: 50%;
            &.play {
              animation: rotate 10s linear infinite;
            }
            &.pause {
              animation-play-state: paused;
            }
          }
        }
      }
      .text {
        display: flex;
        flex-direction: column;
        justify-content: center;
        flex: 1;
        line-height: 20px;
        overflow: hidden;
        .name {
          margin-bottom: 2px;
          @include no-wrap();
          font-size: $font-size-medium;
          color: $color-text;
        }
        .desc {
          @include no-wrap();
          font-size: $font-size-small;
          color: $color-text-d;
        }
      }
      .control {
        flex: 0 0 30px;
        width: 30px;
        padding: 0 10px;
        .icon-play-mini, .icon-pause-mini, .icon-playlist {
          font-size: 30px;
          color: $color-theme-custom1;
        }
        .icon-mini {
          font-size: 32px;
          position: absolute;
          left: 0;
          top: 0;
        }
      }
    }
  }

  @keyframes rotate {
    0% {
      transform: rotate(0)
    }
    100% {
      transform: rotate(360deg)
    }
  }
</style>
