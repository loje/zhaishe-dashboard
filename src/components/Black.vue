<template>
  <div class="black">
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view>
  </div>
</template>

<style lang="scss" scoped>
.black {
  width: 100%;
  height: 100%;
  overflow: auto;
}
</style>