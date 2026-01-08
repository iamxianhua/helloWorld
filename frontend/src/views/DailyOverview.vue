<template>
  <div class="daily-overview">
    <h2 style="margin-bottom: 0.5rem; color: #333;">今日会议室一览</h2>
    <p style="margin-bottom: 1.5rem; color: #666;">{{ currentDate }}</p>

    <div v-if="loading" class="loading">
      加载中...
    </div>

    <div v-else-if="error" class="error">
      {{ error }}
    </div>

    <div v-else>
      <!-- 统计概览 -->
      <div class="stats-grid">
        <div class="stat-card free">
          <div class="stat-number">{{ statusCounts.FREE }}</div>
          <div class="stat-label">空闲</div>
        </div>
        <div class="stat-card partially">
          <div class="stat-number">{{ statusCounts.PARTIALLY_BOOKED }}</div>
          <div class="stat-label">有预定</div>
        </div>
        <div class="stat-card fully">
          <div class="stat-number">{{ statusCounts.FULLY_BOOKED }}</div>
          <div class="stat-label">全天已满</div>
        </div>
        <div class="stat-card unavailable">
          <div class="stat-number">{{ statusCounts.UNAVAILABLE }}</div>
          <div class="stat-label">不可用</div>
        </div>
      </div>

      <!-- 楼层过滤 -->
      <div class="card" style="margin-bottom: 1.5rem;">
        <label style="font-weight: 600; margin-right: 1rem;">按楼层筛选：</label>
        <div class="floor-filters">
          <button
            class="filter-btn"
            :class="{ active: selectedFloor === null }"
            @click="selectedFloor = null"
          >
            全部
          </button>
          <button
            class="filter-btn"
            :class="{ active: selectedFloor === 5 }"
            @click="selectedFloor = 5"
          >
            5楼
          </button>
          <button
            class="filter-btn"
            :class="{ active: selectedFloor === 7 }"
            @click="selectedFloor = 7"
          >
            7楼
          </button>
          <button
            class="filter-btn"
            :class="{ active: selectedFloor === 'high' }"
            @click="selectedFloor = 'high'"
          >
            10-21楼
          </button>
        </div>
      </div>

      <!-- 会议室列表 -->
      <div class="room-list">
        <div
          v-for="item in filteredRooms"
          :key="item.room.id"
          class="room-card card"
          :class="statusClass(item.status)"
        >
          <div class="room-header">
            <h3>{{ item.room.roomName }}</h3>
            <span class="room-status-badge" :class="statusClass(item.status)">
              {{ statusText(item.status) }}
            </span>
          </div>

          <div class="room-details">
            <div class="detail-item">
              <strong>位置:</strong> {{ item.room.location }}
            </div>
            <div class="detail-item">
              <strong>容量:</strong> {{ item.room.capacity }} 人
            </div>
            <div class="detail-item">
              <strong>今日预定:</strong> {{ item.bookingCount }} 次
            </div>
          </div>

          <!-- 今日预定时间段 -->
          <div v-if="item.bookings && item.bookings.length > 0" class="booking-timeline">
            <h4>今日预定时间段：</h4>
            <div class="timeline">
              <div
                v-for="booking in item.bookings"
                :key="booking.id"
                class="timeline-item"
              >
                <div class="time-range">
                  {{ formatTime(booking.startTime) }} - {{ formatTime(booking.endTime) }}
                </div>
                <div class="booking-detail">
                  <span>{{ booking.userName }}</span>
                  <span v-if="booking.purpose" class="purpose">{{ booking.purpose }}</span>
                </div>
              </div>
            </div>
          </div>

          <div v-else class="empty-schedule">
            今日暂无预定
          </div>

          <!-- 操作按钮 -->
          <div class="room-actions" v-if="item.status === 'FREE' || item.status === 'PARTIALLY_BOOKED'">
            <router-link :to="`/book/${item.room.id}`">
              <button class="btn btn-primary btn-small">立即预定</button>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { roomAPI } from '../api/api'

const loading = ref(true)
const error = ref(null)
const roomsStatus = ref([])
const selectedFloor = ref(null)

const currentDate = computed(() => {
  const today = new Date()
  return today.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  })
})

const statusCounts = computed(() => {
  const counts = {
    FREE: 0,
    PARTIALLY_BOOKED: 0,
    FULLY_BOOKED: 0,
    UNAVAILABLE: 0
  }

  roomsStatus.value.forEach(item => {
    counts[item.status]++
  })

  return counts
})

