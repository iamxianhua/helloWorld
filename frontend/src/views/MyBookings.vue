<template>
  <div class="my-bookings">
    <h2 style="margin-bottom: 1.5rem; color: #333;">我的预定</h2>

    <div class="card" style="margin-bottom: 1.5rem;">
      <div class="form-group">
        <label for="email">请输入您的邮箱查询预定记录</label>
        <div style="display: flex; gap: 1rem;">
          <input
            id="email"
            v-model="searchEmail"
            type="email"
            placeholder="your.email@example.com"
            @keyup.enter="searchBookings"
            style="flex: 1;"
          />
          <button class="btn btn-primary" @click="searchBookings" :disabled="loading">
            {{ loading ? '查询中...' : '查询' }}
          </button>
        </div>
      </div>
    </div>

    <div v-if="loading" class="loading">
      加载中...
    </div>

    <div v-else-if="error" class="error">
      {{ error }}
    </div>

    <div v-else-if="bookings.length > 0">
      <div v-for="booking in bookings" :key="booking.id" class="card booking-item">
        <div style="display: flex; justify-content: space-between; align-items: start; flex-wrap: wrap; gap: 1rem;">
          <div style="flex: 1; min-width: 250px;">
            <h3 style="color: #667eea; margin-bottom: 0.5rem;">
              {{ booking.meetingRoom?.roomName || '会议室' }}
            </h3>
            <div style="color: #666; margin: 0.5rem 0;">
              <div><strong>预定人:</strong> {{ booking.userName }}</div>
              <div><strong>邮箱:</strong> {{ booking.userEmail }}</div>
              <div><strong>开始时间:</strong> {{ formatDateTime(booking.startTime) }}</div>
              <div><strong>结束时间:</strong> {{ formatDateTime(booking.endTime) }}</div>
              <div v-if="booking.purpose">
                <strong>会议目的:</strong> {{ booking.purpose }}
              </div>
              <div style="margin-top: 0.5rem;">
                <span class="booking-status" :class="booking.status.toLowerCase()">
                  {{ booking.status === 'CONFIRMED' ? '已确认' : '已取消' }}
                </span>
              </div>
            </div>
          </div>
          <div>
            <button
              class="btn btn-danger"
              @click="cancelBooking(booking.id)"
              :disabled="cancelling === booking.id"
            >
              {{ cancelling === booking.id ? '取消中...' : '取消预定' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="searched" class="card">
      <p style="text-align: center; color: #666;">
        未找到预定记录
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { bookingAPI } from '../api/api'

const searchEmail = ref('')
const bookings = ref([])
const loading = ref(false)
const error = ref(null)
const searched = ref(false)
const cancelling = ref(null)

const formatDateTime = (dateTime) => {
  if (!dateTime) return ''
  const date = new Date(dateTime)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const searchBookings = async () => {
  if (!searchEmail.value) {
    error.value = '请输入邮箱地址'
    return
  }

  try {
    loading.value = true
    error.value = null
    searched.value = true
    const response = await bookingAPI.getBookingsByEmail(searchEmail.value)
    bookings.value = response.data
  } catch (err) {
    error.value = '查询失败，请稍后重试'
    console.error('Error fetching bookings:', err)
  } finally {
    loading.value = false
  }
}

const cancelBooking = async (id) => {
  if (!confirm('确定要取消这个预定吗？')) {
    return
  }

  try {
    cancelling.value = id
    await bookingAPI.deleteBooking(id)
    bookings.value = bookings.value.filter(b => b.id !== id)
  } catch (err) {
    error.value = '取消预定失败，请稍后重试'
    console.error('Error cancelling booking:', err)
  } finally {
    cancelling.value = null
  }
}
</script>

<style scoped>
.my-bookings {
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
</style>
