<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { supabase } from '../lib/supabase'
import { relativeTime } from '../lib/time'

const route = useRoute()
const router = useRouter()
const item = ref<any>(null)
const loading = ref(true)
const errorMsg = ref('')

onMounted(async () => {
  const id = route.params.id
  const { data, error } = await supabase
    .from('items')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    errorMsg.value = error.message
  } else {
    item.value = data
  }
  loading.value = false
})

function copyContact() {
  if (item.value?.contact) {
    navigator.clipboard.writeText(item.value.contact)
    alert('已复制联系方式')
  }
}
</script>

<template>
  <div class="detail-wrap">
    <el-button @click="router.back()" style="margin-bottom: 16px;">← 返回</el-button>

    <p v-if="loading">加载中...</p>
    <p v-else-if="errorMsg" style="color: red;">读取失败：{{ errorMsg }}</p>
    <el-card v-else>
      <img v-if="item.image_url" :src="item.image_url" class="detail-img" />

      <div class="title-row">
        <h2>{{ item.title }}</h2>
        <el-tag :type="item.type === '失物' ? 'danger' : 'success'">{{ item.type }}</el-tag>
        <el-tag :type="item.status === '已找到' ? 'success' : 'info'">{{ item.status }}</el-tag>
      </div>
      <p class="desc">{{ item.description }}</p>
      <div class="contact">
        <span>联系方式：{{ item.contact }}</span>
        <el-button size="small" @click="copyContact">复制</el-button>
      </div>
      <p class="time">发布时间：{{ relativeTime(item.created_at) }}</p>
    </el-card>
  </div>
</template>

<style scoped>
.detail-wrap {
  max-width: 700px;
  margin: 0 auto;
  padding: 24px;
}
.detail-img {
  width: 100%;
  max-height: 400px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 16px;
}
.title-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}
.title-row h2 {
  margin: 0;
}
.desc {
  font-size: 16px;
  line-height: 1.6;
  color: #333;
}
.contact {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 16px 0;
}
.time {
  color: #999;
  font-size: 13px;
}
</style>