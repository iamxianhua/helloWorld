<template>
  <div class="home">
    <div class="card">
      <h2>欢迎使用会议室预定系统</h2>
      <p style="margin: 1rem 0; color: #666;">
        通过本系统，您可以轻松预定公司的会议室。系统支持Web和移动端访问，随时随地管理您的会议预定。
      </p>

      <div class="features">
        <h3 style="margin: 1.5rem 0 1rem 0;">系统功能</h3>
        <div class="grid">
          <div class="card">
            <h4 style="color: #667eea; margin-bottom: 0.5rem;">📅 查看会议室</h4>
            <p>浏览所有可用的会议室，查看详细信息和设施</p>
          </div>
          <div class="card">
            <h4 style="color: #667eea; margin-bottom: 0.5rem;">📝 在线预定</h4>
            <p>选择时间段，快速预定会议室</p>
          </div>
          <div class="card">
            <h4 style="color: #667eea; margin-bottom: 0.5rem;">📱 移动支持</h4>
            <p>支持手机和平板访问，响应式设计</p>
          </div>
          <div class="card">
            <h4 style="color: #667eea; margin-bottom: 0.5rem;">👤 我的预定</h4>
            <p>管理您的所有预定记录</p>
          </div>
        </div>
      </div>

      <div style="margin-top: 2rem; text-align: center;">
        <router-link to="/rooms">
          <button class="btn btn-primary" style="padding: 1rem 2rem; font-size: 1.1rem;">
            开始预定
          </button>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.home {
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

h2 {
  color: #333;
  margin-bottom: 0.5rem;
}

h3 {
  color: #333;
}
</style>
