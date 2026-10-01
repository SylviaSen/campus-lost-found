<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { supabase } from './lib/supabase'

const router = useRouter()
const userEmail = ref('')

// 获取当前登录用户
async function getUser() {
  const { data } = await supabase.auth.getUser()
  userEmail.value = data.user?.email || ''
}

// 退出登录
async function handleLogout() {
  await supabase.auth.signOut()
  userEmail.value = ''
  ElMessage.success('已退出')
  router.push('/')
}

onMounted(() => {
  getUser()
  // 监听登录状态变化
  supabase.auth.onAuthStateChange(() => {
    getUser()
  })
})
</script>

<template>
  <el-container>
    <el-header class="header">
      <div class="logo">校园失物招领</div>
      <el-menu mode="horizontal" :ellipsis="false" router background-color="#2c3e50" text-color="#fff" active-text-color="#ffd04b">
        <el-menu-item index="/">首页</el-menu-item>
        <el-menu-item index="/publish">发布</el-menu-item>
        <el-menu-item index="/mine">我的</el-menu-item>
        <el-menu-item v-if="!userEmail" index="/login">登录</el-menu-item>
      </el-menu>
      <div v-if="userEmail" class="user-info">
        <span>{{ userEmail }}</span>
        <el-button size="small" @click="handleLogout">退出</el-button>
      </div>
    </el-header>
    <el-main>
      <router-view />
    </el-main>
  </el-container>
</template>

<style>
body {
  margin: 0;
  font-family: -apple-system, "Microsoft YaHei", sans-serif;
  background: #f5f6fa;
}
.header {
  background: linear-gradient(rgba(44, 62, 80, 0.7), rgba(44, 62, 80, 0.7)), url('/banner.jpg');
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
}
.logo {
  color: #fff;
  font-size: 20px;
  font-weight: bold;
}
.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #fff;
  font-size: 14px;
}
</style>