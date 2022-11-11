<template>
  <div class="login h-full bg-[url('@/assets/login-bg.svg')] bg-100">
    <div class="login-form-container flex flex-col items-center pt-60">
      <div class="header flex items-center pb-10">
        <img src="@/assets/images/logo.png" class="logo" width="50" />
        <div class="title ml-2 text-2xl font-bold">Common-Admin</div>
      </div>
      <el-form
        :model="loginForm"
        size="large"
        class="w-96"
        @keydown.enter="loginHandle"
      >
        <el-input
          v-model.trim="loginForm.userName"
          class="mb-5"
          placeholder="请输入用户名"
          :prefix-icon="User"
        />
        <el-input
          type="password"
          class="mb-5"
          v-model.trim="loginForm.password"
          show-password
          placeholder="请输入密码"
          :prefix-icon="Lock"
        />
        <el-input
          class="mb-5"
          v-model.trim="loginForm.captcha"
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
        <el-button
          type="primary"
          class="w-full"
          @click="loginHandle"
          :loading="isLoading"
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
import { useAuthStore } from "@/stores/auth";
import { cloneDeep } from "lodash";
import { useRoute, useRouter } from "vue-router";

const adminStore = useAuthStore();
const route = useRoute();
const router = useRouter();

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
  userName: "admin",
  password: "admin123",
  captcha: "gerg",
  captchaID: "",
});

const isLoading = ref(false);

const loginHandle = () => {
  if (!loginForm.userName || !loginForm.password) {
    return ElMessage.warning({ message: "用户名或密码不能为空!" });
  }
  if (!loginForm.captcha) {
    return ElMessage.warning({ message: "请输入验证码!" });
  }
  isLoading.value = true;
  adminStore
    .login(cloneDeep(loginForm))
    .then(() => router.replace((route.query.redirect as string) ?? "/"))
    .catch((err) => {
      console.error(err);
      loadCaptchaImg();
    })
    .finally(() => (isLoading.value = false));
};
</script>

<style scoped lang="scss"></style>