const filteredRooms = computed(() => {
  if (selectedFloor.value === null) {
    return roomsStatus.value
  }

  if (selectedFloor.value === 'high') {
    return roomsStatus.value.filter(item => item.room.floor >= 10 && item.room.floor <= 21)
  }

  return roomsStatus.value.filter(item => item.room.floor === selectedFloor.value)
})

const statusClass = (status) => {
  const classes = {
    'FREE': 'status-free',
    'PARTIALLY_BOOKED': 'status-partial',
    'FULLY_BOOKED': 'status-full',
    'UNAVAILABLE': 'status-unavailable'
  }
  return classes[status] || ''
}

const statusText = (status) => {
  const texts = {
    'FREE': '空闲',
    'PARTIALLY_BOOKED': '有预定',
    'FULLY_BOOKED': '全天已满',
    'UNAVAILABLE': '不可用'
  }
  return texts[status] || status
}

const formatTime = (dateTime) => {
  if (!dateTime) return ''
  const date = new Date(dateTime)
  return date.toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

const loadDailyStatus = async () => {
  try {
    loading.value = true
    error.value = null
    const response = await roomAPI.getDailyStatus()
    roomsStatus.value = response.data
  } catch (err) {
    error.value = '加载数据失败，请稍后重试'
    console.error('Error loading daily status:', err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadDailyStatus()
})
</script>

<style scoped>
.daily-overview {
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

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.stat-card {
  background: white;
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.stat-card.free {
  border-left: 4px solid #28a745;
}

.stat-card.partially {
  border-left: 4px solid #ffc107;
}

.stat-card.fully {
  border-left: 4px solid #dc3545;
}

.stat-card.unavailable {
  border-left: 4px solid #6c757d;
}

.stat-number {
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.stat-card.free .stat-number {
  color: #28a745;
}

.stat-card.partially .stat-number {
  color: #ffc107;
}

.stat-card.fully .stat-number {
  color: #dc3545;
}

.stat-card.unavailable .stat-number {
  color: #6c757d;
}

.stat-label {
  color: #666;
  font-weight: 600;
}

.floor-filters {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-top: 0.5rem;
}

.filter-btn {
  padding: 0.5rem 1rem;
  border: 2px solid #e0e0e0;
  background: white;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s;
  font-weight: 600;
}

.filter-btn:hover {
  border-color: #667eea;
  color: #667eea;
}

.filter-btn.active {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

.room-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.room-card {
  border-left: 4px solid #e0e0e0;
}

.room-card.status-free {
  border-left-color: #28a745;
}

.room-card.status-partial {
  border-left-color: #ffc107;
}

.room-card.status-full {
  border-left-color: #dc3545;
}

.room-card.status-unavailable {
  border-left-color: #6c757d;
  opacity: 0.7;
}

.room-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.room-header h3 {
  color: #333;
  margin: 0;
}

.room-status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
}

.room-status-badge.status-free {
  background: #d4edda;
  color: #155724;
}

.room-status-badge.status-partial {
  background: #fff3cd;
  color: #856404;
}

.room-status-badge.status-full {
  background: #f8d7da;
  color: #721c24;
}

.room-status-badge.status-unavailable {
  background: #e2e3e5;
  color: #383d41;
}

.room-details {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
  color: #666;
}

.detail-item strong {
  color: #333;
}

.booking-timeline {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e0e0e0;
}

.booking-timeline h4 {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 0.75rem;
}

.timeline {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.timeline-item {
  padding: 0.75rem;
  background: #f8f9fa;
  border-radius: 5px;
  border-left: 3px solid #667eea;
}

.time-range {
  font-weight: 600;
  color: #667eea;
  margin-bottom: 0.25rem;
}

.booking-detail {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  font-size: 0.9rem;
  color: #666;
}

.purpose {
  font-style: italic;
}

.empty-schedule {
  text-align: center;
  padding: 1.5rem;
  color: #999;
  font-style: italic;
  background: #f8f9fa;
  border-radius: 5px;
  margin-top: 1rem;
}

.room-actions {
  margin-top: 1rem;
}

.btn-small {
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  width: 100%;
}

@media (max-width: 768px) {
  .room-list {
    grid-template-columns: 1fr;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
