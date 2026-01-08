<template>
  <div id="app">
    <header class="header">
      <h1>会议室预定系统</h1>
      <nav class="nav">
        <router-link to="/">首页</router-link>
        <router-link to="/daily-overview">今日一览</router-link>
        <router-link to="/rooms">会议室列表</router-link>
        <router-link to="/applications">申请列表</router-link>
        <router-link to="/my-bookings">我的预定</router-link>
      </nav>
    </header>
    <main>
      <router-view />
    </main>
  </div>
</template>

<script setup>
</script>
