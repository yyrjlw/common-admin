<template>
  <template v-for="item of realMenus" :key="item.meta.fullPath">
    <el-sub-menu v-if="item.meta?.menuType === 0" :index="item.meta.fullPath">
      <template #title>
        <!-- <el-icon><location /></el-icon> -->
        <span>{{ item.meta.title }}</span>
      </template>
      <side-menu :menus="item.children"></side-menu>
    </el-sub-menu>
    <el-menu-item
      v-else-if="item.meta?.menuType === 1"
      :index="item.meta.fullPath"
      >{{ item.meta.title }}</el-menu-item
    >
  </template>
</template>

<script setup lang="ts">
import { useAuthStore } from "@/stores/auth";
import { computed } from "vue";
import type { RouteRecordRaw } from "vue-router";

const authStore = useAuthStore();

const props = defineProps<{
  menus?: RouteRecordRaw[];
}>();

const realMenus = props.menus ?? computed(() => authStore.menus).value;
</script>

<style scoped></style>
