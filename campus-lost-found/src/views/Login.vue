<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { supabase } from '../lib/supabase'

const router = useRouter()
const email = ref('')
const password = ref('')
const loading = ref(false)

// 登录
async function handleLogin() {
  if (!email.value || !password.value) {
    ElMessage.warning('请输入邮箱和密码')
    return
  }
  loading.value = true
  const { error } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value,
  })
  loading.value = false
  if (error) {
    ElMessage.error('登录失败：' + error.message)
  } else {
    ElMessage.success('登录成功')
    router.push('/')
  }
}

// 注册
async function handleRegister() {
  if (!email.value || !password.value) {
    ElMessage.warning('请输入邮箱和密码')
    return
  }
  loading.value = true
  const { error } = await supabase.auth.signUp({
    email: email.value,
    password: password.value,
  })
  loading.value = false
  if (error) {
    ElMessage.error('注册失败：' + error.message)
  } else {
    ElMessage.success('注册成功，请登录')
  }
}
</script>

<template>
  <div class="login-wrap">
    <el-card class="login-card">
      <h2>登录 / 注册</h2>
      <el-form label-position="top">
        <el-form-item label="邮箱">
          <el-input v-model="email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="password" type="password" placeholder="请输入密码" show-password />
        </el-form-item>
        <div class="btn-row">
          <el-button type="primary" :loading="loading" @click="handleLogin">登录</el-button>
          <el-button :loading="loading" @click="handleRegister">注册</el-button>
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<style scoped>
.login-wrap {
  display: flex;
  justify-content: center;
  padding: 60px 20px;
}
.login-card {
  width: 400px;
}
.btn-row {
  display: flex;
  gap: 12px;
  margin-top: 8px;
}
</style>