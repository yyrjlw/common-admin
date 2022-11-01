<template>
  <div class="login h-full bg-[url('@/assets/login-bg.svg')] bg-100">
    <div class="login-form-container mt-60 flex h-full flex-col items-center">
      <div class="header flex items-center pb-10">
        <img src="@/assets/images/logo.png" class="logo" width="50" />
        <div class="title ml-2 text-2xl font-bold">Common-Admin</div>
      </div>
      <el-form :model="loginForm" size="large" class="w-96">
        <el-input
          v-model="loginForm.userName"
          class="mb-5"
          placeholder="请输入用户名"
          :prefix-icon="User"
        />
        <el-input
          type="password"
          class="mb-5"
          v-model="loginForm.password"
          show-password
          placeholder="请输入密码"
          :prefix-icon="Lock"
        />
        <el-input
          class="mb-5"
          v-model="loginForm.captcha"
          show-password
          placeholder="请输入验证码"
          :prefix-icon="MessageBox"
        >
          <template #suffix>
            <img class="h-full" :src="imgForCaptCha" alt="验证码加载异常" />
          </template>
        </el-input>
        <el-button type="primary" class="w-full">登录</el-button>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import { User, Lock, MessageBox } from "@element-plus/icons-vue";

const imgForCaptCha = ref();

const loginForm = reactive({
  userName: null,
  password: null,
  timestamp: null,
  captcha: null,
});
</script>

<style scoped lang="scss"></style>
