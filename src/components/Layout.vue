<template>
  <div class="layout">
    <div class="layout-top">
      <div class="logo" @click="$router.push('/')">
        <div class="img" style="background-image: url(http://lc-vwzM34py.cn-n1.lcfile.com/93e2bac101ef97002df9/%E5%BE%AE%E4%BF%A1%E6%88%AA%E5%9B%BE_20191112155535.png);"></div>
        <!--<span>设计师活动聚集地</span>-->
      </div>
      <div class="top-right">
        <span class="user-info">{{$store.state.user.username}}</span>
        <el-link class="log-out" @click="logout">退出登录</el-link>
      </div>
    </div>
    <div class="layout-main">
      <div class="left-nav">
        <LeftNav></LeftNav>
      </div>
      <div class="main">
        <keep-alive>
          <router-view v-if="$route.meta.keepAlive"></router-view>
        </keep-alive>
        <router-view v-if="!$route.meta.keepAlive"></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import LeftNav from '@/components/LeftNav'

export default {
  data() {
    return{}
  },
  components: {
    LeftNav,
  },
  methods: {
    logout() {
      localStorage.removeItem('userInfo');
      location.reload();
    },
  },
};
</script>

<style lang="scss" scope>
  .layout {
    width: 100vw;
    height: 100vh;
    background-color: rgb(246, 248, 249);

    .layout-top {
      position: relative;
      width: 100%;
      height: 112px;
      background-color: #fff;
      .logo {
        width: 167px;
        line-height: 112px;
        cursor: pointer;
        .img {
          display: inline-block;
          margin-left: 29px;
          width: 167px;
          height: 47px;
          vertical-align: middle;
          background-size: 100%;
        }
        span {
          display: inline-block;
          padding-left: 16px;
          border-left: 1px dotted #EBEBEB;
          font-size: 16px;
          font-family: PingFang SC Regular;
          color: rgba(153,153,153,1);
          line-height: 52px;
          letter-spacing: 2px;
          vertical-align: middle;
        }
      }
      .top-right {
        position: absolute;
        right: 52px;
        top: 0;
        display: flex;
        align-items: center;
        height: 100%;
        .user-info {
          margin-right: 15px;
          color: #333;
        }
      }
    }
    .layout-main {
      display: flex;
      width: 100%;
      height: calc(100% - 112px);
      .left-nav {
        margin-right: 54px;
        padding-top: 50px;
        width: 220px;
        height: 100%;
        overflow: auto;
        box-sizing: border-box;
      }
      .main {
        padding-top: 50px;
        width: calc(100% - 320px);
        height: 100%;
        box-sizing: border-box;
      }
    }
  }
</style>
