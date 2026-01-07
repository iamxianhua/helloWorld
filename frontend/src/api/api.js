import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

export const roomAPI = {
  getAllRooms: () => api.get('/rooms'),
  getAvailableRooms: () => api.get('/rooms/available'),
  getRoomById: (id) => api.get(`/rooms/${id}`),
  createRoom: (data) => api.post('/rooms', data),
  updateRoom: (id, data) => api.put(`/rooms/${id}`, data),
  deleteRoom: (id) => api.delete(`/rooms/${id}`)
}

export const bookingAPI = {
  getAllBookings: () => api.get('/bookings'),
  getBookingById: (id) => api.get(`/bookings/${id}`),
  getBookingsByEmail: (email) => api.get(`/bookings/user/${email}`),
  getBookingsByRoom: (roomId) => api.get(`/bookings/room/${roomId}`),
  createBooking: (data) => api.post('/bookings', data),
  updateBooking: (id, data) => api.put(`/bookings/${id}`, data),
  deleteBooking: (id) => api.delete(`/bookings/${id}`)
}

export default api
