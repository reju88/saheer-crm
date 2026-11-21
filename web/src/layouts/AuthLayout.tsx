import { Outlet } from 'react-router-dom'

export function AuthLayout() {
  return (
    <div className="h-dvh min-h-dvh">
      <Outlet />
    </div>
  )
}
