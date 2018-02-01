<template>
  <div id="app">
    <m-header></m-header>
    <Tab></Tab>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    <Player></Player>
  </div>
</template>

<script>
  import MHeader from 'components/m-header/m-header.vue'
  import Tab from 'components/tab/tab.vue'
  import Player from 'components/player/player.vue'

  export default {
    components: {
      MHeader,
      Tab,
      Player
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
</style>
