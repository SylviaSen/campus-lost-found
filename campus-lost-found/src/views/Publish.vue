<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { supabase } from '../lib/supabase'

const router = useRouter()
const title = ref('')
const description = ref('')
const type = ref('失物')
const contact = ref('')
const loading = ref(false)
const file = ref<File | null>(null)
const previewUrl = ref('')
const uploading = ref(false)

// 选图
function onFileChange(e: Event) {
  const target = e.target as HTMLInputElement
  const f = target.files?.[0]
  if (!f) return
  if (f.size > 5 * 1024 * 1024) {
    ElMessage.warning('图片不能超过 5MB')
    return
  }
  file.value = f
  previewUrl.value = URL.createObjectURL(f)
}

// 上传图片，返回公开 URL
async function uploadImage(): Promise<string | null> {
  if (!file.value) return null
  uploading.value = true
  const ext = file.value.name.split('.').pop()
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

  const { error } = await supabase.storage
    .from('item-images')
    .upload(fileName, file.value)

  uploading.value = false

  if (error) {
    ElMessage.error('图片上传失败：' + error.message)
    return null
  }

  const { data } = supabase.storage.from('item-images').getPublicUrl(fileName)
  return data.publicUrl
}

async function handleSubmit() {
  if (!title.value || !description.value || !contact.value) {
    ElMessage.warning('请填写完整信息')
    return
  }

  loading.value = true

  const { data: userData } = await supabase.auth.getUser()
  if (!userData.user) {
    ElMessage.warning('请先登录')
    loading.value = false
    router.push('/login')
    return
  }

  // 先上传图片（如果有）
  const imageUrl = await uploadImage()

  const { data, error } = await supabase.from('items').insert({
    title: title.value,
    description: description.value,
    type: type.value,
    status: '未找到',
    contact: contact.value,
    user_id: userData.user.id,
    image_url: imageUrl,
  }).select().single()

  loading.value = false

  if (error) {
    ElMessage.error('发布失败：' + error.message)
  } else {
    ElMessage.success('发布成功')
    router.push('/detail/' + data.id)
  }
}
</script>

<template>
  <div class="publish-wrap">
    <el-card>
      <h2>发布信息</h2>
      <el-form label-position="top">
        <el-form-item label="类型">
          <el-radio-group v-model="type">
            <el-radio value="失物">失物</el-radio>
            <el-radio value="招领">招领</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="标题">
          <el-input v-model="title" placeholder="比如：捡到一张校园卡" />
        </el-form-item>

        <el-form-item label="详细描述">
          <el-input v-model="description" type="textarea" :rows="4" placeholder="描述物品特征、丢失/拾取地点、时间等" />
        </el-form-item>

        <el-form-item label="联系方式">
          <el-input v-model="contact" placeholder="微信 / QQ / 手机号" />
        </el-form-item>

        <el-form-item label="图片（可选）">
          <input type="file" accept="image/*" @change="onFileChange" />
          <div v-if="previewUrl" class="preview">
            <img :src="previewUrl" alt="预览" />
          </div>
        </el-form-item>

        <el-button type="primary" :loading="loading || uploading" @click="handleSubmit">
          {{ uploading ? '图片上传中...' : '发布' }}
        </el-button>
      </el-form>
    </el-card>
  </div>
</template>

<style scoped>
.publish-wrap {
  max-width: 600px;
  margin: 0 auto;
  padding: 24px;
}
.preview {
  margin-top: 12px;
}
.preview img {
  max-width: 200px;
  border-radius: 6px;
}
</style>