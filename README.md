# 会议室预定系统

一个功能完整的会议室预定系统，采用前后端分离架构。前端使用Vue 3构建响应式界面，支持Web和移动端访问；后端使用Java Spring Boot提供RESTful API。

## 项目结构

```
helloWorld/
├── backend/          # Java Spring Boot后端
│   ├── src/
│   │   └── main/
│   │       ├── java/com/meetingroom/
│   │       │   ├── controller/      # REST API控制器
│   │       │   ├── service/         # 业务逻辑层
│   │       │   ├── model/           # 数据模型
│   │       │   ├── repository/      # 数据访问层
│   │       │   └── config/          # 配置类
│   │       └── resources/
│   │           └── application.properties
│   └── pom.xml
│
├── frontend/         # Vue 3前端
│   ├── src/
│   │   ├── views/          # 页面组件
│   │   ├── components/     # 可复用组件
│   │   ├── api/           # API调用
│   │   ├── styles/        # 样式文件
│   │   └── router/        # 路由配置
│   ├── package.json
│   └── vite.config.js
│
└── README.md         # 本文件
```

## 主要功能

- ✅ 会议室列表展示
- ✅ 会议室详情查看
- ✅ 在线预定会议室
- ✅ 时间冲突检测
- ✅ 我的预定管理
- ✅ 取消预定功能
- ✅ 响应式设计（支持Web和移动端）

## 技术栈

### 后端
- Java 17
- Spring Boot 3.2.0
- Spring Data JPA
- H2 Database（开发环境）
- Maven

### 前端
- Vue 3
- Vue Router
- Axios
- Vite
- CSS3（响应式设计）

## 快速开始

### 环境要求

- Java 17 或更高版本
- Maven 3.6+
- Node.js 16+ 和 npm

### 启动后端

```bash
cd backend
mvn spring-boot:run
```

后端服务将在 `http://localhost:8080` 启动

### 启动前端

```bash
cd frontend
npm install
npm run dev
```

前端应用将在 `http://localhost:5173` 启动

## API文档

### 会议室相关API

| 方法 | 路径 | 描述 |
|------|------|------|
| GET | /api/rooms | 获取所有会议室 |
| GET | /api/rooms/available | 获取可用会议室 |
| GET | /api/rooms/{id} | 获取指定会议室 |
| POST | /api/rooms | 创建会议室 |
| PUT | /api/rooms/{id} | 更新会议室 |
| DELETE | /api/rooms/{id} | 删除会议室 |

### 预定相关API

| 方法 | 路径 | 描述 |
|------|------|------|
| GET | /api/bookings | 获取所有预定 |
| GET | /api/bookings/{id} | 获取指定预定 |
| GET | /api/bookings/user/{email} | 获取用户的预定 |
| GET | /api/bookings/room/{roomId} | 获取会议室的预定 |
| POST | /api/bookings | 创建预定 |
| PUT | /api/bookings/{id} | 更新预定 |
| DELETE | /api/bookings/{id} | 取消预定 |

## 功能说明

### 会议室管理
- 查看所有会议室及其详细信息（位置、容量、设施等）
- 实时显示会议室可用状态

### 预定管理
- 选择会议室和时间段进行预定
- 自动检测时间冲突
- 通过邮箱查询个人预定记录
- 支持取消预定

### 响应式设计
- 桌面端：优化的大屏幕布局
- 平板端：自适应中等屏幕
- 移动端：触摸友好的移动界面

## 数据库

开发环境使用H2内存数据库，应用启动后会自动创建表结构。

访问H2控制台：`http://localhost:8080/h2-console`
- JDBC URL: `jdbc:h2:mem:meetingroomdb`
- 用户名: `sa`
- 密码: (留空)

## 开发说明

### 添加测试数据

系统启动时可以通过H2控制台手动添加测试数据：

```sql
INSERT INTO meeting_rooms (room_name, capacity, location, facilities, available, description)
VALUES ('会议室A', 10, '1楼101', '投影仪, 白板', true, '适合小型会议');

INSERT INTO meeting_rooms (room_name, capacity, location, facilities, available, description)
VALUES ('会议室B', 20, '2楼201', '投影仪, 白板, 视频会议设备', true, '适合中型会议');
```

### 生产部署

生产环境建议：
1. 将H2数据库替换为MySQL/PostgreSQL
2. 配置环境变量管理敏感信息
3. 启用HTTPS
4. 配置CORS白名单
5. 添加用户认证和授权

## 更多信息

- [后端详细文档](./backend/README.md)
- [前端详细文档](./frontend/README.md)

## 许可证

MIT License
