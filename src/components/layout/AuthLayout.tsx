import { Outlet } from 'react-router-dom'

// Each auth page manages its own full-screen layout
export default function AuthLayout() {
  return <Outlet />
}
