import { AppProviders } from '@/app/providers'
import { AppRouter } from '@/app/router'
import { DialogHost } from '@/shared/components/DialogHost'
import { ToastHost } from '@/shared/components/ToastHost'

export default function App() {
  return (
    <AppProviders>
      <AppRouter />
      <ToastHost />
      <DialogHost />
    </AppProviders>
  )
}
