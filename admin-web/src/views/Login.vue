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
          placeholder="请输入验证码"
          :prefix-icon="MessageBox"
        >
          <template #suffix>
            <img
              class="cursor-pointer"
              :src="imgForCaptCha"
              alt="验证码加载异常"
              @click="loadCaptchaImg"
            />
          </template>
        </el-input>
        <el-button type="primary" class="w-full" @click="loginHandle"
          >登录</el-button
        >
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import { User, Lock, MessageBox } from "@element-plus/icons-vue";
import { getCaptchaImg } from "@/api/auth";
import { useAdminStore } from "@/stores/admin";

const adminStore = useAdminStore();

const imgForCaptCha = ref();
const loadCaptchaImg = () =>
  getCaptchaImg({
    width: 100,
    height: 40,
  }).then(({ data }) => {
    imgForCaptCha.value = data.img;
    loginForm.captchaID = data.id;
  });
loadCaptchaImg();

const loginForm = reactive({
  userName: "",
  password: "",
  captcha: "",
  captchaID: "",
});

const loginHandle = () => {
  if (!loginForm.userName.trim() || !loginForm.password.trim()) {
    return ElMessage.warning({ message: "用户名或密码不能为空!" });
  }
  if (!loginForm.captcha.trim()) {
    return ElMessage.warning({ message: "请输入验证码!" });
  }
  adminStore.login(loginForm).catch(() => {
    loadCaptchaImg();
  });
};
</script>

<style scoped lang="scss"></style>
