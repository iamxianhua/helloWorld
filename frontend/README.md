# 会议室预定系统 - 前端

基于Vue 3的现代化响应式Web应用，支持桌面和移动设备。

## 技术栈

- **Vue 3**: 渐进式JavaScript框架
- **Vue Router**: 官方路由管理器
- **Axios**: HTTP客户端
- **Pinia**: 状态管理（已配置，可按需使用）
- **Vite**: 下一代前端构建工具
- **CSS3**: 响应式样式设计

## 项目结构

```
frontend/
├── src/
│   ├── api/                    # API调用模块
│   │   └── api.js             # 后端API接口
│   ├── assets/                 # 静态资源
│   ├── components/             # 可复用组件
│   ├── router/                 # 路由配置
│   │   └── index.js
│   ├── styles/                 # 样式文件
│   │   └── main.css           # 全局样式
│   ├── views/                  # 页面组件
│   │   ├── Home.vue           # 首页
│   │   ├── RoomList.vue       # 会议室列表
│   │   ├── BookingForm.vue    # 预定表单
│   │   └── MyBookings.vue     # 我的预定
│   ├── App.vue                 # 根组件
│   └── main.js                 # 应用入口
├── index.html                  # HTML模板
├── package.json                # 依赖配置
└── vite.config.js             # Vite配置
```

## 快速开始

### 环境要求

- Node.js 16+
- npm 7+

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

应用将在 `http://localhost:5173` 启动，支持热模块替换（HMR）。

### 生产构建

```bash
npm run build
```

构建产物位于 `dist/` 目录。

### 预览生产构建

```bash
npm run preview
```

## 功能页面

### 首页 (/)
- 系统介绍
- 功能概览
- 快速导航

### 会议室列表 (/rooms)
- 展示所有会议室
- 显示会议室详细信息（位置、容量、设施）
- 可用性状态实时更新
- 快速预定按钮

### 预定表单 (/book/:id)
- 会议室信息展示
- 预定表单（姓名、邮箱、时间、目的）
- 时间冲突自动检测
- 表单验证

### 我的预定 (/my-bookings)
- 邮箱查询预定记录
- 预定详情展示
- 取消预定功能
- 预定状态显示

## 响应式设计

### 断点设置

- **桌面端**: > 768px
  - 多列网格布局
  - 完整导航栏

- **平板端**: 480px - 768px
  - 单列网格布局
  - 适配中等屏幕

- **移动端**: < 480px
  - 垂直布局
  - 触摸优化
  - 全宽按钮

### 移动端优化

- 触摸友好的大按钮
- 简化的导航菜单
- 优化的表单输入体验
- 自适应字体大小

## API集成

### 配置后端地址

修改 `src/api/api.js` 中的 API_BASE_URL：

```javascript
const API_BASE_URL = 'http://localhost:8080/api'
```

或使用环境变量：

```bash
# .env.development
VITE_API_URL=http://localhost:8080/api

# .env.production
VITE_API_URL=https://api.yourapp.com/api
```

### API模块

```javascript
import { roomAPI, bookingAPI } from '@/api/api'

// 会议室API
roomAPI.getAllRooms()
roomAPI.getAvailableRooms()
roomAPI.getRoomById(id)
roomAPI.createRoom(data)
roomAPI.updateRoom(id, data)
roomAPI.deleteRoom(id)

// 预定API
bookingAPI.getAllBookings()
bookingAPI.getBookingById(id)
bookingAPI.getBookingsByEmail(email)
bookingAPI.getBookingsByRoom(roomId)
bookingAPI.createBooking(data)
bookingAPI.updateBooking(id, data)
bookingAPI.deleteBooking(id)
```

## 样式系统

### 全局样式类

