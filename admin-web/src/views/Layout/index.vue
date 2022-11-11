<template>
  <div class="common-layout h-full">
    <el-container class="h-full">
      <el-aside class="h-full" width="220px">
        <div class="title py-3 text-center">Common-Admin</div>
        <el-menu
          :default-active="$route.meta.fullPath"
          style="border-right: 0"
          router
        >
          <side-menu></side-menu>
        </el-menu>
      </el-aside>
      <el-container class="h-full">
        <el-header>Header</el-header>
        <el-main class="h-full">
          <RouterView></RouterView>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import { RouterView, useRoute } from "vue-router";
import SideMenu from "./components/SideMenu.vue";
</script>

<style scoped></style>
