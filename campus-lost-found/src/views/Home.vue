<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../lib/supabase'
import { relativeTime } from '../lib/time'

const router = useRouter()
const items = ref<any[]>([])
const loading = ref(false)
const errorMsg = ref('')
const filterType = ref('全部')
const keyword = ref('')

onMounted(async () => {
  loading.value = true
  const { data, error } = await supabase
    .from('items')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) errorMsg.value = error.message
  else items.value = data || []
  loading.value = false
})

const filtered = computed(() => {
  return items.value.filter(i => {
    const matchType = filterType.value === '全部' || i.type === filterType.value
    const matchKey = !keyword.value || i.title.includes(keyword.value) || i.description.includes(keyword.value)
    return matchType && matchKey
  })
})

const lostCount = computed(() => items.value.filter(i => i.type === '失物').length)
const foundCount = computed(() => items.value.filter(i => i.type === '招领').length)

function goDetail(id: number) {
  router.push('/detail/' + id)
}
</script>

<template>
  <div class="home-wrap">
    <div class="stats">
      <span>共 {{ items.length }} 条</span>
      <span>失物 {{ lostCount }}</span>
      <span>招领 {{ foundCount }}</span>
    </div>

    <div class="toolbar">
      <el-radio-group v-model="filterType">
        <el-radio-button value="全部">全部</el-radio-button>
        <el-radio-button value="失物">失物</el-radio-button>
        <el-radio-button value="招领">招领</el-radio-button>
      </el-radio-group>
      <el-input v-model="keyword" placeholder="搜索标题" clearable style="width: 220px;" />
    </div>

    <el-skeleton v-if="loading" :rows="3" animated />
    <p v-else-if="errorMsg" style="color: red;">读取失败：{{ errorMsg }}</p>
    <el-empty v-else-if="filtered.length === 0" description="没有找到相关信息" />

    <div v-else class="card-list">
      <el-card
        v-for="item in filtered"
        :key="item.id"
        class="item-card"
        shadow="hover"
        @click="goDetail(item.id)"
      >
        <div class="card-title">
          <h3>{{ item.title }}</h3>
          <div>
            <el-tag :type="item.type === '失物' ? 'danger' : 'success'" size="small">{{ item.type }}</el-tag>
            <el-tag :type="item.status === '已找到' ? 'success' : 'info'" size="small" style="margin-left: 6px;">{{ item.status }}</el-tag>
          </div>
        </div>
        <p class="card-desc">{{ item.description }}</p>
        <p class="card-time">{{ relativeTime(item.created_at) }}</p>
      </el-card>
    </div>
  </div>
</template>

<style scoped>
.home-wrap {
  max-width: 800px;
  margin: 0 auto;
  padding: 24px;
}
.stats {
  display: flex;
  gap: 20px;
  margin-bottom: 16px;
  font-size: 14px;
  color: #666;
}
.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  gap: 12px;
}
.card-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.item-card {
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}
.item-card:hover {
  transform: translateY(-3px);
}
.card-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.card-title h3 {
  margin: 0;
  font-size: 17px;
}
.card-desc {
  color: #555;
  margin: 10px 0;
}
.card-time {
  color: #999;
  font-size: 12px;
  margin: 0;
}
</style>