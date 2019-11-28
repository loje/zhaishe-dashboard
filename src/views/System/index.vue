<template>
  <div class="system-layer">
    <template v-if="$route.path === '/system'"></template>
    <template v-else>
      <keep-alive>
        <router-view v-if="$route.meta.keepAlive"></router-view>
      </keep-alive>
      <router-view v-if="!$route.meta.keepAlive"></router-view>
    </template>
  </div>
</template>