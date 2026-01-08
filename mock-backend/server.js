const http = require('http');
const url = require('url');

// 生成会议室数据
function generateMeetingRooms() {
  const rooms = [];
  let id = 1;

  // 5楼 - 8个会议室，10-50人
  const floor5Capacities = [10, 15, 20, 25, 30, 35, 40, 50];
  for (let i = 0; i < 8; i++) {
    rooms.push({
      id: id++,
      roomName: `5F-${String.fromCharCode(65 + i)}`, // 5F-A, 5F-B, ...
      capacity: floor5Capacities[i],
      floor: 5,
      location: `5楼50${i + 1}`,
      facilities: floor5Capacities[i] >= 30 ? '投影仪, 白板, 视频会议设备, 音响系统' : '投影仪, 白板, 视频会议设备',
      available: true,
      description: `可容纳${floor5Capacities[i]}人的会议室`
    });
  }

  // 7楼 - 8个会议室，10-50人
  const floor7Capacities = [10, 15, 20, 25, 30, 35, 40, 50];
  for (let i = 0; i < 8; i++) {
    rooms.push({
      id: id++,
      roomName: `7F-${String.fromCharCode(65 + i)}`,
      capacity: floor7Capacities[i],
      floor: 7,
      location: `7楼70${i + 1}`,
      facilities: floor7Capacities[i] >= 30 ? '投影仪, 白板, 视频会议设备, 音响系统' : '投影仪, 白板, 视频会议设备',
      available: true,
      description: `可容纳${floor7Capacities[i]}人的会议室`
    });
  }

  // 10楼-21楼 - 每层1个会议室，可容纳20人
  for (let floor = 10; floor <= 21; floor++) {
    rooms.push({
      id: id++,
      roomName: `${floor}F`,
      capacity: 20,
      floor: floor,
      location: `${floor}楼${floor}01`,
      facilities: '投影仪, 白板, 视频会议设备',
      available: true,
      description: `${floor}楼会议室，可容纳20人`
    });
  }

  return rooms;
}

let meetingRooms = generateMeetingRooms();
let bookings = [];
let nextBookingId = 1;

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json'
};

// 解析请求体
function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => body += chunk.toString());
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (e) {
        reject(e);
      }
    });
  });
}

// 时间冲突检测
function hasConflict(roomId, startTime, endTime, excludeId = null) {
  return bookings.some(b => {
    if (excludeId && b.id === excludeId) return false;
    if (b.meetingRoom.id !== roomId) return false;
    if (b.status === 'CANCELLED') return false; // 已取消的不算冲突

    const bookingStart = new Date(b.startTime);
    const bookingEnd = new Date(b.endTime);
    const newStart = new Date(startTime);
    const newEnd = new Date(endTime);

    return (newStart < bookingEnd && newEnd > bookingStart);
  });
}

// 判断是否是今天
function isToday(dateStr) {
  const date = new Date(dateStr);
  const today = new Date();
  return date.getFullYear() === today.getFullYear() &&
         date.getMonth() === today.getMonth() &&
         date.getDate() === today.getDate();
}

