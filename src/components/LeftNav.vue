<template>
  <div style="width: 100%">
    <template v-for="(items, $index) in leftNav">
    <div class="nav" :key="$index">
      <router-link class="title" :to="items.path">{{items.name}}</router-link>

      <div class="children">
        <template v-for="(item, $i) in items.children">
        <router-link class="child-title" :key="$i" :to="item.path">{{item.name}}</router-link>
        </template>
      </div>
    </div>
    </template>
  </div>
</template>

<script>
import leftNav from '@/router/leftnav';

export default {
  data() {
    return {
      leftNav,
    }
  },
};
</script>

<style lang="scss" scope>
  .nav {
    margin-bottom: 30px;
    width: 100%;
    .title {
      display: block;
      text-decoration: none;
      padding-left: 30px;
      width: 100%;
      height: 50px;
      line-height: 50px;
      font-size: 18px;
      box-sizing: border-box;
      color: #333;
      cursor: pointer;
      &:hover {
        background-color: #EFF1F2;
      }
      &.router-link-exact-active.router-link-active {
        background-color: #EFF1F2;
      }
    }
    .children {
      width: 100%;
      .child-title {
        padding-left: 30px;
        display: block;
        text-decoration: none;
        width: 100%;
        height: 50px;
        line-height: 50px;
        font-size: 14px;
        color: #333;
        box-sizing: border-box;
        cursor: pointer;
        &:hover {
          background-color: #EFF1F2;
        }
        &.router-link-active {
          background-color: #EFF1F2;
        }
        &.router-link-exact-active.router-link-active {
          background-color: #EFF1F2;
        }
      }
    }
  }
</style>