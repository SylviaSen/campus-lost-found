<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { supabase } from '../lib/supabase'

const router = useRouter()
const items = ref<any[]>([])
const loading = ref(false)

async function loadMyItems() {
  loading.value = true
  const { data: userData } = await supabase.auth.getUser()
  if (!userData.user) {
    ElMessage.warning('请先登录')
    loading.value = false
    router.push('/login')
    return
  }

  const { data, error } = await supabase
    .from('items')
    .select('*')
    .eq('user_id', userData.user.id)
    .order('created_at', { ascending: false })

  if (error) {
    ElMessage.error('读取失败：' + error.message)
  } else {
    items.value = data || []
  }
  loading.value = false
}

async function toggleStatus(item: any) {
  const newStatus = item.status === '已找到' ? '未找到' : '已找到'
  const { error } = await supabase
    .from('items')
    .update({ status: newStatus })
    .eq('id', item.id)

  if (error) {
    ElMessage.error('更新失败：' + error.message)
  } else {
    item.status = newStatus
    ElMessage.success('已更新')
  }
}

async function deleteItem(item: any) {
  try {
    await ElMessageBox.confirm('确定删除这条吗？', '提示', { type: 'warning' })
  } catch {
    return
  }

  const { error } = await supabase.from('items').delete().eq('id', item.id)
  if (error) {
    ElMessage.error('删除失败：' + error.message)
  } else {
    ElMessage.success('已删除')
    loadMyItems()
  }
}

function goDetail(id: number) {
  router.push('/detail/' + id)
}

onMounted(loadMyItems)
</script>

<template>
  <div class="mine-wrap">
    <h2>我的发布</h2>

    <p v-if="loading">加载中...</p>
    <el-empty v-else-if="items.length === 0" description="你还没有发布过" />

    <div v-else class="card-list">
      <el-card v-for="item in items" :key="item.id" class="item-card">
        <div class="card-title" @click="goDetail(item.id)">
          <h3>{{ item.title }}</h3>
          <div>
            <el-tag :type="item.type === '失物' ? 'danger' : 'success'" size="small">{{ item.type }}</el-tag>
            <el-tag :type="item.status === '已找到' ? 'success' : 'info'" size="small" style="margin-left: 6px;">{{ item.status }}</el-tag>
          </div>
        </div>
        <p class="card-desc">{{ item.description }}</p>
        <div class="actions">
          <el-button size="small" @click="toggleStatus(item)">
            {{ item.status === '已找到' ? '标记为未找到' : '标记为已找到' }}
          </el-button>
          <el-button size="small" type="danger" @click="deleteItem(item)">删除</el-button>
        </div>
      </el-card>
    </div>
  </div>
</template>

<style scoped>
.mine-wrap {
  max-width: 800px;
  margin: 0 auto;
  padding: 24px;
}
.card-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 16px;
}
.card-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
}
.card-title h3 {
  margin: 0;
  font-size: 17px;
}
.card-desc {
  color: #555;
  margin: 10px 0;
}
.actions {
  display: flex;
  gap: 8px;
}
</style>