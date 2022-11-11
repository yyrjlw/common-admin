<script setup lang="ts">
import { RouterView } from "vue-router";
import zhCn from "element-plus/dist/locale/zh-cn.mjs";
</script>

<template>
  <el-config-provider :locale="zhCn">
    <RouterView #="{ Component }">
      <component :is="Component" />
    </RouterView>
  </el-config-provider>
</template>

<style lang="scss">
@use "./styles/reset.scss";
@use "./styles/base.css";
@use "nprogress/nprogress.css";
@use "element-plus/theme-chalk/dark/css-vars.css";
</style>