// 获取会议室今日状态
function getRoomDailyStatus() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  return meetingRooms.map(room => {
    const todayBookings = bookings.filter(b =>
      b.meetingRoom.id === room.id &&
      b.status !== 'CANCELLED' &&
      new Date(b.startTime) >= today &&
      new Date(b.startTime) < tomorrow
    ).sort((a, b) => new Date(a.startTime) - new Date(b.startTime));

    let status = 'FREE'; // 空闲

    if (!room.available) {
      status = 'UNAVAILABLE'; // 不可用
    } else if (todayBookings.length === 0) {
      status = 'FREE'; // 空闲
    } else {
      // 检查是否全天已满（从8:00到18:00基本都有预定）
      const totalBookedMinutes = todayBookings.reduce((sum, b) => {
        const start = new Date(b.startTime);
        const end = new Date(b.endTime);
        return sum + (end - start) / (1000 * 60);
      }, 0);

      if (totalBookedMinutes >= 540) { // 9小时以上
        status = 'FULLY_BOOKED'; // 全天已满
      } else {
        status = 'PARTIALLY_BOOKED'; // 有预定
      }
    }

    return {
      room,
      status,
      bookings: todayBookings,
      bookingCount: todayBookings.length
    };
  });
}

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  const method = req.method;
  const query = parsedUrl.query;

  // Handle OPTIONS
  if (method === 'OPTIONS') {
    res.writeHead(204, corsHeaders);
    res.end();
    return;
  }

  try {
    // Rooms API
    if (path === '/api/rooms' && method === 'GET') {
      // 支持按楼层过滤
      let result = meetingRooms;
      if (query.floor) {
        result = result.filter(r => r.floor === parseInt(query.floor));
      }
      res.writeHead(200, corsHeaders);
      res.end(JSON.stringify(result));
    }
    else if (path === '/api/rooms/available' && method === 'GET') {
      const available = meetingRooms.filter(r => r.available);
      res.writeHead(200, corsHeaders);
      res.end(JSON.stringify(available));
    }
    else if (path === '/api/rooms/daily-status' && method === 'GET') {
      const dailyStatus = getRoomDailyStatus();
      res.writeHead(200, corsHeaders);
      res.end(JSON.stringify(dailyStatus));
    }
    else if (path.match(/^\/api\/rooms\/\d+$/) && method === 'GET') {
      const id = parseInt(path.split('/').pop());
      const room = meetingRooms.find(r => r.id === id);
      if (room) {
        res.writeHead(200, corsHeaders);
        res.end(JSON.stringify(room));
      } else {
        res.writeHead(404, corsHeaders);
        res.end(JSON.stringify({ error: 'Room not found' }));
      }
    }
    // Bookings API
    else if (path === '/api/bookings' && method === 'GET') {
      let result = bookings;

      // 按状态过滤
      if (query.status) {
        result = result.filter(b => b.status === query.status);
      }

      // 按邮箱过滤
      if (query.email) {
        result = result.filter(b => b.userEmail === query.email);
      }

      // 按日期过滤
      if (query.date) {
        const targetDate = new Date(query.date);
        result = result.filter(b => {
          const bookingDate = new Date(b.startTime);
          return bookingDate.toDateString() === targetDate.toDateString();
        });
      }

      res.writeHead(200, corsHeaders);
      res.end(JSON.stringify(result));
    }
    else if (path.match(/^\/api\/bookings\/user\/.+$/) && method === 'GET') {
      const email = decodeURIComponent(path.split('/').pop());
      const userBookings = bookings.filter(b => b.userEmail === email);
      res.writeHead(200, corsHeaders);
      res.end(JSON.stringify(userBookings));
    }
    else if (path.match(/^\/api\/bookings\/room\/\d+$/) && method === 'GET') {
      const roomId = parseInt(path.split('/').pop());
      const roomBookings = bookings.filter(b => b.meetingRoom.id === roomId);
      res.writeHead(200, corsHeaders);
      res.end(JSON.stringify(roomBookings));
    }
    else if (path === '/api/bookings' && method === 'POST') {
      const data = await parseBody(req);
      const room = meetingRooms.find(r => r.id === data.meetingRoom.id);

      if (!room) {
        res.writeHead(404, corsHeaders);
        res.end(JSON.stringify({ error: 'Room not found' }));
        return;
      }

      if (new Date(data.startTime) >= new Date(data.endTime)) {
        res.writeHead(400, corsHeaders);
        res.end('Start time must be before end time');
        return;
      }

      // 验证参加人数不超过会议室容量
      if (data.attendeeCount && data.attendeeCount > room.capacity) {
        res.writeHead(400, corsHeaders);
        res.end(`Attendee count (${data.attendeeCount}) exceeds room capacity (${room.capacity})`);
        return;
      }

      if (hasConflict(room.id, data.startTime, data.endTime)) {
        res.writeHead(400, corsHeaders);
        res.end('Time slot is already booked');
        return;
      }

      const newBooking = {
        id: nextBookingId++,
        meetingRoom: room,
        userName: data.userName,
        userEmail: data.userEmail,
        startTime: data.startTime,
        endTime: data.endTime,
        date: data.startTime.split('T')[0], // 提取日期部分
        purpose: data.purpose || '',
        attendeeCount: data.attendeeCount || 0,
        needsRefreshments: data.needsRefreshments || false, // 是否需要茶水/矿泉水
        status: data.status || 'PENDING', // PENDING(正在申请), CONFIRMED(已申请/已确认), CANCELLED(已取消)
        createdAt: new Date().toISOString()
      };

      bookings.push(newBooking);
      res.writeHead(201, corsHeaders);
      res.end(JSON.stringify(newBooking));
    }
    else if (path.match(/^\/api\/bookings\/\d+$/) && method === 'PUT') {
      const id = parseInt(path.split('/').pop());
      const data = await parseBody(req);
      const index = bookings.findIndex(b => b.id === id);

      if (index === -1) {
        res.writeHead(404, corsHeaders);
        res.end(JSON.stringify({ error: 'Booking not found' }));
        return;
      }

      // 更新预定状态
      if (data.status) {
        bookings[index].status = data.status;
      }

      res.writeHead(200, corsHeaders);
      res.end(JSON.stringify(bookings[index]));
    }
    else if (path.match(/^\/api\/bookings\/\d+$/) && method === 'DELETE') {
      const id = parseInt(path.split('/').pop());
      const index = bookings.findIndex(b => b.id === id);

      if (index !== -1) {
        bookings.splice(index, 1);
        res.writeHead(204, corsHeaders);
        res.end();
      } else {
        res.writeHead(404, corsHeaders);
        res.end(JSON.stringify({ error: 'Booking not found' }));
      }
    }
    else {
      res.writeHead(404, corsHeaders);
      res.end(JSON.stringify({ error: 'Not found' }));
    }
  } catch (error) {
    console.error('Error:', error);
    res.writeHead(500, corsHeaders);
    res.end(JSON.stringify({ error: 'Internal server error' }));
  }
});

const PORT = 8080;
server.listen(PORT, () => {
  console.log(`Mock backend server running at http://localhost:${PORT}`);
  console.log(`Total meeting rooms: ${meetingRooms.length}`);
  console.log('API Endpoints:');
  console.log('  GET  /api/rooms');
  console.log('  GET  /api/rooms?floor=5');
  console.log('  GET  /api/rooms/available');
  console.log('  GET  /api/rooms/daily-status');
  console.log('  GET  /api/rooms/:id');
  console.log('  GET  /api/bookings');
  console.log('  GET  /api/bookings?status=PENDING');
  console.log('  GET  /api/bookings?status=CONFIRMED');
  console.log('  GET  /api/bookings?email=user@example.com');
  console.log('  GET  /api/bookings/user/:email');
  console.log('  GET  /api/bookings/room/:roomId');
  console.log('  POST /api/bookings');
  console.log('  PUT  /api/bookings/:id');
  console.log('  DELETE /api/bookings/:id');
});
