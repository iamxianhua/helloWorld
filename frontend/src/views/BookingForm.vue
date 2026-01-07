<template>
  <div class="booking-form">
    <h2 style="margin-bottom: 1.5rem; color: #333;">预定会议室</h2>

    <div v-if="loading" class="loading">
      加载中...
    </div>

    <div v-else-if="error" class="error">
      {{ error }}
    </div>

    <div v-else class="card">
      <div v-if="room" class="room-info" style="margin-bottom: 2rem; padding-bottom: 1.5rem; border-bottom: 2px solid #f0f0f0;">
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
      </div>

      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="userName">姓名 *</label>
          <input
            id="userName"
            v-model="formData.userName"
            type="text"
            required
            placeholder="请输入您的姓名"
          />
        </div>

        <div class="form-group">
          <label for="userEmail">邮箱 *</label>
          <input
            id="userEmail"
            v-model="formData.userEmail"
            type="email"
            required
            placeholder="请输入您的邮箱"
          />
        </div>

        <div class="form-group">
          <label for="startTime">开始时间 *</label>
          <input
            id="startTime"
            v-model="formData.startTime"
            type="datetime-local"
            required
          />
        </div>

        <div class="form-group">
          <label for="endTime">结束时间 *</label>
          <input
            id="endTime"
            v-model="formData.endTime"
            type="datetime-local"
            required
          />
        </div>

        <div class="form-group">
          <label for="purpose">会议目的</label>
          <textarea
            id="purpose"
            v-model="formData.purpose"
            rows="4"
            placeholder="请简要描述会议目的（可选）"
          ></textarea>
        </div>

        <div v-if="submitError" class="error">
          {{ submitError }}
        </div>

        <div v-if="submitSuccess" class="success">
          预定成功！
        </div>

        <div style="display: flex; gap: 1rem; margin-top: 1.5rem;">
          <button type="submit" class="btn btn-primary" :disabled="submitting">
            {{ submitting ? '提交中...' : '确认预定' }}
          </button>
          <router-link to="/rooms">
            <button type="button" class="btn btn-secondary">
              取消
            </button>
          </router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { roomAPI, bookingAPI } from '../api/api'

const route = useRoute()
const router = useRouter()

const room = ref(null)
const loading = ref(true)
const error = ref(null)
const submitting = ref(false)
const submitError = ref(null)
const submitSuccess = ref(false)

const formData = ref({
  userName: '',
  userEmail: '',
  startTime: '',
  endTime: '',
  purpose: ''
})

const loadRoom = async () => {
  try {
    loading.value = true
    error.value = null
    const response = await roomAPI.getRoomById(route.params.id)
    room.value = response.data
  } catch (err) {
    error.value = '加载会议室信息失败'
    console.error('Error loading room:', err)
  } finally {
    loading.value = false
  }
}

const handleSubmit = async () => {
  try {
    submitting.value = true
    submitError.value = null
    submitSuccess.value = false

    const bookingData = {
      meetingRoom: { id: room.value.id },
      userName: formData.value.userName,
      userEmail: formData.value.userEmail,
      startTime: formData.value.startTime,
      endTime: formData.value.endTime,
      purpose: formData.value.purpose,
      status: 'CONFIRMED'
    }

    await bookingAPI.createBooking(bookingData)
    submitSuccess.value = true

    setTimeout(() => {
      router.push('/my-bookings')
    }, 1500)
  } catch (err) {
    submitError.value = err.response?.data || '预定失败，请检查时间是否冲突或稍后重试'
    console.error('Error creating booking:', err)
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  loadRoom()
})
</script>

<style scoped>
.booking-form {
  animation: fadeIn 0.5s;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