```css
/* 布局 */
.card         - 卡片容器
.grid         - 网格布局
.header       - 页头

/* 表单 */
.form-group   - 表单组
.btn          - 按钮基础样式
.btn-primary  - 主要按钮
.btn-secondary - 次要按钮
.btn-danger   - 危险操作按钮

/* 状态 */
.loading      - 加载中
.error        - 错误提示
.success      - 成功提示

/* 业务组件 */
.room-info    - 会议室信息
.booking-item - 预定项
.booking-status - 预定状态标签
```

### 自定义样式

在组件中使用 `<style scoped>` 添加组件特定样式：

```vue
<style scoped>
.custom-class {
  /* 仅在当前组件生效 */
}
</style>
```

## 路由配置

### 路由列表

| 路径 | 组件 | 描述 |
|------|------|------|
| / | Home | 首页 |
| /rooms | RoomList | 会议室列表 |
| /book/:id | BookingForm | 预定表单 |
| /my-bookings | MyBookings | 我的预定 |

### 添加新路由

在 `src/router/index.js` 中添加：

```javascript
{
  path: '/new-page',
  name: 'NewPage',
  component: () => import('../views/NewPage.vue')
}
```

## 开发指南

### 创建新页面

1. 在 `src/views/` 创建Vue组件
2. 在 `src/router/index.js` 添加路由
3. 在导航中添加链接

### 创建可复用组件

1. 在 `src/components/` 创建组件
2. 导出组件
3. 在需要的地方导入使用

```vue
<!-- components/MyComponent.vue -->
<template>
  <div>...</div>
</template>

<script setup>
// 组件逻辑
</script>

<!-- 使用组件 -->
<script setup>
import MyComponent from '@/components/MyComponent.vue'
</script>
```

### 状态管理

已配置Pinia，如需全局状态管理：

```javascript
// stores/user.js
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    email: ''
  }),
  actions: {
    setEmail(email) {
      this.email = email
    }
  }
})

// 在组件中使用
import { useUserStore } from '@/stores/user'
const userStore = useUserStore()
```

## 构建和部署

### 环境变量

创建环境配置文件：

```bash
# .env.development (开发环境)
VITE_API_URL=http://localhost:8080/api

# .env.production (生产环境)
VITE_API_URL=https://api.yourapp.com/api
```

### 生产构建

```bash
npm run build
```

构建输出在 `dist/` 目录，包含优化后的静态文件。

### 部署选项

**静态托管服务**
- Vercel
- Netlify
- GitHub Pages
- Firebase Hosting

**传统服务器**
- 将 `dist/` 目录内容部署到Web服务器
- 配置服务器支持History模式路由

### Nginx配置示例

```nginx
server {
  listen 80;
  server_name your-domain.com;
  root /path/to/dist;
  index index.html;

  location / {
    try_files $uri $uri/ /index.html;
  }

  location /api {
    proxy_pass http://localhost:8080;
  }
}
```

## 性能优化

### 已实现的优化

- ✅ Vite快速开发服务器
- ✅ 按需加载路由组件
- ✅ CSS模块化
- ✅ 生产构建代码分割

### 推荐优化

- 图片懒加载
- 虚拟滚动（大列表）
- PWA支持
- 代码压缩和混淆

## 浏览器兼容性

- Chrome (推荐)
- Firefox
- Safari
- Edge
- 移动浏览器（iOS Safari, Chrome Mobile）

不支持IE11及更早版本。

## 故障排查

### 开发服务器无法启动

```bash
# 清除node_modules和锁文件
rm -rf node_modules package-lock.json
npm install
```

### API请求失败

1. 确认后端服务已启动
2. 检查API地址配置
3. 查看浏览器控制台CORS错误
4. 验证网络连接

### 样式不生效

1. 检查CSS文件是否正确导入
2. 清除浏览器缓存
3. 检查样式选择器优先级

## 代码规范

- 使用组合式API（Composition API）
- 组件命名使用PascalCase
- Props使用camelCase
- 事件使用kebab-case

## 许可证

MIT License
