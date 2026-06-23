import { Outlet } from 'react-router-dom'

export default function RootLayout() {
  return (
    <div style={{ fontFamily: "'Inter', ui-sans-serif, system-ui, sans-serif" }}>
      <Outlet />
    </div>
  )
}
