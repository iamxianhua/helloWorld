<template>
  <div class="booking-form">
    <h2 style="margin-bottom: 1.5rem; color: #333;">申请会议室</h2>

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
          <strong>位置:</strong> {{ room.location }}
        </div>
        <div class="info-item">
          <strong>容量:</strong> {{ room.capacity }} 人
        </div>
        <div class="info-item">
          <strong>设施:</strong> {{ room.facilities }}
        </div>
      </div>

      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="userName">申请人姓名 *</label>
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
          <label for="date">日期 *</label>
          <input
            id="date"
            v-model="formData.date"
            type="date"
            required
          />
        </div>

        <div class="form-row">
          <div class="form-group" style="flex: 1;">
            <label for="startTime">开始时间 *</label>
            <input
              id="startTime"
              v-model="formData.startTime"
              type="time"
              required
            />
          </div>

          <div class="form-group" style="flex: 1;">
            <label for="endTime">结束时间 *</label>
            <input
              id="endTime"
              v-model="formData.endTime"
              type="time"
              required
            />
          </div>
        </div>

        <div class="form-group">
          <label for="attendeeCount">参加人数 *</label>
          <input
            id="attendeeCount"
            v-model.number="formData.attendeeCount"
            type="number"
            required
            min="1"
            :max="room?.capacity"
            placeholder="请输入参加人数"
          />
          <small style="color: #666;">该会议室最多可容纳 {{ room?.capacity }} 人</small>
        </div>

        <div class="form-group">
          <label for="purpose">会议目的</label>
          <textarea
            id="purpose"
            v-model="formData.purpose"
            rows="3"
            placeholder="请简要描述会议目的（可选）"
          ></textarea>
        </div>

        <div class="form-group">
          <label class="checkbox-label">
            <input
              type="checkbox"
              v-model="formData.needsRefreshments"
            />
            需要茶水或矿泉水
          </label>
        </div>

        <div v-if="submitError" class="error">
          {{ submitError }}
        </div>

        <div v-if="submitSuccess" class="success">
          申请提交成功！正在跳转...
        </div>

        <div style="display: flex; gap: 1rem; margin-top: 1.5rem;">
          <button type="submit" class="btn btn-primary" :disabled="submitting">
            {{ submitting ? '提交中...' : '提交申请' }}
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
  date: '',
  startTime: '',
  endTime: '',
  attendeeCount: '',
  purpose: '',
  needsRefreshments: false
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

    // 验证参加人数
    if (formData.value.attendeeCount > room.value.capacity) {
      submitError.value = `参加人数不能超过会议室容量（${room.value.capacity}人）`
      return
    }

    // 组合日期和时间
    const startDateTime = `${formData.value.date}T${formData.value.startTime}:00`
    const endDateTime = `${formData.value.date}T${formData.value.endTime}:00`

    const bookingData = {
      meetingRoom: { id: room.value.id },
      userName: formData.value.userName,
      userEmail: formData.value.userEmail,
      startTime: startDateTime,
      endTime: endDateTime,
      purpose: formData.value.purpose,
      attendeeCount: formData.value.attendeeCount,
      needsRefreshments: formData.value.needsRefreshments,
      status: 'PENDING' // 正在申请状态
    }

    await bookingAPI.createBooking(bookingData)
    submitSuccess.value = true

    setTimeout(() => {
      router.push('/applications')
    }, 1500)
  } catch (err) {
    submitError.value = err.response?.data || '申请失败，请检查时间是否冲突或稍后重试'
    console.error('Error creating booking:', err)
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  loadRoom()
  // 设置默认日期为今天
  const today = new Date().toISOString().split('T')[0]
  formData.value.date = today
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

.form-row {
  display: flex;
  gap: 1rem;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-weight: normal;
}

.checkbox-label input[type="checkbox"] {
  width: auto;
  cursor: pointer;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .form-row {
    flex-direction: column;
  }
}
</style>
