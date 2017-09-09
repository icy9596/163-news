<template>
  <div id="app">
    <ViewBox>
      <!-- 头部标题 -->
      <XHeader title = "网易新闻" slot="header" class="header">
        <span slot="overwrite-left">直播</span>
        <span slot="right">搜索</span>
      </XHeader>
      
      <div class="content">
        <router-view></router-view>
      </div>

      <!-- 底部按钮 -->
      <Tabbar slot="bottom">
        <TabbarItem selected link="/news">
          <span slot="icon">
            <img src="./assets/icon_nav_article.png"></img>
          </span>
          <span slot="label">新闻</span>
        </TabbarItem>
        <TabbarItem link="/discover">
          <span slot="icon">
            <img src="./assets/icon_nav_button.png"></img>
          </span>
          <span slot="label">发现</span>
        </TabbarItem>
        <TabbarItem link="/game">
          <span slot="icon" link="/news/game">
            <img src="./assets/icon_nav_cell.png"></img>
          </span>
          <span slot="label">游戏</span>
        </TabbarItem>
        <TabbarItem link="/setting">
          <span slot="icon">
            <img src="./assets/icon_nav_msg.png"></img>
          </span>
          <span slot="label">设置</span>
        </TabbarItem>
      </Tabbar>
    </ViewBox>
  </div>
</template>

<script>
  import { XHeader, Tabbar, TabbarItem, ViewBox } from 'vux';
  import router from './common/js/router.js';

  export default {
    data () {
      return {};
    },
    router,
    components: {
      XHeader,
      Tabbar,
      TabbarItem,
      ViewBox
    }
  };
</script>

<style lang="less">
@import '~vux/src/styles/reset.less';

html,body {
  width: 100%;
  height: 100%;
  overflow-x: hidden
}

#app {
  height: 100%;

  .header {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 999;
  }

  .content {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    padding-top: 46px;
    overflow: hidden;
  }

  .footer {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    z-index: 999;
  }

  /* .slide-enter-active, .slide-leave-active {
    transition: transform 0.3s;
  }
  .slide-enter {
    transform: translate3d(100%, 0, 0);
  }
  .slide-leave-to {
    transform: translate3d(-100%, 0, 0);
  } */
}

</style>
