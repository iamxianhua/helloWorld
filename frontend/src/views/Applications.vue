<template>
  <div class="applications">
    <h2 style="margin-bottom: 1.5rem; color: #333;">申请列表</h2>

    <div class="card" style="margin-bottom: 1.5rem;">
      <div class="form-group">
        <label for="email">请输入您的邮箱查询申请记录</label>
        <div style="display: flex; gap: 1rem;">
          <input
            id="email"
            v-model="searchEmail"
            type="email"
            placeholder="your.email@example.com"
            @keyup.enter="searchApplications"
            style="flex: 1;"
          />
          <button class="btn btn-primary" @click="searchApplications" :disabled="loading">
            {{ loading ? '查询中...' : '查询' }}
          </button>
        </div>
      </div>
    </div>

    <div v-if="error" class="error">
      {{ error }}
    </div>

    <div v-if="searched">
      <!-- 标签切换 -->
      <div class="tabs">
        <button
          class="tab-button"
          :class="{ active: activeTab === 'pending' }"
          @click="activeTab = 'pending'"
        >
          正在申请 ({{ pendingApplications.length }})
        </button>
        <button
          class="tab-button"
          :class="{ active: activeTab === 'confirmed' }"
          @click="activeTab = 'confirmed'"
        >
          已申请 ({{ confirmedApplications.length }})
        </button>
      </div>

      <!-- 正在申请列表 -->
      <div v-show="activeTab === 'pending'">
        <div v-if="pendingApplications.length === 0" class="card">
          <p style="text-align: center; color: #666;">暂无正在申请的记录</p>
        </div>
        <div v-else>
          <div v-for="app in pendingApplications" :key="app.id" class="card application-card">
            <div class="application-header">
              <h3>{{ app.meetingRoom?.roomName }}</h3>
              <span class="status-badge pending">正在申请</span>
            </div>
            <div class="application-info">
              <div class="info-row">
                <span class="label">申请人:</span>
                <span>{{ app.userName }}</span>
              </div>
              <div class="info-row">
                <span class="label">日期:</span>
                <span>{{ formatDate(app.startTime) }}</span>
              </div>
              <div class="info-row">
                <span class="label">时间:</span>
                <span>{{ formatTime(app.startTime) }} - {{ formatTime(app.endTime) }}</span>
              </div>
              <div class="info-row">
                <span class="label">参加人数:</span>
                <span>{{ app.attendeeCount }} 人</span>
              </div>
              <div class="info-row">
                <span class="label">茶水需求:</span>
                <span>{{ app.needsRefreshments ? '需要' : '不需要' }}</span>
              </div>
              <div v-if="app.purpose" class="info-row">
                <span class="label">会议目的:</span>
                <span>{{ app.purpose }}</span>
              </div>
            </div>
            <div class="application-actions">
              <button
                class="btn btn-secondary btn-small"
                @click="confirmApplication(app.id)"
                :disabled="confirming === app.id"
              >
                {{ confirming === app.id ? '确认中...' : '确认申请' }}
              </button>
              <button
                class="btn btn-danger btn-small"
                @click="cancelApplication(app.id)"
                :disabled="cancelling === app.id"
              >
                {{ cancelling === app.id ? '取消中...' : '取消申请' }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 已申请列表 -->
      <div v-show="activeTab === 'confirmed'">
        <div v-if="confirmedApplications.length === 0" class="card">
          <p style="text-align: center; color: #666;">暂无已申请的记录</p>
        </div>
        <div v-else>
          <div v-for="app in confirmedApplications" :key="app.id" class="card application-card">
            <div class="application-header">
              <h3>{{ app.meetingRoom?.roomName }}</h3>
              <span class="status-badge confirmed">已确认</span>
            </div>
            <div class="application-info">
              <div class="info-row">
                <span class="label">申请人:</span>
                <span>{{ app.userName }}</span>
              </div>
              <div class="info-row">
                <span class="label">日期:</span>
                <span>{{ formatDate(app.startTime) }}</span>
              </div>
              <div class="info-row">
                <span class="label">时间:</span>
                <span>{{ formatTime(app.startTime) }} - {{ formatTime(app.endTime) }}</span>
              </div>
              <div class="info-row">
                <span class="label">参加人数:</span>
                <span>{{ app.attendeeCount }} 人</span>
              </div>
              <div class="info-row">
                <span class="label">茶水需求:</span>
                <span>{{ app.needsRefreshments ? '需要' : '不需要' }}</span>
              </div>
              <div v-if="app.purpose" class="info-row">
                <span class="label">会议目的:</span>
                <span>{{ app.purpose }}</span>
              </div>
            </div>
            <div class="application-actions">
              <button
                class="btn btn-danger btn-small"
                @click="cancelApplication(app.id)"
                :disabled="cancelling === app.id"
              >
                {{ cancelling === app.id ? '取消中...' : '取消预定' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { bookingAPI } from '../api/api'

const searchEmail = ref('')
const applications = ref([])
const loading = ref(false)
const error = ref(null)
const searched = ref(false)
const activeTab = ref('pending')
const confirming = ref(null)
const cancelling = ref(null)

const pendingApplications = computed(() =>
  applications.value.filter(app => app.status === 'PENDING')
)

const confirmedApplications = computed(() =>
  applications.value.filter(app => app.status === 'CONFIRMED')
)

const formatDate = (dateTime) => {
  if (!dateTime) return ''
  const date = new Date(dateTime)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

const formatTime = (dateTime) => {
  if (!dateTime) return ''
  const date = new Date(dateTime)
  return date.toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

const searchApplications = async () => {
  if (!searchEmail.value) {
    error.value = '请输入邮箱地址'
    return
  }

  try {
    loading.value = true
    error.value = null
    searched.value = true
    const response = await bookingAPI.getBookingsByEmail(searchEmail.value)
    applications.value = response.data.filter(app => app.status !== 'CANCELLED')
  } catch (err) {
    error.value = '查询失败，请稍后重试'
    console.error('Error fetching applications:', err)
  } finally {
    loading.value = false
  }
}

const confirmApplication = async (id) => {
  try {
    confirming.value = id
    await bookingAPI.updateBooking(id, { status: 'CONFIRMED' })
    const app = applications.value.find(a => a.id === id)
    if (app) {
      app.status = 'CONFIRMED'
    }
  } catch (err) {
    error.value = '确认申请失败，请稍后重试'
    console.error('Error confirming application:', err)
  } finally {
    confirming.value = null
  }
}

const cancelApplication = async (id) => {
  if (!confirm('确定要取消这个申请吗？')) {
    return
  }

  try {
    cancelling.value = id
    await bookingAPI.deleteBooking(id)
    applications.value = applications.value.filter(a => a.id !== id)
  } catch (err) {
    error.value = '取消申请失败，请稍后重试'
    console.error('Error cancelling application:', err)
  } finally {
    cancelling.value = null
  }
}
</script>

<style scoped>
.applications {
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

.tabs {
  display: flex;
  gap: 0;
  margin-bottom: 1.5rem;
  border-bottom: 2px solid #e0e0e0;
}

.tab-button {
  padding: 1rem 2rem;
  border: none;
  background: transparent;
  color: #666;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  border-bottom: 3px solid transparent;
  transition: all 0.3s;
}

.tab-button:hover {
  color: #667eea;
}

.tab-button.active {
  color: #667eea;
  border-bottom-color: #667eea;
}

.application-card {
  border-left: 4px solid #667eea;
}

.application-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.application-header h3 {
  color: #667eea;
  margin: 0;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
}

.status-badge.pending {
  background: #fff3cd;
  color: #856404;
}

.status-badge.confirmed {
  background: #d4edda;
  color: #155724;
}

.application-info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
  color: #666;
}

.info-row {
  display: flex;
  gap: 0.5rem;
}

.info-row .label {
  font-weight: 600;
  color: #333;
  min-width: 90px;
}

.application-actions {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.btn-small {
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .tabs {
    flex-direction: column;
  }

  .tab-button {
    border-bottom: 1px solid #e0e0e0;
  }

  .tab-button.active {
    border-left: 4px solid #667eea;
    border-bottom-color: #e0e0e0;
  }

  .application-actions {
    flex-direction: column;
  }

  .btn-small {
    width: 100%;
  }
}
</style>
