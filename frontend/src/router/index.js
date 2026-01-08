import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import RoomList from '../views/RoomList.vue'
import BookingForm from '../views/BookingForm.vue'
import MyBookings from '../views/MyBookings.vue'
import Applications from '../views/Applications.vue'
import DailyOverview from '../views/DailyOverview.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/rooms',
    name: 'RoomList',
    component: RoomList
  },
  {
    path: '/book/:id',
    name: 'BookingForm',
    component: BookingForm
  },
  {
    path: '/my-bookings',
    name: 'MyBookings',
    component: MyBookings
  },
  {
    path: '/applications',
    name: 'Applications',
    component: Applications
  },
  {
    path: '/daily-overview',
    name: 'DailyOverview',
    component: DailyOverview
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
