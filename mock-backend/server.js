const http = require('http');
const url = require('url');

// 模拟数据
let meetingRooms = [
  {
    id: 1,
    roomName: '会议室A',
    capacity: 10,
    location: '1楼101',
    facilities: '投影仪, 白板',
    available: true,
    description: '适合小型会议，配备基础设施'
  },
  {
    id: 2,
    roomName: '会议室B',
    capacity: 20,
    location: '2楼201',
    facilities: '投影仪, 白板, 视频会议设备',
    available: true,
    description: '适合中型会议，配备完善的会议设施'
  },
  {
    id: 3,
    roomName: '会议室C',
    capacity: 50,
    location: '3楼301',
    facilities: '投影仪, 白板, 视频会议设备, 音响系统',
    available: true,
    description: '大型会议室，适合公司全员会议'
  },
  {
    id: 4,
    roomName: '培训室',
    capacity: 30,
    location: '2楼202',
    facilities: '投影仪, 白板, 电脑',
    available: true,
    description: '专用培训室，配备教学设施'
  }
];

let bookings = [
  {
    id: 1,
    meetingRoom: meetingRooms[0],
    userName: '张三',
    userEmail: 'zhangsan@example.com',
    startTime: '2026-01-08T09:00:00',
    endTime: '2026-01-08T10:00:00',
    purpose: '团队周会',
    status: 'CONFIRMED',
    createdAt: '2026-01-07T10:00:00'
  }
];

let nextBookingId = 2;

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

    const bookingStart = new Date(b.startTime);
    const bookingEnd = new Date(b.endTime);
    const newStart = new Date(startTime);
    const newEnd = new Date(endTime);

    return (newStart < bookingEnd && newEnd > bookingStart);
  });
}

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  const method = req.method;

  // Handle OPTIONS
  if (method === 'OPTIONS') {
    res.writeHead(204, corsHeaders);
    res.end();
    return;
  }

  try {
    // Rooms API
    if (path === '/api/rooms' && method === 'GET') {
      res.writeHead(200, corsHeaders);
      res.end(JSON.stringify(meetingRooms));
    }
    else if (path === '/api/rooms/available' && method === 'GET') {
      const available = meetingRooms.filter(r => r.available);
      res.writeHead(200, corsHeaders);
      res.end(JSON.stringify(available));
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
      res.writeHead(200, corsHeaders);
      res.end(JSON.stringify(bookings));
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
        purpose: data.purpose || '',
        status: data.status || 'CONFIRMED',
        createdAt: new Date().toISOString()
      };

      bookings.push(newBooking);
      res.writeHead(201, corsHeaders);
      res.end(JSON.stringify(newBooking));
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
  console.log('API Endpoints:');
  console.log('  GET  /api/rooms');
  console.log('  GET  /api/rooms/available');
  console.log('  GET  /api/rooms/:id');
  console.log('  GET  /api/bookings');
  console.log('  GET  /api/bookings/user/:email');
  console.log('  GET  /api/bookings/room/:roomId');
  console.log('  POST /api/bookings');
  console.log('  DELETE /api/bookings/:id');
});
