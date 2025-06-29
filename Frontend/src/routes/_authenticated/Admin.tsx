import { createFileRoute } from '@tanstack/react-router'
import AdminDashboard from '@/features/AdminDashboard'

export const Route = createFileRoute('/_authenticated/Admin')({
  component: AdminDashboard,
})

