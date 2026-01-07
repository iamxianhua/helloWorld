<template>
  <div class="room-list">
    <h2 style="margin-bottom: 1.5rem; color: #333;">会议室列表</h2>

    <div v-if="loading" class="loading">
      加载中...
    </div>

    <div v-else-if="error" class="error">
      {{ error }}
    </div>

    <div v-else class="grid">
      <div v-for="room in rooms" :key="room.id" class="card">
        <div class="room-info">
          <h3>{{ room.roomName }}</h3>
          <div class="info-item">
            <strong>位置:</strong> {{ room.location || '未指定' }}
          </div>
          <div class="info-item">
            <strong>容量:</strong> {{ room.capacity }} 人
          </div>
          <div class="info-item">
            <strong>设施:</strong> {{ room.facilities || '无' }}
          </div>
          <div class="info-item">
            <strong>状态:</strong>
            <span :style="{ color: room.available ? '#28a745' : '#dc3545' }">
              {{ room.available ? '可用' : '不可用' }}
            </span>
          </div>
          <div v-if="room.description" class="info-item" style="margin-top: 0.5rem;">
            <p style="color: #666;">{{ room.description }}</p>
          </div>
          <div style="margin-top: 1rem;">
            <router-link :to="`/book/${room.id}`">
              <button class="btn btn-primary" :disabled="!room.available">
                {{ room.available ? '立即预定' : '暂不可用' }}
              </button>
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <div v-if="!loading && !error && rooms.length === 0" class="card">
      <p style="text-align: center; color: #666;">暂无会议室</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { roomAPI } from '../api/api'

const rooms = ref([])
const loading = ref(true)
const error = ref(null)

const loadRooms = async () => {
  try {
    loading.value = true
    error.value = null
    const response = await roomAPI.getAllRooms()
    rooms.value = response.data
  } catch (err) {
    error.value = '加载会议室列表失败，请稍后重试'
    console.error('Error loading rooms:', err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadRooms()
})
</script>

<style scoped>
.room-list {
  animation: fadeIn 0.5s;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
