<template>
  <div style="width: 100%">
    <el-menu
      :default-openeds="['0', '1', '2', '3', '4', '5']"
      class="el-menu-vertical-demo"
      @open="handleOpen"
      @close="handleClose"
      text-color="#333"
      active-text-color="#333">
      <template v-for="(items, $index) in leftNav">
      <el-menu-item :index="$index.toString()" @click="$router.push(items.path)" :key="$index" v-if="items.meta.menu === true && !items.children">
        <i class="el-icon-menu"></i>
        <span slot="title">{{items.name}}</span>
      </el-menu-item>

      <el-submenu :index="$index.toString()" :key="$index" v-else-if="items.meta.menu === true && items.children">
        <template slot="title">
          <i class="el-icon-menu"></i>
          <span>{{items.name}}</span>
        </template>
        <el-menu-item-group>
          <template v-for="(item, $i) in items.children">
          <el-menu-item :index="$i.toString()" :key="$i" @click="$router.push(item.path)" v-if="item.meta.menu" :style="{backgroundColor: $route.path === item.path ?  '#fffaea' : ''}">{{item.name}}</el-menu-item>
          </template>
        </el-menu-item-group>
      </el-submenu>
      </template>
    </el-menu>
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
  methods: {
    handleOpen() {},
    handleClose() {},
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