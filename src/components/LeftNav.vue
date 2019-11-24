<template>
  <div style="width: 100%">
    <template v-for="(items, $index) in leftNav">
    <div class="nav" :key="$index">
      <div class="title">{{items.name}}</div>
      <div class="children">
        <template v-for="(item, $i) in items.children">
        <div class="child-title" :key="$i">{{item.name}}</div>
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
    margin-bottom: 50px;
    width: 100%;
    .title {
      padding-left: 30px;
      width: 100%;
      height: 50px;
      line-height: 50px;
      font-size: 18px;
      box-sizing: border-box;
      color: #333;
      &:hover {
        background-color: #EFF1F2;
      }
      .avtive {
        background-color: #EFF1F2;
      }
    }
    .children {
      width: 100%;
      .child-title {
        padding-left: 30px;
        width: 100%;
        height: 50px;
        line-height: 50px;
        font-size: 14px;
        color: #333;
        box-sizing: border-box;
        &:hover {
          background-color: #EFF1F2;
        }
        .avtive {
          background-color: #EFF1F2;
        }
      }
    }
  }
</style>