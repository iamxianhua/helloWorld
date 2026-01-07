# 会议室预定系统 - 后端

基于Spring Boot 3.2的RESTful API后端服务。

## 技术栈

- **Java**: 17
- **Spring Boot**: 3.2.0
- **Spring Data JPA**: 数据持久化
- **H2 Database**: 内存数据库（开发环境）
- **Lombok**: 减少样板代码
- **Maven**: 项目管理和构建

## 项目结构

```
backend/
├── src/main/java/com/meetingroom/
│   ├── MeetingRoomApplication.java    # 应用入口
│   ├── controller/                     # REST控制器
│   │   ├── MeetingRoomController.java
│   │   └── BookingController.java
│   ├── service/                        # 业务逻辑
│   │   ├── MeetingRoomService.java
│   │   └── BookingService.java
│   ├── model/                          # 实体类
│   │   ├── MeetingRoom.java
│   │   └── Booking.java
│   ├── repository/                     # 数据访问
│   │   ├── MeetingRoomRepository.java
│   │   └── BookingRepository.java
│   └── config/                         # 配置类
│       └── CorsConfig.java
└── src/main/resources/
    └── application.properties          # 应用配置
```

## 快速开始

### 环境要求

- JDK 17 或更高版本
- Maven 3.6+

### 运行应用

```bash
# 使用Maven运行
mvn spring-boot:run

# 或者先构建再运行
mvn clean package
java -jar target/meeting-room-booking-1.0.0.jar
```

应用将在 `http://localhost:8080` 启动

### 访问H2控制台

开发环境下可以访问H2数据库控制台：

- URL: `http://localhost:8080/h2-console`
- JDBC URL: `jdbc:h2:mem:meetingroomdb`
- 用户名: `sa`
- 密码: (留空)

## API端点

### 会议室管理

**获取所有会议室**
```
GET /api/rooms
Response: List<MeetingRoom>
```

**获取可用会议室**
```
GET /api/rooms/available
Response: List<MeetingRoom>
```

**获取指定会议室**
```
GET /api/rooms/{id}
Response: MeetingRoom
```

**创建会议室**
```
POST /api/rooms
Request Body: MeetingRoom
Response: MeetingRoom
```

**更新会议室**
```
PUT /api/rooms/{id}
Request Body: MeetingRoom
Response: MeetingRoom
```

**删除会议室**
```
DELETE /api/rooms/{id}
Response: 204 No Content
```

### 预定管理

**获取所有预定**
```
GET /api/bookings
Response: List<Booking>
```

**获取指定预定**
```
GET /api/bookings/{id}
Response: Booking
```

**按邮箱查询预定**
```
GET /api/bookings/user/{email}
Response: List<Booking>
```

**按会议室查询预定**
```
GET /api/bookings/room/{roomId}
Response: List<Booking>
```

**创建预定**
```
POST /api/bookings
Request Body: Booking
Response: Booking
```

**更新预定**
```
PUT /api/bookings/{id}
Request Body: Booking
Response: Booking
```

**删除预定**
```
DELETE /api/bookings/{id}
Response: 204 No Content
```

## 数据模型

### MeetingRoom（会议室）

```java
{
  "id": Long,
  "roomName": String,      // 会议室名称（必填，唯一）
  "capacity": Integer,     // 容量（必填）
  "location": String,      // 位置
  "facilities": String,    // 设施
  "available": Boolean,    // 是否可用（默认true）
  "description": String    // 描述
}
```

### Booking（预定）

```java
{
  "id": Long,
  "meetingRoom": MeetingRoom,  // 会议室（必填）
  "userName": String,          // 预定人姓名（必填）
  "userEmail": String,         // 预定人邮箱（必填）
  "startTime": LocalDateTime,  // 开始时间（必填）
  "endTime": LocalDateTime,    // 结束时间（必填）
  "purpose": String,           // 会议目的
  "status": String,            // 状态（默认CONFIRMED）
  "createdAt": LocalDateTime   // 创建时间（自动生成）
}
```

## 业务逻辑

### 预定冲突检测

创建或更新预定时，系统会自动检测时间冲突：
- 检查同一会议室在指定时间段是否已有预定
- 如果存在冲突，返回400错误和错误信息

### 时间验证

- 开始时间必须早于结束时间
- 违反规则时返回400错误

## 配置

### application.properties

```properties
# 服务器配置
server.port=8080

# 数据库配置
spring.datasource.url=jdbc:h2:mem:meetingroomdb
spring.datasource.username=sa
spring.datasource.password=

# JPA配置
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

# CORS配置
# 已通过CorsConfig类配置
```

## 开发指南

### 添加新功能

1. 创建实体类（model包）
2. 创建Repository接口（repository包）
3. 创建Service类（service包）
4. 创建Controller类（controller包）

### 切换数据库

生产环境建议使用MySQL或PostgreSQL：

1. 添加数据库依赖到pom.xml
2. 更新application.properties：

```properties
# MySQL示例
spring.datasource.url=jdbc:mysql://localhost:3306/meetingroom
spring.datasource.username=your_username
spring.datasource.password=your_password
spring.jpa.hibernate.ddl-auto=update
```

## 测试

```bash
# 运行测试
mvn test
```

## 构建

```bash
# 构建JAR包
mvn clean package

# 跳过测试构建
mvn clean package -DskipTests
```

构建产物位于 `target/meeting-room-booking-1.0.0.jar`

## 生产部署建议

1. **数据库**: 使用生产级数据库（MySQL/PostgreSQL）
2. **安全性**:
   - 配置Spring Security
   - 添加JWT认证
   - 启用HTTPS
3. **监控**: 集成Spring Boot Actuator
4. **日志**: 配置日志级别和输出
5. **环境变量**: 使用环境变量管理敏感配置

## 故障排查

### 端口已被占用
```bash
# Linux/Mac
lsof -i :8080
kill -9 <PID>

# Windows
netstat -ano | findstr :8080
taskkill /PID <PID> /F
```

### 数据库连接失败
- 检查数据库是否运行
- 验证连接信息（URL、用户名、密码）
- 确认防火墙设置

## 许可证

MIT License
